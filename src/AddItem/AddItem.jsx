import React from "react";
import Template from "../InputTemplate.jsx";
import "./AddItem.css";
import { useState } from "react";

export default function AddItem({ addItem }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("MainDish");
  const [image, setImage] = useState("");
  const [itemID, setItemID] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = { id: itemID, name, price, category, image };
    addItem(newItem);
    // Reset form fields
    setName("");
    setPrice("");
    setCategory("MainDish");
  };

  const generateID = () => {
    const id = Math.random().toString(36).substr(2, 9);
    setItemID(id);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
    setImageUrl(URL.createObjectURL(file));
  };

  return (
    <>
      <center>
        <div className="addItemParent">
          <h3 className="addItemTitle">Add a new Item!</h3>
          <hr className="line" />
          {/* input start */}
          <form onSubmit={handleSubmit}>
            <Template
              desc="Item Name"
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Template
              desc="Item Price"
              type="text"
              name="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <p>Menu Item Category</p>
            <select
              class="form-select mb-3"
              aria-label="Default select example"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="MainDish">MainDish</option>
              <option value="SideDish">SideDish</option>
              <option value="Dessert">Dessert</option>
              <option value="Drinks">Drinks</option>
            </select>

            <p>Menu Item Image</p>
            <div class="mb-3">
              <input
                class="form-control"
                type="file"
                id="formFile"
                onChange={handleImageChange}
              />
            </div>

            {/* input end */}
            <button
              type="submit"
              className="btn btn-primary fw-bold mt-4 btn-lg"
              onClick={generateID}
            >
              Submit
            </button>
          </form>
        </div>
      </center>
    </>
  );
}
