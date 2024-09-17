import React from "react";
import "./MainDishContainer.css";
import ItemTemplate from "../ItemTemplate.jsx";

export default function MainDish({ MainDishProp, addToCart }) {
  console.log(MainDishProp);
  const filteredDessert = MainDishProp.filter(
    (item) => item.category === "MainDish"
  );
  return (
    <>
      <div className="MainDishParentContainer">
        <h1 className="title">Main Dish</h1>
        <center>
          <div className="scrollable-main ">
            {filteredDessert.map((main, key) => (
              <ItemTemplate
                key={key}
                foodName={main.name}
                price={main.price}
                img={main.image}
                addToCart={() => addToCart(main)}
              />
            ))}
          </div>
        </center>
      </div>
    </>
  );
}
