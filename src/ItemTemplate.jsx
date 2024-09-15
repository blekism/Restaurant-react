import React from "react";
import eggy from "./assets/eggy.jpg";

export default function ItemTemplate() {
  return (
    <>
      <div class="card" style={{ width: "18rem", height: "37vh" }}>
        <img
          src={eggy}
          style={{ width: "auto", height: "200px" }}
          class="card-img-top"
          alt="eggyyyy"
        />
        <div class="card-body">
          <h5 class="card-title">bayag ni yngwie</h5>
          <p class="card-text">priceless</p>
          <a href="#" class="btn btn-primary">
            Add to card
          </a>
        </div>
      </div>
    </>
  );
}
