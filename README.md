AgroLabTest

Full-stack platform for automating laboratory workflows in agri/biotech research

About
AgroLabTest is a production-grade laboratory management and reporting system designed for agri-biotech research and testing.
No more paperwork, disparate Excel files, or copy-paste reporting—automate the full lifecycle from sample intake and experiment tracking to performance calculation and official PDF reporting.

Democratizes lab expertise: workflows once possible only for the lead scientist are now accessible to every team member

All data in one place: safe, searchable, role-protected, and ready for analytics

Modern, fast UI and real-time calculations

🛠 Technology Stack
Frontend: React, Redux Toolkit, CSS Modules

Backend: Node.js, Express, MongoDB (Mongoose), JWT

Features: PDF reporting (html2pdf.js), role-based access, Kanban board, dynamic forms, advanced search

Deployment: GitHub Pages (frontend), Render (backend)

🚀 Core Features & Highlights
Time Savings: 60% reduction in workflow time (from 2–3 hours to 40–60 minutes per experiment)

Zero Manual Errors: Automatic calculations for multi-level experiment designs (3-level nesting)

Knowledge Transfer: Even junior lab staff can execute advanced reporting and calculations

Single Source of Truth: Replace Excel + Word + Notion + Google Drive with one solution

Reporting: Generate print-ready, official PDF reports in a single click

Fully Responsive: Clean design on both desktop and mobile

Security: Fine-grained role-based access (admin, worker, viewer)


⚡️ Getting Started
Clone the repository

git clone https://github.com/Kryzhanivskyi89/insecticides-research
cd insecticides-research
Install dependencies

npm install
# or, for backend:
cd server && npm install
Configure environment

REACT_APP_API_URL=https://insecticides-research-backend.onrender.com
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_uri

npm run dev        # concurrently run backend + frontend (if supported)
# OR:
npm start          # React
npm run server     # backend
Visit http://localhost:3000

🌍 Deploy to GitHub Pages
In package.json, set:

"homepage": "https://Kryzhanivskyi89.github.io/insecticides-research",

Add scripts:

"predeploy": "npm run build",
"deploy": "gh-pages -d build"

Deploy:
npm run deploy

👨‍🔬 Who is this for
Agri-biotech companies and research labs

QA and R&D teams needing workflow automation and experimental result traceability

Laboratory managers seeking to digitize and centralize data

Scientific developers wanting a production-ready, open-source LIMS alternative

⚡ Why AgroLabTest?
Real live impact: Used in production, reduced research time by 60%

Domain-driven technical design: Created by actual lab manager/developer

Extensible app architecture

Strong focus on usability and data correctness


📫 Contributing / Questions?
Open issues, PRs, or contact [[email](mailto:kryzhanivskyi.an@gmail.com)]
Add feature requests—you will help shape the future of open-source biotech software!

AgroLabTest — Science, streamlined.