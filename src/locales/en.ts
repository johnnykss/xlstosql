export default {
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
  }
}
