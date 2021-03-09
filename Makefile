.PHONY: setup
setup:
	(cd frontend-logs-without-auth && npm install)
	(cd frontend-logs-without-auth-custom-ui && npm install)
	(cd server && npm install)

.PHONY: start-server
start-server:
	(cd server && npm run start)

