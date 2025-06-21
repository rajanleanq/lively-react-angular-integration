const fs = require("fs");
const path = require("path");
const { spawn, execSync } = require("child_process");
const chokidar = require("chokidar");

const ANGULAR_DIST_PATH = path.join(__dirname, "../../lively-angular/dist");
const REACT_BUILD_PATH = path.join(__dirname, "../copy-angular-output/dist");
const ANGULAR_PROJECT_PATH = path.join(__dirname, "../../lively-angular");

let isBuilding = false;
let angularServer = null;

function buildAndCopy() {
  if (isBuilding) return;

  isBuilding = true;
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
    });
  } catch (error) {
  } finally {
    isBuilding = false;
  }
}

function startAngularServer() {
  angularServer = spawn("npx", ["serve", "-s", ".", "-p", "3001"], {
    cwd: ANGULAR_PROJECT_PATH,
    stdio: "inherit",
  });

  angularServer.on("error", (error) => {
    console.error("Angular server error:", error);
  });
}

function setupWatcher() {
  const watcher = chokidar.watch("src/**/*", {
    ignored: /node_modules/,
    persistent: true,
  });

  watcher.on("change", (path) => {
    buildAndCopy();
  });
}

function cleanup() {
  if (angularServer) {
    angularServer.kill();
  }
  process.exit(0);
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

buildAndCopy();
startAngularServer();
setupWatcher();
