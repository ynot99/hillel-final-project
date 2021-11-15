import { Form } from "../../components";

const Login = () => {
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
      resultFunc={(result: { token: string }) => {
        localStorage.setItem("auth-token", result.token);
      }}
    />
  );
};

export default Login;
