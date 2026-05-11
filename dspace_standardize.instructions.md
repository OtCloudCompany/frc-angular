# dspace_standardize.py

A command-line tool for cleaning DSpace 9 metadata CSV files before batch import.
It standardizes quotation marks, dashes, and whitespace across all columns to ensure
consistent Solr indexing, correct faceted browsing, and OAI-PMH interoperability.

---

## Requirements

- Python 3.8 or later
- pandas library

Install the dependency with:

```bash
pip install pandas
```

---

## Basic Usage

```bash
python dspace_standardize.py -i input.csv -o output.csv
```

This runs all three cleaning steps (quotes, dashes, whitespace) and writes the
cleaned file to `output.csv`. The original file is never modified.

To also generate a row-level issues report:

```bash
python dspace_standardize.py -i input.csv -o output.csv --report issues.csv
```

---

## All Options

| Option | Required | Description |
|---|---|---|
| `-i` / `--input` | Yes | Path to the input CSV file |
| `-o` / `--output` | Yes | Path to write the cleaned CSV file |
| `--report PATH` | No | Write a row-level issues report to `PATH` |
| `--skip-quotes` | No | Skip curly quote normalization |
| `--skip-dashes` | No | Skip double-hyphen → em dash conversion |
| `--skip-whitespace` | No | Skip whitespace normalization |
| `--dash-cols` | No | Override the default dash target columns (comma-separated) |

---

## What It Fixes

### 1. Quotation Marks (all columns)

Converts all curly/smart quote variants to plain straight quotes. This ensures
consistent Solr indexing and avoids mixed-quote facet results in DSpace Discovery.

| Original character | Unicode | Replaced with |
|---|---|---|
| `"` left double curly | U+201C | `"` straight double (U+0022) |
| `"` right double curly | U+201D | `"` straight double (U+0022) |
| `„` double low-9 | U+201E | `"` straight double (U+0022) |
| `″` double prime | U+2033 | `"` straight double (U+0022) |
| `'` left single curly | U+2018 | `'` straight single (U+0027) |
| `'` right single curly | U+2019 | `'` straight single (U+0027) |
| `‚` single low-9 | U+201A | `'` straight single (U+0027) |
| `′` prime | U+2032 | `'` straight single (U+0027) |

> **Note:** The `§` section symbol and other legitimate legal characters are
> not affected by this step.

### 2. Dashes (text columns only)

Converts double hyphens (`--`) to em dashes (`—`). This corrects a common
artifact from typewriter-style text entry and copy-pasting from Word documents.

**Rules:**
- Only exactly two consecutive hyphens are converted. Sequences of three or
  more (`---`, `------`) are left untouched — these are often legal document
  placeholders or horizontal separators.
- En dashes (`–`) and em dashes (`—`) that are already correct are preserved.
- URL columns and provenance fields are excluded entirely.

**Default target columns:**
- `dc.description.abstract`
- `dc.description.lawtext`
- `dc.description.summary`
- `dc.title`

To target different columns, use `--dash-cols` (see [examples](#examples) below).

### 3. Whitespace (all columns)

Three whitespace issues are fixed:

| Issue | Example | Fixed result |
|---|---|---|
| Leading spaces | `·· An Act to...` | `An Act to...` |
| Trailing spaces | `An Act to··` | `An Act to` |
| Double (or more) internal spaces | `An··Act··to` | `An Act to` |

> Tabs and newlines embedded within field values are **not** removed, as these
> can be meaningful in multi-paragraph metadata fields like `dc.description.lawtext`.

---

## The Issues Report

When `--report` is specified, the script writes a CSV file listing every cell
that had a problem, with one row per issue type per cell. A single metadata cell
can produce multiple report rows if it has more than one type of issue.

### Report columns

| Column | Description |
|---|---|
| `row` | 1-based row number in the original file (row 1 is the first data row, not the header) |
| `column` | Dublin Core field name where the issue was found |
| `issue_type` | Type of issue detected (see table below) |
| `before` | Original cell value, truncated to 80 characters |
| `after` | Fixed cell value, truncated to 80 characters |

### Issue types

| Issue type | Meaning |
|---|---|
| `curly_quote` | Cell contained one or more curly/smart quote characters |
| `double_hyphen` | Cell contained `--` in a dash target column |
| `leading_space` | Cell value started with one or more spaces or newlines |
| `trailing_space` | Cell value ended with one or more spaces or newlines |
| `double_space` | Cell contained two or more consecutive spaces internally |
| `other` | Cell changed for a reason not matching the above categories |

### Filtering the report

Open the report in Excel and use column filters on `issue_type` or `column`
to focus on specific problems. Or use Python:

```python
import pandas as pd

report = pd.read_csv('issues.csv')

# Show only double-hyphen rows (for manual review)
print(report[report['issue_type'] == 'double_hyphen'])

# Show all issues in a specific column
print(report[report['column'] == 'dc.description.lawtext'])

# Count issues by type
print(report['issue_type'].value_counts())

# Show all rows that had more than one issue type
multi = report.groupby('row').filter(lambda x: len(x) > 1)
print(multi)
```

---

## Examples

**Standard run — clean and report:**
```bash
python dspace_standardize.py -i metadata.csv -o metadata_clean.csv --report issues.csv
```

**Skip dash conversion** (e.g. for a non-legal collection where `--` is intentional):
```bash
python dspace_standardize.py -i metadata.csv -o metadata_clean.csv --skip-dashes
```

**Skip whitespace normalization** (e.g. if your provenance fields use spacing intentionally):
```bash
python dspace_standardize.py -i metadata.csv -o metadata_clean.csv --skip-whitespace
```

**Skip the mojibake-like fixes entirely and only clean whitespace:**
```bash
python dspace_standardize.py -i metadata.csv -o metadata_clean.csv --skip-quotes --skip-dashes
```

**Target a custom set of columns for dash normalization:**
```bash
python dspace_standardize.py -i metadata.csv -o metadata_clean.csv \
  --dash-cols "dc.description.abstract,dc.description.notes,dc.description.sponsorship"
```

---

## Console Output

The script prints a structured summary to the terminal at each stage. Example:

```
────────────────────────────────────────────────────────────
  Loading
────────────────────────────────────────────────────────────
  File    : metadata.csv
  Rows    : 2666
  Columns : 26

────────────────────────────────────────────────────────────
  Before
────────────────────────────────────────────────────────────
  Curly quotes (all columns)         : 79
  Double hyphens (text columns only) : 18
  Whitespace issues (all columns)    : 2911

────────────────────────────────────────────────────────────
  Processing
────────────────────────────────────────────────────────────
  Curly quotes -> straight quotes (all columns)
  Double hyphens -> em dashes (4 column(s))
    Columns: dc.description.abstract, dc.description.lawtext, ...
  Leading/trailing/double spaces removed (all columns)

────────────────────────────────────────────────────────────
  Summary
────────────────────────────────────────────────────────────
  Curly quotes replaced        : 79
  Double hyphens converted     : 10
  Whitespace issues fixed      : 2911
  Curly quotes remaining       : 0
  Double hyphens remaining     : 8  <- expected (placeholders/URLs)
  Whitespace issues remaining  : 0
  Columns changed              : 8
```

The "remaining" double hyphens figure will almost always be greater than zero.
This is expected — it reflects legal placeholders (`------`) and `--` inside
URLs, both of which are intentionally left unchanged.

---

## Recommended Workflow

1. **Back up your original CSV** before running the script.
2. **Verify encoding** — confirm the file is UTF-8 before processing:
   ```bash
   file -i metadata.csv          # Linux / macOS
   ```
   If it is not UTF-8 (e.g. Windows-1252), convert it first:
   ```bash
   iconv -f LATIN1 -t UTF-8 metadata.csv > metadata_utf8.csv
   ```
3. **Run with `--report`** on the first pass to review what will change.
4. **Inspect the report** — pay particular attention to `double_hyphen` rows
   in legal text columns to confirm they are genuine em-dash substitutes and
   not intentional formatting.
5. **Run the cleaning** once satisfied, producing the final output CSV.
6. **Validate** with the [ILRI csv-metadata-quality](https://github.com/ilri/csv-metadata-quality)
   tool (run without `--unsafe-fixes` to preserve `§` and other valid legal symbols).
7. **Test import** on a staging DSpace 9 instance before importing to production.

---

## What the Script Does Not Fix

The following issues are out of scope and should be addressed separately or
with the ILRI csv-metadata-quality tool:

- Mojibake characters (garbled text from encoding mismatches) — use ILRI tool
  with `--unsafe-fixes` carefully, or fix encoding at the source
- Duplicate metadata values within a field
- Invalid ISBNs, ISSNs, or DOIs
- Missing mandatory fields (e.g. `dc.title`)
- Invalid date formats
- Non-breaking spaces (U+00A0) — not currently detected

---

## Licence

MIT — free to use, modify, and distribute.
