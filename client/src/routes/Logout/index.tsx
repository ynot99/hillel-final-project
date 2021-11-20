import { useContext } from "react";
import { Navigate } from "react-router";

import { AuthContext } from "../../App";

const Logout = () => {
  const authContext = useContext(AuthContext);
  authContext.setUser({ user: undefined });
  localStorage.removeItem("auth-token");
  return <Navigate to="/" />;
};

export default Logout;
