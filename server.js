const cors = require("cors");
app.use(cors());

const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

// ==============================
// CONFIG
// ==============================
const API_KEY = "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";
const MODEL = "minimax/minimax-m2.5:free";

// ==============================
// CHAT API (AGNES)
// ==============================
app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message) {
      return res.json({ error: "Message required" });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://openrouter.ai/api/v1/chat/completions",
        "X-Title": "Virtual-AI"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: "You are AGNES, a futuristic anime AI created by DARK TEAM. Be smart, stylish, friendly and helpful."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices) {
      return res.json({ error: "API Error", details: data });
    }

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (err) {
    res.json({ error: "Server error", details: err.message });
  }
});

// ==============================
// GENERATE API (TOOLS)
// ==============================
app.post("/generate", async (req, res) => {
  try {
    const { tool, topic } = req.body;

    if (!tool || !topic) {
      return res.json({ error: "Tool and topic required" });
    }

    let prompt = "";

    switch (tool) {
      case "thumbnail":
        prompt = `Generate 5 viral YouTube thumbnail texts for: ${topic}`;
        break;

      case "script":
        prompt = `Write a professional YouTube script about: ${topic}`;
        break;

      case "hashtags":
        prompt = `Generate 20 trending hashtags for: ${topic}`;
        break;

      case "caption":
        prompt = `Write an engaging Instagram caption for: ${topic}`;
        break;

      case "ideas":
        prompt = `Generate 10 viral content ideas for: ${topic}`;
        break;

      case "bio":
        prompt = `Write a creative social media bio for: ${topic}`;
        break;

      default:
        prompt = topic;
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices) {
      return res.json({ error: "API Error", details: data });
    }

    res.json({
      result: data.choices[0].message.content
    });

  } catch (err) {
    res.json({ error: "Server error", details: err.message });
  }
});

// ==============================
// HEALTH CHECK (OPTIONAL)
// ==============================
app.get("/", (req, res) => {
  res.send("AGNES AI Backend Running 🚀");
});

// ==============================
// START SERVER
// ==============================
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
