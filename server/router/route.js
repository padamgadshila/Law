import { Router } from "express";
import User from "../model/user.js";
import Client from "../model/client.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import generate from "../helpers/username.password.generator.js";
import multer from "multer";

const router = Router();

// authenticate user
let authorize = (roles = []) => {
  if (typeof roles === "string") {
    roles = [roles];
  }
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];

      if (!token) {
        return res.status(401).send({ error: "no token provided" });
      }

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

// Storage configuration

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
// post
router.route("/adminLogin").post(async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const userExist = await User.findOne({ username, role: role });

    if (!userExist) {
      return res.status(404).send({ error: "user not found" });
    }

    const passwordCheck = await bcrypt.compare(password, userExist.password);
    if (!passwordCheck) {
      return res.status(401).send({ error: "password is incorrect" });
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

    if (userExist.role == "admin") {
      return res.status(201).json({
        message: "Admin login successful",
        token,
        user: {
          id: userExist._id,
          username: userExist.username,
          role: userExist.role,
        },
      });
    }

    if (userExist.role == "employee") {
      return res.status(201).json({
        message: "Employee login successful",
        token,
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

router.route("/employeeLogin").post(async (req, res) => {
  const data = req.user;
  return res.status(201).send({ data });
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
        clientId,
        fname,
        mname,
        lname,
        email,
        mobile,
        city,
        state,
        pincode,
      } = req.body;

      const client = new Client({
        clientId,
        fname,
        mname,
        lname,
        email,
        mobile,
        address: { city, state, pincode },
      });

      const savedClient = await client.save();
      return res.status(201).send({ cid: savedClient._id });
    } catch (error) {
      return res.status(500).send({ error: "server error" });
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

// get

export default router;
