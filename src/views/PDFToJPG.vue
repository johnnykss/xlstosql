<template>
  <converter-template
    :title="t('pages.pdfToJPG.title')"
    :description="t('pages.pdfToJPG.desc')"
    accept=".pdf"
    :file-name="fileName"
    :show-convert-button="!!fileName"
    @file-change="handleFileUpload"
    @convert="convertToJPG"
  >
    <template #output>
      <div v-if="converting" class="status">{{ t('common.converting') }}...</div>
      <div v-if="message" class="message">{{ message }}</div>
    </template>
  </converter-template>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ConverterTemplate from './ConverterTemplate.vue'

const { t } = useI18n()

const fileName = ref<string>('')
const converting = ref(false)
const message = ref<string>('')

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  fileName.value = file.name
  message.value = ''
}

const convertToJPG = async () => {
  converting.value = true
  message.value = t('common.featureComingSoon')
  converting.value = false
}
</script>

<style scoped>
.status, .message {
  margin-top: 2rem;
  padding: 1rem;
  background-color: rgba(100, 108, 255, 0.1);
  border-radius: 8px;
  color: #646cff;
}
</style>
