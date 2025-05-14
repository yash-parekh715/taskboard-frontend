import { createSlice } from "@reduxjs/toolkit";
import { socketRef } from "./socket.js";

// Helper to calculate days left from today to due date
function getDaysLeft(dueDateStr) {
    const dueDate = new Date(dueDateStr);
    const today = new Date();
    const timeDiff = dueDate.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0);
    return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
}

const initialTaskState = {
    selectedTask: null,
    selectedTaskName: null,
    tasks: [],
    todotasks: [],
    onprogresstasks: [],
    donetasks: [],
};

export const taskSlice = createSlice({
    name: "tasks",
    initialState: initialTaskState,
    reducers: {
        setSelectedTaskName: (state, action) => {
            state.selectedTaskName = action.payload;
        },
        setSelectedTask: (state, action) => {
            state.selectedTask = action.payload;
        },
        addTask: (state, action) => {
            const t = {
                taskid: action.payload.taskid,
                taskname: action.payload.taskname,
                description: action.payload.description,
                priority: action.payload.priority,
                duedate: action.payload.duedate,
                status: action.payload.status,
                eventid: action.payload.eventid,
            };

            // socketRef.emit("task:create",{
            //     taskname : action.payload.taskname,
            //     description : action.payload.description,
            //     priority : action.payload.priority,
            //     duedate : action.payload.duedate,
            //     status : action.payload.status,
            //     eventid : action.payload.eventid,
            // })

            state.tasks.push(t);
            if (action.payload.status === "todo") {
                state.todotasks.push(t);
            } else if (action.payload.status === "on progress") {
                state.onprogresstasks.push(t);
            } else if (action.payload.status === "done") {
                state.donetasks.push(t);
            }

            // Alert if due in 3 or fewer days or overdue
            const daysLeft = getDaysLeft(t.duedate);
            console.log("Days left: ", daysLeft);
            if (daysLeft < 0) {
                alert(`Task "${t.taskname}" is overdue!`);
            } else if (daysLeft <= 3) {
                alert(`Task "${t.taskname}" is due in ${daysLeft} day(s)!`);
            }
        },
        updateTaskStatus: (state, action) => {
            const { taskid, status } = action.payload;
            const task = state.tasks.find((task) => task.taskid === taskid);
            if (task) {
                task.status = status;
            }
            state.todotasks = state.tasks.filter((task) => task.status === "todo");
            state.onprogresstasks = state.tasks.filter((task) => task.status === "on progress");
            state.donetasks = state.tasks.filter((task) => task.status === "done");
        },

        deleteTask: (state, action) => {
            // socketRef.emit("task:delete",{
            //     taskid : action.payload.taskid,
            // })
            state.tasks = state.tasks.filter((task) => task.taskid !== action.payload.taskid);
            state.todotasks = state.todotasks.filter((task) => task.taskid !== action.payload.taskid);
            state.onprogresstasks = state.onprogresstasks.filter((task) => task.taskid !== action.payload.taskid);
            state.donetasks = state.donetasks.filter((task) => task.taskid !== action.payload.taskid);
        },

        // updateTaskStatus: (state, action) =>{
        //     // socketRef.emit("task:updateStatus",{
        //     //     taskid : action.payload.taskid,
        //     //     status : action.payload.status,
        //     // })
        //     const task = state.tasks.find((task) => task.taskid === action.payload.taskid);
        //     if (task) {
        //         task.status = action.payload.status;
        //     }
        //     state.todotasks = state.tasks.filter((task) => task.status === "todo");
        //     state.onprogresstasks = state.tasks.filter((task) => task.status === "on progress");
        //     state.donetasks = state.tasks.filter((task) => task.status === "done");
        // },

        // filepath: c:\Users\soham\OneDrive\Documents\soham\webdev cwh\CreativeUpaay\frontend\src\features\taskSlice.js
        updateTaskStatus: (state, action) => {
            const { taskid, status } = action.payload;
            const task = state.tasks.find((task) => task.taskid === taskid);
            if (task) {
                task.status = status;
            }
            state.todotasks = state.tasks.filter((task) => task.status === "todo");
            state.onprogresstasks = state.tasks.filter((task) => task.status === "on progress");
            state.donetasks = state.tasks.filter((task) => task.status === "done");
        },

        syncTask: (state, action) => {
            // socketRef.emit("task:getAll",{
            //     eventid : action.payload.eventid,
            // })
            // socketRef.on("task:list", (tasks) => {
            //     state.tasks = tasks;
            // })
            state.tasks = action.payload.tasks; // Assuming tasks are passed in the payload
            state.todotasks = action.payload.tasks.filter((task) => task.status === "todo");
            state.onprogresstasks = action.payload.tasks.filter((task) => task.status === "on progress");
            state.donetasks = action.payload.tasks.filter((task) => task.status === "done");

            // Alert on sync if any due dates are approaching or overdue
            const alertTasks = [...state.todotasks, ...state.onprogresstasks];
            alertTasks.forEach((task) => {
                const daysLeft = getDaysLeft(task.duedate);
                    
                console.log("Days left: ", daysLeft);
                if (daysLeft < 0) {
                    alert(`Task "${task.taskname}" is overdue!`);
                } else if (daysLeft <= 3) {
                    alert(`Task "${task.taskname}" is due in ${daysLeft} day(s)!`);
                }
            });
        },

        clearTasks: (state, action) => {
            state.tasks = [];
            state.todotasks = [];
            state.onprogresstasks = [];
            state.donetasks = [];
        },
    },
});

export const {
    updateTaskStatus,
    setSelectedTaskName,
    setSelectedTask,
    addTask,
    deleteTask,
    syncTask,
    clearTasks,
} = taskSlice.actions;

export default taskSlice.reducer;
