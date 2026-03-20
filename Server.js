const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.json());

const API_KEY = "YOUR_OPENROUTER_API_KEY";

app.post("/chat", async (req, res) => {
  const message = req.body.message;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: message }]
    })
  });

  const data = await response.json();

  res.json({
    reply: data.choices[0].message.content
  });
});

app.listen(10000);