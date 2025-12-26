# Contributing to Sanandem

Thank you for your interest in contributing to Sanandem! This project aims to advance equality in medicine through open data and research. We welcome contributions from everyone who shares this vision.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Style Guidelines](#style-guidelines)
- [Community](#community)

## Code of Conduct

This project is committed to providing a welcoming and inclusive environment for all contributors. We expect:

- **Respect**: Treat everyone with respect and consideration
- **Inclusivity**: Welcome diverse perspectives and experiences
- **Constructive feedback**: Focus on ideas, not people
- **Collaboration**: Work together towards our shared goals
- **Mission alignment**: Remember we're working toward healthcare equity

## How Can I Contribute?

### 1. Reporting Bugs

If you find a bug, please open an issue with:
- A clear, descriptive title
- Steps to reproduce the issue
- Expected vs. actual behavior
- Screenshots if applicable
- Your environment (browser, OS, etc.)

**Note**: Do NOT include any personal health information in bug reports.

### 2. Suggesting Enhancements

We welcome ideas for new features! Please open an issue with:
- A clear description of the enhancement
- The problem it solves
- How it aligns with our mission of healthcare equity
- Potential implementation approaches

Priority areas:
- New visualization types
- Improved data anonymization
- Accessibility improvements
- Internationalization (i18n)
- Mobile responsiveness

### 3. Contributing Code

#### Good First Issues

Look for issues labeled:
- `good first issue`: Great for newcomers
- `help wanted`: We need community help
- `documentation`: Improve our docs
- `accessibility`: Make the platform more accessible

#### Areas We Need Help

**Frontend Development:**
- Svelte components
- Data visualizations (D3, ECharts)
- UI/UX improvements
- Responsive design
- Accessibility (WCAG compliance)

**Backend Development:**
- API endpoints
- Database optimizations
- Data validation
- Security improvements

**Data Science:**
- Statistical analysis methods
- Anonymization techniques
- Data quality validation
- Bias detection algorithms

**Design:**
- UI/UX design
- Accessibility audits
- User flow optimization
- Visual identity

**Documentation:**
- Technical documentation
- User guides
- API documentation
- Translation into other languages

**Testing:**
- Unit tests
- Integration tests
- E2E tests
- Accessibility testing

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- Git
- Code editor (VS Code recommended)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork:
```bash
git clone https://github.com/YOUR_USERNAME/Sanandem.git
cd Sanandem
```

3. Add upstream remote:
```bash
git remote add upstream https://github.com/mitchlabeetch/Sanandem.git
```

### Set Up Development Environment

1. Install dependencies:
```bash
cd sanandem
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your local database credentials
```

3. Initialize the database:
```bash
npm run db:push
```

4. Start development server:
```bash
npm run dev
```

Visit `http://localhost:5173` to see your local instance.

## Development Workflow

### 1. Create a Branch

Always create a new branch for your work:
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/`: New features
- `fix/`: Bug fixes
- `docs/`: Documentation
- `refactor/`: Code refactoring
- `test/`: Adding tests
- `chore/`: Maintenance tasks

### 2. Make Your Changes

- Write clean, readable code
- Follow the style guidelines below
- Add tests for new features
- Update documentation as needed
- Keep commits focused and atomic

### 3. Test Your Changes

Run the test suite:
```bash
npm run test
```

Run linters:
```bash
npm run lint
```

Format your code:
```bash
npm run format
```

### 4. Commit Your Changes

Write clear commit messages:
```
feat: add gender distribution chart to dashboard

- Added new pie chart component
- Integrated with existing data filters
- Added responsive design for mobile
- Updated tests

Closes #123
```

Commit message format:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code formatting
- `refactor:` Code restructuring
- `test:` Adding tests
- `chore:` Maintenance

### 5. Push and Create Pull Request

Push to your fork:
```bash
git push origin feature/your-feature-name
```

Create a pull request with:
- Clear title and description
- Reference to related issues
- Screenshots for UI changes
- Description of testing done

## Style Guidelines

### TypeScript/JavaScript

- Use TypeScript for type safety
- Follow ESLint rules
- Use meaningful variable names
- Add JSDoc comments for complex functions
- Prefer functional programming patterns
- Use async/await over promises chains

Example:
```typescript
/**
 * Calculates the severity distribution across medications
 * @param reports - Array of medication reports
 * @param minSeverity - Minimum severity threshold (1-10)
 * @returns Object with severity statistics
 */
function calculateSeverityStats(
  reports: MedicationReport[],
  minSeverity: number = 1
): SeverityStats {
  // Implementation
}
```

### Svelte Components

- Use Svelte 5 runes syntax ($state, $derived, etc.)
- Keep components focused and reusable
- Use TypeScript for props
- Add accessibility attributes
- Include loading and error states

Example:
```svelte
<script lang="ts">
  interface Props {
    data: ChartData;
    title: string;
    loading?: boolean;
  }

  let { data, title, loading = false }: Props = $props();
</script>

<div class="chart-container" role="region" aria-label={title}>
  {#if loading}
    <LoadingSpinner />
  {:else}
    <Chart {data} {title} />
  {/if}
</div>
```

### CSS/Styling

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Ensure WCAG 2.1 AA compliance
- Use semantic color names
- Test with high contrast modes

### Database

- Use Drizzle ORM for queries
- Never store PII
- Validate and sanitize inputs
- Use transactions for related operations
- Index frequently queried fields

### Security

- Never commit secrets or API keys
- Validate all user inputs
- Use parameterized queries
- Implement rate limiting
- Follow OWASP guidelines

## Accessibility Guidelines

We're committed to making Sanandem accessible to everyone:

- Use semantic HTML
- Include ARIA labels where needed
- Ensure keyboard navigation works
- Provide text alternatives for images
- Maintain sufficient color contrast
- Support screen readers
- Test with accessibility tools

## Testing

### Unit Tests

- Test individual functions and components
- Use Vitest for testing
- Aim for high code coverage
- Mock external dependencies

### Integration Tests

- Test interactions between components
- Verify data flow
- Test error handling

### E2E Tests

- Use Playwright for E2E tests
- Test critical user journeys
- Include accessibility checks

## Documentation

When contributing, update:
- Code comments
- README if needed
- API documentation
- User guides
- CHANGELOG.md

## Pull Request Process

1. **Update Documentation**: Ensure docs reflect your changes
2. **Add Tests**: Include appropriate tests
3. **Run Linters**: Ensure code passes all checks
4. **Update CHANGELOG**: Add entry for your change
5. **Request Review**: Tag relevant maintainers
6. **Address Feedback**: Respond to review comments
7. **Squash Commits**: Clean up commit history if requested

### PR Review Criteria

We look for:
- ✅ Clear purpose and description
- ✅ Tests included and passing
- ✅ Documentation updated
- ✅ No breaking changes (or clearly documented)
- ✅ Accessibility considered
- ✅ Security implications addressed
- ✅ Aligns with project mission

## Community

### Get Help

- **GitHub Discussions**: Ask questions and share ideas
- **Issues**: Report bugs and request features
- **Documentation**: Check our docs first

### Stay Informed

- Watch the repository for updates
- Read the CHANGELOG for recent changes
- Follow project announcements

## Recognition

Contributors will be:
- Listed in our README
- Mentioned in release notes for significant contributions
- Part of building a more equitable healthcare future

## License

By contributing, you agree that your contributions will be licensed under the CC0 1.0 Universal License, dedicating your work to the public domain.

## Questions?

If you have questions about contributing:
- Open a GitHub Discussion
- Check existing issues and documentation
- Reach out to maintainers

---

Thank you for helping make medicine more equitable for everyone! 💙
