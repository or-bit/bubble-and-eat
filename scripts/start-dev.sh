#!/bin/sh

REPO_ROOT=$(git rev-parse --show-toplevel)
BACKEND_DIR=packages/order-gateway
FRONTEND_DIR=packages/frontend

(cd "$REPO_ROOT"/"$BACKEND_DIR" && npm start) &
(cd "$REPO_ROOT"/"$FRONTEND_DIR" && npm start)
