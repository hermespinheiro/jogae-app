#!/usr/bin/env sh
set -eu

case "${1:-}" in
  init|start|stop|status|db|migration|link|login|gen|functions|projects)
    command="$1"
    shift
    docker compose --profile supabase run --rm supabase-cli "$command" "$@"
    ;;
  *)
    echo "Usage: $0 {init|start|stop|status|db|migration|link|login|gen|functions|projects} [args...]" >&2
    exit 2
    ;;
esac
