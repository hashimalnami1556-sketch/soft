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

## Purpose

The repository serves as a shared data drop for spreadsheet-based financial and import records. Contributors can upload new data files or process existing ones for reporting and analysis.

