<template>
  <div class="editor-container">
    <h1>{{ t('pages.wordEditor.title') }}</h1>
    <p>{{ t('pages.wordEditor.desc') }}</p>

    <div class="file-controls">
      <label class="upload-btn">
        <input
          type="file"
          accept=".docx"
          @change="handleFileUpload"
          style="display: none"
        />
        <span>📁 {{ t('pages.wordEditor.uploadFile') }}</span>
      </label>
      <span v-if="fileName" class="file-name">{{ fileName }}</span>
      <button v-if="fileName" @click="clearDocument" class="clear-btn">
        {{ t('pages.wordEditor.newDocument') }}
      </button>
    </div>

    <div class="editor-toolbar">
      <!-- Text Style -->
      <div class="toolbar-group">
        <button @click="applyFormat('bold')" class="tool-btn" title="Bold (Ctrl+B)">
          <strong>B</strong>
        </button>
        <button @click="applyFormat('italic')" class="tool-btn" title="Italic (Ctrl+I)">
          <em>I</em>
        </button>
        <button @click="applyFormat('underline')" class="tool-btn" title="Underline (Ctrl+U)">
          <u>U</u>
        </button>
        <button @click="applyFormat('strikeThrough')" class="tool-btn" title="Strikethrough">
          <s>S</s>
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- Headings -->
      <div class="toolbar-group">
        <select @change="applyHeading($event)" class="tool-select">
          <option value="">Normal</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
          <option value="h5">Heading 5</option>
          <option value="h6">Heading 6</option>
        </select>
      </div>

      <div class="toolbar-divider"></div>

      <!-- Font Size -->
      <div class="toolbar-group">
        <select @change="applyFontSize($event)" class="tool-select">
          <option value="">Font Size</option>
          <option value="1">Small</option>
          <option value="3">Normal</option>
          <option value="5">Large</option>
          <option value="7">Huge</option>
        </select>
      </div>

      <div class="toolbar-divider"></div>

      <!-- Alignment -->
      <div class="toolbar-group">
        <button @click="applyFormat('justifyLeft')" class="tool-btn" title="Align Left">
          ☰
        </button>
        <button @click="applyFormat('justifyCenter')" class="tool-btn" title="Align Center">
          ☰
        </button>
        <button @click="applyFormat('justifyRight')" class="tool-btn" title="Align Right">
          ☰
        </button>
        <button @click="applyFormat('justifyFull')" class="tool-btn" title="Justify">
          ☰
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

      <!-- Script -->
      <div class="toolbar-group">
        <button @click="applyFormat('superscript')" class="tool-btn" title="Superscript">
          X<sup>2</sup>
        </button>
        <button @click="applyFormat('subscript')" class="tool-btn" title="Subscript">
          X<sub>2</sub>
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- Indentation -->
      <div class="toolbar-group">
        <button @click="applyFormat('indent')" class="tool-btn" title="Increase Indent">
          →|
        </button>
        <button @click="applyFormat('outdent')" class="tool-btn" title="Decrease Indent">
          |←
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- Insert -->
      <div class="toolbar-group">
        <button @click="insertLink" class="tool-btn" title="Insert Link">
          🔗
        </button>
        <button @click="applyFormat('insertHorizontalRule')" class="tool-btn" title="Insert Line">
          ―
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <!-- Undo/Redo & Clear -->
      <div class="toolbar-group">
        <button @click="applyFormat('undo')" class="tool-btn" title="Undo (Ctrl+Z)">
          ↶
        </button>
        <button @click="applyFormat('redo')" class="tool-btn" title="Redo (Ctrl+Y)">
          ↷
        </button>
        <button @click="applyFormat('removeFormat')" class="tool-btn" title="Clear Formatting">
          ✕
        </button>
      </div>
    </div>

    <div
      ref="editor"
      class="editor"
      contenteditable="true"
      @input="handleInput"
      :placeholder="t('pages.wordEditor.placeholder')"
    ></div>

    <div class="actions">
      <button @click="downloadDocument" class="download-btn">
        {{ t('common.download') }} (.docx)
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'
// @ts-ignore
import mammoth from 'mammoth'

const { t } = useI18n()

const editor = ref<HTMLElement | null>(null)
const content = ref<string>('')
const fileName = ref<string>('')

const handleInput = () => {
  if (editor.value) {
    content.value = editor.value.innerHTML
  }
}

const applyFormat = (format: string) => {
  document.execCommand(format, false)
  editor.value?.focus()
}

const applyHeading = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const heading = target.value
  if (heading) {
    document.execCommand('formatBlock', false, heading)
  } else {
    document.execCommand('formatBlock', false, 'p')
  }
  target.value = ''
  editor.value?.focus()
}

const applyFontSize = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const size = target.value
  if (size) {
    document.execCommand('fontSize', false, size)
  }
  target.value = ''
  editor.value?.focus()
}

const applyColor = (event: Event, command: string) => {
  const target = event.target as HTMLInputElement
  const color = target.value
  document.execCommand(command, false, color)
  editor.value?.focus()
}

const insertLink = () => {
  const url = prompt('Enter the link URL:')
  if (url) {
    document.execCommand('createLink', false, url)
  }
  editor.value?.focus()
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  fileName.value = file.name

  try {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.convertToHtml({ arrayBuffer })

    if (editor.value) {
      editor.value.innerHTML = result.value
      content.value = result.value
    }

    // Show any conversion messages/warnings
    if (result.messages.length > 0) {
      console.log('Conversion messages:', result.messages)
    }
  } catch (error) {
    console.error('Error loading document:', error)
    alert('Failed to load document. Please make sure it\'s a valid .docx file.')
  }

  // Reset file input
  target.value = ''
}

const clearDocument = () => {
  if (confirm(t('pages.wordEditor.confirmClear'))) {
    if (editor.value) {
      editor.value.innerHTML = ''
      content.value = ''
    }
    fileName.value = ''
  }
}

const downloadDocument = async () => {
  const text = editor.value?.innerText || t('pages.wordEditor.placeholder')

  // Split by lines and create paragraphs
  const lines = text.split('\n').filter(line => line.trim())

  const paragraphs = lines.map(line =>
    new Paragraph({
      children: [new TextRun(line)]
    })
  )

  const doc = new Document({
    sections: [{
      children: paragraphs.length > 0 ? paragraphs : [
        new Paragraph({
          children: [new TextRun(text)]
        })
      ]
    }]
  })

  const blob = await Packer.toBlob(doc)
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'document.docx'
  a.click()
  window.URL.revokeObjectURL(url)
}
</script>

<style scoped>
.editor-container {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #646cff;
  margin-bottom: 0.5rem;
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

.tool-btn:active {
  transform: scale(0.95);
}

.tool-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  min-width: 120px;
}

.tool-select:hover {
  border-color: #646cff;
}

.color-picker-label {
  position: relative;
  cursor: pointer;
  display: inline-block;
}

.color-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.color-btn {
  display: flex;
  align-items: center;
  justify-content: center;
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

.editor ul, .editor ol {
  margin: 1em 0;
  padding-left: 2em;
}

.editor a {
  color: #646cff;
  text-decoration: underline;
}

.actions {
  margin-top: 2rem;
}

.download-btn {
  padding: 0.8rem 2rem;
  background-color: #646cff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.download-btn:hover {
  background-color: #535bf2;
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
    background-color: #444;
  }

  .tool-btn,
  .tool-select {
    background-color: #1a1a1a;
    color: #e0e0e0;
    border-color: #3a3a3a;
  }

  .tool-btn:hover {
    background-color: #646cff;
    color: white;
  }

  .color-btn {
    background-color: #1a1a1a;
    color: #e0e0e0;
    border-color: #3a3a3a;
  }

  .editor {
    background-color: #1a1a1a;
    color: #e0e0e0;
    border-color: #3a3a3a;
  }
}

@media (max-width: 768px) {
  .editor-toolbar {
    padding: 0.5rem;
  }

  .tool-btn {
    min-width: 32px;
    height: 32px;
    padding: 0.25rem;
    font-size: 12px;
  }

  .tool-select {
    min-width: 100px;
    font-size: 12px;
  }

  .toolbar-divider {
    display: none;
  }
}
</style>
