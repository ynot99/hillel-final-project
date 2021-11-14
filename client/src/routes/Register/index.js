import { Form } from "../../components";

const Register = () => {
  return (
    <Form
      fetchurl="api/v1/blog/register"
      redirectTo="/login"
      inputs={[
        {
          name: "email",
          label: "Email",
          type: "email",
          required: true,
        },
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
        {
          name: "password2",
          label: "Repeat password",
          type: "password",
          required: true,
        },
      ]}
      submitText="Sign Up"
    />
  );
};

export default Register;
