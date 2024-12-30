import { Router } from "express";
import User from "../model/user.js";
import Client from "../model/client.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import generate from "../helpers/username.password.generator.js";
import multer from "multer";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import Files from "../model/files.js";
import { fileURLToPath } from "url";
const router = Router();

// authenticate user
let authorize = (roles = []) => {
  if (typeof roles === "string") {
    roles = [roles];
  }
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ error: "No token provided or invalid header format" });
      }

      const token = authHeader.split(" ")[1];

      const key = process.env.JWT_KEY;
      const decodedToken = jwt.verify(token, key);

      if (roles.length && !roles.includes(decodedToken.role)) {
        return res.status(403).json({ error: "Access denied" });
      }
      req.user = decodedToken;
      next();
    } catch (error) {
      console.error("Authorization error:", error);
      return res.status(401).send({ error: "Invalid or expired token" });
    }
  };
};

router
  .route("/auth")
  .post(authorize(["admin", "employee"]), async (req, res) => {
    return res.status(201).json({ message: "authorized" });
  });

// proper object id
let getId = (id) => {
  const cleanedCid = id.replace(/['"]+/g, "");
  const objectId = new mongoose.Types.ObjectId(cleanedCid);
  return objectId;
};

// Storage configuration

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      cb(null, "uploads/");
    } catch (error) {
      cb(error, false);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, "document_" + Date.now() + ext);
  },
});

const upload = multer({ storage });
// post
router.route("/login").post(async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const userExist = await User.findOne({ username, role: role });

    if (!userExist) {
      return res.status(404).json({ error: "User not found..!" });
    }

    const passwordCheck = await bcrypt.compare(password, userExist.password);
    if (!passwordCheck) {
      return res.status(401).json({ error: "Password is incorrect..!" });
    }
    const key = process.env.JWT_KEY;
    const token = jwt.sign(
      {
        id: userExist._id,
        username: userExist.username,
        role: userExist.role,
      },
      key,
      { expiresIn: "2h" }
    );

    if (userExist.role === "admin") {
      return res.status(201).json({
        message: "Admin login successful",
        token: token,
        user: {
          id: userExist._id,
          username: userExist.username,
          role: userExist.role,
        },
      });
    }

    if (userExist.role === "employee") {
      return res.status(201).json({
        message: "Employee login successful",
        token: token,
        user: {
          id: userExist._id,
          username: userExist.username,
          role: userExist.role,
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.route("/addEmployee").post(authorize("admin"), async (req, res) => {
  try {
    const data = req.user;
    const { fname, lname, email, mobile, role } = req.body;
    const { username, password } = generate(fname);

    const userExists = await User.findOne({ email, role: role });

    if (userExists) {
      return res.status(409).send({ error: "user already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashPassword,
      email,
      fname,
      lname,
      role,
      mobile,
    });

    const saveUser = await newUser.save();

    return res.status(201).send({ username: username, password: password });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
});

router
  .route("/addClient")
  .post(authorize(["admin", "employee"]), async (req, res) => {
    try {
      const {
        cid,
        fname,
        mname,
        lname,
        email,
        mobile,
        caseType,
        dob,
        city,
        village,
        pincode,
      } = req.body;

      const client = new Client({
        cid,
        fname,
        mname,
        lname,
        email,
        mobile,
        caseType,
        dob,
        address: { city, village, pincode },
      });

      const savedClient = await client.save();
      return res.status(201).json({ cid: savedClient._id });
    } catch (error) {
      return res.status(500).json({ error: "server error" });
    }
  });

router.route("/add").post(async (req, res) => {
  try {
    const { username, password, role, email } = req.body;
    const userExist = await User.findOne({ username, role: role });

    if (userExist) {
      return res.status(409).send({ error: "username already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashPassword,
      role,
      email,
    });

    const savedUser = await user.save();

    return res.status(201).send({ message: "account created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.route("/addClientDocument").post(
  authorize(["admin", "employee"]),
  upload.fields([
    { name: "documentType-0", maxCount: 1 },
    { name: "document-0", maxCount: 1 },
    { name: "documentType-1", maxCount: 1 },
    { name: "document-1", maxCount: 1 },
    { name: "documentType-2", maxCount: 1 },
    { name: "document-2", maxCount: 1 },
    { name: "documentType-3", maxCount: 1 },
    { name: "document-3", maxCount: 1 },
    { name: "documentType-4", maxCount: 1 },
    { name: "document-4", maxCount: 1 },
    { name: "documentType-5", maxCount: 1 },
    { name: "document-5", maxCount: 1 },
    { name: "documentType-6", maxCount: 1 },
    { name: "document-6", maxCount: 1 },
    { name: "documentType-7", maxCount: 1 },
    { name: "document-7", maxCount: 1 },
    { name: "documentType-8", maxCount: 1 },
    { name: "document-8", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { cid, info } = req.body;
      const ciid = getId(cid);
      const docs = [];
      for (let i = 0; i <= 8; i++) {
        const documentTypeKey = `documentType-${i}`;
        const documentFileKey = `document-${i}`;

        if (req.files[documentFileKey] && req.body[documentTypeKey]) {
          const documentType = req.body[documentTypeKey];
          const documentFile = req.files[documentFileKey][0];

          const fileData = {
            documentType: documentType,
            filename: documentFile.filename,
            filePath: "uploads/" + documentFile.filename,
          };

          docs.push(fileData);
        }
      }
      const data = Files({
        userId: ciid,
        document: docs,
        info: info,
      });
      const savedData = await data.save();

      return res
        .status(201)
        .json({ message: "Documents uploaded..!", user: savedData });
    } catch (error) {
      return res.status(500).json({ error: "Server Error" });
    }
  }
);

// get

router
  .route("/getClients")
  .get(authorize(["admin", "employee"]), async (rqe, res) => {
    try {
      const clientData = await Client.find();
      if (clientData.length === 0) {
        return res.status(404).json({ error: "No clients found" });
      }

      return res.status(201).json({ message: "okay", clientData });
    } catch (error) {
      return res.status(500).json({ error: "Server Error" });
    }
  });

router.route("/clientDoc").get(authorize("admin"), async (req, res) => {
  try {
    const cid = req.query.id;
    const id = getId(cid);

    const docs = await Files.find({ userId: id });

    if (docs.length === 0) {
      return res.status(404).json({ error: "Document not found" });
    }
    return res.status(201).json({ docs });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
router.route("/files/:filename").get((req, res) => {
  const { filename } = req.params;
  const filePath = path.resolve(__dirname, "../uploads", filename);
  return res.sendFile(filePath);
});

// Delete
router
  .route("/deleteClient")
  .delete(authorize(["admin", "employee"]), async (req, res) => {
    try {
      const cid = req.query.id;
      const id = getId(cid);

      const clientDocs = await Files.find({ userId: id });

      if (clientDocs) {
        for (const doc of clientDocs) {
          for (const file of doc.document) {
            const fullPath = path.join("uploads", file.filename);
            fs.unlinkSync(fullPath);
          }
        }
        const delDocuments = await Files.deleteMany({ userId: id });
      }

      const delClient = await Client.deleteOne({ _id: id });
      if (delClient.deletedCount === 0) {
        return res.status(404).json({ error: "Client not found" });
      }
      return res.status(201).json({ message: "Deleted..!" });
    } catch (error) {
      console.error("Server error during deletion:", error);
      return res.status(500).json({ error: "Server Error" });
    }
  });

router.route("/download/:filename").get((req, res) => {
  const filename = req.params.filename;
  const filePath = path.resolve(__dirname, "../uploads", filename);

  // Ensure the file exists before sending
  res.download(filePath, filename, (err) => {
    if (err) {
      console.error("File download error:", err);
      res.status(404).send("File not found!");
    }
  });
});
export default router;
