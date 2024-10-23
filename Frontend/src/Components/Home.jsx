import axios from "../Utils/Axios";
import React, { useContext, useEffect, useState } from "react";
import Cards from "./Partials/Cards";
import LocomotiveScroll from "locomotive-scroll";
import { errorHandler } from "../Utils/HandleError";
import { useLocation } from "react-router-dom";
// import { ProductContext } from "../Context/Context";

const Home = () => {
  const location = useLocation();

  const locomotiveScroll = new LocomotiveScroll();

  const [products, setproducts] = useState([]);
  // const [products, setproducts] = useContext(ProductContext);

  useEffect(() => {
    const url = "/products/get-products";
    axios
      .get(url, { withCredentials: true })
      .then((res) => {
        // console.log(res);

        if (res.data) {
          setproducts(res.data.data);
        }
      })
      .catch((err) => {
        errorHandler(err);
      });
  }, [location]);

  return (
    products && (
      <div className="w-full h-full px-[1.7%] pt-[5%]">
        <Cards data={products}></Cards>
      </div>
    )
  );
};

export default Home;
