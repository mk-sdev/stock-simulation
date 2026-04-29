#!/usr/bin/env bash

set -e

PORT=${1:-3000}

PORT=$PORT docker compose up -d --scale app=3
