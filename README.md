# Enterprise NotebookLM

An enterprise-level BI personal assistant platform inspired by Google NotebookLM. This application enables data engineers, data scientists, and business administrators to connect multiple data sources and interact with them through an AI-powered chat interface.

## Features

- **Multi-Source Data Integration**: Connect CSV files, databases (PostgreSQL, MySQL, SQLite), PDF documents, and web APIs
- **AI-Powered Chat**: Interactive chat interface powered by Google Gemini for data analysis and insights
- **Data Science Tools** (Studio Panel):
  - 📈 **Prediction**: Time series forecasting and regression prediction
  - 📉 **Curve Fitting**: Linear, polynomial, exponential, and logarithmic fitting
  - 🎯 **Feature Extraction**: PCA, feature importance, and clustering analysis
  - 🔍 **Anomaly Detection**: Statistical (IQR/Z-Score), Isolation Forest, DBSCAN
  - 📊 **Statistical Analysis**: Descriptive statistics, distribution analysis, hypothesis testing
  - 🔗 **Correlation Analysis**: Pearson, Spearman, Kendall correlation with heatmap visualization
- **Content Generation Tools**:
  - 📄 Insights Report Generator
  - 📋 One-Page Brief Generator
  - 🎬 Presentation (PPT) Generator
  - 🎙️ Audio Overview (Coming Soon)
- **Data Operation Tools**:
  - 📤 Data Exporter (CSV/Excel)
  - ➕ Data Source Creator
- **Modern UI**: Three-column responsive layout with resizable panels and grid-based tool panel
- **Bilingual Support**: Chinese and English mixed input support

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Zustand (State Management)
- Radix UI (Accessible Components)
- Lucide React (Icons)
- React Markdown

### Backend (Planned)
- Node.js + Express
- Google Gemini API
- PostgreSQL/MySQL connectors

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/rootliu/enterprise-notebooklm.git
cd enterprise-notebooklm
```

2. Install dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
```

3. Start the development server
```bash
cd client
npm run dev
```

4. Open http://localhost:5173 in your browser

## Project Structure

```
enterprise-notebooklm/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Layout/     # Layout components
│   │   │   ├── DataPanel/  # Data source management
│   │   │   ├── ChatPanel/  # AI chat interface
│   │   │   └── ToolPanel/  # Content generation tools
│   │   ├── store/          # Zustand state management
│   │   ├── types/          # TypeScript type definitions
│   │   └── App.tsx         # Main application
│   └── package.json
├── server/                 # Express backend (planned)
├── docs/                   # Documentation
│   ├── REQUIREMENTS.md     # Project requirements
│   └── UI_DESIGN.md        # UI/UX specifications
└── package.json
```

## Screenshots

The application features a modern three-column layout:
- **Left Panel**: Data source management with search, filtering, tag organization, and data quality indicators
- **Center Panel**: AI chat interface for data analysis, Q&A, and inline visualizations
- **Right Panel (Studio)**: Grid-based tool panel with data science tools, content generation tools, and generated content list

## Roadmap

### Phase 1 - Core Infrastructure
- [ ] Backend API implementation
- [ ] Google Gemini integration
- [ ] Database connectors (PostgreSQL, MySQL)
- [ ] PDF parsing and analysis

### Phase 2 - Data Science Tools
- [ ] Statistical Analysis tool
- [ ] Correlation Analysis tool with heatmap
- [ ] Anomaly Detection (IQR/Z-Score)
- [ ] Prediction (Linear Regression)
- [ ] Curve Fitting (Polynomial)
- [ ] Feature Extraction (PCA)

### Phase 3 - Content Generation
- [ ] Insights Report generation (Markdown/PDF)
- [ ] One-Page Brief generation
- [ ] Presentation (PPT) generation
- [ ] Data export functionality (CSV/Excel)

### Phase 4 - Advanced Features
- [ ] Audio Overview generation
- [ ] User authentication
- [ ] Multi-user collaboration
- [ ] Advanced ML models (Random Forest, ARIMA)

## License

MIT License

## Author

[rootliu](https://github.com/rootliu)
