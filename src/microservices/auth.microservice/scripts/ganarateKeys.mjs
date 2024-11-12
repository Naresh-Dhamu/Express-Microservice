import fs from "fs";
import path from "path";
import crypto from "crypto";

const keyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
    },
    privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
    },
});

const __dirname = path.resolve();

// Log keys to console
// eslint-disable-next-line no-console, no-undef
console.log("public key: ", keyPair.publicKey);
// eslint-disable-next-line no-console, no-undef
console.log("private key: ", keyPair.privateKey);

// Create certs folder if it does not exist
const dir = path.join(__dirname, "certs");
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

// Save keys to certs folder
fs.writeFileSync(path.join(dir, "public.key"), keyPair.publicKey);
fs.writeFileSync(path.join(dir, "private.key"), keyPair.privateKey);

// Generate public and private key strings for loading in env variables
const publicKey = keyPair.publicKey.replace(/\n/g, "\\n");
const privateKey = keyPair.privateKey.replace(/\n/g, "\\n");

// Save keys in keys.json file
fs.writeFileSync(
    path.join(dir, "keys.json"),
    JSON.stringify({ publicKey, privateKey }, null, 2),
);