#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 \
  --username "$POSTGRES_USER" \
  --dbname "$POSTGRES_DB" \
  --set=app_password="$MEDISPHERE_APP_PASSWORD" <<'SQL'
CREATE ROLE medispheres_app LOGIN PASSWORD :'app_password';

GRANT CONNECT ON DATABASE medispheres TO medispheres_app;

GRANT USAGE ON SCHEMA public TO medispheres_app;
SQL
