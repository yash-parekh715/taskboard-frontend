// store.js
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import eventReducer from "../features/eventSlice.js";
import taskReducer from "../features/taskSlice.js";
import subtaskReducer from "../features/subtaskSlice.js";
import { loadState, saveState } from "../utils/localStorage.js";

const appReducer = combineReducers({
  eventReducer,
  taskReducer,
  subtaskReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "RESET_STORE") {
    state = undefined; // this resets all state
    localStorage.removeItem("appState"); // also clear localStorage
  }
  return appReducer(state, action);
};

const preloadedState = loadState();

export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
});

store.subscribe(() => {
  saveState(store.getState());
});
