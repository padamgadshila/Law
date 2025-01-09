import { Router } from "express";

import {
  add,
  addClient,
  addClientDocument,
  addEmployee,
  addEvent,
  auth,
  authorize,
  clientDataById,
  clientDoc,
  dashboardData,
  deleteClient,
  deleteEmployee,
  deleteEvent,
  downloadFile,
  employeeDataById,
  fileView,
  getClients,
  getEmployee,
  getEvents,
  getProfile,
  getProfilePic,
  login,
  resendOtp,
  resetpass,
  updateClient,
  updateEmployee,
  updateProfile,
  uploadFields,
  verifyEmail,
  verifyOtp,
} from "../controllers/controller.js";
import { Mail } from "../controllers/mailing.system.js";
const router = Router();

router.route("/auth").post(authorize(["admin", "employee"]), auth);
router.route("/login").post(login);
router.route("/addEmployee").post(authorize("admin"), addEmployee);
router.route("/addClient").post(authorize(["admin", "employee"]), addClient);
router.route("/add").post(add);
router
  .route("/addClientDocument")
  .post(authorize(["admin", "employee"]), uploadFields, addClientDocument);
router.route("/getClients").get(authorize(["admin", "employee"]), getClients);
router.route("/clientDoc").get(authorize(["admin", "employee"]), clientDoc);
router.route("/files/:filename").get(fileView);
router
  .route("/deleteClient")
  .delete(authorize(["admin", "employee"]), deleteClient);
router.route("/download/:filename").get(downloadFile);
router
  .route("/clientData")
  .get(authorize(["admin", "employee"]), clientDataById);
router
  .route("/updateClient")
  .put(authorize(["admin", "employee"]), updateClient);

router.route("/getEmployee").get(authorize("admin"), getEmployee);

router.route("/deleteEmployee").delete(authorize("admin"), deleteEmployee);

router.route("/employeeData").get(authorize("admin"), employeeDataById);

router.route("/updateEmployee").put(authorize("admin"), updateEmployee);
router.route("/profile").get(authorize(["admin", "employee"]), getProfile);
router
  .route("/updateProfile")
  .post(authorize(["admin", "employee"]), updateProfile);

router.route("/sendMail").post(Mail);

router.route("/sendOtp").post(verifyEmail);
router.route("/getProfilePic").get(getProfilePic);
router.route("/verifyOtp").post(verifyOtp);
router.route("/resendOtp").post(resendOtp);
router.route("/resetpass").put(resetpass);

router.route("/dashboardData").get(dashboardData);

router.route("/addEvent").post(authorize("admin"), addEvent);
router.route("/delEvent").delete(authorize("admin"), deleteEvent);
router.route("/getEvents").get(authorize("admin"), getEvents);
export default router;
