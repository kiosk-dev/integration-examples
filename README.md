Kiosk Quickstart
================
This repository contains example Kiosk integrations to quickly introduce what
building a developer dashboard with Kiosk looks like.

   * [Kiosk Quickstart](#kiosk-quickstart)
   * [Prerequisites](#prerequisites)
   * [Setup](#setup)
   * [Running examples](#running-examples)
      * [Examples](#examples)
         * [Frontend Kiosk Logs integration](#frontend-kiosk-logs-integration)
         * [Frontend Kiosk Logs integration with a custom interface](#frontend-kiosk-logs-integration-with-a-custom-interface)

# Prerequisites
- Kiosk API keys
- node.js

# Setup
```sh
# Install all dependencies
$ make setup
```

# Running examples
An example backend server is provided that wraps the `@kiosk-dev/kiosk-node`
node.js library. The frontend examples all depend on this server by default.
```sh
# Start example server on port 8000
# Set the environment variable `KIOSK_SECRET_TEST_KEY` to be your Kiosk `test`
# environment secret key before you start the server.
$ KIOSK_SECRET_TEST_KEY='pk_sec_test_...' make start-server
```

## Examples
The following example integrations are provided:

### Frontend Kiosk Logs integration
[Source](frontend-logs-without-auth)

This shows a Kiosk Logs integration that is authenticated by Kiosk sessions
generated on the backend. See
[`src/App.js`](frontend-logs-without-auth/src/App.js) for the integration code.
This example is useful if you want to get a log exploration interface running
as fast as possible.

To run this example:
```sh
$ cd frontend-logs-without-auth
# Start development server.
# Set the environment variable `REACT_APP_KIOSK_PUBLISHABLE_TEST_KEY` to be
# your Kiosk `test` environment publishable key before you start the app.
$ REACT_APP_KIOSK_PUBLISHABLE_TEST_KEY='pk_pub_test_...' npm run start
```

Roughly, the example:
- Makes a request to the example backend. The example backend ([src][backend-src]):
  - Initializes a Kiosk API client with a secret key.
  - Creates a team via `POST /v1/teams`.
  - Creates a session for that team via `POST /v1/sessions`.
  - Returns the session token from the `POST /v1/sessions` response.
- The frontend, after receiving the session token from the backend ([src][frontend-src]):
  - Initializes a Kiosk API client with the session token.
  - Renders a Kiosk `LogsEmbed` with the Kiosk API client.

[backend-src]: https://github.com/kiosk-dev/integration-examples/blob/7046098/server/index.js
[frontend-src]: https://github.com/kiosk-dev/integration-examples/blob/7046098/frontend-logs-without-auth/src/App.js#L61-L63

### Frontend Kiosk Logs integration with a custom interface
[Source](frontend-logs-without-auth-custom-ui)

This shows a Kiosk Logs integration with a custom UI that is authenticated by
Kiosk sessions generated on the backend. See
[`src/App.js`](frontend-logs-without-auth-custom-ui/src/App.js) for the
integration code. This example is useful if you want control over how your log
exploration interface looks, but don't want to manage details such as fetching
logs and pagination.

To run this example:
```sh
$ cd frontend-logs-without-auth-custom-ui
# Start development server.
# Set the environment variable `REACT_APP_KIOSK_PUBLISHABLE_TEST_KEY` to be
# your Kiosk `test` environment publishable key before you start the app.
$ REACT_APP_KIOSK_PUBLISHABLE_TEST_KEY='pk_pub_test_...' npm run start
```

Roughly, the example:
- Makes a request to the example backend. The example backend ([src][backend-src]):
  - Initializes a Kiosk API client with a secret key.
  - Creates a team via `POST /v1/teams`
  - Creates a session for that team via `POST /v1/sessions`
  - Returns the session token from the `POST /v1/sessions` response.
- The frontend, after receiving the session token from the backend ([src][frontend-src]):
  - Initializes a Kiosk API client with the session token.
  - Renders a Kiosk `LogsProvider` with the Kiosk API client and the
    `CustomLogInterface` as a descendant of the `LogsProvider`.
    - `LogsProvider` handles details such as the initial fetch of the first page
      of logs and provides helpers for fetching more pages of logs.
    - `CustomLogInterface` uses the `useLogs` React hook to read the logs.

[backend-src]: https://github.com/kiosk-dev/integration-examples/blob/7046098/server/index.js
[frontend-src]: https://github.com/kiosk-dev/integration-examples/blob/7046098/frontend-logs-without-auth-custom-ui/src/App.js#L72-L76
