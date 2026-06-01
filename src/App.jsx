```jsx
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
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom right, #dbeafe, white, #bfdbfe)",
        padding: "40px",
        fontFamily: "Arial"
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "white",
          borderRadius: "24px",
          padding: "40px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
        }}
      >
        <h1
          style={{
            fontSize: "54px",
            fontWeight: "bold",
            color: "#2563eb",
            marginBottom: "10px"
          }}
        >
          Vitamind
        </h1>

        <p
          style={{
            color: "#64748b",
            marginBottom: "30px",
            fontSize: "18px"
          }}
        >
          Mental and physical wellness connected.
        </p>

        <div
          style={{
            background: "#eff6ff",
            padding: "25px",
            borderRadius: "20px",
            marginBottom: "20px"
          }}
        >
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              marginBottom: "20px",
              color: "#1e3a8a"
            }}
          >
            AI Wellness Coach
          </h2>

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="How are you feeling today?"
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "14px",
              border: "1px solid #cbd5e1",
              marginBottom: "16px",
              fontSize: "16px"
            }}
          />

          <button
            onClick={sendMessage}
            style={{
              background: "#2563eb",
              color: "white",
              padding: "14px 20px",
              border: "none",
              borderRadius: "14px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            Ask AI Coach
          </button>

          {reply && (
            <div
              style={{
                marginTop: "24px",
                background: "white",
                padding: "20px",
                borderRadius: "16px",
                border: "1px solid #dbeafe"
              }}
            >
              <strong style={{ color: "#2563eb" }}>
                AI Coach:
              </strong>

              <p
                style={{
                  marginTop: "10px",
                  lineHeight: "1.6"
                }}
              >
                {reply}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
```
