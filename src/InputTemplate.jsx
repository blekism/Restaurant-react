import React from "react";

export default function AddInputTemplate(prop) {
  return (
    <>
      <div class="input-group mt-4">
        <span class="input-group-text fw-bold" id="inputGroup-sizing-default">
          {prop.desc}
        </span>
        <input
          type={prop.type}
          class="form-control"
          aria-label="Sizing example input"
          aria-describedby="inputGroup-sizing-default"
          name={prop.name}
          value={prop.value}
          onChange={prop.onChange}
        />
      </div>
    </>
  );
}
