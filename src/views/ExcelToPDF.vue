<template>
  <converter-template
    :title="t('pages.excelToPDF.title')"
    :description="t('pages.excelToPDF.desc')"
    accept=".xlsx,.xls"
    :file-name="fileName"
    :show-convert-button="!!fileName"
    @file-change="handleFileUpload"
    @convert="convertToPDF"
  >
    <template #output>
      <div v-if="converting" class="status">{{ t('common.converting') }}...</div>
    </template>
  </converter-template>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import ConverterTemplate from './ConverterTemplate.vue'

const { t } = useI18n()

const fileName = ref<string>('')
const converting = ref(false)
const excelData = ref<any[]>([])

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

const convertToPDF = async () => {
  if (!excelData.value.length) return

  converting.value = true

  try {
    const doc = new jsPDF()

    autoTable(doc, {
      head: [excelData.value[0]],
      body: excelData.value.slice(1)
    })

    doc.save(fileName.value.replace(/\.[^/.]+$/, '') + '.pdf')
  } finally {
    converting.value = false
  }
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
</style>
