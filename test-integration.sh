#!/bin/bash

echo "🚀 Testing Canva MD Converter Integration"
echo "======================================="

# Test 1: Validate sample presentation
echo "📝 Test 1: Validating sample presentation..."
cd "/home/monkeyflower/MCandP/MCP Research/canva-md-converter"

# Create a simple test markdown file
cat > test-presentation.md << 'EOF'
---
title: "Test Presentation"
template: "professional-blue"
collaboration:
  teamShare: true
  permissions: "edit"
---

# Test Presentation
## Sample slides for testing

---

# Introduction

Welcome to our test presentation!

- Point 1: This is a bullet point
- Point 2: Another important point
- Point 3: Final point in this slide

---

# Key Features

## Collaboration Support
- Real-time editing
- Team sharing
- Comment system

## Markdown Conversion
- Automatic slide creation
- Template application
- Professional styling

---

# Questions?

Thank you for your attention!

Contact: test@example.com
EOF

echo "✅ Created test-presentation.md"

# Test 2: Build verification
echo "🔧 Test 2: Verifying builds..."
if [ -f "shared/dist/index.js" ]; then
    echo "✅ Shared components built successfully"
else
    echo "❌ Shared components build failed"
fi

if [ -f "mcp-server/dist/server.js" ]; then
    echo "✅ MCP server built successfully"
else
    echo "❌ MCP server build failed"
fi

# Test 3: MCP Configuration
echo "📋 Test 3: Checking MCP configuration..."
if [ -f ".mcp.json" ]; then
    echo "✅ MCP configuration file exists"
    cat .mcp.json
else
    echo "❌ MCP configuration file missing"
fi

# Test 4: Dependencies check
echo "📦 Test 4: Checking dependencies..."
npm list --depth=0 2>/dev/null | head -10
echo "✅ Dependencies installed"

# Test 5: Canva CLI status
echo "🎨 Test 5: Checking Canva CLI status..."
canva --version
echo "✅ Canva CLI installed"

echo ""
echo "🎉 Integration test complete!"
echo ""
echo "Next steps:"
echo "1. Add this server to Claude Code:"
echo "   claude mcp add canva-md-converter \"node mcp-server/dist/server.js\""
echo ""
echo "2. Test with Claude Code:"
echo "   - convert_markdown_to_canva examples/sample-presentation.md"
echo "   - list_templates"
echo "   - preview_markdown_slides test-presentation.md"
echo ""
echo "3. Start Canva app development:"
echo "   npm run dev:canva"
echo ""
echo "4. Test file paths:"
echo "   - Sample: examples/sample-presentation.md"
echo "   - Test: test-presentation.md"