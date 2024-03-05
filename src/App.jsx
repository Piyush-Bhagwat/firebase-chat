import React, { useContext, useEffect } from "react";
import Login from "./page/login";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/config.fb";
import { context } from "./context/msgContext";
import "./style/style.css";
import Navbar from "./components/navbar";
import Room from "./page/room";

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
