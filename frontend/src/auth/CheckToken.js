const CheckToken = (navigate) => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/");
  }
};

export default CheckToken;
