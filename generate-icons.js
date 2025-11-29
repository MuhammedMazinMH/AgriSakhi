// Quick icon generator for PWA
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create icons directory
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Icon sizes needed
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

console.log('Creating placeholder icons...');

// For each size, create a simple SVG and save as PNG
sizes.forEach(size => {
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#22c55e"/>
      <text x="50%" y="50%" font-size="${size * 0.4}" fill="white" text-anchor="middle" dy=".35em" font-family="Arial, sans-serif" font-weight="bold">AS</text>
    </svg>
  `;
  
  // Save as SVG (browsers accept it)
  const svgFilename = `icon-${size}x${size}.svg`;
  const svgFilepath = path.join(iconsDir, svgFilename);
  fs.writeFileSync(svgFilepath, svg.trim());
  
  console.log(`✓ Created ${svgFilename}`);
});

console.log('\n✨ Icons created successfully!');
console.log('Note: These are SVG placeholders. For production, use PNG files.');
console.log('Generate PNGs at: https://www.pwabuilder.com/imageGenerator\n');
