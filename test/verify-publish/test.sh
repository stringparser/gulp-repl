#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/../.."

echo "Building..."
npm run dist

echo "Packing..."
npm pack
TARBALL="gulp-repl-$(node -p "require('./package.json').version").tgz"

echo "Installing in test/verify-publish..."
cd test/verify-publish
npm install "../../${TARBALL}"
cd ../..

echo "Running smoke test..."
node test/verify-publish/smoke-test.mjs

echo "Cleaning up..."
rm -f "${TARBALL}"
rm -rf test/verify-publish/node_modules test/verify-publish/package-lock.json

echo "verify:publish passed"
