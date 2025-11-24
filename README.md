# xlstosql

Vue 3 Converter Excel to SQL

A modern Vue.js 3 application built with TypeScript and Vite for converting Excel files to SQL statements. Users can upload Excel files, configure column data types, and generate CREATE TABLE and INSERT statements.

## Features

- Upload Excel files (.xlsx, .xls)
- Automatic column detection
- Manual column type configuration (VARCHAR, INT, DECIMAL, DATE, etc.)
- Custom table naming
- Generate CREATE TABLE statements
- Generate INSERT statements with proper value escaping
- Copy to clipboard functionality
- Download generated SQL files
- Modern UI with dark/light mode support

## Tech Stack

- Vue 3 with Composition API
- TypeScript
- Vite
- XLSX library for Excel parsing

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
2. The application will automatically detect columns
3. Configure the data type for each column
4. Set the desired table name
5. Click "Generate SQL" to create the SQL statements
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
