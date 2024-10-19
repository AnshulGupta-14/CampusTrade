import axios from "../Utils/Axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { errorHandler } from "../Utils/HandleError";

const AddProduct = () => {
  const navigate = useNavigate();
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [price, setprice] = useState("");
  const [category, setcategory] = useState("select");
  const [image, setimage] = useState([]);

  const handleApi = () => {
    const formData = new FormData();
    // console.log(image);

    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    image.forEach((img) => {
      formData.append("image", img);
    });
    // console.log(formData.get("image"));

    const url = "/products/add-products";
    axios
      .post(url, formData, { withCredentials: true })
      .then((res) => {
        if (res.data.message) {
          alert(res.data.message);
          navigate("/");
        }
      })
      .catch((err) => {
        errorHandler(err);
      });
  };

  return (
    <div className="w-1/2 mx-auto pt-[7%] h-full pb-5">
      <h1 className="text-xl font-bold">Product Details</h1>
      <h1 className="mt-5">Add Title</h1>
      <input
        type="text"
        value={title}
        placeholder="Title"
        required
        className="w-full border border-black text-xl p-2 rounded-md"
        onChange={(e) => {
          settitle(e.target.value);
        }}
      />
      <h1 className="mt-5">Description</h1>
      <textarea
        className="w-full border border-black p-2 rounded-md"
        value={description}
        rows="3"
        cols="50"
        onChange={(e) => {
          setdescription(e.target.value);
        }}
      />
      <h1 className="mt-5">Price</h1>
      <input
        type="number"
        value={price}
        className="border border-black text-l p-2 rounded-md w-full"
        onChange={(e) => {
          setprice(e.target.value);
        }}
      />

      <h1 className="mt-5">Images</h1>
      <input
        type="file"
        className="form-control border border-black p-2 rounded-md w-full"
        onChange={(e) => {
          const selectedFiles = Array.from(e.target.files); // Convert FileList to array
          setimage((prev) => [...prev, ...selectedFiles]); // Append the new files to the existing state
        }}
        multiple
        accept="image/*"
      />

      {image.length > 0 ? (
        <div className="flex items-center gap-1 flex-wrap py-5">
          {image.map((file, index) => (
            <div key={index}>
              <img
                src={URL.createObjectURL(file)}
                alt={file.title}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                }}
              />
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex items-center mt-7 gap-5">
        <h1>Category: </h1>
        <select
          title=""
          id=""
          value={category}
          onChange={(e) => {
            setcategory(e.target.value);
          }}
          className="border border-black"
        >
          <option>Select</option>
          <option>Fiction</option>
          <option>Non-Fiction</option>
        </select>
      </div>
      <input
        type="submit"
        value="Add Product"
        onClick={handleApi}
        className="ml-[40%] test-center mt-7 rounded-full px-7 py-2 bg-[#fcd12d]"
      />
    </div>
  );
};

export default AddProduct;
