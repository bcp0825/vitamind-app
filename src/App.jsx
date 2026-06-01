```jsx
import React, { useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [posts, setPosts] = useState([
    {
      name: "Maya",
      text: "What helps your anxiety the most?",
      likes: 2,
      replies: ["Breathing exercises help me."],
    },
  ]);

  const [newPost, setNewPost] = useState("");
  const [replyText, setReplyText] = useState({});

  async function sendMessage() {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          checkin: {
            anxiety: 5,
            stress: 5,
            depression: 5,
            motivation: 5,
            energy: 5,
            sleep: 7,
          },
        }),
      });

      const data = await response.json();

      setReply(data.reply);
    } catch (error) {
      setReply("AI connection failed.");
    }
  }

  function addPost() {
    if (!newPost.trim()) return;

    setPosts([
      {
        name: "You",
        text: newPost,
        likes: 0,
        replies: [],
      },
      ...posts,
    ]);

    setNewPost("");
  }

  function likePost(index) {
    const updated = [...posts];
    updated[index].likes += 1;
    setPosts(updated);
  }

  function addReply(index) {
    if (!replyText[index]) return;

    const updated = [...posts];
    updated[index].replies.push(replyText[index]);

    setPosts(updated);

    setReplyText({
      ...replyText,
      [index]: "",
    });
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom right, #dbeafe, white, #bfdbfe)",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: "52px",
            fontWeight: "bold",
            color: "#2563eb",
            marginBottom: "10px",
          }}
        >
          Vitamind
        </h1>

        <p
          style={{
            color: "#64748b",
            marginBottom: "30px",
            fontSize: "18px",
          }}
        >
          Mental and physical wellness connected.
        </p>

        {/* AI Coach */}
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "20px",
            marginBottom: "30px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              marginBottom: "20px",
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
              borderRadius: "12px",
              border: "1px solid #cbd5e1",
              marginBottom: "15px",
              fontSize: "16px",
            }}
          />

          <button
            onClick={sendMessage}
            style={{
              background: "#2563eb",
              color: "white",
              padding: "14px 20px",
              border: "none",
              borderRadius: "12px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Ask AI Coach
          </button>

          {reply && (
            <div
              style={{
                marginTop: "20px",
                background: "#eff6ff",
                padding: "20px",
                borderRadius: "12px",
              }}
            >
              <strong>AI Coach:</strong>
              <p style={{ marginTop: "10px" }}>{reply}</p>
            </div>
          )}
        </div>

        {/* Community */}
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            Community Feed
          </h2>

          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share your wellness journey..."
            style={{
              width: "100%",
              minHeight: "100px",
              padding: "15px",
              borderRadius: "12px",
              border: "1px solid #cbd5e1",
              marginBottom: "15px",
              fontSize: "16px",
            }}
          />

          <button
            onClick={addPost}
            style={{
              background: "#2563eb",
              color: "white",
              padding: "14px 20px",
              border: "none",
              borderRadius: "12px",
              fontWeight: "bold",
              cursor: "pointer",
              marginBottom: "25px",
            }}
          >
            Create Post
          </button>

          {posts.map((post, index) => (
            <div
              key={index}
              style={{
                background: "#f8fafc",
                padding: "20px",
                borderRadius: "16px",
                marginBottom: "20px",
                border: "1px solid #dbeafe",
              }}
            >
              <h3
                style={{
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                {post.name}
              </h3>

              <p style={{ marginBottom: "15px" }}>{post.text}</p>

              <button
                onClick={() => likePost(index)}
                style={{
                  marginRight: "15px",
                  background: "#dbeafe",
                  border: "none",
                  padding: "10px 15px",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                👍 Like ({post.likes})
              </button>

              <div style={{ marginTop: "15px" }}>
                <input
                  value={replyText[index] || ""}
                  onChange={(e) =>
                    setReplyText({
                      ...replyText,
                      [index]: e.target.value,
                    })
                  }
                  placeholder="Write a reply..."
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    marginBottom: "10px",
                  }}
                />

                <button
                  onClick={() => addReply(index)}
                  style={{
                    background: "#2563eb",
                    color: "white",
                    padding: "10px 15px",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                >
                  Reply
                </button>

                <div style={{ marginTop: "15px" }}>
                  {post.replies.map((reply, i) => (
                    <div
                      key={i}
                      style={{
                        background: "white",
                        padding: "10px",
                        borderRadius: "10px",
                        marginBottom: "8px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      {reply}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
```
