import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socketRef } from "../features/socket.js";
import { syncSubtask, deleteSubtask } from "../features/subtaskSlice.js";
import { X, Trash2, Plus } from "lucide-react";
import SubtaskForm from "../forms/SubtaskForm.jsx";

function SubtaskDialog({ onClose }) {
  const dispatch = useDispatch();
  const selectedTaskId = useSelector((state) => state.taskReducer.selectedTask);
  const selectedTaskName = useSelector((state) => state.taskReducer.selectedTaskName);
  const subtasks = useSelector((state) => state.subtaskReducer.subtasks);
  const [showForm, setShowForm] = useState(false);

  
  
  useEffect(() => {
    if (selectedTaskId) {
      socketRef.emit("subtask:getAll", { taskid: selectedTaskId });

      socketRef.on("subtask:list", (subtaskList) => {
        dispatch(syncSubtask({ subtasks: subtaskList }));
      });
    }

    return () => {
      socketRef.off("subtask:list");
    };
  }, [selectedTaskId, dispatch]);

  const handleDeleteSubtask = (subtaskid) => {
    console.log(subtaskid);
    socketRef.emit("subtask:delete", { subtaskid });
    socketRef.on("subtask:deleted", (subtaskid) => {
      dispatch(deleteSubtask(subtaskid));
    });
  };

  const handleAddClick = () =>{
    setShowForm(true);
  }

  console.log(setShowForm)

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
    >
      <div className="bg-white w-1/2 p-6 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto relative">
        {/* Top-right close button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* Heading with + button */}
        <div className="flex items-center justify-between mb-4 pr-8">
          <h2 className="text-2xl font-bold">{selectedTaskName} - Subtasks</h2>
          <button className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100 transition" onClick={()=>{handleAddClick()}}>
            <Plus size={20} />
          </button>
        </div>

        {/* Subtask list */}
        {subtasks.length === 0 ? (
          <p className="text-sm text-gray-500">No subtasks available.</p>
        ) : (
          <div className="space-y-4">
            {
            subtasks.map((subtask) => ( 
              <div
                key={subtask.subtaskid}
                className="flex justify-between items-center bg-gray-100 px-4 py-3 rounded-lg shadow border"
              >
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    {subtask.name}
                    
                    {/* +{subtask.subtaskid} */}
                  </h3>
                </div>
                <button
                  onClick={() => handleDeleteSubtask(subtask.subtaskid)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {showForm && <SubtaskForm onClose = {() => {setShowForm(false)}}/>}
    </div>
  );
}

export default SubtaskDialog;
