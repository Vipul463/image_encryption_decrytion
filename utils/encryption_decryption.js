const fs = require("fs");

function encryptImage(inputPath, outputPath, key) {
    return new Promise((resolve, reject) => {
        const inputData = fs.readFileSync(inputPath);
        const keyBuffer = Buffer.from(key, "hex");

        const encryptedData = Buffer.from(inputData.map((byte, i) => byte ^ keyBuffer[i % keyBuffer.length]));
        fs.writeFileSync(outputPath, encryptedData);

        resolve();
    });
}

function decryptImage(inputPath, outputPath, key) {
    return new Promise((resolve, reject) => {
        const encryptedData = fs.readFileSync(inputPath);
        const keyBuffer = Buffer.from(key, "hex");

        const decryptedData = Buffer.from(encryptedData.map((byte, i) => byte ^ keyBuffer[i % keyBuffer.length]));
        fs.writeFileSync(outputPath, decryptedData);

        resolve();
    });
}

module.exports = {encryptImage, decryptImage};
