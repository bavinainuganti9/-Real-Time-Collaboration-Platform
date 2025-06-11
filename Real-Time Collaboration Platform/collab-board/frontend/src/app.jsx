import React, { useState } from "react";
import Login from "./components/Login";
import Editor from "./components/Editor";

export default function App() {
  const [token, setToken] = useState(null);
  const [docId, setDocId] = useState("666f1b42e913a2b317f5cdef"); // example ObjectId

  if (!token) return <Login setToken={setToken} />;
  return <Editor docId={docId} />;
}
