import { createSlice , nanoid} from "@reduxjs/toolkit";
import { socketRef } from "./socket.js";

const initialSubtaskState = {
    subtasks: []
}

export const subtaskSlice = createSlice({
    name: "subtasks",
    initialState: initialSubtaskState,
    reducers:{
        addSubtask: (state, action) => {
            const s = {
                subtaskid: action.payload.subtaskid,
                name: action.payload.name,
                taskid: action.payload.taskid,
            }

            // socketRef.emit("subtask:create", {
            //     subtaskname: action.payload.subtaskname,
            //     taskid: action.payload.taskid,
            // });
            state.subtasks.push(s);
        },

        deleteSubtask: (state, action) => {
            // socketRef.emit("subtask:delete", {
            //     subtaskid: action.payload.subtaskid,
            // });
            state.subtasks = state.subtasks.filter((subtask) => subtask.subtaskid !== action.payload.subtaskid);
        },

        syncSubtask: (state, action) => {
            // socketRef.emit("subtask:getAll", {
            //     taskid: action.payload.taskid,
            // });
            // socketRef.on("subtask:list", (subtasks) => {
            //     state.subtasks = subtasks;
            // });
            state.subtasks = action.payload.subtasks; // Assuming subtasks are passed in the payload
        },

        clearSubtasks: (state, action) => {
            state.subtasks = [];
        },
    }
})

export const { addSubtask, deleteSubtask, syncSubtask , clearSubtasks} = subtaskSlice.actions;
export default subtaskSlice.reducer;