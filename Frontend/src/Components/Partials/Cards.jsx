import React from "react";
import Card from "./Card";

const Cards = ({ data, close, onUpdate }) => {
  return (
    <div className="w-[97%] mx-auto flex flex-wrap items-center gap-5 pt-10">
      {data.map((item, index) => (
        <Card key={index} data={item} close={close} onUpdate={onUpdate}></Card>
      ))}
    </div>
  );
};

export default Cards;
