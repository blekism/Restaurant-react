import React from "react";
import Template from "../InputTemplate.jsx";
import "./AddItem.css";

export default function AddItem() {
  return (
    <>
      <center>
        <div className="addItemParent">
          <h3 className="addItemTitle">Add a new Item!</h3>
          <hr className="line" />
          {/* input start */}
          <form>
            <Template desc="Item Name" type="text" name="name" />
            <Template desc="Item Price" type="text" name="price" />

            <p>Menu Item Category</p>
            <select
              class="form-select mb-3"
              aria-label="Default select example"
            >
              <option value="MainDish">MainDish</option>
              <option value="SideDish">SideDish</option>
              <option value="Dessert">Dessert</option>
              <option value="Drinks">Drinks</option>
            </select>

            <p>Menu Item Image</p>
            <div class="mb-3">
              <input class="form-control" type="file" id="formFile" />
            </div>
            {/* input end */}
            <button
              type="submit"
              className="btn btn-primary fw-bold mt-4 btn-lg"
            >
              Submit
            </button>
          </form>
        </div>
      </center>
    </>
  );
}
