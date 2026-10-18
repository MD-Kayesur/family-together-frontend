import fs from "fs";
import path from "path";

const sourcePath = "C:/Users/rmdka/.gemini/antigravity-ide/brain/7904c803-5696-42be-a307-7410a90755c9/familyroots_logo_1792332089048.jpg";

if (!fs.existsSync(sourcePath)) {
  console.error("Source logo not found at:", sourcePath);
  process.exit(1);
}

const data = fs.readFileSync(sourcePath);

// Target destinations in frontend
const frontendTargets = [
  "public/logo.jpg",
  "public/logo.png",
  "public/icon.png",
  "public/apple-icon.png",
  "public/favicon.png",
  "src/app/icon.png",
  "src/app/apple-icon.png",
];

frontendTargets.forEach((relPath) => {
  const dest = path.resolve(relPath);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, data);
  console.log("Successfully wrote:", dest);
});

// Also create proper modern ICO file containing the image data
// Standard modern ICO header wrapping the image
const icoHeader = Buffer.alloc(6);
icoHeader.writeUInt16LE(0, 0); // Reserved
icoHeader.writeUInt16LE(1, 2); // Type 1 = ICO
icoHeader.writeUInt16LE(1, 4); // 1 Image

const icoEntry = Buffer.alloc(16);
icoEntry.writeUInt8(0, 0); // 0 = 256px width
icoEntry.writeUInt8(0, 1); // 0 = 256px height
icoEntry.writeUInt8(0, 2); // Color palette
icoEntry.writeUInt8(0, 3); // Reserved
icoEntry.writeUInt16LE(1, 4); // Color planes
icoEntry.writeUInt16LE(32, 6); // Bits per pixel
icoEntry.writeUInt32LE(data.length, 8); // Image data size
icoEntry.writeUInt32LE(22, 12); // Offset to image data (6 + 16 = 22)

const icoBuffer = Buffer.concat([icoHeader, icoEntry, data]);

const icoTargets = [
  "public/favicon.ico",
  "src/app/favicon.ico",
];

icoTargets.forEach((relPath) => {
  const dest = path.resolve(relPath);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, icoBuffer);
  console.log("Successfully wrote ICO favicon:", dest);
});

// Also copy logo to backend public / root
const backendDest = path.resolve("../family-together-backend/public/logo.png");
try {
  fs.mkdirSync(path.dirname(backendDest), { recursive: true });
  fs.writeFileSync(backendDest, data);
  console.log("Successfully wrote to backend:", backendDest);
} catch (e) {
  console.warn("Could not copy to backend:", e.message);
}

console.log("All favicon and logo files generated successfully!");
