import { useNavigate } from "react-router-dom";
import NavbarComponnent from "../components/common/NavbarComponent";
import DashboardComponent from "../components/layout/DashboardComponent";
import { useEffect } from "react";
import CheckToken from "../auth/CheckToken";
import MainComponent from "../components/layout/MainComponent";
import Footer from "../components/common/Footer";

const MainPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    CheckToken(navigate);
  }, [navigate]);

  return (
    <div className="flex flex-col">
      <NavbarComponnent />
      <div className="grid grid-cols-12 h-[100%]">
        <div className="col-span-2">
          <DashboardComponent />
        </div>
        <div className="col-span-10">
          <MainComponent />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MainPage;
