import csv
import json
from pathlib import Path

# Path to the input CSV file containing customer data
input_path = Path('امال جدول.csv')
output_path = Path('customer_data.json')

rows = []
with input_path.open('r', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        rows.append(row)

with output_path.open('w', encoding='utf-8') as jsonfile:
    json.dump(rows, jsonfile, ensure_ascii=False, indent=2)

print(f"Converted {len(rows)} rows to {output_path}")
