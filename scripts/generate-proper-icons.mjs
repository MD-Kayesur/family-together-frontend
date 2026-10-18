import fs from "fs";
import path from "path";
import sharp from "sharp";

async function run() {
  const sourcePath = "C:/Users/rmdka/.gemini/antigravity-ide/brain/7904c803-5696-42be-a307-7410a90755c9/familyroots_logo_1792332089048.jpg";

  if (!fs.existsSync(sourcePath)) {
    console.error("Source logo not found at:", sourcePath);
    process.exit(1);
  }

  // 1. Generate full high-res PNG (512x512)
  const png512 = await sharp(sourcePath)
    .resize(512, 512, { fit: "cover" })
    .png({ quality: 100 })
    .toBuffer();

  // 2. Generate Apple touch icon (180x180 PNG)
  const png180 = await sharp(sourcePath)
    .resize(180, 180, { fit: "cover" })
    .png()
    .toBuffer();

  // 3. Generate 32x32 PNG for ICO
  const png32 = await sharp(sourcePath)
    .resize(32, 32, { fit: "cover" })
    .png()
    .toBuffer();

  // 4. Generate 16x16 PNG for ICO
  const png16 = await sharp(sourcePath)
    .resize(16, 16, { fit: "cover" })
    .png()
    .toBuffer();

  // Write PNG files
  fs.writeFileSync(path.resolve("public/logo.png"), png512);
  fs.writeFileSync(path.resolve("public/icon.png"), png512);
  fs.writeFileSync(path.resolve("src/app/icon.png"), png512);
  fs.writeFileSync(path.resolve("public/apple-icon.png"), png180);
  fs.writeFileSync(path.resolve("src/app/apple-icon.png"), png180);

  // Write valid multi-resolution PNG-in-ICO format
  // ICO header: 6 bytes
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // Reserved
  icoHeader.writeUInt16LE(1, 2); // Type 1 = ICO
  icoHeader.writeUInt16LE(2, 4); // 2 images (32x32 and 16x16)

  // Directory entries: 16 bytes each
  const entry32 = Buffer.alloc(16);
  entry32.writeUInt8(32, 0); // Width
  entry32.writeUInt8(32, 1); // Height
  entry32.writeUInt8(0, 2); // Color palette
  entry32.writeUInt8(0, 3); // Reserved
  entry32.writeUInt16LE(1, 4); // Color planes
  entry32.writeUInt16LE(32, 6); // Bits per pixel
  entry32.writeUInt32LE(png32.length, 8); // Size
  const offset32 = 6 + (16 * 2);
  entry32.writeUInt32LE(offset32, 12); // Offset

  const entry16 = Buffer.alloc(16);
  entry16.writeUInt8(16, 0); // Width
  entry16.writeUInt8(16, 1); // Height
  entry16.writeUInt8(0, 2); // Color palette
  entry16.writeUInt8(0, 3); // Reserved
  entry16.writeUInt16LE(1, 4); // Color planes
  entry16.writeUInt16LE(32, 6); // Bits per pixel
  entry16.writeUInt32LE(png16.length, 8); // Size
  const offset16 = offset32 + png32.length;
  entry16.writeUInt32LE(offset16, 12); // Offset

  const icoBuffer = Buffer.concat([icoHeader, entry32, entry16, png32, png16]);

  fs.writeFileSync(path.resolve("public/favicon.ico"), icoBuffer);

  // In Next.js App Router, if src/app/favicon.ico exists, Turbopack attempts to parse it with BMP decoder.
  // In Next.js 16, standard App Router favicon is public/favicon.ico and src/app/icon.png.
  // If we remove src/app/favicon.ico or make it a BMP format:
  // Let's create an uncompressed BMP 32x32 for src/app/favicon.ico so Turbopack's BMP decoder is 100% happy!
  // OR remove src/app/favicon.ico because Next.js automatically serves public/favicon.ico!
  // Let's remove src/app/favicon.ico to prevent any Turbopack image decoder failure!
  if (fs.existsSync(path.resolve("src/app/favicon.ico"))) {
    fs.unlinkSync(path.resolve("src/app/favicon.ico"));
    console.log("Removed src/app/favicon.ico to let Next.js use public/favicon.ico & src/app/icon.png cleanly");
  }

  // Also update backend logo
  fs.writeFileSync(path.resolve("../family-together-backend/public/logo.png"), png512);

  console.log("Done generating all proper icons!");
}

run().catch(console.error);
