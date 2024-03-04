import React, { useContext, useEffect, useState, useRef } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db, logOut, roomCol, sendMsg } from "../firebase/config.fb";
import { collection, limit, orderBy, query } from "firebase/firestore";
import { context } from "../context/msgContext";

import sendPop from "../audio/pop1.mp3";

const Room = () => {
    const q = query(
        collection(db, "room"),
        limit(200),
        orderBy("time", "desc")
    );

    const [messages] = useCollectionData(q);
    const [newMsg, setNewMsg] = useState("");
    const { user } = useContext(context);
    const dummy = useRef();

    const [messageSound, setMessageSound] = useState(null);

    useEffect(() => {
        // Load message sound on component mount
        const audio = new Audio(sendPop);
        setMessageSound(audio);

        const per = Notification.requestPermission();

        return () => {
            // Clean up audio element on component unmount
            audio.pause();
            setMessageSound(null);
        };
    }, []);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                console.log("hello");
                handleSend(); // You may call handleSend here if needed
            }
        };

        window.addEventListener("keypress", handleKeyPress);

        return () => {
            window.removeEventListener("keypress", handleKeyPress);
        };
    }, [newMsg]);

    useEffect(() => {
        // messages?.reverse();
        dummy.current.scrollIntoView({ behavior: "smooth" });

        if (messages) {
            messageSound?.play().catch((error) => {
                // Log the error or handle it gracefully
                console.error("Failed to play sound:", error);
            });
        }
        return () => {};
    }, [messages]);

    const renderMsg = () => {
        const revMsg = messages?.slice().reverse();
        let prevSenderId = null;
    
        return (
            <div>
                {revMsg?.map((msg, id) => {
                    const isMyMsg = msg.uid === user.uid;
                    const showProfilePic = prevSenderId !== msg.uid;
                    prevSenderId = msg.uid;
    
                    return (
                        <div
                            key={id}
                            className={`msg-display ${isMyMsg && "my-msg"}`}
                        >
                           
                                <img
                                    className= {showProfilePic ? "dp" : "dp dp-hide" }
                                    src={msg.url}
                                    alt="dp"
                                />
                            
    
                            <div className="text">
                                <div className="msg-name">
                                    ~{msg.name?.split(" ")[0]}~
                                </div>
                                {msg.text}
                                <div className="time">{getTime(msg.time)}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const getTime = (time) => {
        const date = new Date(time);

        const hour = date.getHours();
        const min = date.getMinutes();

        return `${hour % 12 !== 0 ? hour % 12 : "12"}:${
            min < 9 ? "0" + min : min
        } ${hour >= 12 ? "pm" : "am"}`;
    };

    const checkMsg = (msg) => {
        // Split the message into words
        const badWords = [
            "madarchod",
            "madrchod",
            "bahinchod",
            "lavde",
            "bhosadike",
            "land",
            "fuck",
            "fucker",
            "sucker",
            "dick",
            "bitch",
            "motherfucker",
            "lavda",
            "lode",
        ];
        const words = msg.split(" ");
        let hi = "hi";
        // Iterate through each word
        for (let i = 0; i < words.length; i++) {
            const word = words[i].toLowerCase(); // Convert to lowercase for case-insensitive matching
            if (badWords.includes(word)) {
                let newWord = words[i].at(0);
                newWord += "*".repeat(word.length - 2);
                newWord += words[i].at(-1);

                words[i] = newWord;
            }
        }

        // Join the words back into a sentence
        return words.join(" ");
    };

    const handleSend = () => {
        const checkedMsg = checkMsg(newMsg);
        if (checkedMsg.trim() != "") {
            sendMsg(user.uid, user.photoURL, user.displayName, checkedMsg);
        }
        setNewMsg("");
        dummy.current.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div>
            <div className="msg-area">
                {renderMsg()} <div className="dummy" ref={dummy}></div>
            </div>

            <div className="input">
                <input
                    type="text"
                    name="message"
                    autoComplete="false"
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                />
                <button className="send-btn" onClick={handleSend}>
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
            </div>
        </div>
    );
};

export default Room;
