import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { useNavigate, Link } from "react-router-dom";
const NavbarComponnent = () => {
  const navigate = useNavigate();

  const deleteAuth = () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        localStorage.removeItem("token");
        setTimeout(() => {
          navigate("/");
        }, 100);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar position="static" className="border-b-gray-300 border-5 shadow-2xl ">
        <NavbarBrand>
          <p className="font-bold text-xl">TRASPAC</p>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-10 text-gray-500 cursor-pointer" justify="center">
          <NavbarItem>
            <Dropdown>
              <DropdownTrigger>
                <Link className="flex gap-2 text-thin ">
                  Tentang Kami
                  <svg viewBox="0 0 24 24" fill="currentColor" height="20px" width="20px">
                    <path d="M19 21a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14zm-8-9V7h2v5h4l-5 5-5-5h4z" />
                  </svg>
                </Link>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions" className="text-thin">
                <DropdownItem key="new">
                  <Link to={"https://traspac.id/about/"}>Profil Kami</Link>
                </DropdownItem>
                <DropdownItem to={"https://traspac.id/budaya-kami/"} key="copy">
                  <Link>Budaya Kami</Link>
                </DropdownItem>
                <DropdownItem to={"https://traspac.id/csr/"} key="edit">
                  <Link>CSR</Link>
                </DropdownItem>
                <DropdownItem to={"https://traspac.id/gallery/"} key="edit">
                  <Link>Gallery</Link>
                </DropdownItem>
                <DropdownItem to={"https://traspac.id/beasiswa/"} key="edit">
                  <Link>Beasiswa</Link>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
          <NavbarItem>
            <Link to={"https://traspac.id/product-and-service/"}>Produk dan Layanan</Link>
          </NavbarItem>
          <NavbarItem>
            <Link to={"https://traspac.id/informasi-lomba/"}>Traspac Competition</Link>
          </NavbarItem>
          <NavbarItem>
            <Link to={"https://traspac.id/lowongan/"}>Lowongan</Link>
          </NavbarItem>
          <NavbarItem>
            <Link to={"https://traspac.id/contact/"}>Kontak</Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button as={Link} onClick={deleteAuth} className="bg-red-500 text-white" href="#" variant="flat">
              <svg viewBox="0 0 1024 1024" fill="currentColor" height="20px" width="20px">
                <path d="M868 732h-70.3c-4.8 0-9.3 2.1-12.3 5.8-7 8.5-14.5 16.7-22.4 24.5a353.84 353.84 0 01-112.7 75.9A352.8 352.8 0 01512.4 866c-47.9 0-94.3-9.4-137.9-27.8a353.84 353.84 0 01-112.7-75.9 353.28 353.28 0 01-76-112.5C167.3 606.2 158 559.9 158 512s9.4-94.2 27.8-137.8c17.8-42.1 43.4-80 76-112.5s70.5-58.1 112.7-75.9c43.6-18.4 90-27.8 137.9-27.8 47.9 0 94.3 9.3 137.9 27.8 42.2 17.8 80.1 43.4 112.7 75.9 7.9 7.9 15.3 16.1 22.4 24.5 3 3.7 7.6 5.8 12.3 5.8H868c6.3 0 10.2-7 6.7-12.3C798 160.5 663.8 81.6 511.3 82 271.7 82.6 79.6 277.1 82 516.4 84.4 751.9 276.2 942 512.4 942c152.1 0 285.7-78.8 362.3-197.7 3.4-5.3-.4-12.3-6.7-12.3zm88.9-226.3L815 393.7c-5.3-4.2-13-.4-13 6.3v76H488c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h314v76c0 6.7 7.8 10.5 13 6.3l141.9-112a8 8 0 000-12.6z" />
              </svg>{" "}
              Log out
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </>
  );
};

export default NavbarComponnent;
