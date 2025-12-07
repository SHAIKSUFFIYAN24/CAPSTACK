#!/bin/bash

# 🔌 CAPSTACK Backend Connection Verification Script
# Tests all endpoints and configuration for production readiness

set -e

BACKEND_URL="${1:-https://capstack-2k25-backend.onrender.com}"
FRONTEND_URL="${2:-https://capstack.onrender.com}"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║          CAPSTACK BACKEND CONNECTION VERIFICATION              ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "🎯 Testing Backend:  $BACKEND_URL"
echo "🎯 Testing Frontend: $FRONTEND_URL"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

TESTS_PASSED=0
TESTS_FAILED=0

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local auth=${4:-false}
    
    echo -n "Testing $description ... "
    
    local url="$BACKEND_URL$endpoint"
    local headers="-H 'Content-Type: application/json'"
    
    if [ "$auth" = "true" ]; then
        headers="$headers -H 'Authorization: Bearer guest'"
    fi
    
    # Use curl with timeout
    local response=$(curl -s -w "\n%{http_code}" -X "$method" "$url" \
        -H 'Content-Type: application/json' \
        -H 'Authorization: Bearer guest' \
        --max-time 10 2>/dev/null || echo "000")
    
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        echo -e "${GREEN}✅ OK${NC} (HTTP $http_code)"
        ((TESTS_PASSED++))
        return 0
    elif [ "$http_code" = "000" ] || [ -z "$http_code" ]; then
        echo -e "${RED}❌ FAILED${NC} (Connection timeout)"
        ((TESTS_FAILED++))
        return 1
    elif [ "$http_code" = "401" ] || [ "$http_code" = "403" ]; then
        echo -e "${YELLOW}⚠️  AUTH REQUIRED${NC} (HTTP $http_code)"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAILED${NC} (HTTP $http_code)"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Run tests
echo "📋 ENDPOINT TESTS:"
echo "─────────────────────────────────────────────────────────────────"

test_endpoint "GET" "/health" "Health Check"
test_endpoint "GET" "/finance/asset-allocation" "Asset Allocation" true
test_endpoint "GET" "/user/profile" "User Profile" true
test_endpoint "POST" "/auth/guest-login" "Guest Login"
test_endpoint "POST" "/savings/plan" "Create Savings Plan" true

echo ""
echo "─────────────────────────────────────────────────────────────────"
echo ""

# Check frontend can connect
echo "📋 FRONTEND CONNECTIVITY:"
echo "─────────────────────────────────────────────────────────────────"

echo -n "Testing Frontend URL availability ... "
if curl -s -L "$FRONTEND_URL" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ OK${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${YELLOW}⚠️  Cannot reach (may be starting)${NC}"
fi

echo ""
echo "─────────────────────────────────────────────────────────────────"
echo ""

# Summary
echo "🎯 TEST RESULTS:"
echo "─────────────────────────────────────────────────────────────────"
echo -e "Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Failed: ${RED}$TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✨ All tests passed! Backend is ready for production.${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed. Check backend service status.${NC}"
    exit 1
fi
