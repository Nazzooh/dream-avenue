#!/bin/bash

# Dream Avenue Convention Center - Netlify Structure Verification Script
# Run this script before deployment to verify all files are in correct locations

echo "🔍 Dream Avenue - Netlify Structure Verification"
echo "================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 exists"
    else
        echo -e "${RED}✗${NC} $1 NOT FOUND"
        ((ERRORS++))
    fi
}

# Function to check if file does NOT exist
check_not_exists() {
    if [ ! -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 correctly absent"
    else
        echo -e "${RED}✗${NC} $1 SHOULD NOT EXIST - DELETE IT"
        ((ERRORS++))
    fi
}

# Function to check directory
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 directory exists"
    else
        echo -e "${RED}✗${NC} $1 directory NOT FOUND"
        ((ERRORS++))
    fi
}

echo "📋 REQUIRED ROOT FILES:"
echo "----------------------"
check_file "index.html"
check_file "package.json"
check_file "vite.config.ts"
check_file "tsconfig.json"
check_file "tsconfig.node.json"
check_file "postcss.config.js"
check_file "netlify.toml"
check_file ".gitignore"
echo ""

echo "📁 REQUIRED DIRECTORIES:"
echo "------------------------"
check_dir "src"
check_dir "public"
check_dir "components"
check_dir "pages"
check_dir "styles"
echo ""

echo "🔑 CRITICAL SOURCE FILES:"
echo "-------------------------"
check_file "src/main.tsx"
check_file "src/index.css"
check_file "App.tsx"
check_file "public/_redirects"
echo ""

echo "🚫 FILES THAT MUST NOT EXIST:"
echo "------------------------------"
check_not_exists "wrangler.toml"
check_not_exists "vercel.json"
check_not_exists "public/_routes.json"
check_not_exists "src/index.html"
check_not_exists "src/vite.config.ts"
check_not_exists "src/tsconfig.json"
check_not_exists "src/tsconfig.node.json"
echo ""

echo "📄 CHECKING INDEX.HTML CONTENT:"
echo "--------------------------------"
if grep -q 'src="/src/main.tsx"' index.html; then
    echo -e "${GREEN}✓${NC} index.html loads /src/main.tsx"
else
    echo -e "${RED}✗${NC} index.html does not load /src/main.tsx correctly"
    ((ERRORS++))
fi
echo ""

echo "📄 CHECKING _REDIRECTS CONTENT:"
echo "--------------------------------"
if [ -f "public/_redirects" ]; then
    if grep -q '/index.html 200' public/_redirects; then
        echo -e "${GREEN}✓${NC} _redirects contains SPA routing rule"
    else
        echo -e "${RED}✗${NC} _redirects missing SPA routing rule"
        ((ERRORS++))
    fi
else
    echo -e "${RED}✗${NC} public/_redirects file not found"
    ((ERRORS++))
fi
echo ""

echo "📦 CHECKING PACKAGE.JSON:"
echo "-------------------------"
if grep -q '"build": "vite build"' package.json; then
    echo -e "${GREEN}✓${NC} package.json has build script"
else
    echo -e "${RED}✗${NC} package.json missing build script"
    ((ERRORS++))
fi

if grep -q '"dev": "vite"' package.json; then
    echo -e "${GREEN}✓${NC} package.json has dev script"
else
    echo -e "${RED}✗${NC} package.json missing dev script"
    ((ERRORS++))
fi
echo ""

echo "================================================="
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ ALL CHECKS PASSED!${NC}"
    echo -e "${GREEN}🚀 Project is ready for Netlify deployment${NC}"
    exit 0
else
    echo -e "${RED}✗ FOUND $ERRORS ERROR(S)${NC}"
    echo -e "${YELLOW}⚠️  Please fix the errors above before deploying${NC}"
    exit 1
fi
