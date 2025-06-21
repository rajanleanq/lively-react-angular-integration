const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ANGULAR_DIST_PATH = path.join(__dirname, "../../lively-angular/dist");
const REACT_BUILD_PATH = path.join(__dirname, "../copy-angular-output/dist");

function buildAndCopy() {
  try {
    execSync("npm run build:integration", { stdio: "inherit" });

    if (!fs.existsSync(ANGULAR_DIST_PATH)) {
      fs.mkdirSync(ANGULAR_DIST_PATH, { recursive: true });
    }

    const files = fs.readdirSync(REACT_BUILD_PATH);

    files.forEach((file) => {
      const srcPath = path.join(REACT_BUILD_PATH, file);
      const destPath = path.join(ANGULAR_DIST_PATH, file);
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ Copied ${file}`);
    });
  } catch (error) {
    process.exit(1);
  }
}

buildAndCopy();
