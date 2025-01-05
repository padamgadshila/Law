import multer from "multer";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../model/user.js";
import Client from "../model/client.js";
import generate from "../helpers/username.password.generator.js";
import fs from "fs";
import path from "path";
import Files from "../model/files.js";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { getOtp } from "../helpers/otpGenerator.js";
import { Mail } from "./mailing.system.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//otp Storage
const otpStore = new Map();

// authenticate user
export let authorize = (roles = []) => {
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
      return res.status(401).send({ error: "Invalid or expired token" });
    }
  };
};

export let auth = async (req, res) => {
  return res.status(201).json({ message: "authorized" });
};

// proper object id
export let getId = (id) => {
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
export const uploadFields = upload.fields([
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
]);
// POST ROUTES
export let login = async (req, res) => {
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
      { expiresIn: "5h" }
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
    res.status(500).json({ error: "Server error" });
  }
};

export let addEmployee = async (req, res) => {
  try {
    const { fname, lname, email, mobile, role } = req.body;
    const { username, password } = generate(fname);

    const userExists = await User.findOne({ email, role: role });

    if (userExists) {
      return res.status(409).json({ error: "user already exists" });
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

    return res.status(201).json({
      message: "Employee added..!",
      mail: {
        username: username,
        userEmail: email,
        text: { password: password },
        subject: "Registered Successfully..!",
        type: "registration",
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};
export let addClient = async (req, res) => {
  try {
    const {
      docNo,
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
      docNo,
      fname,
      mname,
      lname,
      email,
      mobile,
      caseType,
      dob,
      address: { city, village, pincode },
      fileUploaded: "No",
    });

    const savedClient = await client.save();
    return res.status(201).json({ _id: savedClient._id });
  } catch (error) {
    return res.status(500).json({ error: "server error" });
  }
};
export let add = async (req, res) => {
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
    res.status(500).json({ error: "Server error" });
  }
};
export let addClientDocument = async (req, res) => {
  try {
    const { _id, info } = req.body;
    const id = getId(_id);

    const update = await Client.findOneAndUpdate(
      { _id: id },
      { fileUploaded: "Yes" }
    );

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
      userId: id,
      document: docs,
      info: info,
    });
    const savedData = await data.save();

    return res
      .status(201)
      .json({ message: "Documents uploaded..!", user: savedData });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: "Server Error" });
  }
};
export let sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const code = getOtp();

    console.log(email, code);

    const check = await User.findOne({ email: email }).select("-profilePic");

    if (!check) {
      return res.status(404).json({ error: "Email not found..!" });
    }
    // TODO: otp
    req.body = {
      userEmail: email,
      text: `Your One time password is ${code}`,
      subject: "Password Recovery",
      valid: true,
    };
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};

export let verifyOtp = async (req, res) => {
  try {
    const { otp, email } = req.body;
    const storedOtpData = otpStore.get(email);

    if (!storedOtpData || !storedOtpData.valid) {
      return res.status(400).json({ error: "Invalid or expired OTP." });
    }

    if (Date.now() > storedOtpData.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ error: "OTP has expired." });
    }

    if (storedOtpData.otp !== otp) {
      return res.status(400).json({ error: "Incorrect OTP." });
    }
    otpStore.delete(email);

    return res.status(200).json({ message: "Okay" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: "Server error.!" });
  }
};

// GET ROUTES
export let getClients = async (req, res) => {
  try {
    const clientData = await Client.find();
    if (!clientData) {
      return res.status(404).json({ error: "No clients found..!" });
    }

    return res.status(201).json({ message: "okay", clientData });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};
export let clientDoc = async (req, res) => {
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
};
export let fileView = async (req, res) => {
  const { filename } = req.params;
  const filePath = path.resolve(__dirname, "../uploads", filename);
  return res.sendFile(filePath);
};
export let downloadFile = async (req, res) => {
  const filename = req.params.filename;
  const filePath = path.resolve(__dirname, "../uploads", filename);

  // Ensure the file exists before sending
  res.download(filePath, filename, (err) => {
    if (err) {
      res.status(404).send("File not found!");
    }
  });
};
export let clientDataById = async (req, res) => {
  try {
    const id = req.query.id;
    const cid = getId(id);
    const clientData = await Client.findById(cid);

    if (!clientData) {
      return res.status(404).json({ error: "Client Not found..!" });
    }
    return res.status(200).json({ message: "Client Found..!", clientData });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};
export let getEmployee = async (req, res) => {
  try {
    const { role } = req.query;
    const employeeData = await User.find({ role: role });

    if (!employeeData) {
      return res.status(404).json({ error: "No employee found..!" });
    }
    return res.status(200).json({ employeeData });
  } catch (error) {
    return res.status(500).json({ error: "Server Error..!" });
  }
};
export let getProfile = async (req, res) => {
  try {
    const { id, role } = req.query;
    const userId = getId(id);

    const userData = await User.findOne({ _id: userId, role: role }).select(
      "-password"
    );
    if (!userData) {
      return res.status(404).json({ error: "Not found..!" });
    }
    return res.status(200).json({ userData });
  } catch (error) {
    return res.status(500).json({ error: "Server Error..!" });
  }
};
export let employeeDataById = async (req, res) => {
  try {
    const { id, role } = req.query;
    const eid = getId(id);
    const employeeData = await User.findOne({ _id: eid, role: role }).select(
      "-password"
    );

    if (!employeeData) {
      return res.status(404).json({ error: "Employee Not found..!" });
    }
    return res.status(200).json({ message: "Employee Found..!", employeeData });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: "Server Error" });
  }
};
export let verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const check = await User.find({ email: email }).select(
      "-password -profilePic"
    );

    if (!check) {
      return res.status(404).json({ error: "Email not found..!" });
    }

    const otp = getOtp();
    otpStore.set(email, {
      otp,
      valid: true,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });
    const emailData = {
      username: check.username,
      userEmail: email,
      text: { otp: otp },
      subject: "Account Recovery",
      type: "forgotPassword",
    };

    return res
      .status(200)
      .json({ message: "Email sent successfully!", emailData });
  } catch (error) {
    return res.status(500).json({ error: "Server Error..!" });
  }
};

export let resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    otpStore.delete(email);
    const otp = getOtp();
    otpStore.set(email, {
      otp,
      valid: true,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });
    const emailData = {
      userEmail: email,
      text: { otp: otp },
      subject: "Account Recovery",
      type: "forgotPassword",
    };

    const mockRes = {
      status: (code) => ({
        json: (response) => {
          console.log("Mock Mail Response:", code, response);
          if (code === 200) {
            return res.status(200).json({
              message: "OTP sent..!",
            });
          } else {
            return res.status(500).json({ error: "Failed to send otp." });
          }
        },
      }),
    };

    await Mail({ body: emailData }, mockRes);
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: "Server Error" });
  }
};
export let getProfilePic = async (req, res) => {
  try {
    const { email } = req.query;
    const profilePic = await User.findOne({ email: email }).select("-password");
    if (!profilePic) {
      return res.status(404).json({ error: "Not found..!" });
    }
    return res.status(200).json({ profilePic });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};
//  PUT ROUTES
export let updateEmployee = async (req, res) => {
  try {
    const { _id, fname, lname, email, mobile, role, username } = req.body;
    const eid = getId(_id);
    const updateEmployee = await User.findOneAndUpdate(
      { _id: eid, role: role },
      { fname, lname, email, mobile, username }
    );

    return res.status(200).json({ message: "Record Updated" });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};
export let updateClient = async (req, res) => {
  try {
    const {
      _id,
      docNo,
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
    const id = getId(_id);
    const UpdateClient = await Client.findByIdAndUpdate(id, {
      docNo,
      fname,
      mname,
      lname,
      email,
      mobile,
      caseType,
      dob,
      address: {
        city,
        village,
        pincode,
      },
    });

    return res.status(200).json({ message: "Client details updated..!" });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};
export let updateProfile = async (req, res) => {
  try {
    const { id } = req.query;
    const userId = getId(id);
    const { fname, lname, email, mobile, role, username, profilePic } =
      req.body;

    const updateInfo = await User.findOneAndUpdate(
      { _id: userId, role: role },
      {
        fname,
        lname,
        email,
        mobile,
        username,
        profilePic,
      }
    );

    console.log(updateInfo);

    return res.status(200).json({ message: "Profile updated..!" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: "Server Error..!" });
  }
};

export let resetpass = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const update = await User.findOneAndUpdate(
      { email: email },
      { password: hashPassword }
    );
    return res.status(200).json({ message: "Done" });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};
// DELETE ROUTES

export let deleteClient = async (req, res) => {
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
    return res.status(500).json({ error: "Server Error" });
  }
};

export let deleteEmployee = async (req, res) => {
  try {
    const { id, role } = req.query;
    const _id = getId(id);
    const deleteEmployee = await User.deleteOne({ _id: _id, role: role });

    if (deleteEmployee.deletedCount === 0) {
      return res.status(200).json({ error: "Employee not found..!" });
    }
    return res.status(200).json({ message: "Deleted..!" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: "Server Error..!" });
  }
};
