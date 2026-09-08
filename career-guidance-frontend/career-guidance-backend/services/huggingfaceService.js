const { InferenceClient } = require("@huggingface/inference");

const hf = new InferenceClient(process.env.HF_TOKEN);

async function generateAIResponse(messages) {
  try {
    const response = await hf.chatCompletion({
      model: "Qwen/Qwen3-32B",
      messages,
      max_tokens: 1200,
      temperature: 0.2,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Hugging Face Error:", error.message);
    throw new Error("AI service is currently unavailable");
  }
}

module.exports = {
  generateAIResponse,
};