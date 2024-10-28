import React, { useEffect, useState } from "react";
import Routing from "./Utils/Routing";
import Nav from "./Components/Nav";
import axios from "./Utils/Axios";
import 'remixicon/fonts/remixicon.css'

const App = () => {
  const [products, setproducts] = useState([]);

  useEffect(() => {
    const url = "/products/get-products";
    axios
      .get(url)
      .then((res) => {
        // console.log(res);

        if (res.data) {
          setproducts(res.data.data);
        }
      })
      .catch((err) => {
        alert("Server Err.");
      });
  }, []);

  return (
    <div className="w-full min-h-[100vh] bg-zinc-200">
      <Nav data={products}></Nav>
      <Routing></Routing>
    </div>
  );
};

export default App;
