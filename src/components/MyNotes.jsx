import { useContext, useEffect, useState } from "react";
import { ColorContext } from "../Contexts/ColorContext";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { MdAdd } from "react-icons/md";
import { RiDeleteBin3Fill } from "react-icons/ri";
import { useMutation } from "convex/react";
import { TitleDialog } from "./TitleDialog";
import { FiSearch } from "react-icons/fi";
import Loading from "./Loading";

function formatDate(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MyNotes() {
  const { setSelectedNote, setCardnotes } = useContext(ColorContext);
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const emailAddress = user?.emailAddresses?.[0]?.emailAddress || "";
  const data = useQuery(api.Notes.getAllByEmail, { email: emailAddress });

  useEffect(() => {
    if (isLoaded && !user) {
      navigate("/sign-in");
    }
    if (data) {
      setCardnotes(data);
    }
  }, [user, isLoaded, data, navigate, setCardnotes]);

  const randomMessage = () => {
    const messages = [
      "Happy Journaling!",
      "This note is empty",
      "Start writing something...",
      "Nothing to see here",
      "Try adding some content",
      "Keep Creating!",
      "Stay Inspired!",
      "Dream Big!",
      "Keep Exploring!",
      "Stay Curious!",
      "Happy Coding!",
      "Keep Smiling!",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const deleteNote = useMutation(api.Notes.deleteNote);

  const handleDeleteNote = async () => {
    if (!noteToDelete) return;
    setDeletingId(noteToDelete._id);
    try {
      await deleteNote({ _id: noteToDelete._id });
      setShowConfirm(false);
      setNoteToDelete(null);
    } catch (error) {
      setError("Failed to delete note");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter notes by search
  const filteredData = Array.isArray(data)
    ? data.filter(
        (card) =>
          (card.title || "Untitled")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (card.note || "").toLowerCase().includes(search.toLowerCase())
      )
    : [];

  // Loading skeleton
  if (!isLoaded || data === undefined) {
    return (
      <Loading 
        text="Loading your notes..." 
        size="lg" 
        fullScreen={true}
      />
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-8 min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-800 dark:to-gray-900">
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 px-6 py-4 rounded mb-4 max-w-lg w-full">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 float-right font-bold"
          >
            ×
          </button>
        </div>
        <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">My Notes</h1>
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className="p-8 min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-800 dark:to-gray-900">
        <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">My Notes</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          You have no notes yet. Click the + button to create your first note!
        </p>
        <button
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg text-2xl flex items-center gap-2"
          onClick={() => setIsDialogOpen(true)}
        >
          <MdAdd size={32} /> New Note
        </button>
        <TitleDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-800 dark:to-gray-900 relative flex flex-col items-center"
      style={{ minHeight: "100vh", width: "100vw" }}
    >
      {/* <h1 className="text-3xl font-bold mb-4 text-center w-full mt-6">My Notes</h1> */}
      <div className="flex justify-center m-4 w-full px-2 sm:px-0">
        <div className="relative w-full max-w-lg">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="w-full py-3 pl-12 pr-4 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-purple-400 text-lg bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 text-xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full px-4 sm:px-6 md:px-8 py-8">
        {filteredData.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 text-lg">
            No notes found.
          </div>
        ) : (
          filteredData.map((card) => (
            <div
              key={card._id}
              onClick={() => {
                navigate(`/editor/${card._id}`);
              }}
              className="relative rounded-3xl p-6 min-h-[16rem] cursor-pointer hover:shadow-xl transition-shadow duration-200 flex flex-col group bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600"
            >
              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirm(true);
                  setNoteToDelete(card);
                }}
                className="absolute top-4 right-4 bg-black dark:bg-gray-700 hover:bg-zinc-700 dark:hover:bg-gray-600 w-8 h-8 rounded-full transition-all shadow-md flex items-center justify-center"
                title="Delete note"
                disabled={deletingId === card._id}
              >
                <RiDeleteBin3Fill className="text-red-500 dark:text-red-400 text-sm" />
              </button>

              <h2 className="text-2xl font-bold mb-2 truncate">
                {card.title || "Untitled"}
              </h2>
              <hr className="border-t border-gray-500/30 dark:border-gray-400/30 my-1" />
              <p className="flex-1 whitespace-pre-wrap break-words text-base mt-2 max-h-48 overflow-y-auto">
                {randomMessage()}
              </p>
              <div className="text-sm text-gray-800/80 dark:text-gray-300/80 mt-auto pt-2">
                <span>{formatDate(card.time)}</span>
                {deletingId === card._id && (
                  <span className="text-red-500 ml-2 animate-pulse">
                    Deleting...
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Add Button */}
      <button
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-full shadow-lg text-3xl flex items-center gap-2 z-50"
        onClick={() => setIsDialogOpen(true)}
        title="Add new note"
        style={{ minWidth: "64px", minHeight: "64px" }}
      >
        <MdAdd size={36} />
      </button>
      <TitleDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      {/* Delete Confirmation Modal */}
      {showConfirm && noteToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 dark:bg-black dark:bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-sm w-full flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">
              Delete Note?
            </h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300 text-center">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {noteToDelete.title || "Untitled"}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setNoteToDelete(null);
                }}
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteNote}
                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white font-semibold"
                disabled={deletingId === noteToDelete._id}
              >
                {deletingId === noteToDelete._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyNotes;
