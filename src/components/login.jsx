import React from "react";
import { loginWithGoole } from "../firebase/config.fb";

const Login = () => {
    return (
        <div className="login-cont">
            <button className="login-btn" onClick={loginWithGoole}>
           
                LogIn
            </button>
        </div>
    );
};

export default Login;
