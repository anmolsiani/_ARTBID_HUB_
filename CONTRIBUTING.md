# Contributing to ArtBid Hub

Thank you for your interest in contributing to ArtBid Hub! 🎨

## Code of Conduct

Be respectful, inclusive, and professional.

## Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/artbid-hub.git
   cd artbid-hub
   ```
3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

1. **Make changes**
2. **Test locally**
3. **Commit with meaningful messages**
   ```bash
   git commit -m "feat: add user profile page"
   ```
4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Create Pull Request**

## Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation update
- `style:` Code style/formatting
- `refactor:` Code refactoring
- `test:` Add/update tests
- `chore:` Maintenance tasks

Examples:
```
feat: add real-time notifications
fix: resolve image upload bug
docs: update API documentation
```

## Code Style

### TypeScript
- Use strict mode
- Avoid `any` type
- Use interface over type when possible
- Export types from `/types` directory

### React/Next.js
- Functional components only
- Use hooks (useState, useEffect, etc.)
- Server Components by default (use 'use client' when needed)
- Tailwind CSS for styling

### Backend
- Use async/await over callbacks
- Proper error handling with try/catch
- Validate inputs with Zod
- Add JSDoc comments for complex functions

## Pull Request Guidelines

### Before Submitting
- [ ] Code builds without errors
- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] Follow existing code style
- [ ] Update documentation if needed

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How did you test this?

## Screenshots (if applicable)
```

## Project Structure

```
backend/
  src/
    models/       # Mongoose models
    routes/       # Express routes
    controllers/  # Business logic
    middleware/   # Auth, validation, etc.
    config/       # Configuration files

frontend/
  src/
    app/          # Next.js pages
    components/   # React components
    lib/          # Utilities, API client
    hooks/        # Custom hooks
```

## Running Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## Need Help?

- Open an issue for bugs
- Discussions for questions
- Discord for chat

## Financial Contributions

We accept sponsorships via GitHub Sponsors.

---

**Thank you for contributing! 🚀**
