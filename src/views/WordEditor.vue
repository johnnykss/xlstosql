<template>
  <div class="editor-container">
    <h1>{{ t('pages.wordEditor.title') }}</h1>
    <p>{{ t('pages.wordEditor.desc') }}</p>

    <div class="editor-toolbar">
      <button @click="applyFormat('bold')" class="tool-btn"><strong>B</strong></button>
      <button @click="applyFormat('italic')" class="tool-btn"><em>I</em></button>
      <button @click="applyFormat('underline')" class="tool-btn"><u>U</u></button>
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
        {{ t('common.download') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Document, Packer, Paragraph, TextRun } from 'docx'

const { t } = useI18n()

const editor = ref<HTMLElement | null>(null)
const content = ref<string>('')

const handleInput = () => {
  if (editor.value) {
    content.value = editor.value.innerText
  }
}

const applyFormat = (format: string) => {
  document.execCommand(format, false)
}

const downloadDocument = async () => {
  const text = content.value || t('pages.wordEditor.placeholder')

  const doc = new Document({
    sections: [{
      children: [
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
  max-width: 1000px;
  margin: 0 auto;
}

h1 {
  color: #646cff;
  margin-bottom: 0.5rem;
}

.editor-toolbar {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
  padding: 0.5rem;
  background-color: #f5f5f5;
  border-radius: 8px 8px 0 0;
}

.tool-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.tool-btn:hover {
  background-color: #646cff;
  color: white;
  border-color: #646cff;
}

.editor {
  min-height: 400px;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 0 0 8px 8px;
  background-color: white;
  color: #213547;
  outline: none;
}

.editor:empty:before {
  content: attr(placeholder);
  color: #999;
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
  .editor-toolbar {
    background-color: #2a2a2a;
  }

  .tool-btn {
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
</style>
