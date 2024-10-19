import axios from "../Utils/Axios";
import React, { useEffect, useState } from "react";
import Cards from "./Partials/Cards";
import LocomotiveScroll from "locomotive-scroll";
import { errorHandler } from "../Utils/HandleError";
import { useLocation } from "react-router-dom";

const Home = () => {
  const location = useLocation();
  // console.log(location);

  const locomotiveScroll = new LocomotiveScroll();

  const [products, setproducts] = useState([]);

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
