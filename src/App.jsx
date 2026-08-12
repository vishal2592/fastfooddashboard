import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Adminlayout from "./layout/Adminlayout";

import Dashboard from "./Pages/Dashboard";
import Products from "./Pages/Products";
import Orders from "./Pages/Orders";
import Customers from "./Pages/Customers";
import Offers from "./Pages/Offers";
import Reviews from "./Pages/Reviews";
import Banner from "./Pages/Banner";
import Reports from "./Pages/Reports";
import Categories from "./Pages/Categories";
import Subcategories from "./Pages/Subcategories";
import Payments from "./Pages/Payments";
import Delivery from "./Pages/Delivery";
import Profile from "./Pages/Profile";
import Setting from "./Pages/Setting";
import Login from "./Pages/Login";
import Register from "./Pages/Register";

import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <Routes>

      {/* Root */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Private Admin Routes */}
      <Route element={<PrivateRoute />}>

        <Route path="/admin" element={<Adminlayout />}>

          {/* Dashboard */}
          <Route index element={<Dashboard />} />

          {/* Categories */}
          <Route path="categories" element={<Categories />} />

          {/* Subcategories */}
          <Route path="subcategories" element={<Subcategories />} />

          {/* Products */}
          <Route path="products" element={<Products />} />

          {/* Orders */}
          <Route path="orders" element={<Orders />} />

          {/* Customers */}
          <Route path="customers" element={<Customers />} />

          {/* Offers */}
          <Route path="offers" element={<Offers />} />

          {/* Payments */}
          <Route path="payments" element={<Payments />} />

          {/* Delivery */}
          <Route path="delivery" element={<Delivery />} />

          {/* Reviews */}
          <Route path="reviews" element={<Reviews />} />

          {/* Banner */}
          <Route path="banner" element={<Banner />} />

          {/* Reports */}
          <Route path="reports" element={<Reports />} />

          {/* Profile */}
          <Route path="profile" element={<Profile />} />

          {/* Setting */}
          <Route path="setting" element={<Setting />} />

        </Route>

      </Route>

    </Routes>
  );
};

export default App;