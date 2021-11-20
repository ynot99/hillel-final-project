import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { promiseCopyPaste } from "../utils";

interface FormProps {
  fetchurl: string;
  inputs?: Array<{
    name: string;
    label: string;
    type: string;
    required?: boolean;
  }>;
  submitText?: string;
  redirectTo?: string;
  resultFunc?: (result: any) => void;
}

interface ObjStrKeys {
  [key: string]: Object;
}

const Form = ({
  fetchurl,
  inputs = [],
  submitText = "Submit",
  redirectTo = "/",
  resultFunc,
}: FormProps) => {
  const [formData, setFormData] = useState<ObjStrKeys>({});
  const navigate = useNavigate();

  useEffect(() => {
    let initialFormData: ObjStrKeys = {};
    for (let item of inputs) {
      initialFormData[item.name] = "";
    }
    setFormData(initialFormData);
  }, [inputs]);

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    for (let item of inputs) {
      if (item["required"] && formData[item.name] === "") {
        console.error("OOF");
      }
    }

    promiseCopyPaste(
      fetch(fetchurl, {
        method: "POST",
        body: JSON.stringify({ ...formData }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      (result: any) => {
        if (typeof resultFunc === "function") {
          resultFunc(result);
        }
        navigate(redirectTo);
      }
    );
  };

  // TODO style and errors
  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2 className="auth-form__heading">Sign Up</h2>
      {inputs.map((item) => (
        <div key={item.name} className="auth-form__input-container">
          <label className="auth-form__label">{item.label}</label>
          <input
            className="auth-form__input"
            name={item.name}
            type={item.type}
            required={item.required}
            onChange={(e) => {
              setFormData({ ...formData, [item.name]: e.target.value });
            }}
          />
          {/* {fieldsIsError[item["name"]] ?? <span>Error</span>} */}
        </div>
      ))}
      <input type="submit" value={submitText} />
    </form>
  );
};

export default Form;
