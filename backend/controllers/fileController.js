const fs = require("fs");
const path = require("path");
const s3 = require("../utils/s3");
const {
  PutObjectCommand,
  ListObjectsCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
require("dotenv").config();

const BUCKET = process.env.BUCKET;

exports.uploadFile = async (req, res) => {
  try {
    const fileContent = fs.readFileSync(req.file.path);
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: req.file.filename,
        Body: fileContent,
        ContentType: req.file.mimetype,
      })
    );
    fs.unlinkSync(req.file.path);

    res
      .status(201)
      .json({
        message: "Fájl sikeresen feltöltve!",
        filename: req.file.filename,
      });
  } catch (err) {
    console.log("Feltöltési hiba: ", err);
    res.status(500).json({ error: "Sikertelen feltöltés!" });
  }
};

exports.listFiles = async (req, res) => {
  try {
    const result = await s3.send(new ListObjectsCommand({ Bucket: BUCKET }))
    const files = result.Contents?.map(f => f.key) || []
    res.json(files)
  } catch (error) {
    console.log("Listázási hiba: ", error)
    res.status(500).json({ error: "Sikertelen listázás!" })
  }
}

exports.getPresignedUrl = async (req, res) => {
  const { filename } = req.params

  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET,
      Key: filename,
    })
    const url = await getSignedUrl(s3, command, { expiresIn: 60 * 5 })
    res.json({ url })
  } catch (err) {
    console.log("URL előállítási hiba: ", err)
    res.status(500).json({ error: "Sikertelen URL generálás!" })
  }
}

exports.deleteFile = async (req, res) => {
  try {
    await s3.send(new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: req.params.filename
    }))
    res.json({ message: "Fájl sikeresen törölve!" })
  } catch (err) {
    console.log("Törlési hiba: ", err)
    res.status(500).json({ error: "Sikertelen törlés!" })
  }
}