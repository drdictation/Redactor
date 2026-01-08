#!/bin/bash

# Critical Branding Check
# Prevents usage of incorrect name "RedactPDF"

echo "🔍 Checking for branding errors (RedactPDF)..."

# Grep for "RedactPDF" recursively
# Exclude .git, node_modules, dist, and this script itself
ERRORS=$(grep -r "RedactPDF" . \
  --exclude-dir=.git \
  --exclude-dir=node_modules \
  --exclude-dir=dist \
  --exclude=check-branding.sh \
  --exclude=CRITICAL_RULES.md \
  --exclude=README.md)

if [ ! -z "$ERRORS" ]; then
    echo "❌ CRITICAL ERROR: Found instances of forbidden term 'RedactPDF':"
    echo "$ERRORS"
    echo ""
    echo "⚠️  CORRECTION REQUIRED: Change all instances to 'ReactPDF'."
    exit 1
else
    echo "✅ Branding check passed. No 'RedactPDF' found."
    exit 0
fi
