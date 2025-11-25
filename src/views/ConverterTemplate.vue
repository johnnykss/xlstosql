<template>
  <div class="converter-container">
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>

    <div class="upload-section">
      <label class="file-upload-btn">
        <input
          type="file"
          @change="$emit('fileChange', $event)"
          :accept="accept"
          style="display: none"
        />
        <span>{{ t('common.chooseFile') }}</span>
      </label>
      <span v-if="fileName" class="file-name">{{ fileName }}</span>
    </div>

    <div v-if="showConvertButton" class="actions">
      <button @click="$emit('convert')" class="convert-btn">
        {{ t('common.convert') }}
      </button>
    </div>

    <slot name="output"></slot>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  title: string
  description: string
  accept: string
  fileName?: string
  showConvertButton?: boolean
}>()

defineEmits(['fileChange', 'convert'])

const { t } = useI18n()
</script>

<style scoped>
.converter-container {
  max-width: 1000px;
  margin: 0 auto;
}

h1 {
  color: #646cff;
  margin-bottom: 0.5rem;
}

.upload-section {
  margin: 2rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.file-upload-btn {
  display: inline-block;
  padding: 0.8rem 2rem;
  background-color: #646cff;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.file-upload-btn:hover {
  background-color: #535bf2;
}

.file-name {
  color: #646cff;
  font-weight: 500;
}

.actions {
  margin: 2rem 0;
}

.convert-btn {
  padding: 0.8rem 2rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.convert-btn:hover {
  background-color: #33a372;
}
</style>
