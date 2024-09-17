import React from "react";

export default function ItemTemplate(item) {
  return (
    <>
      <div class="card" style={{ width: "18rem", height: "fit-content" }}>
        {item.img && (
          <img
            src={item.img}
            style={{ width: "auto", height: "200px" }}
            class="card-img-top"
            alt="eggyyyy"
          />
        )}
        <div class="card-body">
          <h5 class="card-title">{item.foodName}</h5>
          <p class="card-text">{item.price}</p>
          <button
            type="button"
            class="btn btn-primary btn-sm"
            onClick={item.addToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
}
