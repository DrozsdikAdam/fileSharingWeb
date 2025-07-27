const bcrypt = require("bcrypt");
const saltRounds = 10;

// Ide írd be a jelszót, amit hashelni szeretnél
const plainPassword = "Adamm177!";

if (!plainPassword || plainPassword === "a_te_jelszavad") {
    console.error("Kérlek, adj meg egy jelszót a 'plainPassword' változóban.");
    process.exit(1);
}

bcrypt.hash(plainPassword, saltRounds).then((hash) => {
    console.log("A generált hash a .env fájlba:");
    console.log(hash);
});