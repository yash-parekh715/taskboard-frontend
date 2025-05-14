import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socketRef } from "../features/socket.js";
import { syncSubtask, deleteSubtask } from "../features/subtaskSlice.js";
import { X, Trash2, Plus, CheckCircle2 } from "lucide-react";
import SubtaskForm from "../forms/SubtaskForm.jsx";

function SubtaskDialog({ onClose }) {
  const dispatch = useDispatch();
  const selectedTaskId = useSelector((state) => state.taskReducer.selectedTask);
  const selectedTaskName = useSelector(
    (state) => state.taskReducer.selectedTaskName
  );
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
    socketRef.emit("subtask:delete", { subtaskid });
    socketRef.on("subtask:deleted", (subtaskid) => {
      dispatch(deleteSubtask(subtaskid));
    });
  };

  const handleAddClick = () => {
    setShowForm(true);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md"
      style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
    >
      <div className="bg-white w-1/2 p-8 rounded-xl shadow-xl max-h-[80vh] overflow-y-auto relative border border-gray-100">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <div className="flex items-center justify-between mb-6 pr-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedTaskName}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage subtasks for this item
            </p>
          </div>
          <button
            className="bg-purple-100 text-purple-600 p-2 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-2"
            onClick={handleAddClick}
          >
            <Plus size={18} />
            <span className="font-medium">Add Subtask</span>
          </button>
        </div>

        {subtasks.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 bg-gray-100 rounded-full mb-4">
              <CheckCircle2 size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">No subtasks available</p>
            <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
              Break down this task into smaller, manageable subtasks to track
              progress more effectively.
            </p>
            <button
              onClick={handleAddClick}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Create First Subtask
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {subtasks.map((subtask) => (
              <div
                key={subtask.subtaskid}
                className="flex justify-between items-center bg-gray-50 px-5 py-4 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-gray-400" />
                  <h3 className="font-medium text-gray-800">{subtask.name}</h3>
                </div>
                <button
                  onClick={() => handleDeleteSubtask(subtask.subtaskid)}
                  className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {showForm && (
        <SubtaskForm
          onClose={() => {
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}

export default SubtaskDialog;
