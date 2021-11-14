import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const Form = ({
  fetchurl,
  inputs = [],
  submitText = "Submit",
  redirectTo = "/",
  resultFunc,
}) => {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    let initialFormData = {};
    for (let item of inputs) {
      initialFormData[item["name"]] = "";
    }
    setFormData(initialFormData);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    for (let item of inputs) {
      if (item["required"] && formData[item["name"]] === "") {
        console.error("OOF");
      }
    }

    fetch(fetchurl, {
      method: "POST",
      body: JSON.stringify({ ...formData }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.log(response.text());
          throw new Error("Something went wrong");
        }
      })
      .then((result) => {
        if (typeof resultFunc === "function") {
          resultFunc(result);
        }
        navigate(redirectTo);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2 className="auth-form__heading">Sign Up</h2>
      {inputs.map((item) => (
        <div key={item["name"]} className="auth-form__input-container">
          <label className="auth-form__label">{item["label"]}</label>
          <input
            className="auth-form__input"
            name={item["name"]}
            type={item["type"]}
            required={item["required"]}
            onChange={(e) => {
              setFormData({ ...formData, [item["name"]]: e.target.value });
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
