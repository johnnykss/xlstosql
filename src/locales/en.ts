export default {
  appTitle: 'File Converter Suite',
  title: 'Excel to SQL Converter',
  subtitle: 'Upload an Excel file to convert it to SQL statements with automatic data type detection',
  uploadFile: 'Choose File',
  configureColumns: 'Configure Column Types',
  tableName: 'Table Name',
  tableNamePlaceholder: 'my_table',
  generateSQL: 'Generate SQL',
  generateAndDownload: 'Generate and Download',
  generatedSQL: 'Generated SQL',
  copyToClipboard: 'Copy to Clipboard',
  downloadSQL: 'Download SQL File',
  copiedSuccess: 'SQL copied to clipboard!',
  columnTypes: {
    varchar: 'VARCHAR(255)',
    int: 'INT',
    bigint: 'BIGINT',
    decimal: 'DECIMAL(10,2)',
    date: 'DATE',
    datetime: 'DATETIME',
    text: 'TEXT',
    boolean: 'BOOLEAN'
  },
  themes: {
    light: 'Light Theme',
    dark: 'Dark Theme',
    warm: 'Warm Theme',
    cold: 'Cold Theme'
  },
  nav: {
    excelToSQL: 'Excel → SQL',
    excelToWord: 'Excel → Word',
    excelToPDF: 'Excel → PDF',
    excelToJPG: 'Excel → JPG',
    pdfToWord: 'PDF → Word',
    pdfToExcel: 'PDF → Excel',
    pdfToJPG: 'PDF → JPG',
    wordToPDF: 'Word → PDF',
    wordToJPG: 'Word → JPG',
    wordEditor: 'Word Editor',
    pdfEditor: 'PDF Editor'
  },
  common: {
    chooseFile: 'Choose File',
    convert: 'Convert',
    download: 'Download',
    converting: 'Converting',
    featureComingSoon: 'This feature is coming soon! Full implementation in progress.'
  },
  pages: {
    excelToWord: {
      title: 'Excel to Word Converter',
      desc: 'Convert Excel spreadsheets to Word documents'
    },
    excelToPDF: {
      title: 'Excel to PDF Converter',
      desc: 'Convert Excel spreadsheets to PDF documents'
    },
    excelToJPG: {
      title: 'Excel to JPG Converter',
      desc: 'Convert Excel spreadsheets to JPG images'
    },
    pdfToWord: {
      title: 'PDF to Word Converter',
      desc: 'Convert PDF documents to Word format'
    },
    pdfToExcel: {
      title: 'PDF to Excel Converter',
      desc: 'Extract tables from PDF to Excel'
    },
    pdfToJPG: {
      title: 'PDF to JPG Converter',
      desc: 'Convert PDF pages to JPG images'
    },
    wordEditor: {
      title: 'Online Word Editor',
      desc: 'Edit and create Word documents online',
      placeholder: 'Start typing your document here...',
      uploadFile: 'Upload .docx File',
      newDocument: 'New Document',
      confirmClear: 'Are you sure you want to clear the document and start a new one?'
    },
    pdfEditor: {
      title: 'Online PDF Editor',
      desc: 'Edit and create PDF documents online',
      placeholder: 'Start typing your document here...',
      uploadFile: 'Upload PDF File',
      newDocument: 'New Document',
      confirmClear: 'Are you sure you want to clear the document and start a new one?',
      emptyDocument: 'No text found in PDF'
    },
    wordToPDF: {
      title: 'Word to PDF Converter',
      desc: 'Convert Word documents to PDF format'
    },
    wordToJPG: {
      title: 'Word to JPG Converter',
      desc: 'Convert Word documents to JPG images'
    }
  }
}
