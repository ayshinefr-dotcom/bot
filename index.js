require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/asphalt-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();
require("dotenv").config();
const { App } = require("@slack/bolt");
const axios = require("axios");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

// ============================================
// COMMAND 1: /asphalt-ping
// ============================================
app.command("/asphalt-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `🚀 Pong! Mission Control is online.\nLatency: ${latency}ms` });
});

// ============================================
// COMMAND 2: /asphalt-help
// ============================================
app.command("/asphalt-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`🌌 *Available Space Commands:*

🚀 /asphalt-ping - Check if mission control is online
🪐 /asphalt-spacefact - Get a random space fact
🌠 /asphalt-astro - Get NASA's Astronomy Picture of the Day
👨‍🚀 /asphalt-help - Show this mission briefing`
  });
});

// ============================================
// COMMAND 3: /asphalt-spacefact
// ============================================
app.command("/asphalt-spacefact", async ({ ack, respond }) => {
  await ack();

  const facts = [
    "🌌 The Milky Way galaxy has over 100 billion stars.",
    "🪐 Saturn's rings are made of ice and rock particles, some as small as dust and others as large as mountains.",
    "🌠 A day on Venus is longer than a year on Venus!",
    "☀️ The Sun is about 4.6 billion years old.",
    "🌕 The Moon is moving away from Earth at about 3.8 centimeters per year.",
    "🛰️ The International Space Station orbits Earth every 90 minutes.",
    "🚀 The first human-made object to reach space was the German V-2 rocket in 1942.",
    "👨‍🚀 There are more stars in the universe than grains of sand on all Earth's beaches.",
    "🌍 Earth is the only known planet to have plate tectonics.",
    "🔭 The Hubble Space Telescope has made over 1.5 million observations since 1990.",
    "🧊 Europa, one of Jupiter's moons, has a subsurface ocean that could harbor life.",
    "🌞 The Sun accounts for 99.86% of all mass in our solar system.",
    "🪐 Jupiter's Great Red Spot is a storm larger than Earth that has been raging for hundreds of years.",
    "🌠 The Andromeda Galaxy is on a collision course with the Milky Way and will merge in about 4.5 billion years.",
    "🚀 NASA's Voyager 1 is the farthest human-made object from Earth, over 14 billion miles away."
  ];

  const randomFact = facts[Math.floor(Math.random() * facts.length)];
  await respond({ text: `🪐 *Space Fact:*\n${randomFact}` });
});

// ============================================
// COMMAND 4: /asphalt-astro (NASA APOD)
// ============================================
app.command("/asphalt-astro", async ({ ack, respond }) => {
  await ack();

  try {
    // Using NASA's public API (no API key required for basic usage)
    const response = await axios.get("https://api.nasa.gov/planetary/apod", {
      params: {
        api_key: "DEMO_KEY"  // Free public key, limited to 30 requests per hour
      }
    });

    const { title, explanation, url, date } = response.data;
    
    await respond({
      text:
`🛸 *NASA Astronomy Picture of the Day* 📸

*Title:* ${title}
*Date:* ${date}

${explanation}

🔭 View full image: ${url}`
    });
  } catch (err) {
    await respond({ 
      text: "🌠 Failed to fetch today's space image. The universe is taking a break!" 
    });
  }
});


// ============================================
// Start the bot
// ============================================
(async () => {
  await app.start();
  console.log("🚀 Mission Control is online! Bot is running!");
})();
// Get latest space news
app.command("/asphalt-news", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://api.spaceflightnewsapi.net/v4/articles", {
      params: {
        limit: 1,
        ordering: "-published_at"
      }
    });

    const article = response.data.results[0];
    if (article) {
      await respond({
        text:
`📰 *Latest Space News Headline* 🚀

*Title:* ${article.title}
*Source:* ${article.news_site}
*Published:* ${new Date(article.published_at).toLocaleString()}

${article.summary || "No summary available."}

🔗 Read full article: ${article.url}`
      });
    } else {
      await respond({ text: "📰 No space news found. Try again later!" });
    }
  } catch (err) {
    console.error("News API error:", err);
    await respond({ text: "🌠 Failed to fetch space news. Signal lost in space!" });
  }
});

// Get ISS real-time location
app.command("/asphalt-iss", async ({ ack, respond }) => {
  await ack();

  try {
    // Get ISS current position
    const positionResponse = await axios.get("http://api.open-notify.org/iss-now.json");
    const { latitude, longitude } = positionResponse.data.iss_position;

    // Get number of astronauts on ISS
    const peopleResponse = await axios.get("http://api.open-notify.org/astros.json");
    const astronauts = peopleResponse.data.people.filter(p => p.craft === "ISS");

    await respond({
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
    await respond({ text: "🛰️ Unable to get ISS location. It might be behind the Moon!" });
  }
});
