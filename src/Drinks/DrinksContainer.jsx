import React from "react";
import "./DrinksContainer.css";
import ItemTemplate from "../ItemTemplate.jsx";

export default function DrinksContainer({ DrinkProp, addToCart }) {
  const filteredDessert = DrinkProp.filter(
    (item) => item.category === "Drinks"
  );

  return (
    <>
      <div className="DrinksParentContainer">
        <h1 className="title">Drinks</h1>
        <center>
          <div className="scrollable-drinks ">
            {filteredDessert.map((drink, key) => (
              <ItemTemplate
                key={key}
                foodName={drink.name}
                price={drink.price}
                img={drink.image}
                addToCart={() => addToCart(drink)}
              />
            ))}
          </div>
        </center>
      </div>
    </>
  );
}
