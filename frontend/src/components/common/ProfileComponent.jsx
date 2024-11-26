import { Avatar, Link, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";

const ProfileComponent = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("YogaNaden");
  const fileInputRef = useRef(null);
  const BASE_URL = "http://localhost:3000";

  const getProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(`${BASE_URL}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 && response.data?.user?.profile_picture) {
        const fullImageUrl = `${BASE_URL}${response.data.user.profile_picture}`;
        setProfilePicture(fullImageUrl);
      }

      if (response.status === 200 && response.data?.user?.username) {
        setUsername(response.data.user.username);
      }

      //----
    } catch (error) {
      console.error("Error fetching profile picture:", error);
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile-picture", file);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${BASE_URL}/api/auth/profile-picture`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        await getProfile();
        toast.sucess("Profile Picture berhasil diganti 😁");
      }
    } catch (error) {
      console.error("error updating profile picture:", error);
      console.error(error.message);
    }
  };

  const handleDeleteClick = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${BASE_URL}/api/auth/profile-picture`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setProfilePicture(null);
        toast.success("Profile picture Berhasil Dihapus");
      }
    } catch (error) {
      console.error("Error deleting profile picture:", error);
      console.error(error.message);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  if (loading) {
    return <Avatar className="w-20 h-20" showFallback isBordered />;
  }

  return (
    <div className="flex justify-center flex-col gap-4 mt-5">
      <div className="flex justify-center ms-6">
        <Avatar
          isBordered
          className="w-40 h-40"
          src={profilePicture}
          showFallback
          fallback={
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-600">No Image</span>
            </div>
          }
        />
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        <Dropdown>
          <DropdownTrigger>
            <Link className="flex items-start h-7">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                />
              </svg>
            </Link>
          </DropdownTrigger>
          <DropdownMenu aria-label=" Actions">
            <DropdownItem onClick={handleEditClick} key="edit">
              Edit Image
            </DropdownItem>
            <DropdownItem key="delete" onClick={handleDeleteClick} className="text-danger" color="danger">
              Delete Image
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        {/* dropdown ------------------------------------------------------- */}
      </div>
      <div className="flex flex-col items-center">
        <p className="font-poppins font-medium text-lg mt-2 mb-3">SELAMAT DATANG, {username.split("").slice(0, 5).join("").toUpperCase()}</p>
        <p className="text-sm">Di Aplikasi Data PNS traspac</p>
      </div>
    </div>
  );
};

export default ProfileComponent;
