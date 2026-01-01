# Enterprise NotebookLM

An enterprise-level BI personal assistant platform inspired by Google NotebookLM. This application enables data engineers, data scientists, and business administrators to connect multiple data sources and interact with them through an AI-powered chat interface.

## Features

- **Multi-Source Data Integration**: Connect CSV files, databases (PostgreSQL, MySQL, SQLite), PDF documents, and web APIs
- **AI-Powered Chat**: Interactive chat interface powered by Google Gemini for data analysis and insights
- **Content Generation Tools**:
  - Insights Report Generator
  - One-Page Brief Generator
  - Presentation (PPT) Generator
  - Data Exporter
  - Podcast Generator (Coming Soon)
  - Data Source Creator
- **Modern UI**: Three-column responsive layout with resizable panels
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
- **Left Panel**: Data source management with search, filtering, and tag organization
- **Center Panel**: AI chat interface for data analysis and Q&A
- **Right Panel**: Content generation tools and generated content list

## Roadmap

- [ ] Backend API implementation
- [ ] Google Gemini integration
- [ ] Database connectors (PostgreSQL, MySQL)
- [ ] PDF parsing and analysis
- [ ] Report generation (PDF/DOCX)
- [ ] Presentation generation
- [ ] Data export functionality
- [ ] User authentication
- [ ] Multi-user collaboration

## License

MIT License

## Author

[rootliu](https://github.com/rootliu)
