const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.json());

const API_KEY = "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";

app.post("/chat", async (req, res) => {
  const message = req.body.message;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "minimax/minimax-m2.5:free",
      messages: [{ role: "user", content: message }]
    })
  });

  const data = await response.json();

  res.json({
    reply: data.choices[0].message.content
  });
});

app.listen(10000);
