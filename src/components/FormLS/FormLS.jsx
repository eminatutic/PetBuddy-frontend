import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./FormLS.css";
import Button from "../Button/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAt, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function FormLS({title, fields, submitButtonText, onSubmit, imageSrc, pageType, loading, error}) {

  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {})
  );
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  return (
    <div className="form-container">
      <div className="form-image">
        <img src={imageSrc} alt="Form illustration" />
      </div>

      <div className={`form ${pageType === "signup" ? "signup-form" : "login-form"}`}>
        <form onSubmit={handleSubmit} className="form-wrapper">
          <h1>{title}</h1>
          {error && <div className="form-error">{error}</div>}

          {fields.map((field) => (
            <div className="form-field" key={field.name}>
              <label htmlFor={field.name}>{field.label}</label>
              <div className="input-wrapper">
                {field.name === "email" && <FontAwesomeIcon icon={faAt} className="email-icon" />}
                <input
                  type={
                    field.type === "password"
                      ? passwordVisible
                        ? "text"
                        : "password"
                      : field.type
                  }
                  placeholder={field.placeholder}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={field.required}
                />
                {field.type === "password" && (
                  <FontAwesomeIcon
                    icon={passwordVisible ? faEyeSlash : faEye}
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                  />
                )}
              </div>
            </div>
          ))}

          <Button
            text={submitButtonText}
            className="form-submit-button"
            type="submit"
            disabled={loading}
          />
        </form>

        <div id="links">
          {pageType === "login" ? (
            <p>
              Don't have an account? <Link to="/signup">Register here</Link>
            </p>
          ) : (
            <p>
              Already have an account? <Link to="/login">Log in here</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FormLS;
