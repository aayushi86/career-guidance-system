import { useState } from "react";

export default function AICareerAssistant() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message) return;

    const res = await fetch("http://localhost:5000/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();

    setChat([
      ...chat,
      { user: message, bot: data.reply }
    ]);

    setMessage("");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">AI Career Assistant 🤖</h1>

      <div className="space-y-3">
        {chat.map((c, i) => (
          <div key={i}>
            <p><b>You:</b> {c.user}</p>
            <p><b>AI:</b> {c.bot}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 w-full"
          placeholder="Ask something..."
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-4">
          Send
        </button>
      </div>
    </div>
  );
}