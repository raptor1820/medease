
# MedEase: AI-Assisted Diagnostic Workflow

**Made by [Cheng-Yuan Li](https://github.com/1129Chengyuan), [David Gu](https://github.com/shaply), [Amisha Sao](https://github.com/amishasao), [Ritwic Verma](https://github.com/raptor1820) for HackGT XI**

[![React](https://img.shields.io/badge/React-17.0+-blue.svg)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-12.0+-black.svg)](https://nextjs.org/)
[![Flask](https://img.shields.io/badge/Flask-2.0+-orange.svg)](https://flask.palletsprojects.com/)
[![lucide-react](https://img.shields.io/badge/Lucide--React-0.14+-yellow.svg)](https://github.com/lucide-icons/lucide-react)
[![Python 3.7+](https://img.shields.io/badge/Python-3.7+-teal.svg)](https://www.python.org/downloads/release/python-390/)

## Description

MedEase: AI-Assisted Diagnostic Workflow is an innovative platform designed to streamline the workflow of emergency department physicians by reducing the time spent on data entry and increasing the focus on patient care. The website utilizes Retrieval-Augmented Generation Large Language Models (RAG-LLMs) integrated with medical databases to take patient medical data and generate a differential diagnosis.

By automating note-taking and reducing the number of manual entries required, MedEase enables physicians to quickly fill out relevant entry forms using the AI-generated outputs. This enhanced efficiency allows doctors to spend more time in direct patient care, potentially increasing hospital revenue while improving patient outcomes.

## Table of Contents

1. [Frontend](#frontend)
2. [Backend](#backend)
3. [Dependencies](#dependencies)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Downloading shadcn/ui files](#downloading-shadcnui-files)
7. [Contributing](#contributing)
8. [License](#license)

## Project Structure


```
EMR-Automatic/
├── backend/
│   ├── main.py
│   └── ... (other backend files)
├── frontend/
│   ├── src/
│   │   ├── srcForDashboard/
│   │   │   ├── pdf-upload.tsx
│   │   │   └── ... (other dashboard source files)
│   │   ├── styles/
│   │   │   ├── global.css
│   │   │   └── ... (other style files)
│   │   └── ... (other frontend source files)
│   ├── dashboard.astro
│   └── ... (other frontend files)
└── README.md
```

## Key Files

### backend/main.py:

The main backend file that sets up the Flask application, handles HTTP requests, and connects to the MongoDB database.

### frontend/src/srcForDashboard/pdf-upload.tsx:

A React component for uploading PDFs and selecting templates. It includes functionality for handling file uploads and displaying a list of templates.

### frontend/src/styles/global.css:

The global CSS file that contains styles applied across the entire frontend application.

### frontend/dashboard.astro:

The main dashboard file written in Astro. It sets up the HTML structure, imports necessary components and icons, and includes the navigation bar and sidebar for the dashboard.

## Dependencies

### Frontend

- [React](https://reactjs.org/)
- [Next.js](https://nextjs.org/)
- [lucide-react](https://github.com/lucide-icons/lucide-react)

### Backend

- [Flask](https://flask.palletsprojects.com/)
- [Flask-CORS](https://flask-cors.readthedocs.io/en/latest/)
- [PyMongo](https://pymongo.readthedocs.io/en/stable/)
- [Werkzeug](https://werkzeug.palletsprojects.com/en/2.0.x/)

## Installation

### Backend (Flask)

1. Clone the repository.
   ```bash
   git clone https://github.com/your-repository-name.git
   ```
2. Navigate to the backend directory and set up a virtual environment:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install the backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Frontend (Next.js)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

## Usage

### Running the Backend

1. Ensure the virtual environment is activated.
2. Run the Flask app:
   ```bash
   flask run
   ```

### Running the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Start the Next.js development server:
   ```bash
   npm run dev
   ```

## Downloading shadcn/ui files

To ensure that all UI elements are generated correctly using **shadcn/ui**, follow these steps:

1. Install the shadcn/ui package:
   ```bash
   npm install @shadcn/ui
   ```

2. Run the following command to generate the required UI components in your project:
   ```bash
   npx shadcn-ui init
   ```

3. Customize and build the components by running:
   ```bash
   npx shadcn-ui build
   ```

After following these steps, the **Button**, **Input**, **Progress**, and other UI components should be correctly configured.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.


