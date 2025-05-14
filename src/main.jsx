import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./app/store.js";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <Provider store={store}>
//   <React.StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
//   </Provider>
// );

// filepath: c:\Users\soham\OneDrive\Documents\soham\webdev cwh\CreativeUpaay\frontend\src\main.jsx
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
{/*     <React.StrictMode> */}
      <BrowserRouter>
        <DndProvider backend={HTML5Backend}>
          <App />
        </DndProvider>
      </BrowserRouter>
{/*     </React.StrictMode> */}
  </Provider>
);
