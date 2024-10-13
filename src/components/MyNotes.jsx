import React, { useContext, useEffect, useCallback } from "react";
import { ColorContext } from "../Contexts/ColorContext";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
// import { getNotes } from "../utils/FetchNotes";
// import mydata from "../data/mydata.json";


function MyNotes() {
  const { Cardnotes, setSelectedNote, setCardnotes } = useContext(ColorContext);
  const { user } = useUser();
  const navigate = useNavigate();
  
  const fetchnotes = async () =>{
    // setCardnotes(mydata)
    // const data = getNotes()
    // setCardnotes(data)
  }

  useEffect(() => {
    if (!user) {
      navigate("/sign-in");
    }
    fetchnotes();
  }, [user, navigate]);



  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">My Notes</h1>
      {Cardnotes.length === 0 ? (
        <p>No notes available.</p>
      ) : (
        <ul className="flex gap-3 flex-wrap justify-center">
          {Cardnotes.map((card, index) => (
            <li
              onClick={() => {
                setSelectedNote({
                  title: card.title,
                  note: card.note,
                  time: Date.now(),
                  color: card.color,
                  textColor: card.textColor,
                });
                navigate("/editor");
              }}
              key={card.id || index}
              style={{
                backgroundColor: card.color,
                color: card.textColor,
              }}
              className={`border-b border-gray-200 cursor-pointer py-2 w-60 gap-4 border-2 flex flex-col px-4 h-60 rounded-lg `}
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
            time: Date.now(),
          });
          navigate("/editor");
        }} >+</button>
      </div>
    </div>
  );
}

export default MyNotes;
