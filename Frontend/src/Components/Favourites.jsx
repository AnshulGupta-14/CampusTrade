import React, { useEffect, useState } from "react";
import axios from "../Utils/Axios";
import { errorHandler } from "../Utils/HandleError";
import Cards from "./Partials/Cards";
import { NavLink } from "react-router-dom";

const Favourites = () => {
  const [Favourites, setFavourites] = useState([]);
  const getFavourites = () => {
    axios
      .get("users/favourite-products")
      .then((response) => {
        setFavourites(response.data.data);
      })
      .catch((error) => {
        errorHandler(error);
      });
  };
  useEffect(() => {
    getFavourites();
  }, []);

  return (
    <div className="pt-[6%]">
      {Favourites.length > 0 ? (
        <Cards data={Favourites} onUpdate={getFavourites}></Cards>
      ) : (
        <div className="h-[82.7vh] w-full flex flex-col items-center justify-center">
          <img src="./Empty.png" alt="" className="h-60 w-60"/>
          <h1 className="mt-7 text-xl font-black">Looks like you haven't found your favorites yet. </h1>
          <h1 className="mt-3 text-xl font-semibold">Browse through our listings to discover something special!</h1>
          <NavLink
              to={"/"}
              className={"mt-7 p-3 bg-[#002f34] text-white rounded-xl"}
            >
              Start Exploring
            </NavLink>
        </div>
      )}
    </div>
  );
};

export default Favourites;
