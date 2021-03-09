const { Client } = require('@kiosk-dev/kiosk-node');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8000;

const kioskClient = new Client({
  testMode: true,
  runtime: 'server',
  auth: {
    secretKey: process.env.KIOSK_SECRET_KEY || 'pk_sec_test_9810789d9a2ec87ac882b79a77212f7d',
  },
  host: 'http://localhost:3001/v1',
});


let teamId = null;

app.get('/session', cors(), async (req, res) => {
  try {
    if (teamId == null) {
      const createTeamResponse = await kioskClient.teams.create({
        name: `Example Team #${Math.floor(100 * Math.random())}`,

      });
      teamId = createTeamResponse.team.id
      console.log(`Created team ${teamId}`);
    }
    const { session_token: { value: sessionToken } } = await kioskClient.sessions.create({
      team_id: teamId,
      role: 'admin',
    });
    res.json({
      sessionToken,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: e,
    });
  }
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
