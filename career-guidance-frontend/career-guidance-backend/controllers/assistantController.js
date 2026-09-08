const { generateAIResponse } = require("../services/huggingfaceService");

const askAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Please provide a message",
      });
    }

    const answer = await generateAIResponse([
      {
        role: "system",
        content:
          "You are CareerAI, an AI career guidance assistant for college students. Give practical, clear and concise career guidance.",
      },
      {
        role: "user",
        content: message,
      },
    ]);

    res.json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error("AI Assistant Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to get AI response",
    });
  }
};

module.exports = {
  askAI,
};