import React, { useState } from "react";
import { X } from "lucide-react";
import Errorpopup from "../components/Errorpopup";
import { socketRef } from "../features/socket";
import { useDispatch, useSelector } from "react-redux";
import { addTask } from "../features/taskSlice";

function TaskForm({ onClose, status }) {
  const [taskname, setTaskname] = useState("");
  const [description, setDescription] = useState("");
  const [duedate, setDuedate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const eventid = useSelector((state) => state.eventReducer.selectedEvent);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskname.trim() || !description.trim() || !duedate) {
      setError("All fields are required.");
      return;
    }

    const formattedDueDate = new Date(duedate).toISOString();

    socketRef.emit("task:create", {
      taskname: taskname,
      description: description,
      priority: priority,
      duedate: formattedDueDate,
      status: status,
      eventid: eventid,
    });

    onClose();
  };

  return (
    <>
      {error && <Errorpopup message={error} onClose={() => setError("")} />}
      <div
        className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md"
        style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
      >
        <div className="bg-white p-8 rounded-xl shadow-xl w-1/3 relative border border-gray-100">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
            onClick={onClose}
          >
            <X size={20} />
          </button>
          <h2 className="text-xl font-bold mb-6 text-gray-800">Create Task</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Task Name
              </label>
              <input
                type="text"
                placeholder="Enter task name"
                value={taskname}
                onChange={(e) => setTaskname(e.target.value)}
                className="w-full border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                placeholder="Enter task description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                rows={3}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Due Date
              </label>
              <input
                type="date"
                value={duedate}
                onChange={(e) => setDuedate(e.target.value)}
                className="w-full border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-purple-600 text-white font-medium px-4 py-3 rounded-lg hover:bg-purple-700 transition-all shadow-sm"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default TaskForm;
