import React, { createContext, useEffect, useState } from "react";

export const context = createContext(null);

const MsgContextProvider = (props) => {
    const [user, setUser] = useState(null);

    useEffect(() => console.log("user", user), [user]);

    const value = { user, setUser };

    return <context.Provider value={value}>{props.children}</context.Provider>;
};

export default MsgContextProvider;
