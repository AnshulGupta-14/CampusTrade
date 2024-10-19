import React from "react";
import { NavLink } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { errorHandler } from "../../Utils/HandleError";

const Card = ({ data, close = false, onUpdate }) => {
  // console.log(close);
  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const removeProduct = prompt(
      "Write 'Yes' if you want to remove this product"
    );
    console.log(removeProduct);

    if (removeProduct !== "Yes") {
      alert("Product did not remove as you did not give correct input");
      return;
    }
    axios
      .post(
        `http://localhost:8000/api/v1/products/upload-ad/${data._id}`,
        {},
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res);
        alert("Product removed successfully");
        onUpdate();
      })
      .catch((err) => {
        errorHandler(err);
      });
  };

  return (
    <NavLink
      to={`/productdetails/${data._id}`}
      className="w-[22vw] h-[40vh] data={data} relative"
    >
      {close && (
        <div className="relative group">
          <div className="absolute right-0 text-xl bg-red-500 rounded-full p-1 text-white">
            <IoMdClose onClick={handleClick} />
          </div>
          <h1 className="hidden absolute -right-7 -top-7 group-hover:block bg-red-400 text-xs rounded-xl p-1 text-white">
            Remove Element
          </h1>
        </div>
      )}
      <div className="w-full h-[70%]">
        <img src={data.image[0]} alt="" className="w-full h-full" />
      </div>
      <div className="w-full h-[30%] bg-zinc-300 flex flex-col justify-center items-start px-5">
        <h1 className="text-xl font-bold">&#8377;{data.price}</h1>
        <p className="text-gray-600">{data.title}</p>
      </div>
    </NavLink>
  );
};

export default Card;
