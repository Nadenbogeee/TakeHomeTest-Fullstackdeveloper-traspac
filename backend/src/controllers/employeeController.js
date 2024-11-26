//src/controllers/employeeControllers.js
import Employee from "../models/Employee.js";
import { Op } from "sequelize";

const getAllEmployees = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const unit_kerja_id = req.query.unit_kerja_id;

    const whereClause = {
      [Op.or]: [{ nama: { [Op.like]: `%${search}%` } }, { nip: { [Op.like]: `%${search}%` } }],
    };

    if (unit_kerja_id) {
      whereClause.unit_kerja_id = unit_kerja_id;
    }

    const { count, rows } = await Employee.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: (page - 1) * limit,
      order: [["createdAt", "ASC"]],
    });

    res.json({
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      employees: rows,
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({
      error: "Error fetching employees",
      details: error.message,
    });
  }
};

const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }
    res.json(employee);
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({
      error: "Error fetching employee details",
      details: error.message,
    });
  }
};

const createEmployee = async (req, res) => {
  try {
    const { nip, nama, tempat_lahir, alamat, tanggal_lahir, jenis_kelamin, golongan_id, eselon, jabatan_id, unit_kerja_id, tempat_tugas, agama, no_hp, npwp } = req.body;

    if (!agama || !jenis_kelamin) {
      return res.status(400).json({
        error: "NIP, nama, dan jenis kelamin wajib diisi",
        success: false,
      });
    }

    const employee = await Employee.create({
      nip,
      nama,
      tempat_lahir,
      alamat,
      tanggal_lahir: tanggal_lahir ? new Date(tanggal_lahir) : null,
      jenis_kelamin,
      golongan_id: golongan_id || null,
      eselon: eselon || null,
      jabatan_id: jabatan_id || null,
      unit_kerja_id: unit_kerja_id || null,
      tempat_tugas,
      agama,
      no_hp,
      npwp,
      foto_path: req.file ? req.file.path : null,
    });

    res.status(201).json({
      message: "Data pegawai berhasil ditambahkan",
      employee,
      success: true,
    });
  } catch (error) {
    console.error("Error creating employee:", error);

    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        error: "Referensi tidak valid (unit kerja, jabatan, atau golongan)",
        success: false,
      });
    }

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Data tidak valid",
        details: error.errors.map((e) => e.message),
        success: false,
      });
    }

    res.status(500).json({
      error: "Gagal menambahkan data pegawai",
      details: error.message,
      success: false,
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }

    const updateData = { ...req.body };

    // Convert tanggal_lahir to Date object if it exists
    if (updateData.tanggal_lahir) {
      updateData.tanggal_lahir = new Date(updateData.tanggal_lahir);
    }

    await employee.update(updateData);

    res.json({
      message: "Data pegawai berhasil diperbarui",
      employee,
      success: true,
    });
  } catch (error) {
    console.error("Error updating employee:", error);

    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        error: "Referensi tidak valid (unit kerja, jabatan, atau golongan).",
        success: false,
      });
    }

    res.status(500).json({
      error: "Gagal memperbarui data pegawai",
      details: error.message,
      success: false,
    });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }

    await employee.destroy();

    res.json({
      message: "Data pegawai berhasil dihapus",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({
      error: "Gagal menghapus data pegawai",
      details: error.message,
      success: false,
    });
  }
};

const exportEmployees = async (req, res) => {
  try {
    const search = req.query.search || "";
    const unit_kerja_id = req.query.unit_kerja_id;

    
    const whereClause = {
      [Op.or]: [{ nama: { [Op.like]: `%${search}%` } }, { nip: { [Op.like]: `%${search}%` } }],
    };

    if (unit_kerja_id) {
      whereClause.unit_kerja_id = unit_kerja_id;
    }

    // Fetch all employees matching the criteria
    const employees = await Employee.findAll({
      where: whereClause,
      order: [["createdAt", "ASC"]],
    });

    
    if (req.query.format === "csv") {
      const csvData = employees.map((e) => ({
        NIP: e.nip,
        Nama: e.nama,
        "Tempat Lahir": e.tempat_lahir,
        "Tanggal Lahir": e.tanggal_lahir,
        Alamat: e.alamat,
        "Jenis Kelamin": e.jenis_kelamin,
        Jabatan: e.jabatan_id,
        "Unit Kerja": e.unit_kerja_id,
      }));

      const csv = convertToCSV(csvData);
      res.header("Content-Type", "text/csv");
      res.attachment("daftar_pegawai.csv");
      return res.send(csv);
    }

    
    res.json(employees);
  } catch (error) {
    console.error("Error exporting employees:", error);
    res.status(500).json({
      error: "Gagal mengekspor data pegawai",
      details: error.message,
    });
  }
};

const convertToCSV = (data) => {
  const headers = Object.keys(data[0]).join(",");
  const rows = data.map((row) => Object.values(row).join(",")).join("\n");
  return `${headers}\n${rows}`;
};

export default {
  getAllEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  exportEmployees,
};
