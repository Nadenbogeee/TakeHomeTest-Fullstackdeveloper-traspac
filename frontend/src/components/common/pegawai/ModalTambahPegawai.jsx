import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, useDisclosure, RadioGroup, Radio } from "@nextui-org/react";
import { toast } from "sonner";
import { useState } from "react";
import axios from "axios";

const ModalTambahPegawai = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tambahPegawai, setTambahPegawai] = useState({
    nip: "",
    nama: "",
    tempat_lahir: "",
    alamat: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    golongan_id: "",
    eselon: "",
    jabatan_id: "",
    unit_kerja_id: "",
    tempat_tugas: "",
    agama: "",
    no_hp: "",
    npwp: "",
  });

  //post
  const handleSubmit = async (onClose) => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const formattedData = {
        ...tambahPegawai,
        jenis_kelamin: tambahPegawai.jenis_kelamin === "Pria" ? "L" : "P",
        golongan_id: tambahPegawai.golongan_id || null, // Tetap sebagai string
        jabatan_id: tambahPegawai.jabatan_id || null, // Tetap sebagai string
        unit_kerja_id: tambahPegawai.unit_kerja_id || null, // Tetap sebagai string
      };

      const response = await axios.post("http://localhost:3000/api/employees", formattedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setTambahPegawai({
          nip: "",
          nama: "",
          tempat_lahir: "",
          alamat: "",
          tanggal_lahir: "",
          jenis_kelamin: "",
          golongan_id: "",
          eselon: "",
          jabatan_id: "",
          unit_kerja_id: "",
          tempat_tugas: "",
          agama: "",
          no_hp: "",
          npwp: "",
        });
        onClose();
        toast.success("Data berhasil ditambahkan!");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Terjadi kesalahan saat menambahkan pegawai");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setTambahPegawai((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <>
      <Button color="primary" onPress={onOpen}>
        <svg viewBox="0 0 1024 1024" fill="currentColor" height="1em" width="1em">
          <path d="M678.3 642.4c24.2-13 51.9-20.4 81.4-20.4h.1c3 0 4.4-3.6 2.2-5.6a371.67 371.67 0 00-103.7-65.8c-.4-.2-.8-.3-1.2-.5C719.2 505 759.6 431.7 759.6 349c0-137-110.8-248-247.5-248S264.7 212 264.7 349c0 82.7 40.4 156 102.6 201.1-.4.2-.8.3-1.2.5-44.7 18.9-84.8 46-119.3 80.6a373.42 373.42 0 00-80.4 119.5A373.6 373.6 0 00137 888.8a8 8 0 008 8.2h59.9c4.3 0 7.9-3.5 8-7.8 2-77.2 32.9-149.5 87.6-204.3C357 628.2 432.2 597 512.2 597c56.7 0 111.1 15.7 158 45.1a8.1 8.1 0 008.1.3zM512.2 521c-45.8 0-88.9-17.9-121.4-50.4A171.2 171.2 0 01340.5 349c0-45.9 17.9-89.1 50.3-121.6S466.3 177 512.2 177s88.9 17.9 121.4 50.4A171.2 171.2 0 01683.9 349c0 45.9-17.9 89.1-50.3 121.6C601.1 503.1 558 521 512.2 521zM880 759h-84v-84c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v84h-84c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h84v84c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-84h84c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z" />
        </svg>
        Tambah Pegawai
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Tambah Pegawai Baru</ModalHeader>
              <ModalBody>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <div className="grid grid-cols-2 gap-4">
                  <Input label="NIP" placeholder="NIP" value={tambahPegawai.nip} onChange={(e) => handleInputChange("nip", e.target.value)} />
                  <Input label="Nama" placeholder="Nama" value={tambahPegawai.nama} onChange={(e) => handleInputChange("nama", e.target.value)} />
                  <Input label="Tempat Lahir" placeholder="Tempat Lahir" value={tambahPegawai.tempat_lahir} onChange={(e) => handleInputChange("tempat_lahir", e.target.value)} />
                  <Input label="Tanggal Lahir" type="date" placeholder="Tanggal Lahir" value={tambahPegawai.tanggal_lahir} onChange={(e) => handleInputChange("tanggal_lahir", e.target.value)} />
                  <Input label="Alamat" placeholder="Alamat" value={tambahPegawai.alamat} onChange={(e) => handleInputChange("alamat", e.target.value)} />
                  <RadioGroup label="Jenis Kelamin" orientation="horizontal" value={tambahPegawai.jenis_kelamin} onValueChange={(value) => handleInputChange("jenis_kelamin", value)}>
                    <Radio value="Pria">Pria</Radio>
                    <Radio value="Wanita">Wanita</Radio>
                  </RadioGroup>
                  <Input label="Golongan" placeholder="Golongan" value={tambahPegawai.golongan_id} onChange={(e) => handleInputChange("golongan_id", e.target.value)} />
                  <Input label="Eselon" placeholder="Eselon" value={tambahPegawai.eselon} onChange={(e) => handleInputChange("eselon", e.target.value)} />
                  <Input label="Jabatan" placeholder="Jabatan" value={tambahPegawai.jabatan_id} onChange={(e) => handleInputChange("jabatan_id", e.target.value)} />
                  <Input label="Tempat Tugas" placeholder="Tempat Tugas" value={tambahPegawai.tempat_tugas} onChange={(e) => handleInputChange("tempat_tugas", e.target.value)} />
                  <Input label="Unit Kerja" placeholder="Unit Kerja" value={tambahPegawai.unit_kerja_id} onChange={(e) => handleInputChange("unit_kerja_id", e.target.value)} />
                  <Input label="Agama" placeholder="Agama" value={tambahPegawai.agama} onChange={(e) => handleInputChange("agama", e.target.value)} />
                  <Input label="No HP" placeholder="No HP" value={tambahPegawai.no_hp} onChange={(e) => handleInputChange("no_hp", e.target.value)} />
                  <Input label="NPWP" placeholder="NPWP" value={tambahPegawai.npwp} onChange={(e) => handleInputChange("npwp", e.target.value)} />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Batal
                </Button>
                <Button color="primary" onPress={() => handleSubmit(onClose)} isLoading={loading}>
                  Simpan
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalTambahPegawai;
