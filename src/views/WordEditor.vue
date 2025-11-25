<template>
  <div class="word-editor-page">
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

    <div class="editor-wrapper">
      <Vueditor v-model="content" ref="editor" />
    </div>

    <button @click="downloadDocument" class="download-btn">
      {{ t('common.download') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'
// @ts-ignore
import mammoth from 'mammoth'

const { t } = useI18n()

const editor = ref(null)
const content = ref<string>('')
const fileName = ref<string>('')

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  fileName.value = file.name

  try {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.convertToHtml({
      arrayBuffer,
      options: {
        styleMap: [
          "p[style-name='Normal'] => p:fresh",
          "p[style-name='Heading 1'] => h1:fresh",
          "p[style-name='Heading 2'] => h2:fresh",
          "p[style-name='Heading 3'] => h3:fresh",
          "p[style-name='Heading 4'] => h4:fresh",
          "p[style-name='Heading 5'] => h5:fresh",
          "p[style-name='Heading 6'] => h6:fresh"
        ],
        includeDefaultStyleMap: true,
        convertImage: mammoth.images.inline(function(image: any) {
          return image.read("base64").then(function(imageBuffer: string) {
            return {
              src: "data:" + image.contentType + ";base64," + imageBuffer
            }
          })
        })
      }
    })

    content.value = result.value

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
    content.value = ''
    fileName.value = ''
  }
}

const downloadDocument = async () => {
  const htmlContent = content.value || t('pages.wordEditor.placeholder')

  // Create a temporary div to parse HTML
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = htmlContent

  const paragraphs: any[] = []

  // Process each child element
  const processElement = (element: HTMLElement): any[] => {
    const results: any[] = []

    if (element.tagName === 'P') {
      const textRuns = []
      const textAlign = element.style.textAlign || 'left'

      element.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          if (node.textContent && node.textContent.trim()) {
            textRuns.push(new TextRun({ text: node.textContent }))
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement
          const text = el.textContent || ''

          if (text.trim()) {
            textRuns.push(new TextRun({
              text: text,
              bold: el.tagName === 'STRONG' || el.tagName === 'B',
              italics: el.tagName === 'EM' || el.tagName === 'I',
              underline: el.tagName === 'U' ? {} : undefined,
              strike: el.tagName === 'S' || el.tagName === 'STRIKE'
            }))
          }
        }
      })

      if (textRuns.length > 0) {
        const alignment = textAlign === 'center' ? AlignmentType.CENTER :
                        textAlign === 'right' ? AlignmentType.RIGHT :
                        textAlign === 'justify' ? AlignmentType.JUSTIFIED :
                        AlignmentType.LEFT

        results.push(new Paragraph({
          children: textRuns,
          alignment: alignment
        }))
      } else {
        results.push(new Paragraph({ text: '' }))
      }
    } else if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(element.tagName)) {
      const level = parseInt(element.tagName[1])
      const headingLevel = [
        HeadingLevel.HEADING_1,
        HeadingLevel.HEADING_2,
        HeadingLevel.HEADING_3,
        HeadingLevel.HEADING_4,
        HeadingLevel.HEADING_5,
        HeadingLevel.HEADING_6
      ][level - 1]

      results.push(new Paragraph({
        text: element.textContent || '',
        heading: headingLevel
      }))
    } else if (element.tagName === 'UL' || element.tagName === 'OL') {
      element.querySelectorAll('li').forEach(li => {
        results.push(new Paragraph({
          text: `• ${li.textContent || ''}`,
          bullet: { level: 0 }
        }))
      })
    } else if (element.tagName === 'BR') {
      results.push(new Paragraph({ text: '' }))
    }

    return results
  }

  Array.from(tempDiv.children).forEach(child => {
    const elements = processElement(child as HTMLElement)
    paragraphs.push(...elements)
  })

  if (paragraphs.length === 0) {
    paragraphs.push(new Paragraph({ text: t('pages.wordEditor.placeholder') }))
  }

  try {
    const doc = new Document({
      sections: [{
        properties: {},
        children: paragraphs
      }]
    })

    const blob = await Packer.toBlob(doc)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName.value ? fileName.value.replace(/\.[^/.]+$/, '') + '_edited.docx' : 'document.docx'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error creating document:', error)
    alert('Failed to create document. Please try again.')
  }
}
</script>

<style scoped>
.word-editor-page {
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

.editor-wrapper {
  margin: 2rem 0;
  min-height: 500px;
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
  h1 {
    color: #fff;
  }

  p {
    color: #a3abff;
  }

  .file-controls {
    background-color: #2a2a2a;
  }

  .file-name {
    background-color: rgba(100, 108, 255, 0.2);
    color: #a3abff;
  }
}
</style>
