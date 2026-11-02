#!/bin/bash
# Run pa11y-ci against the built _site, mirroring the CI accessibility job.
# Serves _site on 127.0.0.1:4000 with Jekyll, waits until *that* server is
# ready, runs pa11y-ci, and always stops the server afterwards.
set -euo pipefail

host=127.0.0.1
port=4000
url="http://${host}:${port}/"

if [ ! -d _site ]; then
	echo "a11y: _site/ not found. Run make build first." >&2
	exit 1
fi

# Refuse to run if something else already answers on the port: pa11y would
# otherwise test that server (e.g. a running `make serve`) instead of ours.
if curl -fs -o /dev/null "$url"; then
	echo "a11y: something is already serving ${url}. Stop it (e.g. make serve) and retry." >&2
	exit 1
fi

log="$(mktemp)"
bundle exec jekyll serve --no-watch --skip-initial-build --host "$host" --port "$port" >"$log" 2>&1 &
pid=$!
trap 'kill "$pid" 2>/dev/null || true; rm -f "$log"' EXIT

ready=false
for _ in $(seq 30); do
	if ! kill -0 "$pid" 2>/dev/null; then
		echo "a11y: Jekyll exited before it was ready:" >&2
		cat "$log" >&2
		exit 1
	fi
	if curl -fs -o /dev/null "$url"; then
		ready=true
		break
	fi
	sleep 1
done

if [ "$ready" != true ]; then
	echo "a11y: Jekyll did not answer on ${url} within 30s:" >&2
	cat "$log" >&2
	exit 1
fi

npx pa11y-ci --config .pa11yci.json
