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

const createLog = async () => {
  try {
    const logResp = await fetch('http://localhost:8000/demo-log');
    if (logResp.status === 500) {
      throw new Error(JSON.stringify(logResp.body));
    }
  } catch (e) {
    window.alert('failed to create log ' + e.message);
  }
}


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
        <>
          <p>Could not load session, is the server running?</p>
          <pre>{error.message}</pre>
        </>
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
      <h1>Logs (click row for details)</h1>
      {body}
      <br></br>
      <button onClick={createLog}>Create example log</button>
    </div>
  );
}

function CustomLogInterface() {
  const logs = useLogs();

  const [selectedLogId, setSelectedLogId] = useState(null);
  const selectedLog = (selectedLogId == null | logs.logs == null) ? null : logs.logs.find(l => l.id === selectedLogId);

  if (logs.logs != null && logs.logs.length === 0) {
    return (
      <p>No logs to show. Add a log with <code>POST /v1/logs</code>.</p>
    );
  }
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
