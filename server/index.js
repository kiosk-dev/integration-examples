const { Client } = require('@kiosk-dev/kiosk-node');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8000;

const SECRET_KEY = process.env.KIOSK_SECRET_TEST_KEY;
if (SECRET_KEY == null) {
  throw new Error('Set KIOSK_SECRET_TEST_KEY before starting this server.');
}

const kioskClient = new Client({
  testMode: true,
  runtime: 'server',
  auth: {
    secretKey: SECRET_KEY,
  },
});


let teamId = null;

app.get('/session', cors(), async (req, res) => {
  try {
    if (teamId == null) {
      // Create a team if one has not been created already. In a production
      // app, these team IDs should be read from a database rather than stored
      // in memory.
      const createTeamResponse = await kioskClient.teams.create({
        name: `Example Team #${Math.floor(100 * Math.random())}`,
      });
      teamId = createTeamResponse.team.id
      console.log(`Created team ${teamId}`);
    }
    // Create a session for the team for the admin role.
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
