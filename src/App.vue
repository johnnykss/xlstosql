<template>
  <div class="container">
    <h1>Excel to SQL Converter</h1>
    <p>Upload an Excel file to convert it to SQL statements</p>

    <div class="upload-section">
      <input
        type="file"
        @change="handleFileUpload"
        accept=".xlsx,.xls"
        ref="fileInput"
      />
    </div>

    <div v-if="columns.length > 0" class="column-config">
      <h2>Configure Column Types</h2>
      <div class="columns-grid">
        <div v-for="(col, index) in columns" :key="index" class="column-item">
          <label>{{ col.name }}</label>
          <select v-model="col.type">
            <option value="VARCHAR(255)">VARCHAR(255)</option>
            <option value="INT">INT</option>
            <option value="BIGINT">BIGINT</option>
            <option value="DECIMAL(10,2)">DECIMAL(10,2)</option>
            <option value="DATE">DATE</option>
            <option value="DATETIME">DATETIME</option>
            <option value="TEXT">TEXT</option>
            <option value="BOOLEAN">BOOLEAN</option>
          </select>
        </div>
      </div>

      <div class="table-name-section">
        <label for="tableName">Table Name:</label>
        <input
          id="tableName"
          v-model="tableName"
          type="text"
          placeholder="my_table"
        />
      </div>

      <button @click="generateSQL" class="generate-btn">Generate SQL</button>
    </div>

    <div v-if="sqlOutput" class="output">
      <h2>Generated SQL</h2>
      <div class="sql-actions">
        <button @click="copyToClipboard">Copy to Clipboard</button>
        <button @click="downloadSQL">Download SQL File</button>
      </div>
      <pre>{{ sqlOutput }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import * as XLSX from 'xlsx'

interface Column {
  name: string
  type: string
}

const fileInput = ref<HTMLInputElement | null>(null)
const columns = ref<Column[]>([])
const tableName = ref<string>('my_table')
const sqlOutput = ref<string>('')
const excelData = ref<any[]>([])

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  const reader = new FileReader()

  reader.onload = (e) => {
    const data = new Uint8Array(e.target?.result as ArrayBuffer)
    const workbook = XLSX.read(data, { type: 'array' })

    const firstSheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[firstSheetName]

    const jsonData = XLSX.utils.sheet_to_json(worksheet)
    excelData.value = jsonData

    if (jsonData.length > 0) {
      const firstRow = jsonData[0] as Record<string, any>
      columns.value = Object.keys(firstRow).map(key => ({
        name: key,
        type: 'VARCHAR(255)'
      }))
    }
  }

  reader.readAsArrayBuffer(file)
}

const generateSQL = () => {
  if (columns.value.length === 0 || excelData.value.length === 0) return

  const createTableSQL = generateCreateTableSQL()
  const insertSQL = generateInsertSQL()

  sqlOutput.value = `${createTableSQL}\n\n${insertSQL}`
}

const generateCreateTableSQL = (): string => {
  const columnDefinitions = columns.value
    .map(col => `  ${sanitizeColumnName(col.name)} ${col.type}`)
    .join(',\n')

  return `CREATE TABLE ${sanitizeTableName(tableName.value)} (\n${columnDefinitions}\n);`
}

const generateInsertSQL = (): string => {
  const columnNames = columns.value
    .map(col => sanitizeColumnName(col.name))
    .join(', ')

  const insertStatements = excelData.value.map(row => {
    const values = columns.value
      .map(col => {
        const value = row[col.name]
        return formatValue(value, col.type)
      })
      .join(', ')

    return `INSERT INTO ${sanitizeTableName(tableName.value)} (${columnNames}) VALUES (${values});`
  })

  return insertStatements.join('\n')
}

const formatValue = (value: any, type: string): string => {
  if (value === null || value === undefined || value === '') {
    return 'NULL'
  }

  if (type.includes('VARCHAR') || type.includes('TEXT') || type.includes('DATE')) {
    return `'${String(value).replace(/'/g, "''")}'`
  }

  return String(value)
}

const sanitizeColumnName = (name: string): string => {
  return name.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase()
}

const sanitizeTableName = (name: string): string => {
  return name.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase()
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(sqlOutput.value)
    alert('SQL copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const downloadSQL = () => {
  const blob = new Blob([sqlOutput.value], { type: 'text/plain' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${tableName.value}.sql`
  a.click()
  window.URL.revokeObjectURL(url)
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #646cff;
  margin-bottom: 0.5rem;
}

.upload-section {
  margin: 2rem 0;
}

.column-config {
  margin: 2rem 0;
  padding: 1.5rem;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.columns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.column-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.column-item label {
  font-weight: bold;
  text-align: left;
}

.column-item select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #646cff;
  background-color: #1a1a1a;
  color: inherit;
}

.table-name-section {
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
}

.table-name-section input {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #646cff;
  background-color: #1a1a1a;
  color: inherit;
  min-width: 200px;
}

.generate-btn {
  margin-top: 1rem;
  background-color: #646cff;
  color: white;
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
}

.generate-btn:hover {
  background-color: #535bf2;
}

.sql-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.output {
  margin-top: 2rem;
}

.output pre {
  text-align: left;
  font-size: 0.9rem;
  line-height: 1.5;
}

@media (prefers-color-scheme: light) {
  .column-item select,
  .table-name-section input {
    background-color: white;
    color: #213547;
  }
}
</style>
