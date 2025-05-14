import React, { useState } from "react";
import { X } from "lucide-react";
import Errorpopup from "../components/Errorpopup"; // Adjust path as needed
import { socketRef } from "../features/socket";
import { useDispatch } from "react-redux";
import { addEvent } from "../features/eventSlice";

function EventForm({ onClose , userid}) {
  const [eventname, setEventname] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!eventname.trim()) {
      setError("Event name is required.");
      return;
    }

    socketRef.emit("event:create",{eventname:eventname , userid: userid})
    // socketRef.on("event:created",(event) =>{
    //     dispatch(addEvent({ eventid: event.eventid,eventname:event.eventname , userid:userid}));
    // })
    

    console.log("Event Name:", eventname);
    onClose();
    // return () => {
    //   socketRef.off("event:created", handleSubmit);
    // };
  };

  return (
    <>
      {error && <Errorpopup message={error} onClose={() => setError("")} />}
      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md" style={{ backgroundColor: "rgba(255,255,255,0.3)" }}>
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 relative">
          <button className="absolute top-4 right-4 text-gray-500 hover:text-red-500" onClick={onClose}>
            <X size={20} />
          </button>
          <h2 className="text-xl font-semibold mb-4">Create Event</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Event Name"
              value={eventname}
              onChange={(e) => setEventname(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Create Event
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default EventForm;
