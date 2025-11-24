# xlstosql

Vue 3 Converter Excel to SQL

A modern Vue.js 3 application built with TypeScript and Vite for converting Excel files to SQL statements. Users can upload Excel files, configure column data types, and generate CREATE TABLE and INSERT statements.

## Features

- Upload Excel files (.xlsx, .xls)
- Automatic data type detection for columns (INT, BIGINT, DECIMAL, DATETIME, BOOLEAN, TEXT, VARCHAR)
- Manual column type configuration
- Custom table naming
- Generate CREATE TABLE statements
- Generate INSERT statements with proper value escaping
- Copy to clipboard functionality
- Download generated SQL files
- Direct download option (generate and download without preview)
- Multi-language support (English/Russian)
- Modern UI with dark/light mode support

## Tech Stack

- Vue 3 with Composition API
- TypeScript
- Vite
- XLSX library for Excel parsing
- Vue I18n for internationalization

## Installation

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Type Checking

Run TypeScript type checking:

```bash
npm run type-check
```

## Usage

1. Click the file input to select an Excel file
2. The application will automatically detect columns and their data types
3. Review and adjust data types if needed
4. Set the desired table name
5. Click "Generate SQL" to view the SQL statements, or "Generate and Download" to download directly
6. Copy to clipboard or download the generated SQL file

## Column Types Supported

- VARCHAR(255)
- INT
- BIGINT
- DECIMAL(10,2)
- DATE
- DATETIME
- TEXT
- BOOLEAN

## License

ISC
