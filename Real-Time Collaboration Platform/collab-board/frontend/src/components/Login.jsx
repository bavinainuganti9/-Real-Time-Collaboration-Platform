import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ setToken }) {
  const [username, setUsername] = useState("");

  const login = async () => {
    const res = await axios.post("http://localhost:4000/login", { username });
    setToken(res.data.token);
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <input
        type="text"
        placeholder="Enter your name"
        className="border p-2 w-full mb-4"
        onChange={(e) => setUsername(e.target.value)}
      />
      <button className="bg-blue-600 text-white px-4 py-2" onClick={login}>
        Join
      </button>
    </div>
  );
}
