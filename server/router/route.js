import { Router } from "express";

import {
  add,
  addClient,
  addClientDocument,
  addEmployee,
  auth,
  authorize,
  clientDataById,
  clientDoc,
  deleteClient,
  deleteEmployee,
  downloadFile,
  employeeDataById,
  fileView,
  getClients,
  getEmployee,
  login,
  updateClient,
  updateEmployee,
  uploadFields,
} from "../controllers/controller.js";
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
router.route("/clientDoc").get(authorize("admin"), clientDoc);
router.route("/files/:filename").get(fileView);
router
  .route("/deleteClient")
  .delete(authorize(["admin", "employee"]), deleteClient);
router.route("/download/:filename").get(downloadFile);
router.route("/clientData").get(authorize("admin"), clientDataById);
router.route("/updateClient").put(authorize("admin"), updateClient);

router.route("/getEmployee").get(authorize("admin"), getEmployee);

router.route("/deleteEmployee").delete(authorize("admin"), deleteEmployee);

router.route("/employeeData").get(authorize("admin"), employeeDataById);

router.route("/updateEmployee").put(authorize("admin"), updateEmployee);
export default router;
