import React, { useEffect, useRef, useState } from "react";
import { getMsgId } from "../firebase/config.fb";

const Message = ({ id, isMyMsg, showProfilePic, msg }) => {
    const getTime = (time) => {
        const date = new Date(time);

        const hour = date.getHours();
        const min = date.getMinutes();

        return `${hour % 12 !== 0 ? hour % 12 : "12"}:${
            min < 9 ? "0" + min : min
        } ${hour >= 12 ? "pm" : "am"}`;
    };

    const [showSideBox, setShowSideBox] = useState(false);
    const sideBoxRef = useRef(null); // Create a ref for the sidebox element

    const handleClickOutside = (event) => {
        if (showSideBox && !sideBoxRef.current?.contains(event.target)) {
            // Check if click is outside the sidebox and sidebox is visible
            setShowSideBox(false);
        }
    };

    useEffect(() => {
        // Add event listener on document mount, remove on unmount
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [showSideBox]); // Re-run effect only when showSideBox changes

    return (
        <div key={id} className={`msg-display ${isMyMsg && "my-msg"}`}>
            <img
                className={showProfilePic ? "dp" : "dp dp-hide"}
                src={msg.url}
                alt="dp"
            />

            <div
                className="text"
                onClick={() =>
                    setShowSideBox((prevShowSideBox) => !prevShowSideBox)
                }
            >
                {showProfilePic && (
                    <div className="msg-name">~{msg.name?.split(" ")[0]}~</div>
                )}
                {msg.text}
                <div className="time">{getTime(msg.time)}</div>
            </div>

            {showSideBox && isMyMsg && (
                <div className="msg-sidebox" ref={sideBoxRef}>
                    {/* <button className="btn small-btn">
            Edit <i className="fa-solid fa-pencil"></i>
          </button> */}
                    <button
                        onClick={() => getMsgId(msg.time, msg.uid)}
                        className="btn small-btn"
                    >
                        Delete <i className="fa-solid fa-trash"></i>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Message;
