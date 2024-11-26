//src/routes/employeeRoutes.js
import express from "express";
import employeeController from "../controllers/employeeController.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.use(auth);

router.get("/", employeeController.getAllEmployees);

router.get("/:id", employeeController.getEmployee);

router.post("/", employeeController.createEmployee);

router.put("/:id", employeeController.updateEmployee);

router.delete("/:id", employeeController.deleteEmployee);

router.get("/export", employeeController.exportEmployees);

export default router;
