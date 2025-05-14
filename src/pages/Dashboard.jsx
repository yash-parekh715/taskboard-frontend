import React, { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { syncEvent } from "../features/eventSlice";
import { socketRef } from "../features/socket.js";

import Sidebar from "../dashboardComponents/Sidebar.jsx";
import Navbar from "../dashboardComponents/Navbar.jsx";
import Taskboard from "../dashboardComponents/Taskboard.jsx"; // 🆕 Create this

// import { socketRef } from './features/socket.js';
// import { useDispatch } from 'react-redux';
import { addEvent } from "../features/eventSlice.js";
import { addTask } from "../features/taskSlice.js";
import { addSubtask } from "../features/subtaskSlice.js";

function Dashboard() {
  const selectedEventId = useSelector(
    (state) => state.eventReducer.selectedEventId
  );
  const selectedTaskId = useSelector(
    (state) => state.taskReducer.selectedTaskId
  );

  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;

  const dispatch = useDispatch();
  const eventList = useSelector((state) => state.eventReducer.events);

  useEffect(() => {
    if (user?.userid) {
      socketRef.emit("event:getAll", { userid: user.userid });
      const handleEventList = (events) => dispatch(syncEvent({ events }));
      socketRef.on("event:list", handleEventList);
      return () => socketRef.off("event:list", handleEventList);
    }
  }, [user?.userid, dispatch]);

  useEffect(() => {
    socketRef.on("event:created", (event) => {
      dispatch(
        addEvent({
          eventid: event.eventid,
          eventname: event.eventname,
          userid: user.userid,
        })
      );
    });

    socketRef.on("task:created", (task) => {
      dispatch(
        addTask({
          taskid: task.taskid,
          taskname: task.taskname,
          description: task.description,
          priority: task.priority,
          duedate: task.duedate,
          status: task.status,
          eventid: selectedEventId,
        })
      );
    });

    socketRef.on("subtask:created", (subtask) => {
      console.log("Subtask Created:", subtask);
      dispatch(
        addSubtask({
          subtaskid: subtask.subtaskid,
          name: subtask.name,
          taskid: selectedTaskId,
        })
      );
    });

    return () => {
      socketRef.off("event:created");
      socketRef.off("task:created");
      socketRef.off("subtask:created");
    };
  }, [dispatch]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar events={eventList} userid={user?.userid} />
      <div className="flex flex-col flex-1">
        <Navbar username={user?.username} />
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <Taskboard />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
