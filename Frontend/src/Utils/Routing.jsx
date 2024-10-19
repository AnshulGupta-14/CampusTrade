import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../Components/Home";
import Login from "../Components/Login";
import SignUp from "../Components/SignUp";
import ProductDetails from "../Components/ProductDetails";
import UserProfile from "../Components/UserProfile";
import AddProduct from "../Components/AddProduct";
import Otp from "../Components/Otp";
import UpdateProfile from "../Components/UpdateProfile";
import MyAds from "../Components/MyAds";
import Confirmation from "../Components/Partials/Confirmation";
import UpdateAvatar from "../Components/Partials/UpdateAvatar";
import UpdatePassword from "../Components/Partials/UpdatePassword";
import UpdateMobile from "../Components/Partials/UpdateMobile";

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/signup" element={<SignUp />}></Route>
      <Route path="/productdetails/:id" element={<ProductDetails />}></Route>
      <Route path="/profile/:id?" element={<UserProfile />}>
        <Route path="avatar" element={<UpdateAvatar />}></Route>
        <Route path="password" element={<UpdatePassword />}></Route>
      </Route>
      <Route path="/addproduct" element={<AddProduct />}></Route>
      <Route path="/otp" element={<Otp />}></Route>
      <Route path="/update-profile" element={<UpdateProfile />}>
        <Route path="mobile" element={<UpdateMobile />}></Route>
      </Route>
      <Route path="/my-ads" element={<MyAds />}>
        <Route path="confirmation" element={<Confirmation />}></Route>
      </Route>
    </Routes>
  );
};

export default Routing;
