const serverUrl = "http://localhost:5000";

async function encryptImage() {
    const fileInput = document.getElementById("encryptInput").files[0];
    if (!fileInput) {
        alert("Please select an image to encrypt.");
        return;
    }

    let formData = new FormData();
    formData.append("image", fileInput);

    try {
        let response = await fetch(`${serverUrl}/encrypt`, {method: "POST", body: formData});
        let data = await response.json();

        if (data.error) throw new Error(data.error);

        document.getElementById("encryptResult").innerHTML = `
            <p> Encryption Successful!</p>
            <a href="${serverUrl}${data.encryptedImage}" download="encrypted_image.jpg">Download Encrypted Image</a><br>
            <a href="${serverUrl}${data.keyFile}" download="encryption_key.txt">Download Key File</a>
        `;
    } catch (error) {
        document.getElementById("encryptResult").innerHTML = `<p style="color: red;"> ${error.message}</p>`;
    }
}

// Decrypt Image
async function decryptImage() {
    const fileInput = document.getElementById("decryptInput").files[0];
    const keyInput = document.getElementById("keyInput").files[0];

    if (!fileInput || !keyInput) {
        alert("Please select an encrypted image and a key file.");
        return;
    }

    let keyText = await keyInput.text();
    let formData = new FormData();
    formData.append("image", fileInput);
    formData.append("key", keyText.trim());

    try {
        let response = await fetch(`${serverUrl}/decrypt`, {method: "POST", body: formData});
        let data = await response.json();

        if (data.error) throw new Error(data.error);

        document.getElementById("decryptResult").innerHTML = `
            <p> Decryption Successful!</p>
            <a href="${serverUrl}${data.decryptedImage}" download="decrypted_image.jpg">Download Decrypted Image</a>
        `;
    } catch (error) {
        document.getElementById("decryptResult").innerHTML = `<p style="color: red;"> ${error.message}</p>`;
    }
}

