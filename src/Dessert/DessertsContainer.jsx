import React from "react";
import "./DessertContainer.css";
import ItemTemplate from "../ItemTemplate.jsx";

export default function DessertContainer() {
  return (
    <>
      <div className="DessertParentContainer">
        <h1 className="title">Dessert</h1>
        <center>
          <div className="scrollable-dessert ">
            <ItemTemplate />
          </div>
        </center>
      </div>
    </>
  );
}
