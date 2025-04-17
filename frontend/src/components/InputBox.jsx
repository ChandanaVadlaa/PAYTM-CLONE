import React from "react";

function InputBox({ label, onchange, placeholder }) {
  <h3>{label}</h3>;
  return <input type="text" onChange={onchange} placeholder={placeholder} />;
}

export default InputBox;
