import React, { useContext, useEffect, useState, useRef } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db, logOut, roomCol, sendMsg } from "../firebase/config.fb";
import { collection, limit, orderBy, query } from "firebase/firestore";
import { context } from "../context/msgContext";

const Room = () => {
    const q = query(collection(db, "room"), limit(50), orderBy("time",  "desc" ));

    const [messages] = useCollectionData(q);
    const [newMsg, setNewMsg] = useState("");
    const { user } = useContext(context);
    const dummy = useRef();
    
    useEffect(() =>{
        // messages?.reverse();
        dummy.current.scrollIntoView({behaviour: "smooth"});
        return () => {}
    }, [messages]);

    const renderMsg = () => {
        const revMsg = messages?.slice().reverse();
        return (
            <div>
                {revMsg?.map((msg) => {
                    return (
                        <div
                            className={`msg-display ${
                                msg.uid === user.uid && "my-msg"
                            }`}
                        >
                            <img className="dp" src={msg.url} alt="dp" />
                            <div className="text">{msg.text}</div>
                        </div>
                    );
                })}
            </div>
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
        if(checkedMsg.trim() != ""){
            sendMsg(user.uid, user.photoURL, checkedMsg);
        }
        setNewMsg("");
        dummy.current.scrollIntoView();
    };

    return (
        <div>
            <button onClick={logOut} className="btn logout">
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
            </button>
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
