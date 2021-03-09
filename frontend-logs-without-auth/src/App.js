import React from 'react';
import './App.css';

import { LogsEmbed } from '@kiosk-dev/embeds';
import { Client as Kiosk } from '@kiosk-dev/kiosk-node';

const PUBLISHABLE_KEY = process.env.REACT_APP_KIOSK_PUBLISHABLE_TEST_KEY;

/**
 * Loads a Kiosk session token from the provided example server.
 */
const loadKioskApi = async () => {
  if (PUBLISHABLE_KEY == null) {
    throw new Error('Set REACT_APP_KIOSK_PUBLISHABLE_TEST_KEY before starting this app.');
  }

  try {
    const sessionResp = await fetch('http://localhost:8000/session');
    if (sessionResp.status === 500) {
      throw new Error('could not load session');
    }
    const body = await sessionResp.json();
    return new Kiosk({
      testMode: true,
      runtime: 'client',
      auth: {
        sessionToken: body.sessionToken,
        publishableKey: PUBLISHABLE_KEY,
      },
    });
  } catch (e) {
    throw new Error(`could not load session, check server? ${e.message}`);
  }
};

function App() {
  // Initialize kiosk API client from session pulled from backend.
  const [kioskApi, setKioskApi] = React.useState(null);
  const [error, setError] = React.useState(null);
  React.useEffect(() => {
    loadKioskApi().then((client) => {
      setKioskApi(client);
    }).catch((e) => {
      console.error('Error loading session', e);
      setError(e);
    });
  }, []);

  let body;
  if (kioskApi == null) {
    if (error != null) {
      body = (
        <p>Could not load session, is the server running?</p>
      );
    } else {
      body = (
        <p>Loading session...</p>
      );
    }
  } else {
    body = (
      <LogsEmbed kioskApi={kioskApi} />
    );
  }

  return (
    <div className="App">
      <h1>Logs</h1>
      {body}
    </div>
  );
}

export default App;
