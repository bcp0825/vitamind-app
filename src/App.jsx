```jsx
async function send() {
  // Stop empty messages
  if (!input.trim()) return;

  // Store user message
  const text = input.trim();

  // Show user message immediately in chat
  setMessages(prev => [
    ...prev,
    {
      role: "user",
      text,
    },
  ]);

  // Clear chat input
  setInput("");

  try {
    // Send message to your backend AI route
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        message: text,

        // Send current check-in scores
        checkin: {
          depression,
          anxiety,
          stress,
          motivation,
          energy,
          sleep,
        },

        // Send saved history
        history,
      }),
    });

    // Convert response to JSON
    const data = await response.json();

    // Add AI response to chat
    setMessages(prev => [
      ...prev,
      {
        role: "coach",
        text:
          data.reply ||
          "I’m having trouble responding right now. Try again.",
      },
    ]);
  } catch (error) {
    console.error(error);

    // Fallback error message
    setMessages(prev => [
      ...prev,
      {
        role: "coach",
        text:
          "The AI coach is having trouble connecting right now.",
      },
    ]);
  }
}
```
