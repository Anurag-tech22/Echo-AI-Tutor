# Contributing to ECHO: AI Tutor

Thank you for your interest in contributing to **ECHO (Evaluative Cognitive Heuristic Oracle)**! We welcome contributions from educators, physicists, developers, and AI researchers.

---

## Code of Conduct
This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

---

## Development Workflow

### 1. Prerequisites
- **Node.js**: `20.x` or higher
- **npm**: `10.x` or higher
- A **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

### 2. Local Setup
1. Fork the repository on GitHub.
2. Clone your fork locally:
   ```bash
   git clone https://github.com/<your-username>/Echo-AI-Tutor.git
   cd Echo-AI-Tutor
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure `.env`:
   ```bash
   cp .env.example .env
   # Add your GEMINI_API_KEY
   ```
5. Start development server:
   ```bash
   npm run dev
   ```

---

## Adding a New 3D Simulation

ECHO's 3D simulations reside in `src/components/dashboard/LiveSimulation.tsx`. When adding a new simulation:
1. **Mathematical Accuracy**: Ground the simulation in real physical formulas (e.g., differential equations, Newtonian kinematics, or quantum mechanics).
2. **Performance**: Use instanced meshes (`<instancedMesh>`) or efficient React Three Fiber techniques for multiple particle systems.
3. **Socratic Hook**: Provide an `AINarrator` prompt that guides the user to question their preconceptions rather than merely describing what's on screen.
4. **Parameter Controls**: Provide responsive sliders for key physical constants.

---

## Commit Guidelines
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
- `feat:` A new feature or simulation
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Changes that do not affect the meaning of the code
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `perf:` A code change that improves performance
- `test:` Adding missing tests or correcting existing tests

---

## Submitting Pull Requests
1. Create a feature branch (`git checkout -b feat/quantum-entanglement-sim`).
2. Verify TypeScript compiles without issues:
   ```bash
   npx tsc --noEmit
   ```
3. Commit your changes with descriptive messages.
4. Push to your fork and submit a Pull Request targeting the `main` branch.
