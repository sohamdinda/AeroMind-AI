# AeroMind AI — Frontend

The frontend application for **AeroMind AI**, a web-based air-quality prediction project built with React.

## Features

- Air-quality prediction interface
- Weather and pollutant data input form
- Prediction results and charts
- SHAP-based feature explanations
- Prediction history and CSV export

## Tech Stack

- **React** — user interface
- **Chart.js** — data visualization
- **react-chartjs-2** — Chart.js integration with React

## Getting Started

### Prerequisites

- Node.js and npm
- AeroMind AI backend running for prediction-related features

### Installation

Open a terminal in the `frontend` directory and run:

```bash
npm install
```

### Run the Application

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The development server reloads when you make changes.

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Starts the development server |
| `npm test` | Runs tests in interactive watch mode |
| `npm run build` | Creates an optimized production build in the `build` directory |

## Backend Integration

AeroMind AI uses a FastAPI backend for prediction-related functionality. Start the backend separately and ensure the frontend uses the correct API endpoint.

## Related Documentation

See the [main project README](../README.md) for the complete overview, backend setup, machine-learning details, and application screenshots.