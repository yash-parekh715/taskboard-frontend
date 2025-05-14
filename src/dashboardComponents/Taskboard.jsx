


import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useDrag, useDrop } from "react-dnd";
import { socketRef } from "../features/socket.js";
import { deleteTask, setSelectedTask, setSelectedTaskName, syncTask, updateTaskStatus } from "../features/taskSlice.js";
import { Trash2, MoreVertical, Plus, Filter, Users, MessageSquare, Paperclip } from "lucide-react";
import SubtaskDialog from "./SubtaskDialog.jsx";
import TaskForm from "../forms/TaskForm.jsx";

const priorityColors = {
  low: "text-orange-500",
  medium: "text-blue-500",
  high: "text-red-500",
};

const priorityBgColors = {
  low: "bg-orange-50",
  medium: "bg-blue-50",
  high: "bg-red-50",
};

const Task = ({ task, onDeleteTask, onOpenSubtasks }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { taskid: task.taskid, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // Calculate days remaining
  const dueDate = new Date(task.duedate);
  const today = new Date();
  const daysLeft = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));

  let dateDisplay = `${dueDate.toLocaleDateString()}`;
  let dateClass = "text-gray-600";

  if (daysLeft < 0) {
    dateClass = "text-red-600 font-bold";
    dateDisplay = `Overdue by ${Math.abs(daysLeft)} days`;
  } else if (daysLeft <= 3) {
    dateClass = "text-amber-600 font-semibold";
    dateDisplay = `Due in ${daysLeft} days`;
  }

  return (
    <div
      ref={drag}
      className={`bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all space-y-3 border-l-4 ${
        priorityColors[task.priority].replace('text', 'border')
      } ${isDragging ? "opacity-50" : ""}`}
    >
      <div className="flex justify-between items-center">
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${priorityBgColors[task.priority]} ${priorityColors[task.priority]}`}
        >
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
        <span className={`text-xs ${dateClass} px-2.5 py-1 rounded-full bg-gray-50`}>
          {dateDisplay}
        </span>
      </div>
      <h3 className="font-semibold text-gray-800">{task.taskname}</h3>
      <p className="text-xs text-gray-600 leading-relaxed">{task.description}</p>
      <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-100">
        <div>
          <span className="flex items-center gap-1">
            <Users size={14} />
            <span className="font-medium">Assignees</span>
          </span>
        </div>
        <div className="flex gap-3">
          <span className="flex items-center gap-1"><MessageSquare size={14} /> 0</span>
          <span className="flex items-center gap-1"><Paperclip size={14} /> 0</span>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => onDeleteTask(task.taskid)}
            className="hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 transition-colors"
          >
            <Trash2 size={14} />
          </button>
          <button
            className="hover:text-purple-700 p-1.5 rounded-full hover:bg-purple-50 transition-colors"
            onClick={() => onOpenSubtasks(task.taskname, task.taskid)}
          >
            <MoreVertical size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

const TaskColumn = ({ title, tasks, status, onTaskDrop, handleAddClick, priority, onDeleteTask, onOpenSubtasks }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "TASK",
    drop: (item) => onTaskDrop(item.taskid, status),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  let columnColor;
  switch (status) {
    case "todo":
      columnColor = "bg-gradient-to-b from-blue-50 to-blue-50/30";
      break;
    case "on progress":
      columnColor = "bg-gradient-to-b from-amber-50 to-amber-50/30";
      break;
    case "done":
      columnColor = "bg-gradient-to-b from-green-50 to-green-50/30";
      break;
    default:
      columnColor = "bg-gray-50";
  }

  return (
    <div
      ref={drop}
      className={`${columnColor} ${isOver ? "ring-2 ring-purple-300" : ""} p-4 rounded-xl w-80 flex-shrink-0 max-h-[650px] flex flex-col shadow-sm`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-lg text-gray-800">{title}</h2>
          <button
            className="text-gray-400 hover:text-purple-600 p-1 rounded-full hover:bg-white transition-colors"
            onClick={() => handleAddClick(title)}
          >
            <Plus size={16} />
          </button>
        </div>
        <span className="text-sm bg-white/80 px-2.5 py-0.5 rounded-full font-medium text-gray-600 shadow-sm">
          {tasks.length}
        </span>
      </div>
      <div className="space-y-4 overflow-y-auto pr-2 no-scrollbar" style={{ flex: 1 }}>
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center border border-dashed border-gray-300 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-2">No tasks yet</p>
            <button
              onClick={() => handleAddClick(title)}
              className="text-xs bg-white px-3 py-1.5 rounded-lg text-purple-600 hover:text-purple-700 transition-colors shadow-sm"
            >
              Add a task
            </button>
          </div>
        ) : (
          tasks
            .filter((task) => priority === "" || task.priority === priority)
            .map((task) => (
              <Task
                key={task.taskid}
                task={task}
                onDeleteTask={onDeleteTask}
                onOpenSubtasks={onOpenSubtasks}
              />
            ))
        )}
      </div>
    </div>
  );
};

export default function Taskboard() {
  const dispatch = useDispatch();
  const selectedEventId = useSelector((state) => state.eventReducer.selectedEvent);
  const selectedEventName = useSelector((state) => state.eventReducer.selectedEventName);
  const todotasks = useSelector((state) => state.taskReducer.todotasks);
  const onprogresstasks = useSelector((state) => state.taskReducer.onprogresstasks);
  const donetasks = useSelector((state) => state.taskReducer.donetasks);

  const [showSubTasks, setShowSubtasks] = useState(false);
  const [showTodoTaskForm, setShowTodoTaskForm] = useState(false);
  const [showOnProgressTaskForm, setShowOnProgressTaskForm] = useState(false);
  const [showDoneTaskForm, setShowDoneTaskForm] = useState(false);
  const [priority, setPriority] = useState("");

  useEffect(() => {
    if (selectedEventId) {
      socketRef.emit("task:getAll", { eventid: selectedEventId });
      socketRef.on("task:list", (taskList) => {
        dispatch(syncTask({ tasks: taskList }));
      });
    }
  }, [selectedEventId, dispatch]);

  const handleTaskDrop = (taskid, newStatus) => {
    socketRef.emit("task:updateStatus", { taskid, status: newStatus });
    dispatch(updateTaskStatus({ taskid, status: newStatus }));
  };

  const handleAddClick = (title) => {
    if (title === "To Do") {
      setShowTodoTaskForm(true);
    } else if (title === "On Progress") {
      setShowOnProgressTaskForm(true);
    } else if (title === "Done") {
      setShowDoneTaskForm(true);
    }
  };

  const handleFilter = (priority) => {
    setPriority(priority);
  };

  const handleDeleteTask = (taskid) => {
    socketRef.emit("task:delete", { taskid });
    const handleTaskDeleted = (taskid) => {
      dispatch(deleteTask(taskid));
    };
    socketRef.on("task:deleted", handleTaskDeleted);
    return () => {
      socketRef.off("task:deleted", handleTaskDeleted);
    };
  };

  const handleOpenSubtasks = (taskname, taskid) => {
    dispatch(setSelectedTask(taskid));
    dispatch(setSelectedTaskName(taskname));
    setShowSubtasks(true);
  };

  return (
    <>
      {selectedEventId ? (
        <div className="p-6">
          <h1 className="text-4xl font-bold mb-8 text-gray-800 ml-2">
            {selectedEventName || "Select an event"}
          </h1>

          <div className="mb-6 flex gap-3 flex-wrap">
            <button
              className={`px-4 py-2 rounded-xl shadow-sm flex items-center gap-2 transition-all ${
                priority === "high"
                  ? "bg-red-100 text-red-700 border-2 border-red-300"
                  : "bg-white text-red-600 border border-red-200 hover:bg-red-50"
              }`}
              onClick={() => handleFilter("high")}
            >
              <Filter size={16} />
              <span>High Priority</span>
            </button>
            <button
              className={`px-4 py-2 rounded-xl shadow-sm flex items-center gap-2 transition-all ${
                priority === "medium"
                  ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                  : "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"
              }`}
              onClick={() => handleFilter("medium")}
            >
              <Filter size={16} />
              <span>Medium Priority</span>
            </button>
            <button
              className={`px-4 py-2 rounded-xl shadow-sm flex items-center gap-2 transition-all ${
                priority === "low"
                  ? "bg-orange-100 text-orange-700 border-2 border-orange-300"
                  : "bg-white text-orange-600 border border-orange-200 hover:bg-orange-50"
              }`}
              onClick={() => handleFilter("low")}
            >
              <Filter size={16} />
              <span>Low Priority</span>
            </button>
            <button
              className={`px-4 py-2 rounded-xl shadow-sm bg-gray-100 text-gray-600 border border-gray-300 hover:bg-white transition-all`}
              onClick={() => handleFilter("")}
            >
              Clear Filter
            </button>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-6">
            <TaskColumn
              title="To Do"
              tasks={todotasks}
              status="todo"
              onTaskDrop={handleTaskDrop}
              handleAddClick={handleAddClick}
              priority={priority}
              onDeleteTask={handleDeleteTask}
              onOpenSubtasks={handleOpenSubtasks}
            />
            <TaskColumn
              title="On Progress"
              tasks={onprogresstasks}
              status="on progress"
              onTaskDrop={handleTaskDrop}
              handleAddClick={handleAddClick}
              priority={priority}
              onDeleteTask={handleDeleteTask}
              onOpenSubtasks={handleOpenSubtasks}
            />
            <TaskColumn
              title="Done"
              tasks={donetasks}
              status="done"
              onTaskDrop={handleTaskDrop}
              handleAddClick={handleAddClick}
              priority={priority}
              onDeleteTask={handleDeleteTask}
              onOpenSubtasks={handleOpenSubtasks}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            {/* <ListTodo size={24} className="text-purple-600" /> */}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No project selected</h2>
          <p className="text-gray-500 max-w-md">
            Select a project from the sidebar or create a new one to get started with your tasks.
          </p>
        </div>
      )}
      {showSubTasks && <SubtaskDialog onClose={() => setShowSubtasks(false)} />}
      {showTodoTaskForm && <TaskForm onClose={() => setShowTodoTaskForm(false)} status="todo" />}
      {showOnProgressTaskForm && (
        <TaskForm onClose={() => setShowOnProgressTaskForm(false)} status="on progress" />
      )}
      {showDoneTaskForm && <TaskForm onClose={() => setShowDoneTaskForm(false)} status="done" />}
    </>
  );
}