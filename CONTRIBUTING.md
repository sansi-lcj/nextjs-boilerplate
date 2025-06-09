# Contributing to Building Asset Management Platform

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Code Style

### Go Code Style
- Follow the official [Go Code Review Comments](https://github.com/golang/go/wiki/CodeReviewComments)
- Use `gofmt` to format your code
- Use meaningful variable and function names
- Add comments for exported functions and types

### TypeScript/React Code Style
- Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use TypeScript for all new files
- Use functional components with hooks
- Keep components small and focused

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

Example:
```
feat(auth): add JWT refresh token support

Implement refresh token functionality to improve security
and user experience.

Closes #123
```

## Pull Request Process

1. Update the README.md with details of changes to the interface, if applicable.
2. Update the docs/ with any new documentation.
3. The PR title should follow the same convention as commit messages.
4. Link the PR to any relevant issues.
5. Request reviews from maintainers.

## Testing

### Backend Testing
```bash
cd backend
go test ./...
```

### Frontend Testing
```bash
cd frontend
npm test
```

## Setting Up Development Environment

1. Install required tools:
   - Go 1.18+
   - Node.js 14+
   - Git

2. Clone the repository:
   ```bash
   git clone https://github.com/your-org/building-asset-management.git
   cd building-asset-management
   ```

3. Install dependencies:
   ```bash
   make install
   ```

4. Set up pre-commit hooks (optional):
   ```bash
   # Install pre-commit
   pip install pre-commit
   pre-commit install
   ```

## Project Structure

Please maintain the existing project structure:

```
.
├── backend/          # Go backend service
├── frontend/         # React frontend
├── docs/            # Documentation
├── scripts/         # Utility scripts
└── docker-compose.yml
```

## Reporting Bugs

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/your-org/building-asset-management/issues/new).

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## License

By contributing, you agree that your contributions will be licensed under its MIT License.

## References

This document was adapted from the open-source contribution guidelines for [Facebook's Draft](https://github.com/facebook/draft-js/blob/master/CONTRIBUTING.md).