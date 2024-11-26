//src/components/common/pegawai/ModalEditPegawai.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Radio, RadioGroup } from "@nextui-org/react";

const ModalEditPegawai = ({ dataEmployee, onClose, isOpen, onUpdate }) => {
  const [formDataPegawai, setFormDataPegawai] = useState({
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

  useEffect(() => {
    if (dataEmployee) {
      setFormDataPegawai({
        nip: dataEmployee.nip || "",
        nama: dataEmployee.nama || "",
        tempat_lahir: dataEmployee.tempat_lahir || "",
        alamat: dataEmployee.alamat || "",
        tanggal_lahir: dataEmployee.tanggal_lahir || "",
        jenis_kelamin: dataEmployee.jenis_kelamin || "",
        golongan_id: dataEmployee.golongan_id || "",
        eselon: dataEmployee.eselon || "",
        jabatan_id: dataEmployee.jabatan_id || "",
        unit_kerja_id: dataEmployee.unit_kerja_id || "",
        tempat_tugas: dataEmployee.tempat_tugas || "",
        agama: dataEmployee.agama || "",
        no_hp: dataEmployee.no_hp || "",
        npwp: dataEmployee.npwp || "",
      });
    }
  }, [dataEmployee]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(dataEmployee.id, formDataPegawai);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataPegawai((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenderChange = (value) => {
    setFormDataPegawai((prev) => ({
      ...prev,
      jenis_kelamin: value,
    }));
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader className="flex flex-col gap-1">Edit Mata Kuliah</ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-2 gap-4">
                <Input name="nip" label="NIP" value={formDataPegawai.nip} onChange={handleChange} />
                <Input name="nama" label="Nama" value={formDataPegawai.nama} onChange={handleChange} />
                <Input name="tempat_lahir" label="Tempat Lahir" value={formDataPegawai.tempat_lahir} onChange={handleChange} />
                <Input name="tanggal_lahir" label="Tanggal Lahir" type="date" value={formDataPegawai.tanggal_lahir} onChange={handleChange} />
                <Input name="alamat" label="Alamat" value={formDataPegawai.alamat} onChange={handleChange} />
                <RadioGroup name="jenis_kelamin" label="Jenis Kelamin" orientation="horizontal" value={formDataPegawai.jenis_kelamin} onValueChange={handleGenderChange}>
                  <Radio value="L">Pria</Radio>
                  <Radio value="P">Wanita</Radio>
                </RadioGroup>
                <Input name="golongan" label="Golongan" value={formDataPegawai.golongan_id} onChange={handleChange} />
                <Input name="eselon" label="Eselon" value={formDataPegawai.eselon} onChange={handleChange} />
                <Input name="jabatan" label="Jabatan" value={formDataPegawai.jabatan_id} onChange={handleChange} />
                <Input name="tempat_tugas" label="Tempat Tugas" value={formDataPegawai.tempat_tugas} onChange={handleChange} />
                <Input name="unit_kerja" label="Unit Kerja" value={formDataPegawai.unit_kerja_id} onChange={handleChange} />
                <Input name="agama" label="Agama" value={formDataPegawai.agama} onChange={handleChange} />
                <Input name="no_hp" label="No HP" value={formDataPegawai.no_hp} onChange={handleChange} />
                <Input name="npwp" label="NPWP" value={formDataPegawai.npwp} onChange={handleChange} />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Batal
              </Button>
              <Button color="primary" type="submit">
                Simpan
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalEditPegawai;
