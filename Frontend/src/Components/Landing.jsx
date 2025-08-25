import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { useMediaQuery } from "react-responsive";

const Landing = () => {
  const [isLoading, setIsLoading] = useState  (true);
  const isDesktop = useMediaQuery({ minWidth: 1224 });
  const navigate = useNavigate();
  const boxRef = useRef(null);
  const handleClick = async () => {
    await gsap.to(boxRef.current, {
      x: "-100%",
      duration: 2,
      opacity: 0,
    });
    navigate("/home");
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-[#c9d1d9]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-[#58a6ff] mx-auto"></div>
          <p className="mt-4 text-[#8b949e]">Loading CampusTrade...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isDesktop && (
        <div
          ref={boxRef}
          className="absolute z-50 w-full h-full flex flex-col items-center"
        >
          <div className="absolute top-[15%] text-center">
            <h1 className="text-3xl font-bold">Welcome to CampusTrade!</h1>
            <h1 className="mt-5">
              Your one-stop marketplace for secondhand classics and rare finds.
            </h1>
            <h1>
              Here, each book has a story, waiting to be rediscovered by you.
            </h1>
            <button
              className="mt-5 px-5 py-2 bg-[#002f34] text-white rounded-xl"
              onClick={handleClick}
            >
              Get Started
            </button>
          </div>
          <img src="/image.png" alt="" className="h-full w-full" />
        </div>
      )}

      {!isDesktop && (
        <div
          ref={boxRef}
          className="absolute z-50 w-full h-full flex flex-col items-center"
        >
          <div className="absolute top-[15%] mx-auto w-[70%] text-center">
            <h1 className="text-2xl font-semibold">Welcome to CampusTrade!</h1>
            <h1 className="mt-5">
              Your one-stop marketplace for secondhand classics and rare finds.
            </h1>
            <h1>Here, each book has a story,</h1>
            <h1>waiting to be rediscovered by you.</h1>
          </div>
          <img src="/image.png" alt="" className="h-full w-full" />
          <button
            className="absolute top-[80%] mt-5 px-5 py-2 bg-[#002f34] text-white rounded-xl"
            onClick={handleClick} 
          >
            Get Started
          </button>
        </div>
      )}
    </>
  );
};

export default Landing;
