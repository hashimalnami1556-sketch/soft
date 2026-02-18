# Soft Data Repository

This repository archives a collection of CSV, Excel, and Microsoft Access database files. The data appears to cover financial or import records with file names primarily in Arabic. The project aims to make these raw datasets available for analysis and processing.

## Repository Structure

All files are stored in the repository root. The most common groups are:

- `Sheet*.csv` – CSV exports of individual sheets.
- `Book *.xlsx` and other `*.xlsx` files – original Excel workbooks.
- `*.accdb` – Microsoft Access databases.
- Auxiliary files such as logs (`OneDriveOrganize.log`) and Zip archives.

Add or update files by placing them in the root directory and committing them.

## Working With the Data

### Spreadsheet files (`.csv`, `.xlsx`)
You can open these files with Microsoft Excel, LibreOffice Calc, or any tool that supports CSV/Excel formats.

For programmatic access in Python:

```bash
pip install pandas openpyxl
```

```python
import pandas as pd

# CSV example
df = pd.read_csv("Sheet431.csv")

# Excel example
wb = pd.read_excel("Book 14.xlsx")
```

### Access databases (`.accdb`)
To open Access files, use Microsoft Access or connect programmatically using `pyodbc` with the [Microsoft Access Database Engine](https://learn.microsoft.com/en-us/office/troubleshoot/access/database-engine-installation).

## Setup

No project-specific setup is required. Install the tools you need to inspect or analyze the data:

- [Python](https://www.python.org/) 3.10+
- [pandas](https://pandas.pydata.org/) for handling CSV/Excel files
- [openpyxl](https://openpyxl.readthedocs.io/) for Excel support
- [pyodbc](https://github.com/mkleehammer/pyodbc) and the [Access Database Engine](https://learn.microsoft.com/en-us/office/troubleshoot/access/database-engine-installation) for `.accdb` files.

## Handwriting Cleanup App (Google Vision API)

This repository includes `vision.html` plus a Node.js proxy (`server.js`) for OCR with Google Vision API.

### Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start server (recommended with env key):
   ```bash
   export GOOGLE_VISION_API_KEY="YOUR_KEY"
   npm start
   ```
3. Open:
   ```bash
   http://localhost:8000/vision.html
   ```

### Connection modes in UI

- `auto`: checks local server first, then falls back to direct Google call.
- `proxy`: forces `/api/vision`.
- `direct`: calls Google Vision from browser and requires form API key.

Notes:
- UI is self-styled with local CSS (no Tailwind CDN dependency), so it renders correctly even with restricted internet.
- Do not open `vision.html` via `file://` when using `auto/proxy`.
- If no server key is configured, you can still paste API key in the form.

### Build executable (.exe)

You can package the app as a standalone executable using [`pkg`](https://www.npmjs.com/package/pkg).

1. Install dependencies (includes `pkg`):
   ```bash
   npm install
   ```
2. Build Windows `.exe`:
   ```bash
   npm run build:win-exe
   ```
3. Output file:
   ```bash
   dist/vision-app.exe
   ```

Optional Linux build:
```bash
npm run build:linux-bin
```


## Purpose

The repository serves as a shared data drop for spreadsheet-based financial and import records. Contributors can upload new data files or process existing ones for reporting and analysis.
