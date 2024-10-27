import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";

const Landing = () => {
  const navigate = useNavigate();
  const boxRef = useRef(null);
  const handleClick = async () => {
    await gsap.to(boxRef.current, {
      x: -1200,
      duration: 2,
      opacity: 0,
    });
    navigate("/home");
  };

  return (
    <div
      ref={boxRef}
      className="absolute z-50 w-screen h-screen flex flex-col items-center"
    >
      <div className="absolute top-[15%] text-center">
        <h1 className="text-3xl font-bold">Welcome to CampusTrade!</h1>
        <h1 className="mt-5">
          Your one-stop marketplace for secondhand classics and rare finds.
        </h1>
        <h1>Here, each book has a story, waiting to be rediscovered by you.</h1>
        <button
          className="mt-5 px-5 py-2 bg-[#002f34] text-white rounded-xl"
          onClick={handleClick}
        >
          Get Started
        </button>
      </div>
      <img src="/image.png" alt="" className="h-full w-full" />
    </div>
  );
};

export default Landing;
