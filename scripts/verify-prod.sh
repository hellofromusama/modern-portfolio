#!/usr/bin/env bash
#
# verify-prod.sh — Phase-6 post-deploy (and pre-deploy local-prod) verification checklist.
#
# Runs the research checklist against a BASE_URL. Emits exactly one line per check,
# each STARTING with "PASS" or "FAIL" (so 06-08's log-grep can count PASS/FAIL lines).
# Exits non-zero if ANY check fails.
#
# Usage:
#   scripts/verify-prod.sh [BASE_URL]
#   scripts/verify-prod.sh                          # -> https://www.usamajaved.com.au (deployed prod)
#   scripts/verify-prod.sh http://localhost:3000    # -> local prod build (npm start)
#
# Checks (research checklist):
#   1. GET /                              -> HTTP 200
#   2. GET /sitemap.xml                   -> 200 + valid XML + expected routes
#   3. GET /robots.txt                    -> 200 + bot tiers intact
#   4. GET /llms.txt                      -> 200 + Content-Type text/markdown
#   5. GET /                              -> JSON-LD application/ld+json blocks present (~7)
#   6. GET /api/test-openai (no token)    -> 401/403 + NO "keyUsed" in body (FIX-01)
#   7. GET /usamajaved-indexnow-key-2026.txt -> 200 (IndexNow key file served)

set -u

BASE_URL="${1:-https://www.usamajaved.com.au}"
BASE_URL="${BASE_URL%/}"   # strip a single trailing slash

FAILURES=0

pass() { echo "PASS  $1"; }
fail() { echo "FAIL  $1"; FAILURES=$((FAILURES + 1)); }

echo "=== verify-prod.sh against ${BASE_URL} ==="

# Helpers -------------------------------------------------------------------
http_code() { curl -s -o /dev/null -w "%{http_code}" -L "$1"; }   # -L follows redirects
body()      { curl -s -L "$1"; }
headers()   { curl -s -I -L "$1"; }
# Count OCCURRENCES of a fixed string in stdin (NOT matching lines — served HTML
# is minified onto one line, so `grep -c` would under-count to 1). Reads $1 from stdin.
count_occ() { grep -o -F "$1" | grep -c "."; }

# 1. Homepage 200 -----------------------------------------------------------
CODE="$(http_code "${BASE_URL}/")"
if [ "$CODE" = "200" ]; then
  pass "homepage / returns 200"
else
  fail "homepage / returned ${CODE} (expected 200)"
fi

# 2. sitemap.xml: 200 + valid XML + expected routes -------------------------
SITEMAP="$(body "${BASE_URL}/sitemap.xml")"
SCODE="$(http_code "${BASE_URL}/sitemap.xml")"
if [ "$SCODE" = "200" ] && echo "$SITEMAP" | grep -q "<urlset" && echo "$SITEMAP" | grep -q "<loc>"; then
  URL_COUNT="$(echo "$SITEMAP" | grep -c "<loc>")"
  pass "sitemap.xml 200, valid XML, ${URL_COUNT} <loc> routes"
else
  fail "sitemap.xml invalid (code ${SCODE}, missing <urlset>/<loc>)"
fi

# 3. robots.txt: 200 + bot tiers intact -------------------------------------
ROBOTS="$(body "${BASE_URL}/robots.txt")"
RCODE="$(http_code "${BASE_URL}/robots.txt")"
if [ "$RCODE" = "200" ] && echo "$ROBOTS" | grep -qi "User-Agent" && echo "$ROBOTS" | grep -qi "Sitemap"; then
  pass "robots.txt 200, User-Agent tiers + Sitemap present"
else
  fail "robots.txt invalid (code ${RCODE}, missing User-Agent/Sitemap)"
fi

# 4. llms.txt: 200 + Content-Type text/markdown -----------------------------
LCODE="$(http_code "${BASE_URL}/llms.txt")"
LCT="$(headers "${BASE_URL}/llms.txt" | grep -i "^content-type:")"
if [ "$LCODE" = "200" ] && echo "$LCT" | grep -qi "text/markdown"; then
  pass "llms.txt 200, Content-Type text/markdown"
else
  fail "llms.txt wrong (code ${LCODE}, content-type: ${LCT:-none}; expected text/markdown)"
fi

# 5. JSON-LD blocks on homepage (~7) ----------------------------------------
# Count OCCURRENCES of the script type, not matching lines (HTML is minified to one line).
HOME_HTML="$(body "${BASE_URL}/")"
LDJSON_COUNT="$(echo "$HOME_HTML" | count_occ '<script type="application/ld+json"')"
if [ "$LDJSON_COUNT" -ge 5 ]; then
  pass "homepage carries ${LDJSON_COUNT} application/ld+json blocks (>=5, ~7 expected)"
else
  fail "homepage JSON-LD count ${LDJSON_COUNT} (<5; expected ~7)"
fi

# 6. FIX-01: /api/test-openai unauth -> 401/403, no keyUsed -----------------
OAI_CODE="$(http_code "${BASE_URL}/api/test-openai")"
OAI_BODY="$(body "${BASE_URL}/api/test-openai")"
KEYUSED_COUNT="$(echo "$OAI_BODY" | count_occ "keyUsed")"
if { [ "$OAI_CODE" = "401" ] || [ "$OAI_CODE" = "403" ]; } && [ "$KEYUSED_COUNT" -eq 0 ]; then
  pass "/api/test-openai unauth -> ${OAI_CODE}, no keyUsed in body (FIX-01)"
else
  fail "/api/test-openai unauth -> ${OAI_CODE} (expected 401/403), keyUsed count ${KEYUSED_COUNT} (expected 0)"
fi

# 7. IndexNow key file served (200) -----------------------------------------
INCODE="$(http_code "${BASE_URL}/usamajaved-indexnow-key-2026.txt")"
if [ "$INCODE" = "200" ]; then
  pass "IndexNow key file /usamajaved-indexnow-key-2026.txt returns 200"
else
  fail "IndexNow key file returned ${INCODE} (expected 200)"
fi

# Summary -------------------------------------------------------------------
echo "=== ${FAILURES} failure(s) ==="
if [ "$FAILURES" -ne 0 ]; then
  exit 1
fi
exit 0
