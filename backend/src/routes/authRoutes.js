// src/routes/authRoutes.js
import express from "express";
import authController from "../controllers/authController.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";
const router = express.Router();

router.post("/register", authController.Register);
router.post("/login", authController.Login);
router.post(
  "/upload-profile-picture",
  auth, 
  upload.single("profilePicture"), 
  authController.UploadProfilePicture 
);
router.get("/profile", auth, authController.GetProfile);
router.put("/profile-picture", auth, upload.single("profile-picture"), authController.UpdateProfilePicture);
router.delete("/profile-picture", auth, authController.DeleteProfilePicture);

// router.post("/upload-profile-picture", auth, upload.single("profilePicture"), authController.updateProfilePicture);

export default router;
