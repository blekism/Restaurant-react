import React from "react";
import "./SideDishContainer.css";
import ItemTemplate from "../ItemTemplate.jsx";

export default function SideContainer({ SideDishProp, addToCart }) {
  const filteredDessert = SideDishProp.filter(
    (item) => item.category === "SideDish"
  );
  return (
    <>
      <div className="SideParentContainer">
        <h1 className="title">Side Dish</h1>
        <center>
          <div className="scrollable-side ">
            {filteredDessert.map((side, key) => (
              <ItemTemplate
                key={key}
                foodName={side.name}
                price={side.price}
                img={side.image}
                addToCart={() => addToCart(side)}
              />
            ))}
          </div>
        </center>
      </div>
    </>
  );
}
