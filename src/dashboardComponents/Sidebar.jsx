import React, { useState, useEffect } from "react";
import { socketRef } from "../features/socket.js";
import {
  LayoutDashboard,
  MessageSquare,
  ListTodo,
  Users,
  Settings,
  Trash2,
  ChevronRight,
  Plus,
  Lightbulb,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteEvent,
  setSelectedEvent,
  setSelectedEventName,
} from "../features/eventSlice.js";
import EventForm from "../forms/EventForm.jsx";

function Sidebar({ events = [], userid }) {
  const selectedEventId = useSelector(
    (state) => state.eventReducer.selectedEventId
  );
  const dispatch = useDispatch();
  const [showEventForm, setShowEventForm] = useState(false);

  const handleEventClick = (eventId, eventname) => {
    dispatch(setSelectedEvent(eventId));
    dispatch(setSelectedEventName(eventname));
  };

  useEffect(() => {
    if (selectedEventId) {
      console.log("Selected Event ID:", selectedEventId);
    }
  }, [selectedEventId]);

  const handleEventDelete = (eventid) => {
    socketRef.emit("event:delete", { eventid: eventid });
    const handleDelete = (eventid) => {
      dispatch(deleteEvent(eventid));
    };
    socketRef.on("event:deleted", handleDelete);
    console.log("Delete task with id:", eventid);
  };

  const handleAddClick = () => {
    setShowEventForm(true);
  };

  return (
    <>
      <div className="w-64 bg-white border-r border-r-gray-100 flex flex-col justify-between overflow-y-auto no-scrollbar shadow-sm h-screen">
        <div className="p-6">
          <h1 className="text-2xl font-extrabold text-purple-600 mb-10 flex items-center">
            Project<span className="text-gray-800">M.</span>
          </h1>

          <nav className="space-y-2 text-gray-700 text-sm mb-10">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 cursor-pointer transition-all">
              <LayoutDashboard className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Home</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 cursor-pointer transition-all">
              <MessageSquare className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Messages</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 cursor-pointer transition-all border-r-4 border-r-purple-600">
              <ListTodo className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-purple-600">Tasks</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 cursor-pointer transition-all">
              <Users className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Members</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 cursor-pointer transition-all">
              <Settings className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Settings</span>
            </div>
          </nav>

          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6"></div>

          <div className="flex justify-between items-center mb-4">
            <div className="text-xs font-bold text-gray-500 tracking-wider">
              MY PROJECTS
            </div>
            <button
              className="h-6 w-6 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-all"
              onClick={() => handleAddClick()}
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="space-y-3 text-sm max-h-56 overflow-y-auto pr-1 custom-scrollbar no-scrollbar">
            {events.map((event, index) => {
              const isSelected = event.eventid === selectedEventId;
              return (
                <div
                  key={event._id || index}
                  className={`flex items-center justify-between ${
                    isSelected ? "bg-purple-100" : "bg-gray-50"
                  } px-3 py-3 rounded-lg hover:bg-purple-50 group transition-all`}
                >
                  <div
                    className="flex items-center gap-2 text-gray-800 font-medium cursor-pointer flex-1"
                    onClick={() =>
                      handleEventClick(event.eventid, event.eventname)
                    }
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isSelected ? "bg-purple-500" : "bg-green-500"
                      }`}
                    ></span>
                    <span
                      className={`truncate ${
                        isSelected ? "text-purple-700" : ""
                      }`}
                    >
                      {event.eventname}
                    </span>
                  </div>
                  <div className="flex gap-2 items-center text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="hover:text-red-500 p-1 rounded-full hover:bg-white"
                      onClick={() => handleEventDelete(event.eventid)}
                    >
                      <Trash2 size={14} />
                    </button>
                    <button
                      className="hover:text-purple-700 p-1 rounded-full hover:bg-white"
                      onClick={() =>
                        handleEventClick(event.eventid, event.eventname)
                      }
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-5 bg-gradient-to-br from-yellow-50 to-orange-50 m-4 rounded-xl text-center text-sm text-gray-700 border border-yellow-100 shadow-sm">
          <div className="inline-flex items-center justify-center h-10 w-10 bg-yellow-100 rounded-full mb-3">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
          </div>
          <p className="font-semibold text-gray-800">Thoughts Time</p>
          <p className="text-xs mt-2 mb-3 text-gray-600 leading-relaxed">
            We don't have any notice for you, till then you can share your
            thoughts with your peers.
          </p>
          <button className="text-white bg-purple-600 px-4 py-2 rounded-lg text-xs font-medium hover:bg-purple-700 shadow-sm hover:shadow transition-all">
            Write a message
          </button>
        </div>
      </div>
      {showEventForm && (
        <EventForm
          onClose={() => {
            setShowEventForm(false);
          }}
          userid={userid}
        />
      )}
    </>
  );
}

export default Sidebar;
