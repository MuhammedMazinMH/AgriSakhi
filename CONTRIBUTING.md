# Contributing to AgriSakhi

Thank you for your interest in contributing to AgriSakhi! This document provides guidelines and instructions for contributing to the project.

## 🌟 Ways to Contribute

- **Report Bugs**: Submit detailed bug reports
- **Suggest Features**: Propose new features or improvements
- **Write Code**: Fix bugs or implement new features
- **Improve Documentation**: Enhance docs, add examples, fix typos
- **Test**: Help test new features and report issues
- **Translate**: Add or improve translations
- **Design**: Improve UI/UX or create assets

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Supabase account (free tier)
- Code editor (VS Code recommended)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
```bash
git clone https://github.com/YOUR_USERNAME/agrisakhi.git
cd agrisakhi
```

3. Add upstream remote:
```bash
git remote add upstream https://github.com/original/agrisakhi.git
```

### Setup Development Environment

1. Install dependencies:
```bash
npm install --legacy-peer-deps
```

2. Copy environment variables:
```bash
cp env.template .env.local
```

3. Add your Supabase credentials to `.env.local`

4. Run development server:
```bash
npm run dev
```

5. Open http://localhost:3000

## 📝 Development Workflow

### Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `test/` - Test additions or modifications
- `refactor/` - Code refactoring
- `style/` - Code style improvements

### Make Changes

1. **Write Clean Code**
   - Follow TypeScript best practices
   - Use meaningful variable names
   - Add comments for complex logic
   - Keep functions small and focused

2. **Follow Code Style**
   - Use Prettier for formatting: `npm run format`
   - Follow ESLint rules: `npm run lint`
   - Use TypeScript strict mode

3. **Write Tests**
   - Add unit tests for utilities
   - Add integration tests for features
   - Add E2E tests for user flows
   - Aim for >80% code coverage

4. **Update Documentation**
   - Update README if needed
   - Add JSDoc comments
   - Update CHANGELOG.md
   - Add examples if applicable

### Testing

Run all tests before committing:

```bash
# Unit tests
npm test

# Type checking
npm run type-check

# Linting
npm run lint

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Commit Changes

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: add disease comparison feature"
git commit -m "fix: resolve image upload bug on mobile"
git commit -m "docs: update API documentation"
git commit -m "test: add tests for detection flow"
```

Commit message format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Maintenance

### Push Changes

```bash
git push origin feature/your-feature-name
```

### Create Pull Request

1. Go to GitHub and create a Pull Request
2. Fill out the PR template completely
3. Link related issues
4. Add screenshots if UI changes
5. Request review from maintainers

## 📋 Pull Request Guidelines

### PR Title

Follow conventional commit format:
```
feat: add multi-image batch upload
fix: resolve detection timeout on slow connections
```

### PR Description

Include:
- **What**: What changes were made
- **Why**: Why these changes are necessary
- **How**: How the problem was solved
- **Testing**: How to test the changes
- **Screenshots**: For UI changes
- **Breaking Changes**: If any

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] No console errors
- [ ] Mobile responsive (if UI change)
- [ ] Accessibility checked
- [ ] No breaking changes (or documented)

## 🧪 Testing Guidelines

### Unit Tests

```typescript
// src/lib/__tests__/utils.test.ts
import { formatDate } from '../utils';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2025-01-01');
    expect(formatDate(date)).toContain('2025');
  });
});
```

### Integration Tests

```typescript
// src/app/__tests__/detect.test.tsx
import { render, screen } from '@testing-library/react';
import DetectPage from '../detect/page';

test('renders detection page', () => {
  render(<DetectPage />);
  expect(screen.getByText(/Disease Detection/i)).toBeInTheDocument();
});
```

### E2E Tests

```typescript
// e2e/detection.spec.ts
test('complete detection flow', async ({ page }) => {
  await page.goto('/detect');
  // ... test steps
});
```

## 🎨 Code Style Guide

### TypeScript

```typescript
// Good
interface User {
  id: string;
  email: string;
  fullName: string;
}

function getUserById(id: string): Promise<User | null> {
  // implementation
}

// Avoid
function getUser(id: any): any {
  // implementation
}
```

### React Components

```typescript
// Good
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button className={cn('btn', `btn-${variant}`)} onClick={onClick}>
      {children}
    </button>
  );
}

// Use descriptive names
// Extract complex logic into custom hooks
// Keep components small and focused
```

### Naming Conventions

- **Components**: PascalCase (`DetectionCard`, `UserProfile`)
- **Functions**: camelCase (`formatDate`, `calculatePercentage`)
- **Constants**: UPPER_SNAKE_CASE (`API_URL`, `MAX_FILE_SIZE`)
- **Files**: kebab-case (`disease-detection.ts`, `user-profile.tsx`)

## 🌍 Adding Translations

To add a new language:

1. Create translation file:
```bash
mkdir -p public/locales/[language-code]
cp public/locales/en/common.json public/locales/[language-code]/common.json
```

2. Translate all strings in the file

3. Add language to `next.config.ts`:
```typescript
i18n: {
  locales: ['en', 'hi', ..., 'your-language-code'],
  defaultLocale: 'en',
}
```

4. Test translations:
```bash
npm run dev
# Switch language in app
```

## 🐛 Reporting Bugs

Use the bug report template and include:

- **Description**: Clear description of the bug
- **Steps to Reproduce**: Detailed steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: If applicable
- **Environment**: Browser, OS, device
- **Logs**: Console errors if any

## 💡 Suggesting Features

Use the feature request template and include:

- **Problem**: What problem does this solve
- **Solution**: Proposed solution
- **Alternatives**: Alternative solutions considered
- **Additional Context**: Mockups, examples, etc.

## 🔍 Code Review Process

### For Contributors

- Be open to feedback
- Respond to review comments
- Make requested changes promptly
- Ask questions if unclear

### For Reviewers

- Be respectful and constructive
- Explain the reasoning behind suggestions
- Approve if looks good
- Request changes if issues found

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 💬 Communication

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and discussions
- **Discord**: Real-time chat (coming soon)
- **Email**: support@agrisakhi.app

## 🙏 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

## ❓ Need Help?

- Check the [README](README.md)
- Browse [existing issues](https://github.com/original/agrisakhi/issues)
- Ask in [GitHub Discussions](https://github.com/original/agrisakhi/discussions)
- Join our [Discord](https://discord.gg/agrisakhi) (coming soon)

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [TensorFlow.js Guide](https://www.tensorflow.org/js/guide)
- [PWA Documentation](https://web.dev/progressive-web-apps/)

---

Thank you for contributing to AgriSakhi! Together we're helping farmers worldwide. 🌾
