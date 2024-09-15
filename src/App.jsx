import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./Home/Home.jsx";
import MainDish from "./MainDish/MainDish.jsx";
import SideDish from "./SideDish/SideDish.jsx";
import Dessert from "./Dessert/Dessert.jsx";
import Drinks from "./Drinks/Drinks.jsx";
import AddItem from "./AddItem/AddItem.jsx";
import "./App.css";

export default function App() {
  return (
    <div className="parentContainer">
      <Router>
        <nav class="navbar navbar-expand-lg navbar-light bg-custom">
          <div class="container-fluid">
            <h2 className="titleTxt">Shopee To pre</h2>
            <div class="collapse navbar-collapse" id="navbarNav">
              <ul class="navbar-nav ms-auto">
                <li class="nav-item">
                  <Link to="/" class="nav-link">
                    Home
                  </Link>
                </li>
                <li class="nav-item">
                  <Link to="/Dessert" class="nav-link">
                    Dessert
                  </Link>
                </li>
                <li class="nav-item">
                  <Link to="/Drinks" class="nav-link">
                    Drinks
                  </Link>
                </li>
                <li class="nav-item">
                  <Link to="/MainDish" class="nav-link">
                    Main Dish
                  </Link>
                </li>
                <li class="nav-item">
                  <Link to="/SideDish" class="nav-link">
                    Side Dish
                  </Link>
                </li>
                <li class="nav-item">
                  <Link to="/AddItem" class="nav-link">
                    Add Item
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Dessert" element={<Dessert />} />
          <Route path="/Drinks" element={<Drinks />} />
          <Route path="/MainDish" element={<MainDish />} />
          <Route path="/SideDish" element={<SideDish />} />
          <Route path="/AddItem" element={<AddItem />} />
        </Routes>
      </Router>
    </div>
  );
}
