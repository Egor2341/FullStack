#!/bin/sh
set -eu

echo "Waiting for Postgres at ${DB_HOST:-postgres}:${DB_PORT:-5432} ..."
python - <<'PY'
import os, socket, time, sys
host = os.getenv("DB_HOST", "postgres")
port = int(os.getenv("DB_PORT", "5432"))
deadline = time.time() + 60
while time.time() < deadline:
    try:
        with socket.create_connection((host, port), timeout=2):
            sys.exit(0)
    except OSError:
        time.sleep(1)
print("Postgres is not reachable", file=sys.stderr)
sys.exit(1)
PY

echo "Applying Alembic migrations..."
alembic -c alembic.ini upgrade head

echo "Starting API..."
exec uvicorn main:app --host 0.0.0.0 --port 8000
