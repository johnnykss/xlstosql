<template>
  <converter-template
    :title="t('pages.excelToJPG.title')"
    :description="t('pages.excelToJPG.desc')"
    accept=".xlsx,.xls"
    :file-name="fileName"
    :show-convert-button="!!fileName"
    @file-change="handleFileUpload"
    @convert="convertToJPG"
  >
    <template #output>
      <div v-if="converting" class="status">{{ t('common.converting') }}...</div>
      <div v-if="imageUrl" class="preview">
        <img :src="imageUrl" alt="Preview" />
        <button @click="downloadImage" class="download-btn">{{ t('common.download') }}</button>
      </div>
    </template>
  </converter-template>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import * as XLSX from 'xlsx'
import html2canvas from 'html2canvas'
import ConverterTemplate from './ConverterTemplate.vue'

const { t } = useI18n()

const fileName = ref<string>('')
const converting = ref(false)
const excelData = ref<any[]>([])
const imageUrl = ref<string>('')

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  fileName.value = file.name

  const reader = new FileReader()
  reader.onload = (e) => {
    const data = new Uint8Array(e.target?.result as ArrayBuffer)
    const workbook = XLSX.read(data, { type: 'array' })
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
    excelData.value = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })
  }
  reader.readAsArrayBuffer(file)
}

const convertToJPG = async () => {
  if (!excelData.value.length) return

  converting.value = true

  try {
    const table = document.createElement('table')
    table.style.border = '1px solid black'
    table.style.borderCollapse = 'collapse'

    excelData.value.forEach(row => {
      const tr = table.insertRow()
      row.forEach((cell: any) => {
        const td = tr.insertCell()
        td.textContent = String(cell || '')
        td.style.border = '1px solid black'
        td.style.padding = '8px'
      })
    })

    document.body.appendChild(table)
    const canvas = await html2canvas(table)
    document.body.removeChild(table)

    imageUrl.value = canvas.toDataURL('image/jpeg', 0.95)
  } finally {
    converting.value = false
  }
}

const downloadImage = () => {
  const a = document.createElement('a')
  a.href = imageUrl.value
  a.download = fileName.value.replace(/\.[^/.]+$/, '') + '.jpg'
  a.click()
}
</script>

<style scoped>
.status {
  margin-top: 2rem;
  padding: 1rem;
  background-color: rgba(100, 108, 255, 0.1);
  border-radius: 8px;
  color: #646cff;
}

.preview {
  margin-top: 2rem;
}

.preview img {
  max-width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.download-btn {
  margin-top: 1rem;
  padding: 0.8rem 2rem;
  background-color: #646cff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.download-btn:hover {
  background-color: #535bf2;
}
</style>
