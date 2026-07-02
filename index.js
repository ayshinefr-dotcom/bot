require("dotenv").config();

const { App } = require("@slack/bolt");
const axios = require("axios");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

// ============================================
// COMMAND: /asphalt-ping
// ============================================
app.command("/asphalt-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({
    response_type: "in_channel",
    text: `🚀 Pong! Mission Control is online.\nLatency: ${latency}ms`
  });
});

// ============================================
// COMMAND: /asphalt-help
// ============================================
app.command("/asphalt-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    response_type: "in_channel",
    text:
`🌌 *Available Space Commands:*

🚀 /asphalt-ping - Check if mission control is online
🪐 /asphalt-spacefact - Get a random space fact
🌠 /asphalt-astro - Get NASA's Astronomy Picture of the Day
📰 /asphalt-news - Get latest space news
🛰️ /asphalt-iss - ISS real-time location
👨‍🚀 /asphalt-help - Show this mission briefing`
  });
});

// ============================================
// COMMAND: /asphalt-spacefact
// ============================================
app.command("/asphalt-spacefact", async ({ ack, respond }) => {
  await ack();
  const facts = [
    "🌌 The Milky Way galaxy has over 100 billion stars.",
    "🪐 Saturn's rings are made of ice and rock particles.",
    "🌠 A day on Venus is longer than a year on Venus!",
    "☀️ The Sun is about 4.6 billion years old.",
    "🌕 The Moon is moving away from Earth at about 3.8 cm/year.",
    "🛰️ The ISS orbits Earth every 90 minutes.",
    "🚀 The first human-made object to reach space was the V-2 rocket in 1942.",
    "👨‍🚀 There are more stars than grains of sand on Earth.",
    "🌍 Earth is the only known planet with plate tectonics.",
    "🔭 Hubble has made over 1.5 million observations.",
    "🧊 Europa has a subsurface ocean that could harbor life.",
    "🌞 The Sun accounts for 99.86% of our solar system's mass.",
    "🪐 Jupiter's Great Red Spot is a storm larger than Earth.",
    "🌠 Andromeda will merge with the Milky Way in 4.5 billion years.",
    "🚀 Voyager 1 is over 14 billion miles away."
  ];
  const randomFact = facts[Math.floor(Math.random() * facts.length)];
  await respond({
    response_type: "in_channel",
    text: `🪐 *Space Fact:*\n${randomFact}`
  });
});

// ============================================
// COMMAND: /asphalt-astro (NASA APOD)
// ============================================
app.command("/asphalt-astro", async ({ ack, respond }) => {
  await ack();
  try {
    const response = await axios.get("https://api.nasa.gov/planetary/apod", {
      params: { api_key: "DEMO_KEY" }
    });
    const { title, explanation, url, date } = response.data;
    await respond({
      response_type: "in_channel",
      text:
`🛸 *NASA Astronomy Picture of the Day* 📸

*Title:* ${title}
*Date:* ${date}

${explanation}

🔭 View full image: ${url}`
    });
  } catch (err) {
    await respond({
      response_type: "in_channel",
      text: "🌠 Failed to fetch today's space image. The universe is taking a break!"
    });
  }
});

// ============================================
// COMMAND: /asphalt-news
// ============================================
app.command("/asphalt-news", async ({ ack, respond }) => {
  await ack();
  try {
    const response = await axios.get("https://api.spaceflightnewsapi.net/v4/articles", {
      params: { limit: 1, ordering: "-published_at" }
    });
    const article = response.data.results[0];
    if (article) {
      await respond({
        response_type: "in_channel",
        text:
`📰 *Latest Space News Headline* 🚀

*Title:* ${article.title}
*Source:* ${article.news_site}
*Published:* ${new Date(article.published_at).toLocaleString()}

${article.summary || "No summary available."}

🔗 Read full article: ${article.url}`
      });
    } else {
      await respond({
        response_type: "in_channel",
        text: "📰 No space news found. Try again later!"
      });
    }
  } catch (err) {
    console.error("News API error:", err);
    await respond({
      response_type: "in_channel",
      text: "🌠 Failed to fetch space news. Signal lost in space!"
    });
  }
});

// ============================================
// COMMAND: /asphalt-iss
// ============================================
app.command("/asphalt-iss", async ({ ack, respond }) => {
  await ack();
  try {
    const positionResponse = await axios.get("http://api.open-notify.org/iss-now.json");
    const { latitude, longitude } = positionResponse.data.iss_position;
    const peopleResponse = await axios.get("http://api.open-notify.org/astros.json");
    const astronauts = peopleResponse.data.people.filter(p => p.craft === "ISS");
    await respond({
      response_type: "in_channel",
      text:
`🛰️ *International Space Station (ISS) Real-Time Location*

📍 *Latitude:* ${latitude}
📍 *Longitude:* ${longitude}
👨‍🚀 *Astronauts on board:* ${astronauts.length}

---
🔄 Data updates every 90 minutes
🌍 Traveling at ~28,000 km/h`
    });
  } catch (err) {
    console.error("ISS API error:", err);
    await respond({
      response_type: "in_channel",
      text: "🛰️ Unable to get ISS location. It might be behind the Moon!"
    });
  }
});

// ============================================
// START THE BOT
// ============================================
(async () => {
  await app.start();
  console.log("🚀 Mission Control is online! Bot is running!");
})();