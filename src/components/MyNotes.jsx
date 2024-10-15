import React, { useContext, useEffect } from "react";
import { ColorContext } from "../Contexts/ColorContext";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

function MyNotes() {
  const { setSelectedNote, setCardnotes } = useContext(ColorContext);
  const { user } = useUser();
  const navigate = useNavigate();

  // Fetch notes using Convex's useQuery hook
  const data = useQuery(api.Notes.get);

  useEffect(() => {
    if (!user) {
      navigate("/sign-in");
    }
    if (data) {
      setCardnotes(data); // Set the Cardnotes state when data is fetched
    }
  }, [user, data, navigate, setCardnotes]);


  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">My Notes</h1>

      {data === undefined ? (
        <p>Loading notes...</p>
      ) : data.length === 0 ? (
        <p>No notes available.</p>
      ) : (
        <ul className="flex gap-3 flex-wrap justify-center">
          {data.map((card, index) => (
            <li
              key={card._id || index} // Use the correct `_id` field from your data
              onClick={() => {
                console.log(card._id, "Radha rani ji"); // Use console.log here correctly
                setSelectedNote({
                  _id: card._id, // Ensure to store the `_id` for updates
                  title: card.title,
                  note: card.note,
                  time: card.time, // Use the card's stored time
                  color: card.color,
                  textColor: card.textColor,
                });
                navigate("/editor");
              }}
              style={{
                backgroundColor: card.color,
                color: card.textColor,
              }}
              className={`border-b border-gray-200 cursor-pointer py-2 w-60 gap-4 border-2 flex flex-col px-4 h-60 rounded-lg`}
            >
              <h2 className="text-xl px-4 font-semibold">{card.title}</h2>
              <hr />
              <p className="px-4">{card.note}</p>
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
              time: new Date().toISOString(), // Use the current time in ISO format
            });
            navigate("/editor");
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default MyNotes;
