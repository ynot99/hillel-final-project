import { useDispatch } from "react-redux";

import { Form } from "../../components";
import { addPopup } from "../../redux/popup/popupSlice";
import { setUser } from "../../redux/userauth/userauthSlice";

const Login = () => {
  const dispatch = useDispatch();
  return (
    <Form
      header="Sign In"
      fetchurl="api/token-auth"
      inputs={[
        {
          name: "username",
          label: "Username",
          type: "text",
          required: true,
        },
        {
          name: "password",
          label: "Password",
          type: "password",
          required: true,
        },
      ]}
      submitText="Login"
      resultFunc={(result: {
        id: number;
        slug: string;
        token: string;
        first_name: string;
        last_name: string;
        username: string;
        avatar: string;
      }) => {
        localStorage.setItem("auth-token", result.token);
        dispatch(
          setUser({
            id: result.id,
            slug: result.slug,
            username: result.username,
            firstName: result.first_name,
            lastName: result.last_name,
            avatar: result.avatar,
          })
        );
        dispatch(addPopup("Successfully logged in"));
      }}
    />
  );
};

export default Login;
