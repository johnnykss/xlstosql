# File Converter Suite

Multi-format file converter built with Vue 3

A comprehensive Vue.js 3 application built with TypeScript and Vite for converting between multiple file formats including Excel, PDF, Word, and images.

## Available Converters

### Excel Converters
1. **Excel to SQL** - Convert Excel to SQL with automatic data type detection
   - Automatic column type detection (INT, BIGINT, DECIMAL, DATETIME, BOOLEAN, TEXT, VARCHAR)
   - Manual column type configuration
   - Generate CREATE TABLE and INSERT statements
   - Direct download option

2. **Excel to Word** - Convert Excel spreadsheets to Word documents
   - Preserves table structure
   - Direct download as .docx

3. **Excel to PDF** - Convert Excel to PDF documents
   - Table formatting preserved
   - Ready-to-print PDFs

4. **Excel to JPG** - Convert Excel to image format
   - Visual preview before download
   - High-quality image export

### PDF Converters
5. **PDF to Word** - Extract content from PDF to Word (Coming Soon)
6. **PDF to Excel** - Extract tables from PDF to Excel (Coming Soon)
7. **PDF to JPG** - Convert PDF pages to images (Coming Soon)

### Document Editor
8. **Word Editor** - Online Word document editor
   - Rich text editing
   - Format text (Bold, Italic, Underline)
   - Download as .docx

## General Features

- Multi-language support (English/Russian)
- Modern responsive UI with dark/light mode
- Client-side processing (no server uploads)
- Fast and secure conversions

## Tech Stack

- Vue 3 with Composition API & Vue Router
- TypeScript
- Vite
- XLSX library for Excel parsing
- jsPDF & jsPDF-AutoTable for PDF generation
- docx for Word document generation
- html2canvas for image conversion
- pdfjs-dist for PDF processing
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

1. Navigate to the desired converter using the top navigation menu
2. Upload your file using the file picker
3. Configure any available options (varies by converter)
4. Click convert/generate to process the file
5. Download the converted file

### Excel to SQL Specific
- Automatic data type detection
- Manual column type adjustment
- Supported types: VARCHAR, INT, BIGINT, DECIMAL, DATE, DATETIME, TEXT, BOOLEAN

## License

ISC
