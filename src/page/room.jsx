import React, { useContext, useEffect, useState, useRef } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db, logOut, roomCol, sendMsg } from "../firebase/config.fb";
import { collection, limit, orderBy, query } from "firebase/firestore";
import { context } from "../context/msgContext";

import sendPop from "../audio/pop1.mp3";
import recivePop from "../audio/pop2.mp3";
import Message from "../components/message";

const Room = () => {
    const q = query(
        collection(db, "room"),
        limit(100),
        orderBy("time", "desc")
    );

    const [messages] = useCollectionData(q);
    const [newMsg, setNewMsg] = useState("");
    const { user } = useContext(context);
    const dummy = useRef();

    const [reciveSound, setReciveSound] = useState(null);
    const [sendSound, setSendSound] = useState(null);

    useEffect(() => {
        //initalize audio
        // Load message sound on component mount
        const audio1 = new Audio(recivePop);
        const audio2 = new Audio(sendPop);
        setReciveSound(audio1);
        setSendSound(audio2);

        const per = Notification.requestPermission();

        return () => {
            // Clean up audio element on component unmount
            audio1.pause();
            audio2.pause();
            setSendSound(null);
            setReciveSound(null);
        };
    }, []);

    useEffect(() => {
        //add enter event listener
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
        //play reciving sound and scroll

        dummy.current.scrollIntoView({ behavior: "smooth" });

        if (messages) {
            if (messages[0]?.uid !== user?.uid) {
                reciveSound?.play().catch((error) => {
                    // Log the error or handle it gracefully
                    console.error("Failed to play sound:", error);
                });
            }
        }
        return () => {};
    }, [messages]);

    const renderMsg = () => {
        const revMsg = messages?.slice().reverse();
        let prevSenderId = null;

        return (
            <>
                {revMsg?.map((msg, id) => {
                    const isMyMsg = msg.uid === user.uid;
                    const showProfilePic = prevSenderId !== msg.uid;
                    prevSenderId = msg.uid;

                    return (
                        <Message
                            id={id}
                            msg={msg}
                            isMyMsg={isMyMsg}
                            showProfilePic={showProfilePic}
                        />
                    );
                })}
            </>
        );
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
        sendSound?.play();
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
