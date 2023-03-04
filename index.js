const express = require("express");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");

const app = express();

// configure the multer middleware to handle file uploads
const upload = multer({ dest: "uploads/" });

// set up a route to handle file uploads
app.post("/upload", upload.single("video"), (req, res) => {
  // handle the file upload
  const command = ffmpeg(req.file.path);

  // set the output format and destination
  command
    .outputFormat("mp4")
    .save("output.mp4")
    .on("end", () => {
      // send the encoded video back to the client
      res.sendFile("output.mp4", { root: __dirname });

      // clean up the uploaded file
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error(err);
        }
      });
    })
    .on("error", (err) => {
      // handle errors
      console.error(err);
      next(err);
    });
});

// start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
