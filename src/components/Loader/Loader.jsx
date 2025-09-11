import React from "react";
import "./Loader.css";

function Loader() {
  return (
    <div className="paw-loader-container">
      <img src="/images/paw.png" alt="Loading..." className="paw-loader" />
      <p>Loading...</p>
    </div>
  );
}

export default Loader;
