import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import MainDish from "./MainDish/MainDish.jsx";
import SideDish from "./SideDish/SideDish.jsx";
import Dessert from "./Dessert/Dessert.jsx"; // Login page
import Drinks from "./Drinks/Drinks.jsx"; // Register page
import AddItem from "./AddItem/AddItem.jsx";  // Page to Add New Item
import "./App.css";

function AppContent() {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);  // Initialize as an empty array

  // Add item function
  const addItem = (item) => {
    setItems((prevItems) => [...prevItems, item]);
  };

  // Add to cart function (already in use)
  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (cartItem) => cartItem.id === item.id
      );
      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
                totalPrice: Number(cartItem.totalPrice) + Number(item.price),
              }
            : cartItem
        );
      } else {
        return [
          ...prevItems,
          { ...item, quantity: 1, totalPrice: Number(item.price) },
        ];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <div className="parentContainer">
      <nav className="navbar navbar-expand-lg navbar-light bg-custom">
        <div className="container-fluid">
          <h2 className="titleTxt">Restaurant Management System</h2>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/MainDish" className="nav-link">
                  Homepage
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/SideDish" className="nav-link">
                  Your Cart
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/AddItem" className="nav-link">
                  Add Item
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route
          path="/"
          element={<Dessert />}
        />
        <Route
          path="/Drinks"
          element={<Drinks />}
        />
        <Route
          path="/MainDish"
          element={<MainDish items={items} addToCart={addToCart} />}
        />
        <Route
          path="/SideDish"
          element={<SideDish itemInCart={cartItems} removeFromCart={removeFromCart} />}
          />
        <Route
          path="/AddItem"
          element={<AddItem addItem={addItem} />}
        />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
