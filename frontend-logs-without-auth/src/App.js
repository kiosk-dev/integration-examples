import React from 'react';
import './App.css';

import * as embeds from '@kiosk-dev/embeds';
import { Client as Kiosk } from '@kiosk-dev/kiosk-node';

const PUBLISHABLE_KEY = 'pk_pub_test_545e9c2345f08beeb053f614b037072c';

/**
 * Loads a Kiosk session token from the provided example server.
 */
const loadKioskApi = async () => {
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
    host: 'http://localhost:3001/v1',
  });
};

function App() {
  // Initialize kiosk API client from session pulled from backend.
  const [kioskApi, setKioskApi] = React.useState(null);
  const [hasError, setHasError] = React.useState(false);
  React.useEffect(() => {
    loadKioskApi().then((client) => {
      setKioskApi(client);
    }).catch((e) => {
      console.error('Error loading session', e);
      setHasError(true);
    });
  }, []);

  let body;
  if (kioskApi == null) {
    if (hasError) {
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
      <embeds.LogsEmbed kioskApi={kioskApi} />
    );
  }

  return (
    <div className="App">
      <h1>hello</h1>
      {body}
    </div>
  );
}

export default App;
