Kiosk Quickstart
================
This repository contains example Kiosk integrations to quickly introduce what
building a developer dashboard with Kiosk looks like.

   * [Kiosk Quickstart](#kiosk-quickstart)
   * [Prerequisites](#prerequisites)
   * [Setup](#setup)
   * [Running examples](#running-examples)
      * [1. Start the backend server](#1-start-the-backend-server)
      * [2. Pick a frontend example](#2-pick-a-frontend-example)
         * [Example A: Frontend Kiosk Logs integration](#example-a-frontend-kiosk-logs-integration)
         * [Example B: Frontend Kiosk Logs integration with a custom interface](#example-b-frontend-kiosk-logs-integration-with-a-custom-interface)
         * [Example C: Frontend Kiosk Keys & Logs integration](#example-c-frontend-kiosk-keys-&-logs-integration)


# Prerequisites
- Kiosk API keys
- node.js

# Setup
```sh
# Install all dependencies
$ make setup
```

Note: We recommend using `npm` version 7+ since the `package-lock.json` files are `v2`. The included `.nvmrc` will do this if you're using `nvm`. If you're on an older version of `npm`, the lockfile should be backwards compatible, but it will update the `package-lock.json` files.

# Running examples

Each example app consists of a backend and frontend.

## 1. Start the backend server
An example backend server is provided that wraps the `@kiosk-dev/kiosk-node`
node.js library. The frontend examples all depend on this server by default.
```sh
# Start example server on port 8000
# Set the environment variable `KIOSK_SECRET_TEST_KEY`
# to be your Kiosk `test` secret key before you start
# the server.
$ KIOSK_SECRET_TEST_KEY='pk_sec_test_...' make start-server
```

## 2. Pick a frontend example
The following example integrations are provided:

### Example A: Frontend Kiosk Logs integration
[Source](frontend-logs-without-auth)

This shows a Kiosk Logs integration that is authenticated by Kiosk sessions
generated on the backend. See
[`src/App.js`](frontend-logs-without-auth/src/App.js) for the integration code.
This example is useful if you want to get a log exploration interface running
as fast as possible.

To run this example (may take ~30s to compile the first time):
```sh
$ cd frontend-logs-without-auth
# Start development server.
# Set the environment variable `REACT_APP_KIOSK_PUBLISHABLE_TEST_KEY`
# to be your Kiosk `test` publishable key before you start
# the app.
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

### Example B: Frontend Kiosk Logs integration with a custom interface
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

### Example C: Frontend Kiosk Keys & Logs integration
[Source](frontend-keys-and-logs-without-auth)

This shows a Kiosk Keys & Logs integration that is authenticated by Kiosk sessions
generated on the backend. See
[`src/App.js`](frontend-keys-and-logs-without-auth/src/App.js) for the integration code.
This example is useful if you want to see a Keys + Logs integration running.

To run this example (may take ~30s to compile the first time):
```sh
$ cd frontend-keys-and-logs-without-auth
# Start development server.
# Set the environment variable `REACT_APP_KIOSK_PUBLISHABLE_TEST_KEY`
# to be your Kiosk `test` publishable key before you start
# the app.
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
  - Renders a Kiosk `KeysEmbed` and `LogsEmbed` with the Kiosk API client.

[backend-src]: https://github.com/kiosk-dev/integration-examples/blob/7046098/server/index.js
[frontend-src]: https://github.com/kiosk-dev/integration-examples/blob/7046098/frontend-keys-and-logs-without-auth/src/App.js#L72-L76
