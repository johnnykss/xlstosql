<template>
  <converter-template
    :title="t('pages.excelToWord.title')"
    :description="t('pages.excelToWord.desc')"
    accept=".xlsx,.xls"
    :file-name="fileName"
    :show-convert-button="!!fileName"
    @file-change="handleFileUpload"
    @convert="convertToWord"
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
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun } from 'docx'
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

const convertToWord = async () => {
  if (!excelData.value.length) return

  converting.value = true

  try {
    const rows = excelData.value.map((row: any[]) =>
      new TableRow({
        children: row.map((cell: any) =>
          new TableCell({
            children: [new Paragraph(String(cell || ''))]
          })
        )
      })
    )

    const table = new Table({ rows })

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ children: [new TextRun({ text: 'Excel Data', bold: true, size: 28 })] }),
          table
        ]
      }]
    })

    const blob = await Packer.toBlob(doc)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName.value.replace(/\.[^/.]+$/, '') + '.docx'
    a.click()
    window.URL.revokeObjectURL(url)
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
