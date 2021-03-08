import './App.css';

import * as embeds from '@kiosk-dev/embeds';
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

  return (
    <div className="App">
      <h1>hello</h1>
      <embeds.LogsEmbed kioskApi={kioskApi} />
    </div>
  );
}

export default App;
