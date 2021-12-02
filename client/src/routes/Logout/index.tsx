import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router";

import { addPopup } from "../../redux/popup/popupSlice";
import { logout } from "../../redux/userauth/userauthSlice";

const Logout = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(logout());
    dispatch(addPopup("Successfuly logged out"));
  }, [dispatch]);
  return <Navigate to="/" />;
};

export default Logout;
