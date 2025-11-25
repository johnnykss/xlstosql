<template>
  <div class="pdf-editor-page">
    <h1>{{ t('pages.pdfEditor.title') }}</h1>
    <p>{{ t('pages.pdfEditor.desc') }}</p>

    <div class="file-controls">
      <label class="upload-btn">
        <input
          type="file"
          accept=".pdf"
          @change="handleFileUpload"
          style="display: none"
        />
        <span>📁 {{ t('pages.pdfEditor.uploadFile') }}</span>
      </label>
      <span v-if="fileName" class="file-name">{{ fileName }}</span>
      <button v-if="fileName" @click="clearDocument" class="clear-btn">
        {{ t('pages.pdfEditor.newDocument') }}
      </button>
    </div>

    <div class="editor-toolbar">
      <!-- Text Style -->
      <div class="toolbar-group">
        <button @click="applyFormat('bold')" class="tool-btn" title="Bold">
          <strong>B</strong>
        </button>
        <button @click="applyFormat('italic')" class="tool-btn" title="Italic">
          <em>I</em>
        </button>
        <button @click="applyFormat('underline')" class="tool-btn" title="Underline">
          <u>U</u>
        </button>
        <button @click="applyFormat('strikeThrough')" class="tool-btn" title="Strikethrough">
          <s>S</s>
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- Font Size -->
      <div class="toolbar-group">
        <select @change="applyFontSize" class="font-size-select">
          <option value="1">Small</option>
          <option value="3" selected>Normal</option>
          <option value="5">Large</option>
          <option value="7">Huge</option>
        </select>
      </div>

      <div class="toolbar-divider"></div>

      <!-- Headings -->
      <div class="toolbar-group">
        <button @click="applyHeading('h1')" class="tool-btn" title="Heading 1">
          H1
        </button>
        <button @click="applyHeading('h2')" class="tool-btn" title="Heading 2">
          H2
        </button>
        <button @click="applyHeading('h3')" class="tool-btn" title="Heading 3">
          H3
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- Alignment -->
      <div class="toolbar-group">
        <button @click="applyFormat('justifyLeft')" class="tool-btn" title="Align Left">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <rect x="2" y="3" width="10" height="1.5"/>
            <rect x="2" y="6.5" width="12" height="1.5"/>
            <rect x="2" y="10" width="8" height="1.5"/>
          </svg>
        </button>
        <button @click="applyFormat('justifyCenter')" class="tool-btn" title="Align Center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <rect x="3" y="3" width="10" height="1.5"/>
            <rect x="2" y="6.5" width="12" height="1.5"/>
            <rect x="4" y="10" width="8" height="1.5"/>
          </svg>
        </button>
        <button @click="applyFormat('justifyRight')" class="tool-btn" title="Align Right">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <rect x="4" y="3" width="10" height="1.5"/>
            <rect x="2" y="6.5" width="12" height="1.5"/>
            <rect x="6" y="10" width="8" height="1.5"/>
          </svg>
        </button>
        <button @click="applyFormat('justifyFull')" class="tool-btn" title="Justify">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <rect x="2" y="3" width="12" height="1.5"/>
            <rect x="2" y="6.5" width="12" height="1.5"/>
            <rect x="2" y="10" width="12" height="1.5"/>
          </svg>
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- Lists -->
      <div class="toolbar-group">
        <button @click="applyFormat('insertUnorderedList')" class="tool-btn" title="Bullet List">
          • List
        </button>
        <button @click="applyFormat('insertOrderedList')" class="tool-btn" title="Numbered List">
          1. List
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- Colors -->
      <div class="toolbar-group">
        <label class="color-picker-label">
          <input
            type="color"
            @change="applyColor($event, 'foreColor')"
            class="color-input"
            title="Text Color"
          />
          <span class="color-btn">A</span>
        </label>
        <label class="color-picker-label">
          <input
            type="color"
            @change="applyColor($event, 'hiliteColor')"
            class="color-input"
            title="Highlight"
          />
          <span class="color-btn" style="background: linear-gradient(to bottom, transparent 50%, yellow 50%)">A</span>
        </label>
      </div>

      <div class="toolbar-divider"></div>

      <!-- Additional -->
      <div class="toolbar-group">
        <button @click="applyFormat('superscript')" class="tool-btn" title="Superscript">
          x²
        </button>
        <button @click="applyFormat('subscript')" class="tool-btn" title="Subscript">
          x₂
        </button>
        <button @click="applyFormat('insertHorizontalRule')" class="tool-btn" title="Horizontal Line">
          ―
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- Indent -->
      <div class="toolbar-group">
        <button @click="applyFormat('indent')" class="tool-btn" title="Indent">
          →
        </button>
        <button @click="applyFormat('outdent')" class="tool-btn" title="Outdent">
          ←
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- Undo/Redo -->
      <div class="toolbar-group">
        <button @click="applyFormat('undo')" class="tool-btn" title="Undo">
          ↶
        </button>
        <button @click="applyFormat('redo')" class="tool-btn" title="Redo">
          ↷
        </button>
      </div>
    </div>

    <div
      ref="editor"
      class="editor"
      contenteditable="true"
      @input="handleInput"
      :placeholder="t('pages.pdfEditor.placeholder')"
    ></div>

    <button @click="downloadDocument" class="download-btn">
      {{ t('common.download') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
// @ts-ignore
import * as pdfjsLib from 'pdfjs-dist/build/pdf'
// @ts-ignore
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

const { t } = useI18n()

const editor = ref<HTMLElement | null>(null)
const content = ref<string>('')
const fileName = ref<string>('')

const handleInput = () => {
  if (editor.value) {
    content.value = editor.value.innerHTML
  }
}

const applyFormat = (command: string) => {
  document.execCommand(command, false)
  editor.value?.focus()
}

const applyHeading = (tag: string) => {
  document.execCommand('formatBlock', false, tag)
  editor.value?.focus()
}

const applyFontSize = (event: Event) => {
  const target = event.target as HTMLSelectElement
  document.execCommand('fontSize', false, target.value)
  editor.value?.focus()
}

const applyColor = (event: Event, command: string) => {
  const target = event.target as HTMLInputElement
  const color = target.value
  document.execCommand(command, false, color)
  editor.value?.focus()
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  fileName.value = file.name

  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

    let fullText = ''

    // Extract text from all pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items.map((item: any) => item.str).join(' ')
      fullText += `<p>${pageText}</p>`

      if (i < pdf.numPages) {
        fullText += '<hr style="margin: 2rem 0; border: 1px solid #ddd;">'
      }
    }

    if (editor.value) {
      editor.value.innerHTML = fullText || `<p>${t('pages.pdfEditor.emptyDocument')}</p>`
      content.value = editor.value.innerHTML
    }
  } catch (error) {
    console.error('Error loading PDF:', error)
    alert('Failed to load PDF. Please make sure it\'s a valid PDF file.')
  }

  // Reset file input
  target.value = ''
}

const clearDocument = () => {
  if (confirm(t('pages.pdfEditor.confirmClear'))) {
    if (editor.value) {
      editor.value.innerHTML = ''
      content.value = ''
    }
    fileName.value = ''
  }
}

const downloadDocument = async () => {
  const text = editor.value?.innerText || t('pages.pdfEditor.placeholder')

  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create()
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)

    // Split text into lines and pages
    const lines = text.split('\n')
    const pageWidth = 595.28 // A4 width in points
    const pageHeight = 841.89 // A4 height in points
    const margin = 50
    const fontSize = 12
    const lineHeight = fontSize * 1.5
    const maxLinesPerPage = Math.floor((pageHeight - 2 * margin) / lineHeight)

    let currentPage = pdfDoc.addPage([pageWidth, pageHeight])
    let yPosition = pageHeight - margin
    let lineCount = 0

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
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName.value ? fileName.value.replace(/\.[^/.]+$/, '') + '_edited.pdf' : 'document.pdf'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error creating PDF:', error)
    alert('Failed to create PDF. Please try again.')
  }
}
</script>

<style scoped>
.pdf-editor-page {
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

.file-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  flex-wrap: wrap;
}

.upload-btn {
  display: inline-block;
  padding: 0.6rem 1.5rem;
  background-color: #42b983;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: 500;
}

.upload-btn:hover {
  background-color: #33a372;
}

.file-name {
  color: #646cff;
  font-weight: 500;
  padding: 0.5rem 1rem;
  background-color: rgba(100, 108, 255, 0.1);
  border-radius: 4px;
}

.clear-btn {
  padding: 0.6rem 1.5rem;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: 500;
}

.clear-btn:hover {
  background-color: #ee5a5a;
}

.editor-toolbar {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
  padding: 0.75rem;
  background-color: #f5f5f5;
  border-radius: 8px 8px 0 0;
  flex-wrap: wrap;
  align-items: center;
}

.toolbar-group {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}

.toolbar-divider {
  width: 1px;
  height: 24px;
  background-color: #ddd;
}

.tool-btn {
  min-width: 36px;
  height: 36px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tool-btn:hover {
  background-color: #646cff;
  color: white;
  border-color: #646cff;
}

.font-size-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.font-size-select:hover {
  border-color: #646cff;
}

.color-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.color-picker-label {
  cursor: pointer;
  display: inline-block;
}

.color-btn {
  display: inline-block;
  min-width: 36px;
  height: 36px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  font-weight: bold;
  transition: all 0.3s;
}

.color-picker-label:hover .color-btn {
  background-color: #646cff;
  color: white;
  border-color: #646cff;
}

.editor {
  min-height: 500px;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 8px 8px;
  background-color: white;
  color: #213547;
  outline: none;
  line-height: 1.6;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.editor:empty:before {
  content: attr(placeholder);
  color: #999;
}

.editor h1 {
  font-size: 2em;
  margin: 0.67em 0;
}

.editor h2 {
  font-size: 1.5em;
  margin: 0.75em 0;
}

.editor h3 {
  font-size: 1.17em;
  margin: 0.83em 0;
}

.editor p {
  margin: 1em 0;
  color: #213547;
}

.editor ul,
.editor ol {
  margin: 1em 0;
  padding-left: 2em;
}

.editor a {
  color: #646cff;
  text-decoration: underline;
}

.download-btn {
  margin-top: 1rem;
  padding: 0.75rem 2rem;
  background-color: #646cff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.download-btn:hover {
  background-color: #5558dd;
}

@media (prefers-color-scheme: dark) {
  .file-controls {
    background-color: #2a2a2a;
  }

  .file-name {
    background-color: rgba(100, 108, 255, 0.2);
    color: #a3abff;
  }

  .editor-toolbar {
    background-color: #2a2a2a;
  }

  .toolbar-divider {
    background-color: #555;
  }

  .tool-btn {
    background-color: #1a1a1a;
    border-color: #555;
    color: #fff;
  }

  .tool-btn:hover {
    background-color: #646cff;
    border-color: #646cff;
  }

  .font-size-select {
    background-color: #1a1a1a;
    border-color: #555;
    color: #fff;
  }

  .color-btn {
    background-color: #1a1a1a;
    border-color: #555;
    color: #fff;
  }

  .editor {
    background-color: #1a1a1a;
    border-color: #555;
    color: #fff;
  }

  .editor p {
    color: #fff;
  }

  h1 {
    color: #fff;
  }

  p {
    color: #a3abff;
  }
}
</style>
