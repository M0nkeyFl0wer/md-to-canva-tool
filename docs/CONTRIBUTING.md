# Contributing to Canva Markdown Converter

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/canva-md-converter.git
   cd canva-md-converter
   ```

2. **Install Dependencies**
   ```bash
   npm install
   npm run setup
   ```

3. **Development Environment**
   ```bash
   # Install Canva CLI
   npm install -g @canva/cli@latest
   canva login

   # Add to Claude Code
   claude mcp add canva-md-converter "node" "mcp-server/dist/server.js" -s local
   ```

## 🏗️ Project Structure

```
canva-md-converter/
├── canva-app/     # React app for Canva integration
├── mcp-server/    # MCP server for Claude Code
├── shared/        # Shared utilities and types
├── templates/     # Presentation templates
├── examples/      # Example markdown files
└── docs/         # Documentation
```

## 🎨 Contributing Templates

### Creating New Templates

1. **Define Template**
   ```typescript
   // shared/src/your-template.ts
   export const YOUR_TEMPLATE: PresentationTemplate = {
     id: 'your-theme',
     name: 'Your Theme Name',
     description: 'Description of your theme',
     slides: YOUR_SLIDE_TEMPLATES,
     branding: YOUR_BRANDING_CONFIG
   };
   ```

2. **Add to Registry**
   ```typescript
   // shared/src/templates.ts
   import { YOUR_TEMPLATE } from './your-template.js';

   export const PRESENTATION_TEMPLATES = {
     // ... existing templates
     'your-theme': YOUR_TEMPLATE
   };
   ```

3. **Test Template**
   ```bash
   npm run build
   preview_markdown_slides examples/sample.md --template=your-theme
   ```

### Template Guidelines

- **Color Accessibility**: Ensure good contrast ratios
- **Typography**: Use web-safe fonts with fallbacks
- **Responsive**: Consider different screen sizes
- **Professional**: Maintain clean, readable designs
- **Consistent**: Follow existing naming conventions

## 🔧 Contributing Code

### Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Follow existing code style
   - Add tests for new functionality
   - Update documentation as needed

3. **Test Changes**
   ```bash
   npm run build
   npm run test
   ./test-integration.sh
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

### Code Style

- **TypeScript**: Use strict type checking
- **ESLint**: Follow project linting rules
- **Prettier**: Format code consistently
- **Comments**: Document complex logic
- **Error Handling**: Comprehensive error management

### Commit Messages

Follow conventional commits format:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions or changes
- `chore:` - Maintenance tasks

## 📊 Contributing Documentation

### Documentation Types

- **README.md**: Main project documentation
- **API Docs**: Function and class documentation
- **Examples**: Usage examples and tutorials
- **Templates**: Template documentation and previews

### Documentation Guidelines

- **Clear Examples**: Provide working code examples
- **Screenshots**: Include visual previews where helpful
- **Step-by-Step**: Break complex processes into steps
- **Cross-References**: Link related documentation
- **Up-to-Date**: Keep documentation current with code

## 🧪 Testing

### Test Types

1. **Unit Tests**: Individual function testing
2. **Integration Tests**: Component interaction testing
3. **End-to-End Tests**: Full workflow testing
4. **Template Tests**: Template rendering validation

### Running Tests

```bash
# Run all tests
npm run test

# Test specific component
cd mcp-server && npm run test

# Integration test
./test-integration.sh

# Manual testing
preview_markdown_slides examples/sample-presentation.md
```

## 🐛 Bug Reports

### Before Reporting

1. Check existing issues
2. Test with latest version
3. Reproduce with minimal example
4. Check documentation

### Bug Report Template

```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Step one
2. Step two
3. Step three

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS:
- Node version:
- Canva CLI version:
- Claude Code version:

**Additional Context**
Any other relevant information
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Feature Description**
Clear description of the proposed feature

**Use Case**
Why is this feature needed?

**Proposed Solution**
How should this feature work?

**Alternative Solutions**
Other ways to solve this problem

**Additional Context**
Any other relevant information
```

## 📋 Pull Request Process

### Before Submitting

1. **Test Thoroughly**
   - All tests pass
   - Manual testing complete
   - No console errors

2. **Update Documentation**
   - README.md if needed
   - Code comments
   - Example files

3. **Clean Commit History**
   - Meaningful commit messages
   - Squash related commits
   - Remove debugging code

### Pull Request Template

```markdown
**Description**
Brief description of changes

**Type of Change**
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

**Testing**
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing complete

**Screenshots**
Include screenshots for UI changes

**Additional Notes**
Any other relevant information
```

### Review Process

1. **Automated Checks**: All CI checks must pass
2. **Code Review**: At least one maintainer approval
3. **Testing**: Thorough testing by maintainers
4. **Documentation**: Documentation review
5. **Merge**: Squash and merge to main branch

## 🏷️ Release Process

### Version Numbering

- **Major**: Breaking changes (1.0.0 → 2.0.0)
- **Minor**: New features (1.0.0 → 1.1.0)
- **Patch**: Bug fixes (1.0.0 → 1.0.1)

### Release Steps

1. Update version numbers
2. Update CHANGELOG.md
3. Create release tag
4. Publish to npm (if applicable)
5. Create GitHub release

## 📞 Getting Help

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Documentation**: Check docs/ folder
- **Examples**: Review examples/ folder

## 🙏 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Tagged in social media announcements

Thank you for contributing to Canva Markdown Converter! 🌊