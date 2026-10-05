#!/usr/bin/env bash
# Copies the web app (built by the shiftino repo's "Web export" workflow onto its web-dist
# branch) into app/, and makes 404.html open the app for deep links under /app/.
#
#   ./deploy-app.sh            # from web-dist (main)
#   ./deploy-app.sh preview    # from web-dist-preview
set -euo pipefail
cd "$(dirname "$0")"

branch=web-dist
if [ "${1:-}" = "preview" ]; then branch=web-dist-preview; fi

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
git clone -q --depth 1 -b "$branch" https://github.com/seliin21/shiftino "$tmp/dist"
rm -rf "$tmp/dist/.git"

rm -rf app
mkdir app
cp -R "$tmp/dist/." app/
echo "Built from $(cat app/BUILD_COMMIT)"

# GitHub Pages answers unknown paths with /404.html. Under /app/ that is the app itself
# (the router reads the address); anywhere else it goes back to the home page.
python3 - <<'PY'
from pathlib import Path
html = Path('app/index.html').read_text(encoding='utf-8')
guard = (
    "<script>if (!/^\\/app(\\/|$)/.test(location.pathname)) location.replace('/');</script>"
)
html = html.replace('<head>', '<head>\n    ' + guard, 1)
Path('404.html').write_text(html, encoding='utf-8')
PY
echo "app/ and 404.html updated"
