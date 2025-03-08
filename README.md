# Retail Analytics Dashboard

## Overview

The **Retail Analytics Dashboard** is a React-based web application built with TypeScript, designed to visualize and manage retail planning data. It provides two main views:

1. **Charts View**:
   - Displays a dual-axis chart showing Gross Margin (GM) Dollars and GM Percentage over 52 weeks for a selected store.
   - Uses Chart.js to render a bar chart for GM Dollars and a line chart for GM Percentage.
   - Allows users to filter data by store using a dropdown.

2. **Planning View**:
   - Presents a data table using AG Grid, showing sales units, sales dollars, GM dollars, and GM percentage for each store-SKU combination across 52 weeks.
   - Supports inline editing of sales units, which updates the underlying data in real-time via Redux state management.
   - Includes conditional formatting for GM percentages (e.g., green for high values, red for low).

The project uses Redux for state management, ensuring a single source of truth for the application data. It leverages TypeScript for type safety, making the codebase more maintainable and less prone to runtime errors.

## Features
- Visualize GM Dollars and GM Percentage trends over time for a selected store.
- Interactive data table for viewing and editing retail planning data.
- Store filtering to focus on specific store data.
- Conditional cell styling in the data table based on GM percentage values.
- Responsive design for better usability.

## Tech Stack
- **React**: Frontend framework for building the UI.
- **TypeScript**: Adds type safety to JavaScript, improving code quality and developer experience.
- **Redux**: State management library for managing the application's data (stores, SKUs, planning data).
- **Chart.js**: Used with `react-chartjs-2` to render charts in the Charts view.
- **AG Grid**: A powerful data grid library for displaying and editing tabular data in the Planning view.
- **Tailwind CSS**: Utility-first CSS framework for styling (assumed based on class names like `bg-gray-200`).

## Dependencies and Their Purpose

| Dependency              | Purpose                                                                 |
|-------------------------|-------------------------------------------------------------------------|
| `react`                | Core library for building the user interface.                           |
| `react-dom`            | Provides DOM-specific methods for React.                                |
| `typescript`           | Adds static types to JavaScript for better tooling and error catching.  |
| `react-redux`          | Official React bindings for Redux to manage state in React components.  |
| `redux`                | Core library for state management (used with `react-redux`).            |
| `chart.js`             | Library for rendering charts (bar and line charts in the Charts view).  |
| `react-chartjs-2`      | React wrapper for Chart.js to integrate charts into React components.   |
| `@types/chart.js`      | TypeScript type definitions for Chart.js.                               |
| `ag-grid-react`        | React component for AG Grid, used to render the data table.             |
| `ag-grid-community`    | Core AG Grid library for community features (e.g., sorting, editing).   |
| `tailwindcss`          | CSS framework for styling the application (assumed based on usage).     |

## Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js** (v16 or later): Required to run the JavaScript runtime.
- **npm** (v8 or later): Package manager for installing dependencies (comes with Node.js).

