import React from 'react';
import './App.css';

import {
  useState,
} from 'react';
import {
  LogsProvider,
  useLogs,
} from '@kiosk-dev/embeds';
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
      <LogsProvider kioskApi={kioskApi} options={{
        pollingIntervalMs: 10000,
      }}>
        <CustomLogInterface />
      </LogsProvider>
    );
  }

  return (
    <div className="App">
      <h1>Logs</h1>
      {body}
    </div>
  );
}

function CustomLogInterface() {
  const logs = useLogs();

  const [selectedLogId, setSelectedLogId] = useState(null);
  const selectedLog = (selectedLogId == null | logs.logs == null) ? null : logs.logs.find(l => l.id === selectedLogId);

  return (
    <div className="logs--container">
      <div className="logs--table">
        <table>
          <tbody>
            {logs.logs == null ? null : logs.logs.map(log => {
              return (
                <tr className="logs--row" key={log.id} onClick={() => {
                  setSelectedLogId(log.id)
                }}>
                  <td>
                    <div className="logs--status__badge">{log.response_code}</div>
                  </td>
                  <td className="logs--route">{log.route}</td>
                  <td className="logs--time">{log.timestamp}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="logs--detail">
        {selectedLog == null ? null : (
          <>
            <h2>{selectedLog.id}</h2>
            <pre className="logs--detail-response">{JSON.stringify(selectedLog.response_body, null, 2)}</pre>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
