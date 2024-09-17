import React from "react";
import "./DessertContainer.css";
import ItemTemplate from "../ItemTemplate.jsx";

export default function DessertContainer({ dessertProp, addToCart }) {
  console.log(dessertProp);
  const filteredDessert = dessertProp.filter(
    (item) => item.category === "Dessert"
  );

  return (
    <>
      <div className="DessertParentContainer">
        <h1 className="title">Dessert</h1>
        <center>
          <div className="scrollable-dessert ">
            {filteredDessert.map((dessert, key) => (
              <ItemTemplate
                key={key}
                foodName={dessert.name}
                price={dessert.price}
                img={dessert.image}
                addToCart={() => addToCart(dessert)}
              />
            ))}
          </div>
        </center>
      </div>
    </>
  );
}
