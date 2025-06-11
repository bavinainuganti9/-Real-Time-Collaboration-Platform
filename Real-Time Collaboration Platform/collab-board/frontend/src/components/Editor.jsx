import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import axios from "axios";

export default function Editor({ docId }) {
  const [text, setText] = useState("");

  useEffect(() => {
    socket.emit("join", docId);

    const fetchDoc = async () => {
      const res = await axios.get(`http://localhost:4000/documents/${docId}`);
      setText(res.data.content);
    };

    fetchDoc();

    socket.on("update", setText);
    return () => socket.off("update");
  }, [docId]);

  const handleChange = (e) => {
    const newContent = e.target.value;
    setText(newContent);
    socket.emit("edit", { docId, newContent });
  };

  return (
    <textarea
      className="w-full h-screen p-4 text-lg"
      value={text}
      onChange={handleChange}
    />
  );
}
