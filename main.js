const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const electronReload = require("electron-reload");
const ffmpeg = require("fluent-ffmpeg");
const http = require("http");

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL(`file://${__dirname}/./pages/login.html`);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

app.whenReady().then(createWindow);

// Enable automatic reloading of the renderer process during development.
if (process.env.NODE_ENV === "development") {
  electronReload(__dirname);
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle("start-stream", (event, srtUrl) => {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      if (req.url === "/video") {
        const command = ffmpeg(srtUrl)
          .videoCodec("libx264")
          .audioCodec("aac")
          .format("mp4")
          .outputOptions(["-movflags frag_keyframe+empty_moov"])
          .on("start", (commandLine) => {
            console.log("Spawned FFmpeg with command: " + commandLine);
          })
          .on("end", () => {
            console.log("Conversion finished.");
          })
          .on("error", (err) => {
            console.log(`Error: ${err.message}`);
            console.log(err);
          });

        command.pipe(res, { end: false });
      }
    });

    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const streamUrl = `http://${address.address}:${address.port}/video`;
      resolve(streamUrl);
    });
  });
});
