# apex-codex-cli

A personal, self-contained CLI tool for adding high-fidelity components, transitions, and text effects to your Next.js project. Inspired by the `shadcn/ui` workflow.

## Features

- **🚅 Self-Contained**: All components are bundled inside the package. No external repo required.
- **🔗 Automatic Dependency Resolution**: Adding a component automatically pulls in all its local dependencies (sub-components, contexts, and hooks).
- **📦 Smart Installation**: Detects your package manager (npm, pnpm, yarn) and installs required libraries like `gsap`, `framer-motion`, and `lucide-react`.
- **🛠️ Tailwind Ready**: Sets up a base `utils.ts` for smooth class merging.

## Installation

You can run the CLI directly using `npx`:

```bash
npx apex-codex-cli <command>
```

Or install it globally:

```bash
npm install -g apex-codex-cli
```

## Quick Start

### 1. Initialize your project

Run the `init` command to set up your configuration (`components.json`) and base utilities.

```bash
npx apex-codex-cli init
```

### 2. Add a component

Add a component by name, or run the command without an argument to see a selection menu.

```bash
npx apex-codex-cli add menu
```

_Example: Adding the `menu` component will automatically install the `Copy` component, `Line` component, and the `Language`/`Theme` contexts._

## Available Components

- **Menu**: A high-fidelity animated navigation menu.
- **Copy**: GSAP-powered text reveal and split-type animations.
- **Line**: Animated horizontal line reveals.
- **Reveal**: Slide-up block reveals.
- **PageTransition**: Complete page transition logic.
- **WaveLine**: Animated SVG wave effect.
- **GridFlip**: Animated grid component with flip-dot and random pop effects.
- **GridFlipScene**: Complete Three.js scene wrapper for GridFlip.

## Configuration

The CLI uses a `components.json` file in your root directory to track paths:

```json
{
  "paths": {
    "components": "src/components",
    "utils": "src/lib"
  }
}
```

## License

MIT
