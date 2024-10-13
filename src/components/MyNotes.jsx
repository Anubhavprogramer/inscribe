import React, { useContext, useEffect, useCallback } from "react";
import { ColorContext } from "../Contexts/ColorContext";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

function MyNotes() {
  const { Cardnotes, setSelectedNote } = useContext(ColorContext);
  const { user } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate("/sign-in");
    }
  }, [user, navigate]);



  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">My Notes</h1>
      {Cardnotes.length === 0 ? (
        <p>No notes available.</p>
      ) : (
        <ul>
          {Cardnotes.map((card, index) => (
            <li
              onClick={() => {
                setSelectedNote({
                  title: card.title,
                  note: card.note,
                  time: Date.now(),
                });
                navigate("/editor");
              }}
              key={card.id || index}
              className="border-b border-gray-200 cursor-pointer py-2 w-fit gap-4 flex flex-col p-7 h-60 rounded-lg bg-blue-600"
            >
              <h2 className="text-xl font-semibold">{card.title}</h2>
              <p>{card.note}</p>
            </li>
          ))}
        </ul>
      )}
      <div className="absolute bottom-5 right-5">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        onClick={() => {
          setSelectedNote({
            title: "",
            note: "",
            color: "",
            textColor: "",
            time: Date.now(),
          });
          navigate("/editor");
        }} >+</button>
      </div>
    </div>
  );
}

export default MyNotes;
