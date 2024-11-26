//src/models/employee.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Employee = sequelize.define(
  "Employee",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    nip: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
    },
    nama: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    tempat_lahir: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    tempat_tugas: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    tanggal_lahir: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    alamat: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    jenis_kelamin: {
      type: DataTypes.ENUM("L", "P"),
      allowNull: true,
    },
    // Changed to STRING to accept both string and number inputs
    golongan_id: {
      type: DataTypes.STRING(20),
      allowNull: true,
      references: {
        model: "golongan",
        key: "id",
        // Add this to allow any type of input
        constraints: false,
      },
    },
    // Changed to match database schema
    eselon: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    // Changed to STRING to accept both string and number inputs
    jabatan_id: {
      type: DataTypes.STRING(20),
      allowNull: true,
      references: {
        model: "jabatan",
        key: "id",
        constraints: false,
      },
    },
    // Changed to STRING to accept both string and number inputs
    unit_kerja_id: {
      type: DataTypes.STRING(20),
      allowNull: true,
      references: {
        model: "unit_kerja",
        key: "id",
        constraints: false,
      },
    },
    agama: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    no_hp: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    npwp: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    foto_path: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "pegawai", // Changed to match the database table name
    underscored: true,
  }
);

// Define relationships here if needed
Employee.associate = (models) => {
  Employee.belongsTo(models.UnitKerja, {
    foreignKey: "unit_kerja_id",
    as: "unit_kerja",
    constraints: false, // Add this to allow flexible relationships
  });
  Employee.belongsTo(models.Jabatan, {
    foreignKey: "jabatan_id",
    as: "jabatan",
    constraints: false,
  });
  Employee.belongsTo(models.Golongan, {
    foreignKey: "golongan_id",
    as: "golongan",
    constraints: false,
  });
};

export default Employee;
