import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import MsgContextProvider from "./context/msgContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <MsgContextProvider>
        <App />
    </MsgContextProvider>
);
