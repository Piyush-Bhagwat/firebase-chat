import React from "react";
import { logOut } from "../firebase/config.fb";

const Navbar = () => {
    return (
        <nav>
            <h2>Charcha</h2>
            <button onClick={logOut} className="btn logout">
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
            </button>
        </nav>
    );
};

export default Navbar;
