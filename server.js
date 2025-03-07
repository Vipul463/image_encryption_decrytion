const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const crypto = require("crypto");
const {encryptImage, decryptImage} = require("./utils/encryption_decryption");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({storage});

app.post("/encrypt", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({error: "No file uploaded"});

        const inputPath = req.file.path;
        const outputImage = `uploads/encrypted_${req.file.filename}`;
        const encryptionKey = crypto.randomBytes(16).toString("hex");
        const keyFilePath = `uploads/key_${req.file.filename}.txt`;

        console.log("Encrypting:", inputPath);
        await encryptImage(inputPath, outputImage, encryptionKey);
        fs.writeFileSync(keyFilePath, encryptionKey); // Save the key as a downloadable file

        res.json({
            encryptedImage: `/${outputImage}`,
            keyFile: `/${keyFilePath}`
        });
    } catch (err) {
        console.error("Encryption Error:", err.message);
        res.status(500).json({error: err.message});
    }
});

app.post("/decrypt", upload.single("image"), async (req, res) => {
    try {
        if (!req.file || !req.body.key) return res.status(400).json({error: "File and key are required"});

        const inputPath = req.file.path;
        const outputImage = `uploads/decrypted_${req.file.filename}`;
        const encryptionKey = req.body.key.trim();

        console.log("Decrypting:", inputPath, "with key:", encryptionKey);
        await decryptImage(inputPath, outputImage, encryptionKey);

        res.json({decryptedImage: `/${outputImage}`});
    } catch (err) {
        console.error("Decryption Error:", err.message);
        res.status(500).json({error: err.message});
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
