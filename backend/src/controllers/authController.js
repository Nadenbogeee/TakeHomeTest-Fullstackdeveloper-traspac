//src/controllers/authController.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";

const generateToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "24h" });
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Register
const Register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validasi
    if (!username || !password) {
      return res.status(400).json({
        error: "Username dan password harus diisi",
      });
    }

    // Cek username existing
    const existingUser = await User.findOne({
      where: { username },
    });

    if (existingUser) {
      return res.status(400).json({
        error: "Username sudah terdaftar",
      });
    }

    // Create user
    const user = await User.create({ username, password });

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      message: "Register berhasil",
      success: true,
      user: {
        id: user.id,
        username: user.username,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Terjadi kesalahan saat register",
    });
  }
};

// Login
const Login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validasi
    if (!username || !password) {
      return res.status(400).json({
        error: "Username dan password harus diisi",
      });
    }

    // Cek user
    const user = await User.findOne({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({
        error: "Username atau password salah",
      });
    }

    // Validasi password
    const isValid = await user.validatePassword(password);

    if (!isValid) {
      return res.status(401).json({
        error: "Username atau password salah",
      });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      message: "Login berhasil",
      success: true,
      user: {
        id: user.id,
        username: user.username,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Terjadi kesalahan saat login",
    });
  }
};

//--- upload profile picture
const UploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "Please upload an image",
      });
    }

    // Log untuk debugging
    console.log("File uploaded:", req.file);
    console.log("User:", req.user);

    const filePath = `/uploads/${req.file.filename}`;

    // Hapus file lama jika ada
    if (req.user.profile_picture) {
      const oldFilePath = path.join(__dirname, "../../", req.user.profile_picture);
      try {
        await fs.unlink(oldFilePath);
        console.log("Old file deleted successfully");
      } catch (error) {
        console.error("Error deleting old profile picture:", error);
      }
    }

    // Update user's profile picture
    await req.user.update({
      profile_picture: filePath,
    });

    console.log("Database updated successfully");

    res.json({
      message: "Profile picture updated successfully",
      profile_picture: filePath,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      error: "Error uploading profile picture: " + error.message,
    });
  }
};
//--- end Upload

//--- Update profile pic
const UpdateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "Please upload an image",
      });
    }

    const filePath = `/uploads/${req.file.filename}`;

    // Hapus file lama jika ada
    if (req.user.profile_picture) {
      const oldFilePath = path.join(__dirname, "../../", req.user.profile_picture);
      try {
        await fs.unlink(oldFilePath);
        console.log("Old file deleted successfully");
      } catch (error) {
        console.error("Error deleting old profile picture:", error);
      }
    }

    // Update user's profile picture
    await req.user.update({
      profile_picture: filePath,
    });

    res.json({
      message: "Profile picture updated successfully",
      profile_picture: filePath,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      error: "Error uploading profile picture: " + error.message,
    });
  }
};

const DeleteProfilePicture = async (req, res) => {
  try {
    // Cek apakah user memiliki profile picture
    if (!req.user.profile_picture) {
      return res.status(400).json({
        error: "No profile picture to delete",
      });
    }

    // Hapus file dari storage
    const filePath = path.join(__dirname, "../../", req.user.profile_picture);
    try {
      await fs.unlink(filePath);
      console.log("Profile picture file deleted successfully");
    } catch (error) {
      console.error("Error deleting profile picture file:", error);
    }

    // Update database: set profile_picture to null
    await req.user.update({
      profile_picture: null,
    });

    res.json({
      message: "Profile picture deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      error: "Error deleting profile picture",
    });
  }
};
const GetProfile = async (req, res) => {
  try {
    // req.user sudah diset oleh middleware auth
    res.json({
      user: {
        id: req.user.id,
        username: req.user.username,
        profile_picture: req.user.profile_picture,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Error fetching profile",
    });
  }
};

export default {
  Login,
  Register,
  UploadProfilePicture,
  UpdateProfilePicture,
  DeleteProfilePicture,
  GetProfile,
};
