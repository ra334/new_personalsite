#!/bin/sh

set -e

echo "Applying database migrations..."
npx drizzle-kit migrate

exec "$@"