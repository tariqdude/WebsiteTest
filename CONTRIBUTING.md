# Contributing to WebsiteTest

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to this project. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Styleguides](#styleguides)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming and inclusive environment. Please be respectful and constructive in all interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed and what behavior you expected**
- **Include screenshots if applicable**
- **Include your environment details** (OS, browser, Node.js version, etc.)

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **Include examples of how the enhancement would work**

### Code Contributions

1. Fork the repository
2. Create a new branch from `main`
3. Make your changes
4. Add or update tests if necessary
5. Ensure all tests pass
6. Update documentation if needed
7. Submit a pull request

## Development Setup

### Prerequisites

- Node.js 18+
- npm 8+

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/your-username/WebsiteTest.git

# Navigate to the directory
cd WebsiteTest

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues
npm run format       # Format code with Prettier
npm run type-check   # TypeScript type checking
npm run check        # Astro check
```

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

#### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring without feature changes
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(hero): add animated background particles
fix(contact): resolve form validation bug
docs(readme): update installation instructions
```

### TypeScript Styleguide

- Use TypeScript for all new files
- Define proper interfaces and types
- Avoid `any` type when possible
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### CSS/Styling Guidelines

- Use Tailwind CSS utilities first
- Create custom CSS only when necessary
- Follow the existing design system
- Use CSS custom properties for theming
- Ensure responsive design across all screen sizes

### Component Guidelines

- Create reusable components when possible
- Use proper TypeScript interfaces for props
- Include accessibility attributes (ARIA labels, etc.)
- Follow the existing component structure
- Add prop validation and default values

## Pull Request Process

### Before Submitting

1. **Test thoroughly**: Ensure your changes work as expected
2. **Run quality checks**: `npm run lint`, `npm run type-check`, `npm run build`
3. **Update documentation**: If you change APIs or add features
4. **Write good commit messages**: Follow the commit message guidelines
5. **Keep PRs focused**: One feature or bug fix per pull request

### PR Template

When creating a pull request, please include:

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] I have tested these changes locally
- [ ] I have added/updated tests if necessary
- [ ] All existing tests pass

## Screenshots (if applicable)
Include screenshots of UI changes.

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
```

### Review Process

1. **Automated checks**: All CI checks must pass
2. **Code review**: At least one maintainer will review your code
3. **Testing**: Changes will be tested in different environments
4. **Approval**: Once approved, your PR will be merged

## Recognition

Contributors will be recognized in:
- GitHub contributor list
- Project documentation
- Release notes (for significant contributions)

## Questions?

If you have questions about contributing, feel free to:
- Open an issue with the "question" label
- Reach out to maintainers
- Check existing documentation

Thank you for contributing to WebsiteTest! 🚀
