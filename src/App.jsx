import React, { useContext, useEffect } from "react";
import Login from "./components/login";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/config.fb";
import Room from "./components/room";
import { context } from "./context/msgContext";
import "./style/style.css";
import Navbar from "./components/navbar";

const App = () => {
    const { setUser } = useContext(context);
    const [usr] = useAuthState(auth);

    useEffect(() => {
        setUser(usr);
    }, [usr]);

    return (
        <div className="app">
            <Navbar />
            {usr ? <Room /> : <Login />}
        </div>
    );
};

export default App;
