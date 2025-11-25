<template>
  <div class="converter-page">
    <h1>{{ t('pages.wordToJPG.title') }}</h1>
    <p>{{ t('pages.wordToJPG.desc') }}</p>

    <div class="upload-section">
      <label class="file-input-label">
        <input type="file" @change="handleFileUpload" accept=".docx" class="file-input" />
        <span class="file-input-button">{{ t('common.chooseFile') }}</span>
      </label>
      <span v-if="fileName" class="file-name">{{ fileName }}</span>
    </div>

    <div v-if="isConverting" class="loading">
      {{ t('common.converting') }}...
    </div>

    <button
      v-if="wordData"
      @click="convertToJPG"
      :disabled="isConverting"
      class="convert-btn"
    >
      {{ t('common.convert') }}
    </button>

    <div v-if="imageUrls.length > 0" class="preview-section">
      <h2>Preview ({{ imageUrls.length }} page{{ imageUrls.length > 1 ? 's' : '' }}):</h2>
      <div v-for="(url, index) in imageUrls" :key="index" class="image-container">
        <h3>Page {{ index + 1 }}</h3>
        <img :src="url" :alt="`Page ${index + 1}`" />
        <a :href="url" :download="`${baseFileName}_page_${index + 1}.jpg`" class="download-btn">
          {{ t('common.download') }} Page {{ index + 1 }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import html2canvas from 'html2canvas'
// @ts-ignore
import mammoth from 'mammoth'

const { t } = useI18n()

const fileName = ref<string>('')
const baseFileName = ref<string>('document')
const wordData = ref<string>('')
const isConverting = ref<boolean>(false)
const imageUrls = ref<string[]>([])

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  fileName.value = file.name
  baseFileName.value = file.name.replace(/\.[^/.]+$/, '')
  isConverting.value = true

  try {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.convertToHtml({
      arrayBuffer,
      options: {
        styleMap: [
          "p[style-name='Normal'] => p:fresh",
          "p[style-name='Heading 1'] => h1:fresh",
          "p[style-name='Heading 2'] => h2:fresh",
          "p[style-name='Heading 3'] => h3:fresh"
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
    wordData.value = result.value

    // Clear previous images
    imageUrls.value.forEach(url => URL.revokeObjectURL(url))
    imageUrls.value = []
  } catch (error) {
    console.error('Error reading Word file:', error)
    alert('Failed to read Word file. Please make sure it\'s a valid .docx file.')
  } finally {
    isConverting.value = false
  }

  // Reset file input
  target.value = ''
}

const convertToJPG = async () => {
  if (!wordData.value) return

  isConverting.value = true

  try {
    // Create a temporary container to render the HTML
    const container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.left = '-9999px'
    container.style.top = '0'
    container.style.width = '794px' // A4 width in pixels at 96 DPI
    container.style.padding = '40px'
    container.style.backgroundColor = 'white'
    container.style.color = 'black'
    container.style.fontFamily = 'Arial, sans-serif'
    container.style.fontSize = '14px'
    container.style.lineHeight = '1.6'
    container.innerHTML = wordData.value

    document.body.appendChild(container)

    // Split content into pages based on height
    const maxPageHeight = 1123 // A4 height in pixels at 96 DPI
    const children = Array.from(container.children)

    // Clear previous images
    imageUrls.value.forEach(url => URL.revokeObjectURL(url))
    imageUrls.value = []

    let currentPage = document.createElement('div')
    currentPage.style.width = '794px'
    currentPage.style.padding = '40px'
    currentPage.style.backgroundColor = 'white'
    currentPage.style.color = 'black'
    currentPage.style.fontFamily = 'Arial, sans-serif'
    currentPage.style.fontSize = '14px'
    currentPage.style.lineHeight = '1.6'
    currentPage.style.boxSizing = 'border-box'

    const pages: HTMLElement[] = []
    let currentHeight = 0

    for (const child of children) {
      const clone = child.cloneNode(true) as HTMLElement
      currentPage.appendChild(clone)

      // Measure height
      const tempContainer = document.createElement('div')
      tempContainer.style.position = 'absolute'
      tempContainer.style.left = '-9999px'
      tempContainer.style.width = '794px'
      tempContainer.appendChild(currentPage.cloneNode(true))
      document.body.appendChild(tempContainer)

      const pageHeight = tempContainer.offsetHeight
      document.body.removeChild(tempContainer)

      if (pageHeight > maxPageHeight && currentPage.children.length > 1) {
        // Remove the last child and create a new page
        currentPage.removeChild(clone)
        pages.push(currentPage)

        currentPage = document.createElement('div')
        currentPage.style.width = '794px'
        currentPage.style.padding = '40px'
        currentPage.style.backgroundColor = 'white'
        currentPage.style.color = 'black'
        currentPage.style.fontFamily = 'Arial, sans-serif'
        currentPage.style.fontSize = '14px'
        currentPage.style.lineHeight = '1.6'
        currentPage.style.boxSizing = 'border-box'
        currentPage.appendChild(clone)
      }
    }

    if (currentPage.children.length > 0) {
      pages.push(currentPage)
    }

    // Convert each page to image
    for (const page of pages) {
      document.body.appendChild(page)
      page.style.position = 'absolute'
      page.style.left = '-9999px'

      const canvas = await html2canvas(page, {
        backgroundColor: '#ffffff',
        scale: 2
      })

      document.body.removeChild(page)

      const url = canvas.toDataURL('image/jpeg', 0.95)
      imageUrls.value.push(url)
    }

    // Clean up
    document.body.removeChild(container)
  } catch (error) {
    console.error('Error converting to JPG:', error)
    alert('Failed to convert to JPG. Please try again.')
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
  margin-bottom: 1.5rem;
}

.image-container {
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.image-container h3 {
  color: #213547;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.image-container img {
  width: 100%;
  max-width: 800px;
  height: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
  display: block;
}

.download-btn {
  display: inline-block;
  padding: 0.6rem 1.5rem;
  background-color: #646cff;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 14px;
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

  .image-container {
    background-color: #1a1a1a;
  }

  .image-container h3 {
    color: #fff;
  }

  .image-container img {
    border-color: #555;
  }
}
</style>
