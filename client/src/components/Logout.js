import { Navigate } from "react-router";

const Logout = () => {
  localStorage.removeItem("auth-token");
  return <Navigate to="/" />;
};

export default Logout;
