import React, { useState } from "react";
import Template from "../InputTemplate.jsx";
import "./AddItem.css";

export default function AddItem({ addItem }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("MainDish");
  const [image, setImage] = useState("");
  const [itemID, setItemID] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (name && price && itemID) {
      const newItem = {
        id: itemID,
        name,
        price: parseFloat(price),
        category,
        image,
      };
      addItem(newItem);

      // Reset form fields
      setName("");
      setPrice("");
      setCategory("MainDish");
      setImage("");
      setItemID("");
    } else {
      alert("Please fill out all fields.");
    }
  };

  const generateID = () => {
    const id = Math.random().toString(36).substr(2, 9);
    setItemID(id);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
  };

  return (
    <div className="addItemParent">
      <h3 className="addItemTitle">Add a new Item!</h3>
      <hr className="line" />
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

        <p>Menu Item Image</p>
        <div className="mb-3">
          <input
            className="form-control"
            type="file"
            onChange={handleImageChange}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary fw-bold mt-4 btn-lg"
          onClick={generateID}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
