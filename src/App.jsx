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
        backgroundColor: "#dbeafe",
        minHeight: "100vh"
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "white",
          borderRadius: "24px",
          padding: "35px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
        }}
      >
        <h1 style={{ color: "#2563eb", fontSize: "48px", fontWeight: "bold" }}>
          Vitamind
        </h1>

        <p style={{ color: "#475569", fontSize: "18px", marginBottom: "25px" }}>
          Mental and physical wellness connected.
        </p>

        <div
          style={{
            background: "linear-gradient(to right, #2563eb, #0ea5e9)",
            color: "white",
            borderRadius: "20px",
            padding: "28px",
            marginBottom: "25px"
          }}
        >
          <h2 style={{ fontSize: "30px", marginBottom: "10px" }}>
            AI Wellness Coach
          </h2>

          <p style={{ marginBottom: "20px" }}>
            Ask for support with stress, motivation, fitness, nutrition, or daily wellness.
          </p>

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="How are you feeling today?"
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "12px",
              border: "none",
              marginBottom: "15px",
              fontSize: "16px"
            }}
          />

          <button
            onClick={sendMessage}
            style={{
              background: "white",
              color: "#2563eb",
              padding: "14px 20px",
              border: "none",
              borderRadius: "12px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            Ask AI Coach
          </button>
        </div>
<div
  style={{
    background: "white",
    borderRadius: "20px",
    padding: "25px",
    marginBottom: "25px",
    border: "1px solid #dbeafe"
  }}
>
  <h2
    style={{
      fontSize: "28px",
      color: "#2563eb",
      marginBottom: "20px"
    }}
  >
    Community Feed
  </h2>

  <textarea
    placeholder="Share your wellness journey..."
    style={{
      width: "100%",
      minHeight: "100px",
      padding: "15px",
      borderRadius: "12px",
      border: "1px solid #cbd5e1",
      marginBottom: "15px",
      fontSize: "16px"
    }}
  />

  <button
    style={{
      background: "#2563eb",
      color: "white",
      padding: "12px 18px",
      border: "none",
      borderRadius: "12px",
      fontWeight: "bold",
      cursor: "pointer"
    }}
  >
    Create Post
  </button>

  <div
    style={{
      marginTop: "25px",
      background: "#eff6ff",
      padding: "20px",
      borderRadius: "16px"
    }}
  >
    <h3 style={{ marginBottom: "10px" }}>Maya</h3>

    <p style={{ marginBottom: "15px" }}>
      What helps your anxiety the most?
    </p>

    <button
      style={{
        background: "#dbeafe",
        border: "none",
        padding: "10px 14px",
        borderRadius: "10px",
        marginRight: "10px",
        cursor: "pointer"
      }}
    >
      👍 Like
    </button>

    <button
      style={{
        background: "#dbeafe",
        border: "none",
        padding: "10px 14px",
        borderRadius: "10px",
        cursor: "pointer"
      }}
    >
      💬 Reply
    </button>
  </div>
</div>
        {reply && (
          <div
            style={{
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              padding: "22px",
              borderRadius: "18px"
            }}
          >
            <strong style={{ color: "#2563eb" }}>AI Coach:</strong>
            <p style={{ lineHeight: "1.6", marginTop: "10px" }}>{reply}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
