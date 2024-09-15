import React from "react";
import DessertContainer from "./DessertsContainer.jsx";
import Cart from "../ItemCart/ItemCart.jsx";
import "./Dessert.css";

export default function Dessert() {
  return (
    <div className="wrapper">
      <DessertContainer />
      <Cart />
    </div>
  );
}
