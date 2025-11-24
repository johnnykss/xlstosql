<template>
  <div class="container">
    <div class="language-switcher">
      <button
        @click="switchLanguage('en')"
        :class="{ active: locale === 'en' }"
        class="lang-btn"
      >
        EN
      </button>
      <button
        @click="switchLanguage('ru')"
        :class="{ active: locale === 'ru' }"
        class="lang-btn"
      >
        RU
      </button>
    </div>

    <h1>{{ t('title') }}</h1>
    <p>{{ t('subtitle') }}</p>

    <div class="upload-section">
      <input
        type="file"
        @change="handleFileUpload"
        accept=".xlsx,.xls"
        ref="fileInput"
      />
    </div>

    <div v-if="columns.length > 0" class="column-config">
      <h2>{{ t('configureColumns') }}</h2>
      <div class="columns-grid">
        <div v-for="(col, index) in columns" :key="index" class="column-item">
          <label>{{ col.name }}</label>
          <select v-model="col.type">
            <option value="VARCHAR(255)">{{ t('columnTypes.varchar') }}</option>
            <option value="INT">{{ t('columnTypes.int') }}</option>
            <option value="BIGINT">{{ t('columnTypes.bigint') }}</option>
            <option value="DECIMAL(10,2)">{{ t('columnTypes.decimal') }}</option>
            <option value="DATE">{{ t('columnTypes.date') }}</option>
            <option value="DATETIME">{{ t('columnTypes.datetime') }}</option>
            <option value="TEXT">{{ t('columnTypes.text') }}</option>
            <option value="BOOLEAN">{{ t('columnTypes.boolean') }}</option>
          </select>
        </div>
      </div>

      <div class="table-name-section">
        <label for="tableName">{{ t('tableName') }}:</label>
        <input
          id="tableName"
          v-model="tableName"
          type="text"
          :placeholder="t('tableNamePlaceholder')"
        />
      </div>

      <div class="button-group">
        <button @click="generateSQL" class="generate-btn">{{ t('generateSQL') }}</button>
        <button @click="generateAndDownload" class="generate-btn secondary">{{ t('generateAndDownload') }}</button>
      </div>
    </div>

    <div v-if="sqlOutput" class="output">
      <h2>{{ t('generatedSQL') }}</h2>
      <div class="sql-actions">
        <button @click="copyToClipboard">{{ t('copyToClipboard') }}</button>
        <button @click="downloadSQL">{{ t('downloadSQL') }}</button>
      </div>
      <pre>{{ sqlOutput }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import * as XLSX from 'xlsx'

interface Column {
  name: string
  type: string
}

const { t, locale } = useI18n()

const fileInput = ref<HTMLInputElement | null>(null)
const columns = ref<Column[]>([])
const tableName = ref<string>('my_table')
const sqlOutput = ref<string>('')
const excelData = ref<any[]>([])

const switchLanguage = (lang: string) => {
  locale.value = lang
  localStorage.setItem('language', lang)
}

const detectColumnType = (columnName: string, data: any[]): string => {
  const values = data.map(row => row[columnName]).filter(val => val !== null && val !== undefined && val !== '')

  if (values.length === 0) return 'VARCHAR(255)'

  let hasDate = false
  let hasDecimal = false
  let hasInteger = false
  let hasBoolean = false
  let maxLength = 0

  for (const value of values) {
    const strValue = String(value)
    maxLength = Math.max(maxLength, strValue.length)

    // Check for boolean
    if (strValue.toLowerCase() === 'true' || strValue.toLowerCase() === 'false' || value === 0 || value === 1) {
      if (typeof value === 'boolean' || (typeof value === 'number' && (value === 0 || value === 1))) {
        hasBoolean = true
        continue
      }
    }

    // Check for date
    if (value instanceof Date || !isNaN(Date.parse(strValue))) {
      const date = new Date(value)
      if (date.toString() !== 'Invalid Date' && strValue.includes('-') || strValue.includes('/')) {
        hasDate = true
        continue
      }
    }

    // Check for number
    if (typeof value === 'number' || !isNaN(Number(strValue))) {
      const num = Number(value)
      if (Number.isInteger(num)) {
        hasInteger = true
        if (Math.abs(num) > 2147483647) {
          return 'BIGINT'
        }
      } else {
        hasDecimal = true
      }
      continue
    }
  }

  // Determine the best type
  if (hasBoolean && values.length === values.filter(v => {
    const str = String(v).toLowerCase()
    return str === 'true' || str === 'false' || v === 0 || v === 1
  }).length) {
    return 'BOOLEAN'
  }

  if (hasDate) {
    return 'DATETIME'
  }

  if (hasDecimal) {
    return 'DECIMAL(10,2)'
  }

  if (hasInteger) {
    return 'INT'
  }

  if (maxLength > 255) {
    return 'TEXT'
  }

  return 'VARCHAR(255)'
}

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
        type: detectColumnType(key, jsonData)
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
    alert(t('copiedSuccess'))
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

const generateAndDownload = () => {
  if (columns.value.length === 0 || excelData.value.length === 0) return

  const createTableSQL = generateCreateTableSQL()
  const insertSQL = generateInsertSQL()
  const sql = `${createTableSQL}\n\n${insertSQL}`

  const blob = new Blob([sql], { type: 'text/plain' })
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

.language-switcher {
  position: absolute;
  top: 2rem;
  right: 2rem;
  display: flex;
  gap: 0.5rem;
}

.lang-btn {
  padding: 0.4rem 1rem;
  border-radius: 4px;
  border: 1px solid #646cff;
  background-color: transparent;
  color: inherit;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.lang-btn:hover {
  background-color: rgba(100, 108, 255, 0.1);
}

.lang-btn.active {
  background-color: #646cff;
  color: white;
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

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.generate-btn {
  background-color: #646cff;
  color: white;
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
}

.generate-btn:hover {
  background-color: #535bf2;
}

.generate-btn.secondary {
  background-color: #42b983;
}

.generate-btn.secondary:hover {
  background-color: #33a372;
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
