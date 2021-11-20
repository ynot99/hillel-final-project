import { useContext } from "react";

import { Form } from "../../components";
import { AuthContext } from "../../App";

const Login = () => {
  const authContext = useContext(AuthContext);
  return (
    <Form
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
        authContext.setUser({
          user: {
            id: result.id,
            slug: result.slug,
            username: result.username,
            firstName: result.first_name,
            lastName: result["last_name"],
            avatar: result.avatar,
          },
        });
      }}
    />
  );
};

export default Login;
