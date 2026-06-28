Asphalt Space Bot

I built a Slack bot that replies to space commands 24/7. It runs on a Nest server.

What it does:
Type these commands in Slack:
- /asphalt-ping – checks if the bot is awake
- /asphalt-help – shows all commands
- /asphalt-spacefact – random space fact
- /asphalt-astro – NASA's picture of the day
- /asphalt-mars – random Mars rover photo
- /asphalt-launch – latest SpaceX launch
- /asphalt-news – latest space news
- /asphalt-company – random space company info
- /asphalt-iss – live ISS location

How I built it:
- Node.js with the Slack Bolt SDK
- Fetches data from NASA, SpaceX, and other public APIs
- Deployed on a Debian server using PM2 so it stays online

What I struggled with:
I got stuck while setting it up on the server. The deployment guide was confusing, so I used AI to help break down the steps into simple words. The biggest headache was fixing the invalid_auth errors and making the responses public in Slack channels.

Links:
GitHub: https://github.com/ayshinefr-dotcom/bot  
