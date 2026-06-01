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
    <div style={{ padding: "40px", fontFamily: "Arial", backgroundColor: "#dbeafe", minHeight: "100vh" }}>
     <h1 style={{ color: "#2563eb", fontSize: "48px", fontWeight: "bold" }}>Vitamind</h1>
      <p>Mental and physical wellness connected.</p>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="How are you feeling today?"
        style={{ padding: "12px", width: "100%", marginBottom: "12px" }}
      />

      <button onClick={sendMessage}>Ask AI Coach</button>

      {reply && (
        <div style={{ marginTop: "20px" }}>
          <strong>AI Coach:</strong>
          <p>{reply}</p>
        </div>
      )}
    </div>
  );
}

export default App;
