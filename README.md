# Project Playground

This monorepo is a collection of mini-projects used to practice React concepts and explore various technologies. It's structured using pnpm workspaces, allowing for efficient management of multiple packages.

## Dependencies

### Core Dependencies
- React
- TypeScript
- Redux
- Redux Saga
- Redux Thunk
- Redux Middleware
- TanStack Query (React Query)
- React Hook Form
- Zod

### Development Dependencies
- ESLint
- Prettier
- Commitlint
- Tailwind CSS
- PostCSS
- Autoprefixer

## Project Structure

This project uses a monorepo structure with the following main directories:

- `packages/`: Contains all the individual packages and mini-projects
  - `configs/`: Configuration packages for various tools
  - `ui-kit/`: Shared UI components
  - `utils/`: Shared utility functions

## Mini-Projects

Below is a list of mini-projects included in this monorepo. Each project focuses on implementing specific technologies or concepts.

<!-- TODO: Add links to your mini-projects as you create them -->
- [Project 1](./packages/project1)
- [Project 2](./packages/project2)
- [Project 3](./packages/project3)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   pnpm install
   ```
3. Run a specific project:
   ```
   pnpm --filter=<project-name> dev
   ```

