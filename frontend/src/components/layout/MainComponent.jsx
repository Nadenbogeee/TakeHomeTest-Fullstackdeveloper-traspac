import axios from "axios";
import { useEffect, useState } from "react";
import { SearchIcon } from "../common/SearchIcon";
import { Button, Input } from "@nextui-org/react";
import { toast } from "sonner";
import { debounce } from "lodash";
import ModalTambahPegawai from "../common/pegawai/ModalTambahPegawai";
import ModalEditPegawai from "../common/pegawai/ModalEditPegawai";
import CetakDataPegawai from "../common/pegawai/CetakDataPegawai";

const MainComponent = () => {
  // State management
  const [dataEmployees, setDataEmployees] = useState([]);
  const [isModalEditPegawaiOpen, setIsModalEditPegawaiOpen] = useState(false);
  const [selectedDataEmployees, setSelectedDataEmployees] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");

  // Debounced search function
  const debouncedSearch = debounce((query, unit, page) => {
    getAllEmployees(page, query, unit);
  }, 1500);

  // Main data fetching function
  const getAllEmployees = async (page, search = searchQuery, unit = selectedUnit) => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      // Build query parameters
      const params = new URLSearchParams({
        page: page,
        limit: 10,
        ...(search && { search }),
        ...(unit && { unit_kerja_id: unit }),
      });

      const response = await axios.get(`http://localhost:3000/api/employees?${params.toString()}`, {
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
      toast.error("Gagal mengambil data pegawai");
    } finally {
      setIsLoading(false);
    }
  };

  // Effect hook for search and filter
  useEffect(() => {
    setCurrentPage(1);
    setDataEmployees([]);
    debouncedSearch(searchQuery, selectedUnit, 1);
  }, [searchQuery, selectedUnit]);

  // Event handlers
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleUnitChange = (event) => {
    setSelectedUnit(event.target.value);
  };

  const handleLoadMore = () => {
    getAllEmployees(currentPage + 1);
  };

  const handleEditClick = (dataEmployee) => {
    setSelectedDataEmployees(dataEmployee);
    setIsModalEditPegawaiOpen(true);
  };

  const handleUpdateDataPegawai = async (employeeId, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`http://localhost:3000/api/employees/${employeeId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setDataEmployees((prevEmployees) => prevEmployees.map((employee) => (employee.id === employeeId ? response.data.employee : employee)));
        setIsModalEditPegawaiOpen(false);
        toast.success("Data pegawai berhasil diperbarui");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      const errorMessage = error.response?.data?.error || "Gagal memperbarui data pegawai";
      toast.error(errorMessage);
    }
  };

  const handleDeleteDataPegawai = async (employeeId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`http://localhost:3000/api/employees/${employeeId.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setDataEmployees((prevEmployees) => prevEmployees.filter((employee) => employee.id !== employeeId.id));
        toast.success("Data Pegawai berhasil dihapus");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Gagal menghapus data pegawai");
    }
  };

  if (isLoading && currentPage === 1) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="h-full w-full p-4">
      <div className="bg-[#dcdbdb] shadow-xl w-full rounded-2xl p-4 md:p-10 flex flex-col gap-6 md:gap-10">
        {/* Header Section */}
        <div className="flex flex-col items-end gap-5">
          {/* Search and Filter Section */}
          <div className="flex gap-5">
            <div className="relative">
              <Input
                className="rounded-2xl w-full md:w-[300px] border-gray-500"
                variant="flat"
                startContent={<SearchIcon size={18} />}
                type="text"
                placeholder="Search by name, NIP, or other fields..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <select className="px-4 py-2 border rounded-xl" value={selectedUnit} onChange={handleUnitChange}>
              <option value="">Semua Unit</option>
              <option value="1">Unit 1</option>
              <option value="2">Unit 2</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-5">
            <CetakDataPegawai searchParams={{ search: searchQuery, unit_kerja_id: selectedUnit }} />
            <ModalTambahPegawai onSuccess={() => getAllEmployees(1)} />
          </div>
        </div>

        {/* Table Section */}
        <div className="w-[100%] overflow-auto">
          <table className="w-[100%] table-auto border-collapse text-sm">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="p-2 border border-black whitespace-nowrap">No</th>
                <th className="p-2 border border-black whitespace-nowrap">NIP</th>
                <th className="p-2 border border-black whitespace-nowrap">Nama</th>
                <th className="p-2 border border-black whitespace-nowrap">Tempat Lahir</th>
                <th className="p-2 border border-black whitespace-nowrap">Alamat</th>
                <th className="p-2 border border-black whitespace-nowrap">Tanggal Lahir</th>
                <th className="p-2 border border-black whitespace-nowrap">Jenis Kelamin</th>
                <th className="p-2 border border-black whitespace-nowrap">Gol</th>
                <th className="p-2 border border-black whitespace-nowrap">Eselon</th>
                <th className="p-2 border border-black whitespace-nowrap">Jabatan</th>
                <th className="p-2 border border-black whitespace-nowrap">Tempat Tugas</th>
                <th className="p-2 border border-black whitespace-nowrap">Agama</th>
                <th className="p-2 border border-black whitespace-nowrap">Unit Kerja</th>
                <th className="p-2 border border-black whitespace-nowrap">No.Hp</th>
                <th className="p-2 border border-black whitespace-nowrap">NPWP</th>
                <th className="p-2 border border-black whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {dataEmployees && dataEmployees.length > 0 ? (
                dataEmployees.map((dataEmployee, index) => (
                  <tr key={dataEmployee?.id || index} className="hover:bg-blue-900 hover:text-white">
                    <td className="p-2 border border-black">{index + 1}</td>
                    <td className="p-2 border border-black">{dataEmployee?.nip || ""}</td>
                    <td className="p-2 border border-black">{dataEmployee?.nama || ""}</td>
                    <td className="p-2 border border-black">{dataEmployee?.tempat_lahir || ""}</td>
                    <td className="p-2 border border-black max-w-xs truncate">{dataEmployee?.alamat || ""}</td>
                    <td className="p-2 border border-black">{dataEmployee?.tanggal_lahir || ""}</td>
                    <td className="p-2 border border-black">{dataEmployee?.jenis_kelamin || ""}</td>
                    <td className="p-2 border border-black">{dataEmployee?.golongan_id || ""}</td>
                    <td className="p-2 border border-black">{dataEmployee?.eselon || ""}</td>
                    <td className="p-2 border border-black">{dataEmployee?.jabatan_id || ""}</td>
                    <td className="p-2 border border-black">{dataEmployee?.tempat_tugas || ""}</td>
                    <td className="p-2 border border-black">{dataEmployee?.agama || ""}</td>
                    <td className="p-2 border border-black">{dataEmployee?.unit_kerja_id || ""}</td>
                    <td className="p-2 border border-black">{dataEmployee?.no_hp || ""}</td>
                    <td className="p-2 border border-black">{dataEmployee?.npwp || ""}</td>
                    <td className="p-2 border border-black">
                      <div className="flex justify-center items-center gap-2">
                        <svg className="text-green-500 cursor-pointer" viewBox="0 0 1024 1024" fill="currentColor" height="24px" width="24px" onClick={() => handleEditClick(dataEmployee)}>
                          <path d="M880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32zm-622.3-84c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 000-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 009.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9z" />
                        </svg>
                        <svg className="text-red-500 cursor-pointer" viewBox="0 0 24 24" fill="currentColor" height="24px" width="24px" onClick={() => handleDeleteDataPegawai(dataEmployee)}>
                          <path d="M17 4v2H3V4h3.5l1-1h5l1 1H17M4 19V7h12v12c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2m15-4h2v2h-2v-2m0-8h2v6h-2V7z" />
                        </svg>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="16" className="p-2 text-center border border-black">
                    {isLoading ? "Loading..." : "Tidak ada data pegawai"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Load More Button */}
        {currentPage < totalPages && (
          <div className="flex justify-center mt-4">
            <Button onClick={handleLoadMore} disabled={isLoading} className="bg-blue-900 text-white">
              {isLoading ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <ModalEditPegawai
        isOpen={isModalEditPegawaiOpen}
        onClose={() => {
          setIsModalEditPegawaiOpen(false);
          setSelectedDataEmployees(null);
        }}
        dataEmployee={selectedDataEmployees}
        onUpdate={handleUpdateDataPegawai}
      />
    </div>
  );
};

export default MainComponent;
