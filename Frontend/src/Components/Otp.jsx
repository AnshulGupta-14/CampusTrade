import axios from "axios";
import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { errorHandler } from "../Utils/HandleError";

const Otp = () => {
  const navigate = useNavigate();

  const [otp, setotp] = useState("");

  const submithandler = () => {
    const data = { otp };
    const url = "http://localhost:8000/api/v1/users/verify-otp";

    axios
      .post(url, data, { withCredentials: true })
      .then((res) => {
        if (res.data.message) {
          alert("Now you can log in");
          navigate("/login");
        }
      })
      .catch((err) => {
        errorHandler(err);
      });
  };

  return (
    <div className="w-full h-screen pt-[6%] flex items-center justify-center">
      <div className="w-[30%] flex flex-col px-10 py-5 bg-white rounded-xl">
        <h1 className="text-2xl font-bold mb-3">Verification</h1>
        <h1 className="mt-5">OTP</h1>
        <input
          className="border border-black p-2 py-1 text-md rounded-md"
          type="text"
          value={otp}
          onChange={(e) => {
            setotp(e.target.value);
          }}
        />
        <input
          className="rounded-full mt-7 mx-auto w-1/3 px-5 py-2 bg-[#fcd12d]"
          type="submit"
          value={"Verify"}
          onClick={submithandler}
        />
      </div>
    </div>
  );
};

export default Otp;
