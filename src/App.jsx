import React from "react";

export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom right, #dbeafe, white, #e0f2fe)",
        fontFamily: "Arial, sans-serif",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(to right, #2563eb, #0ea5e9, #14b8a6)",
            color: "white",
            borderRadius: "24px",
            padding: "60px",
            marginBottom: "30px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          }}
        >
          <h1
            style={{
              fontSize: "64px",
              fontWeight: "900",
              marginBottom: "20px",
            }}
          >
            Vitamind
          </h1>

          <p
            style={{
              fontSize: "24px",
              marginBottom: "30px",
              maxWidth: "700px",
            }}
          >
            Mental and physical wellness connected.
          </p>

          <button
            style={{
              background: "white",
              color: "#2563eb",
              border: "none",
              padding: "16px 30px",
              borderRadius: "14px",
              fontWeight: "bold",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            Start Wellness Journey
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "30px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            }}
          >
            <h2 style={{ color: "#2563eb" }}>Mental Health Check-In</h2>

            <p>
              Track anxiety, depression, ADHD symptoms, sleep, stress,
              motivation, and emotional wellness.
            </p>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "30px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            }}
          >
            <h2 style={{ color: "#0ea5e9" }}>
              Personalized Fitness
            </h2>

            <p>
              Receive adaptive workouts based on mood, energy, stress,
              and recovery needs.
            </p>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "30px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            }}
          >
            <h2 style={{ color: "#14b8a6" }}>
              AI Wellness Coach
            </h2>

            <p>
              Talk with an AI coach for wellness support, motivation,
              stress recovery, and healthy habits.
            </p>
          </div>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "40px",
            marginTop: "30px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          }}
        >
          <h2
            style={{
              fontSize: "40px",
              color: "#071E4A",
              marginBottom: "20px",
            }}
          >
            Vitamind Premium
          </h2>

          <div
            style={{
              fontSize: "56px",
              fontWeight: "900",
              marginBottom: "20px",
            }}
          >
            $19.99
            <span
              style={{
                fontSize: "22px",
                color: "#64748b",
              }}
            >
              /month
            </span>
          </div>

          <p
            style={{
              color: "#2563eb",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            Start free for 7 days.
          </p>

          <ul
            style={{
              lineHeight: "2",
              color: "#334155",
            }}
          >
            <li>✔ Daily mental health check-ins</li>
            <li>✔ Mood-based workouts</li>
            <li>✔ Personalized nutrition guidance</li>
            <li>✔ AI wellness coach</li>
            <li>✔ Wellness community access</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
