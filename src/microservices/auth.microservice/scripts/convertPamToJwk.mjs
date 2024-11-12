import fs from "fs";
import path from "path";
import rsaPemToJwk from "rsa-pem-to-jwk";

const __dirname = path.resolve();

// Create certs folder if not exists
const dir = path.join(__dirname, "certs");
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

// Read private key from file
const privateKeyPath = path.join(__dirname, "certs", "private.key");
const privateKey = fs.readFileSync(privateKeyPath, "utf8");

const jwk = rsaPemToJwk(privateKey, { use: "sig" }, "public");

// eslint-disable-next-line no-console, no-undef
console.log(JSON.stringify(jwk, null, 2));
