//src/routes/employeeRoutes.js
import express from "express";
import employeeController from "../controllers/employeeController.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Semua routes dilindungi dengan middleware auth
router.use(auth);

// Get all employees with pagination and search
router.get("/", employeeController.getAllEmployees);

// Get single employee
router.get("/:id", employeeController.getEmployee);

// Create new employee
router.post("/", employeeController.createEmployee);

// Update employee
router.put("/:id", employeeController.updateEmployee);

// Delete employee
router.delete("/:id", employeeController.deleteEmployee);

router.get("/export", employeeController.exportEmployees);

export default router;
