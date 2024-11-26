import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Button } from "@nextui-org/react";
import axios from "axios";

const CetakDataPegawai = () => {
  const [dataEmployees, setDataEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const getAllEmployees = async (page) => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:3000/api/employees?page=${page}&limit=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const { employees, totalPages, currentPage } = response.data;
        setDataEmployees((prevEmployees) => (page === 1 ? employees : [...prevEmployees, ...employees]));
        setCurrentPage(currentPage);
        setTotalPages(totalPages);
      }
    } catch (error) {
      console.error("Error fetching data pegawai:", error);
      setError("Gagal mengambil data pegawai");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllEmployees(1);
  }, []);

  const handleCetakPDF = () => {
    const doc = new jsPDF("l", "mm", "a4"); // Set to landscape orientation

    // Add title
    doc.setFontSize(14);
    doc.text("Data Pegawai", 15, 10);

    // Define the columns exactly as in the table
    const columns = [
      { header: "No", dataKey: "no" },
      { header: "NIP", dataKey: "nip" },
      { header: "Nama", dataKey: "nama" },
      { header: "Tempat Lahir", dataKey: "tempat_lahir" },
      { header: "Alamat", dataKey: "alamat" },
      { header: "Tanggal Lahir", dataKey: "tanggal_lahir" },
      { header: "Jenis Kelamin", dataKey: "jenis_kelamin" },
      { header: "Gol", dataKey: "golongan" },
      { header: "Eselon", dataKey: "eselon" },
      { header: "Jabatan", dataKey: "jabatan" },
      { header: "Tempat Tugas", dataKey: "tempat_tugas" },
      { header: "Agama", dataKey: "agama" },
      { header: "Unit Kerja", dataKey: "unit_kerja" },
      { header: "No.Hp", dataKey: "no_hp" },
      { header: "NPWP", dataKey: "npwp" },
    ];

    // Prepare the data
    const tableData = dataEmployees.map((employee, index) => ({
      no: index + 1,
      nip: employee.nip || "",
      nama: employee.nama || "",
      tempat_lahir: employee.tempat_lahir || "",
      alamat: employee.alamat || "",
      tanggal_lahir: employee.tanggal_lahir || "",
      jenis_kelamin: employee.jenis_kelamin || "",
      golongan: employee.golongan || "",
      eselon: employee.eselon || "",
      jabatan: employee.jabatan || "",
      tempat_tugas: employee.tempat_tugas || "",
      agama: employee.agama || "",
      unit_kerja: employee.unit_kerja || "",
      no_hp: employee.no_hp || "",
      npwp: employee.npwp || "",
    }));

    // Generate table
    doc.autoTable({
      columns: columns.map((col) => ({
        header: col.header,
        dataKey: col.dataKey,
      })),
      body: tableData,
      startY: 20,
      styles: {
        fontSize: 8,
        cellPadding: 1,
        overflow: "linebreak",
        cellWidth: "wrap",
      },
      columnStyles: {
        no: { cellWidth: 8 },
        nip: { cellWidth: 25 },
        nama: { cellWidth: 25 },
        tempat_lahir: { cellWidth: 20 },
        alamat: { cellWidth: 30 },
        tanggal_lahir: { cellWidth: 20 },
        jenis_kelamin: { cellWidth: 15 },
        golongan: { cellWidth: 10 },
        eselon: { cellWidth: 10 },
        jabatan: { cellWidth: 25 },
        tempat_tugas: { cellWidth: 20 },
        agama: { cellWidth: 15 },
        unit_kerja: { cellWidth: 20 },
        no_hp: { cellWidth: 20 },
        npwp: { cellWidth: 20 },
      },
      headStyles: {
        fillColor: [70, 78, 95],
        textColor: 255,
        fontSize: 8,
        halign: "center",
        valign: "middle",
      },
      bodyStyles: {
        halign: "left",
        valign: "middle",
      },
      theme: "grid",
    });

    // Save the PDF
    doc.save("data_pegawai.pdf");
  };

  return (
    <Button className="text-white bg-green-600 hover:bg-green-700" onClick={handleCetakPDF} disabled={isLoading || error}>
      Cetak Data{" "}
      <svg fill="currentColor" viewBox="0 0 16 16" height="1em" width="1em">
        <path d="M.5 9.9a.5.5 0 01.5.5v2.5a1 1 0 001 1h12a1 1 0 001-1v-2.5a.5.5 0 011 0v2.5a2 2 0 01-2 2H2a2 2 0 01-2-2v-2.5a.5.5 0 01.5-.5z" />
        <path d="M7.646 11.854a.5.5 0 00.708 0l3-3a.5.5 0 00-.708-.708L8.5 10.293V1.5a.5.5 0 00-1 0v8.793L5.354 8.146a.5.5 0 10-.708.708l3 3z" />
      </svg>
    </Button>
  );
};

export default CetakDataPegawai;
