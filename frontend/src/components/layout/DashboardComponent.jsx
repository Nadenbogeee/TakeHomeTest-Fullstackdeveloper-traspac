import { Button, Divider } from "@nextui-org/react";
import ProfileComponent from "../common/ProfileComponent";

const DashboardComponent = () => {
  return (
    <div className="flex flex-col min-h-screen h-[100%] gap-10 p-10 shadow-2xl">
      <ProfileComponent />
      <Divider />
      <Button color="primary">Home</Button>
      <Button>Daftar Pegawai</Button>
      <Divider />
    </div>
  );
};

export default DashboardComponent;
