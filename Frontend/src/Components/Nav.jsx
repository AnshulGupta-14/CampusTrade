import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { BiSolidUser } from "react-icons/bi";
import { IoCloseSharp, IoSearchOutline } from "react-icons/io5";
import Cookies from "js-cookie";
import axios from "../Utils/Axios";
import { jwtDecode } from "jwt-decode";
import { errorHandler } from "../Utils/HandleError";

const Nav = ({ data }) => {
  const accessToken = Cookies.get("accessToken");
  console.log(accessToken);
  
  const [showOver, setshowOver] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    axios
      .post(
        "/users/logout",
        {},
        {
          withCredentials: true,
        }
      )
      .then(() => {
        alert("You have been logged out");
        navigate("/");
      })
      .catch((error) => {
        errorHandler(error);
      });
    setshowOver(false);
    navigate("/");
  };

  const [search, setsearch] = useState("");

  const products = data.filter((product) => {
    return product.title.toLowerCase().includes(search.toLowerCase());
    // product.author.toLowerCase().includes(search.toLowerCase())
  });

  return (
    <div className="fixed left-0 top-0 w-full z-50">
      <div className="w-full h-[10vh] p-2 bg-zinc-300 px-10 flex items-center">
        <div className="relative p-1 h-full w-[50%] mx-auto flex justify-between">
          <button className="p-3 mr-2 flex items-center bg-[#003034] text-white text-2xl rounded-lg">
            <IoSearchOutline />
          </button>
          <input
            type="text"
            placeholder="Find Books"
            className="p-2 border-[2px] border-black w-[91%] h-full rounded-lg"
            value={search}
            onChange={(e) => setsearch(e.target.value)}
          />
          {search.length > 0 && (
            <button
              onClick={() => setsearch("")}
              className="p-3 ml-2 flex items-center hover:bg-red-500 text-2xl rounded-lg"
            >
              <IoCloseSharp />
            </button>
          )}
          <div className="absolute w-[80%] max-h-[50vh] bg-zinc-200 text-black text-xl top-[100%] left-[5%] overflow-auto">
            {products && products.length > 0 && search
              ? products.map((s, i) => {
                  return (
                    <Link
                      to={`/${s.media_type}/details/${s.id}`}
                      key={i}
                      className="p-5 w-full bg-zinc-300 p-8 hover:bg-zinc-400 hover:font-semibold border-b-2 border-white duration-300 flex items-center justify-start"
                    >
                      <img
                        className="w-[5vw] h-[10vh] object-cover object-center rounded-full mr-10 shadow-xl bg-black"
                        src=""
                        alt=""
                      />
                      <div>
                        <h1>{s.title}</h1>
                        <h3 className="text-sm">By {s.author}</h3>
                        <h3 className="text-sm">Price</h3>
                      </div>
                    </Link>
                  );
                })
              : search && (
                  <h1 className="p-5 w-full bg-zinc-300 p-8 hover:bg-zinc-400 hover:font-semibold border-b-2 border-white duration-300 flex items-center justify-start">
                    No Book is available with this name
                  </h1>
                )}
          </div>
        </div>
        {!accessToken ? (
          <div className="w-[10%]">
            <NavLink
              className={
                "p-2 px-7 bg-[#fcd12d] rounded-xl text-lg font-semibold"
              }
              to={"/login"}
            >
              Login
            </NavLink>
          </div>
        ) : (
          <div
            className="w-[15%] flex items-center justify-center relative"
            onMouseLeave={() => {
              setshowOver(false);
            }}
            onClick={() => {
              setshowOver(!showOver);
            }}
          >
            <div
              onMouseEnter={() => {
                setshowOver(true);
              }}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#002f34",
                width: "40px",
                height: "40px",
                color: "#fff",
                fontSize: "14px",
                borderRadius: "50%",
              }}
            >
              {" "}
              <BiSolidUser className="text-2xl"></BiSolidUser>{" "}
            </div>

            {showOver && (
              <div className="absolute top-10 bg-white p-3">
                {Cookies.get("accessToken") && (
                  <div className="p-2 flex flex-col gap-2">
                    <Link
                      className="p-2 rounded-lg bg-blue-500"
                      to={`/profile/${jwtDecode(accessToken)._id}`}
                    >
                      MY PROFILE{" "}
                    </Link>
                    <Link
                      className="p-2 rounded-lg bg-blue-500"
                      to="/addproduct"
                    >
                      ADD PRODUCT{" "}
                    </Link>
                    <Link
                      className="p-2 rounded-lg bg-blue-500"
                      to="/liked-products"
                    >
                      FAVOURITES{" "}
                    </Link>
                    <Link
                      className="p-2 rounded-lg bg-blue-500"
                      to="/my-ads"
                    >
                      MY ADS{" "}
                    </Link>
                    <Link
                      className="p-2 rounded-lg bg-blue-500"
                      onClick={handleLogout}
                    >
                      LOGOUT
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="w-full bg-white p-1"></div>
    </div>
  );
};

export default Nav;
