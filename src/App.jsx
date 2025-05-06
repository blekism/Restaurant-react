import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import MainDish from "./MainDish/MainDish.jsx";
import SideDish from "./SideDish/SideDish.jsx";
import Dessert from "./Dessert/Dessert.jsx"; // Login page
import Drinks from "./Drinks/Drinks.jsx"; // Register page
import AddItem from "./AddItem/AddItem.jsx";  // Page to Add New Item
import ProtectedRoute from "./ProtectedRoute.jsx"; // Import the protected route component
import "./App.css";
import SellerApply from "./SellerApply/SellerApplyPage.jsx";
import StockPage from "./stockpage/readstock.jsx";

function AppContent() {
  // ... existing state and functions (items, cartItems, addItem, addToCart, removeFromCart) ...

  // --- Determine if Navbar links should be shown based on login status/role ---
  // You might want to hide Add Item link if user doesn't have the role
  const userRole = localStorage.getItem('user_role');
  const isLoggedIn = !!localStorage.getItem('user_id'); // Check if user_id exists

  return (
    <div className="parentContainer">
      <nav className="navbar navbar-expand-lg navbar-light bg-custom">
        <div className="container-fluid">
          <h2 className="titleTxt">Ecommerce System</h2>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {/* Conditionally show links based on login status */}
              {isLoggedIn && (
                <>
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
                  {/* Conditionally show Add Item link based on role */}
                  {userRole === 'seller' && ( // Assuming 'admin' is the required role
                    <li className="nav-item">
                      <Link to="/AddItem" className="nav-link">
                        Add Item
                      </Link>
                    </li>
                  )}
                  {userRole === 'seller' && ( // Assuming 'admin' is the required role
                    <li className="nav-item">
                      <Link to="/stockpage" className="nav-link">
                        Stock
                      </Link>
                    </li>
                  )}
                  {userRole === 'buyer' && ( // Assuming 'admin' is the required role
                    <li className="nav-item">
                      <Link to="/Apply" className="nav-link">
                        Apply as Seller
                      </Link>
                    </li>
                  )}
                  {/* Add a Logout button here */}
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Dessert />} /> {/* Login */}
        <Route path="/Drinks" element={<Drinks />} /> {/* Register */}

        {/* Routes requiring login (can be further protected if needed) */}
        {/* Consider wrapping these in another ProtectedRoute checking just for login status */}
        <Route
          path="/MainDish"
          // Pass necessary props - remove 'items' if MainDish fetches its own
          element={<MainDish />}
        />
        <Route
          path="/SideDish"
          // Pass necessary props - remove 'itemInCart' if SideDish fetches its own
          element={<SideDish  />}
        />

        {/* Protected Route for AddItem */}
        <Route element={<ProtectedRoute requiredRole="seller" redirectPath="/MainDish" />}>
          {/* The element to render if the role check passes */}
          <Route
            path="/AddItem"
            element={<AddItem />} // Pass the addItem prop
          />
          <Route
            path="/stockpage"
            element={<StockPage />} // Pass the addItem prop
          />
        </Route>
        <Route element={<ProtectedRoute requiredRole="buyer" redirectPath="/MainDish" />}>
          {/* The element to render if the role check passes */}
          <Route
            path="/Apply"
            element={<SellerApply />} // Pass the addItem prop
          />
        </Route>

        {/* Optional: Add a catch-all route or a specific "Not Found" page */}
        {/* <Route path="*" element={<NotFound />} /> */}
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