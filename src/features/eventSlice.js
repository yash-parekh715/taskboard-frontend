import { createSlice } from "@reduxjs/toolkit";
import { socketRef } from "./socket.js";

const initialEventState = {
    selectedEvent : null,
    selectedEventName : null,
    events: [] // Ensure this is a valid initial state
};

export const eventSlice = createSlice({
    name: "events",
    initialState: initialEventState, // Correctly reference the initial state
    reducers: {
        setSelectedEventName: (state, action) => {
            console.log("Selected Event Name: ", action.payload);
            state.selectedEventName = action.payload;
        },
        setSelectedEvent: (state, action) => {
            console.log("Selected Event: ", action.payload);
            state.selectedEvent = action.payload;
        },
        addEvent: (state, action) => {
            const e = {
                eventid: action.payload.eventid,
                eventname: action.payload.eventname,
                userid: action.payload.userid,
            };
            // socketRef.emit("createEvent", {
            //     eventname: action.payload.eventname,
            //     userid: action.payload.userid,
            // });
            state.events.push(e);
            console.log("Event added: ", e);
            console.log("Events: ", state.events);
        },
        deleteEvent: (state, action) => {
            // socketRef.emit("event:delete", {
            //     eventid: action.payload.eventid,
            // });
            state.events = state.events.filter((event) => event.eventid !== action.payload.eventid);
        },
        syncEvent: (state, action) => {
            // socketRef.emit("event:getAll", {
            //     userid: action.payload.userid,
            // });
            // socketRef.on("event:list", (events) => {
            //     state.events = events;
            // });

            state.events = action.payload.events; // Assuming events are passed in the payload
        },
        clearEvents: (state) => {
            state.events = [];
        },
    },
});

export const { setSelectedEventName,addEvent, deleteEvent, syncEvent, clearEvents, setSelectedEvent } = eventSlice.actions;
export default eventSlice.reducer;