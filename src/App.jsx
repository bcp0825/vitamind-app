import React, { useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  async function sendMessage() {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: message,
          checkin: {
            anxiety: 5,
            stress: 5,
            depression: 5,
            motivation: 5,
            energy: 5,
            sleep: 7
          }
        })
      });

      const data = await response.json();
      setReply(data.reply || "No reply received.");
    } catch (error) {
      setReply("AI connection failed.");
    }
  }

 return (
  <div
    style={{
      padding: "40px",
      fontFamily: "Arial",
      minHeight: "100vh",
      background:
        "linear-gradient(to bottom right, #dbeafe, white, #bfdbfe)"
    }}
  >
}

export default App;
