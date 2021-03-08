import './App.css';

import {
  useState,
} from 'react';
import {
  LogsProvider,
  useLogs,
} from '@kiosk-dev/embeds';
import { Client as Kiosk } from '@kiosk-dev/kiosk-node';

const kioskApi = new Kiosk({
  testMode: false,
  runtime: 'client',
  auth: {
    // sessionToken should be a session token returned from POST /v1/sessions.
    sessionToken: 'stok_...',
    publishableKey: 'pk_pub_test_545e9c2345f08beeb053f614b037072c',
  },
  host: 'http://localhost:3001/v1',
});

function App() {
  const logsOptions = {
    pollingIntervalMs: 10000,
  };
  return (
    <div className="App">
      <h1>Logs</h1>
      <LogsProvider kioskApi={kioskApi} options={logsOptions}>
        <CountdownCompanyLogs />
      </LogsProvider>
    </div>
  );
}

function CountdownCompanyLogs() {
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
