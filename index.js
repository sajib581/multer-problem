const express = require("express");
const multer = require("multer");
const path = require("path");

// File upload folder
const UPLOADS_FOLDER = "./uploads/";

// var upload = multer({ dest: UPLOADS_FOLDER });

// define the storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_FOLDER);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExt, "")
        .toLowerCase()
        .split(" ")
        .join("-") +
      "-" +
      Date.now();

    cb(null, fileName + fileExt);
  },
});

// preapre the final multer upload object
var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000, // 1MB
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "avatar") {
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(new Error("Only .jpg, .png or .jpeg format allowed!"));
      }
    } else if (file.fieldname === "doc") {
      if (file.mimetype === "application/pdf") {
        cb(null, true);
      } else {
        cb(new Error("Only .pdf format allowed!"));
      }
    } else {
      cb(new Error("There was an unknown error!"));
    }
  },
});

// express app initialization
const app = express();

// application route
app.post(
  "/profile",
  upload.fields([
    {
      name: "avatar",
      maxCount: 2,
    },
    {
      name: "doc",
      maxCount: 1,
    },
  ]),
  (req, res, next) => {
    res.send("success");
  }
);

// default error handler
app.use((err, req, res, next) => {
  if (err) {
    console.log(err instanceof multer.MulterError);
    console.log("Error is : ",err.message);
    if (err instanceof multer.MulterError) {
      console.log("Here 2");
      res.status(500).send("There was an upload error!");
    } else {
      console.log("Else Hitted");
      res.status(500).send(err.message);
      console.log("Reached");
    }
  } else {
    res.send("success");
  }
});

app.listen(3000, () => {
  console.log("app listening at port 3000");
});