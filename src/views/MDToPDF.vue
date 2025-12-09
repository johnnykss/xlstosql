<template>
  <div class="converter-page">
    <h1>{{ t('pages.mdToPDF.title') }}</h1>
    <p>{{ t('pages.mdToPDF.desc') }}</p>

    <div class="upload-section">
      <label class="file-input-label">
        <input type="file" @change="handleFileUpload" accept=".md,.markdown" class="file-input" />
        <span class="file-input-button">{{ t('common.chooseFile') }}</span>
      </label>
      <span v-if="fileName" class="file-name">{{ fileName }}</span>
    </div>

    <div v-if="isConverting" class="loading">
      {{ t('common.converting') }}...
    </div>

    <button
      v-if="markdownData"
      @click="convertToPDF"
      :disabled="isConverting"
      class="convert-btn"
    >
      {{ t('common.convert') }}
    </button>

    <div v-if="pdfUrl" class="preview-section">
      <h2>Preview:</h2>
      <embed :src="pdfUrl" type="application/pdf" width="100%" height="600px" />
      <a :href="pdfUrl" :download="pdfFileName" class="download-btn">
        {{ t('common.download') }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { marked } from 'marked'

const { t } = useI18n()

const fileName = ref<string>('')
const markdownData = ref<string>('')
const isConverting = ref<boolean>(false)
const pdfUrl = ref<string>('')
const pdfFileName = ref<string>('document.pdf')

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  fileName.value = file.name
  pdfFileName.value = file.name.replace(/\.[^/.]+$/, '') + '.pdf'
  isConverting.value = true

  try {
    const text = await file.text()
    markdownData.value = text

    // Clear previous PDF
    if (pdfUrl.value) {
      URL.revokeObjectURL(pdfUrl.value)
      pdfUrl.value = ''
    }
  } catch (error) {
    console.error('Error reading Markdown file:', error)
    alert('Failed to read Markdown file. Please make sure it\'s a valid .md file.')
  } finally {
    isConverting.value = false
  }

  // Reset file input
  target.value = ''
}

const convertToPDF = async () => {
  if (!markdownData.value) return

  isConverting.value = true

  try {
    // Convert Markdown to HTML
    const html = await marked.parse(markdownData.value)

    // Create a temporary div to extract text from HTML
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html
    const text = tempDiv.innerText

    // Create PDF document
    const pdfDoc = await PDFDocument.create()
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
    const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)
    const courierFont = await pdfDoc.embedFont(StandardFonts.Courier)

    // Page dimensions (A4)
    const pageWidth = 595.28
    const pageHeight = 841.89
    const margin = 50
    const fontSize = 12
    const lineHeight = fontSize * 1.5
    const maxLinesPerPage = Math.floor((pageHeight - 2 * margin) / lineHeight)

    let currentPage = pdfDoc.addPage([pageWidth, pageHeight])
    let yPosition = pageHeight - margin
    let lineCount = 0

    // Split text into lines
    const lines = text.split('\n')

    for (const line of lines) {
      if (lineCount >= maxLinesPerPage) {
        currentPage = pdfDoc.addPage([pageWidth, pageHeight])
        yPosition = pageHeight - margin
        lineCount = 0
      }

      // Handle long lines by wrapping
      const maxWidth = pageWidth - 2 * margin
      const words = line.split(' ')
      let currentLine = ''

      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word
        const textWidth = timesRomanFont.widthOfTextAtSize(testLine, fontSize)

        if (textWidth > maxWidth && currentLine) {
          currentPage.drawText(currentLine, {
            x: margin,
            y: yPosition,
            size: fontSize,
            font: timesRomanFont,
            color: rgb(0, 0, 0)
          })
          yPosition -= lineHeight
          lineCount++
          currentLine = word

          if (lineCount >= maxLinesPerPage) {
            currentPage = pdfDoc.addPage([pageWidth, pageHeight])
            yPosition = pageHeight - margin
            lineCount = 0
          }
        } else {
          currentLine = testLine
        }
      }

      if (currentLine) {
        currentPage.drawText(currentLine, {
          x: margin,
          y: yPosition,
          size: fontSize,
          font: timesRomanFont,
          color: rgb(0, 0, 0)
        })
        yPosition -= lineHeight
        lineCount++
      }
    }

    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })

    // Revoke previous URL if exists
    if (pdfUrl.value) {
      URL.revokeObjectURL(pdfUrl.value)
    }

    pdfUrl.value = URL.createObjectURL(blob)
  } catch (error) {
    console.error('Error converting to PDF:', error)
    alert('Failed to convert to PDF. Please try again.')
  } finally {
    isConverting.value = false
  }
}
</script>

<style scoped>
.converter-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #213547;
  margin-bottom: 0.5rem;
}

p {
  color: #646cff;
  margin-bottom: 1.5rem;
}

.upload-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
  flex-wrap: wrap;
}

.file-input-label {
  position: relative;
  display: inline-block;
}

.file-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.file-input-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #646cff;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: 500;
}

.file-input-button:hover {
  background-color: #5558dd;
}

.file-name {
  color: #42b983;
  font-weight: 500;
}

.loading {
  color: #646cff;
  font-style: italic;
  margin: 1rem 0;
}

.convert-btn {
  padding: 0.75rem 2rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.3s;
  margin: 1rem 0;
}

.convert-btn:hover:not(:disabled) {
  background-color: #33a372;
}

.convert-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.preview-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.preview-section h2 {
  color: #213547;
  margin-bottom: 1rem;
}

.preview-section embed {
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.download-btn {
  display: inline-block;
  padding: 0.75rem 2rem;
  background-color: #646cff;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.download-btn:hover {
  background-color: #5558dd;
}

@media (prefers-color-scheme: dark) {
  h1 {
    color: #fff;
  }

  p {
    color: #a3abff;
  }

  .preview-section {
    background-color: #2a2a2a;
  }

  .preview-section h2 {
    color: #fff;
  }

  .preview-section embed {
    border-color: #555;
  }
}
</style>
