import "./Form.scss";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { promiseCopyPaste } from "../utils";

interface FormProps {
  header: string;
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
  header,
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
      fetch(process.env.REACT_APP_BASE_URL + "/" + fetchurl, {
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

  // TODO show errors
  return (
    <div className="shadow-container">
      <h1 className="form__heading">{header}</h1>
      <form onSubmit={handleSubmit} className="form">
        {inputs.map((item, index) => (
          <div key={item.name} className="form__input-container">
            <label htmlFor={item.name} className="form__label">
              {item.label} {item.required && "*"}
            </label>
            <input
              autoFocus={index === 0}
              className="form__input"
              id={item.name}
              name={item.name}
              type={item.type}
              required={item.required}
              onChange={(e) => {
                setFormData({ ...formData, [item.name]: e.target.value });
              }}
            />
          </div>
        ))}
        <input className="form__button btn6" type="submit" value={submitText} />
      </form>
    </div>
  );
};

export default Form;
