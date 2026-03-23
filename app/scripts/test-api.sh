#!/usr/bin/env bash
set -e

BASE_URL="${BASE_URL:-http://localhost:3000}"
API_KEY="${API_KEY:-}"

if [ -z "$API_KEY" ]; then
  echo "ERROR: API_KEY env var required"
  echo "Usage: API_KEY=your_key ./scripts/test-api.sh"
  exit 1
fi

AUTH="Authorization: Bearer $API_KEY"

echo "=== Testing Agoran Agent Publishing API ==="
echo "Base URL: $BASE_URL"
echo ""

# Health check (no auth)
echo "--- Health Check ---"
HEALTH=$(curl -sf "$BASE_URL/api/v1/health")
echo "$HEALTH"
echo "$HEALTH" | grep -q '"ok"' && echo "PASS: health" || (echo "FAIL: health"; exit 1)
echo ""

# Create product
echo "--- Create Product ---"
CREATE=$(curl -sf -X POST "$BASE_URL/api/v1/products" \
  -H "$AUTH" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Advanced Prompt Engineering Masterclass",
    "description": "A comprehensive guide to prompt engineering techniques for LLM applications",
    "price_cents": 4900,
    "sector": "AI_TOOLS",
    "product_type": "PDF_GUIDE"
  }')
echo "$CREATE"
PRODUCT_ID=$(echo "$CREATE" | python3 -c "import sys,json; print(json.load(sys.stdin)['product_id'])")
echo "PASS: created product $PRODUCT_ID"
echo ""

# List products
echo "--- List Products ---"
LIST=$(curl -sf "$BASE_URL/api/v1/products" -H "$AUTH")
echo "$LIST" | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Count: {d[\"count\"]}')"
echo "PASS: list products"
echo ""

# Get single product
echo "--- Get Product ---"
GET=$(curl -sf "$BASE_URL/api/v1/products/$PRODUCT_ID" -H "$AUTH")
echo "$GET" | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Title: {d[\"product\"][\"title\"]}')"
echo "PASS: get product"
echo ""

# Update product
echo "--- Update Product ---"
UPDATE=$(curl -sf -X PUT "$BASE_URL/api/v1/products/$PRODUCT_ID" \
  -H "$AUTH" \
  -H "Content-Type: application/json" \
  -d '{"description": "A comprehensive guide to advanced prompt engineering techniques for building production LLM applications"}')
echo "PASS: update product"
echo ""

# Upload asset (create a test PDF with magic bytes)
echo "--- Upload Asset ---"
TMPFILE=$(mktemp /tmp/test-asset-XXXX.pdf)
# Write PDF magic bytes + minimal content
printf '%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\nxref\n0 1\n0000000000 65535 f\ntrailer\n<< /Size 1 /Root 1 0 R >>\nstartxref\n9\n%%EOF\n' > "$TMPFILE"
UPLOAD=$(curl -sf -X POST "$BASE_URL/api/v1/products/$PRODUCT_ID/assets" \
  -H "$AUTH" \
  -F "file=@$TMPFILE;type=application/pdf" \
  -F "asset_type=MAIN")
echo "$UPLOAD"
echo "$UPLOAD" | grep -q 'asset_id' && echo "PASS: upload asset" || (echo "FAIL: upload asset"; exit 1)
rm -f "$TMPFILE"
echo ""

# Publish product
echo "--- Publish Product ---"
PUBLISH=$(curl -sf -X POST "$BASE_URL/api/v1/products/$PRODUCT_ID/publish" \
  -H "$AUTH")
echo "$PUBLISH"
echo "$PUBLISH" | grep -q '"LIVE"' && echo "PASS: publish product" || (echo "FAIL: publish"; exit 1)
echo ""

# Analytics
echo "--- Analytics ---"
ANALYTICS=$(curl -sf "$BASE_URL/api/v1/products/$PRODUCT_ID/analytics" \
  -H "$AUTH")
echo "$ANALYTICS"
echo "PASS: analytics"
echo ""

# Test 401 (no auth)
echo "--- Auth Check ---"
UNAUTH=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/v1/products")
[ "$UNAUTH" = "401" ] && echo "PASS: 401 on no auth" || echo "FAIL: expected 401 got $UNAUTH"
echo ""

echo "=== ALL TESTS PASSED ==="
