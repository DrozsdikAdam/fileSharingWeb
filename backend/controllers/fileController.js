const s3 = require("../utils/s3");
const {
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
require("dotenv").config();

const BUCKET = process.env.BUCKET;

// Segédfüggvény a fájlnevek "megtisztítására" az S3 kulcsokhoz.
// Eltávolítja az ékezeteket és a nem biztonságos karaktereket.
const sanitizeFilenameForS3 = (filename) => {
  // 1. Ékezetes karakterek felbontása alap karakterre és ékezetre (pl. "ű" -> "u" + " ̋").
  const normalized = filename.normalize('NFD');

  // 2. Az ékezetek eltávolítása.
  const withoutAccents = normalized.replace(/[\u0300-\u036f]/g, '');

  // 3. Minden, ami nem betű, szám, pont, kötőjel vagy aláhúzás, cseréje aláhúzásra.
  return withoutAccents.replace(/[^a-zA-Z0-9.\-_]/g, '_');
};

exports.uploadFile = async (req, res) => {
  try {
    // A böngésző UTF-8 kódolással küldi a fájlnevet, de a multer/busboy latin1-ként értelmezheti.
    // Ezt a hibát korrigáljuk a string bájtjainak helyes (UTF-8) újraértelmezésével.
    const originalNameDecoded = Buffer.from(
      req.file.originalname,
      "latin1"
    ).toString("utf8");

    const folder = req.body.folder;
    const sanitizedOriginalName = sanitizeFilenameForS3(originalNameDecoded);
    const s3Key = `${folder === "" ? "" : (folder + "/")}${Date.now()}@&|${sanitizedOriginalName}`;
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: s3Key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
    );

    res
      .status(201)
      .json({
        message: "Fájl sikeresen feltöltve!",
        filename: s3Key,
        originalName: originalNameDecoded,
      });
  } catch (err) {
    console.log("Feltöltési hiba: ", err);
    res.status(500).json({ error: "Sikertelen feltöltés!" });
  }
};

exports.listFiles = async (req, res) => {
  try {
    const result = await s3.send(new ListObjectsCommand({ Bucket: BUCKET }))
    const files = result.Contents?.map(f => f.Key) || []
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