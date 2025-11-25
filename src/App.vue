<template>
  <div id="app" :data-theme="currentTheme">
    <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">{{ t('appTitle') }}</h1>
        <div class="controls-group">
          <div class="theme-switcher">
            <button
              @click="switchTheme('light')"
              :class="{ active: currentTheme === 'light' }"
              class="theme-btn"
              :title="t('themes.light')"
            >
              ☀️
            </button>
            <button
              @click="switchTheme('dark')"
              :class="{ active: currentTheme === 'dark' }"
              class="theme-btn"
              :title="t('themes.dark')"
            >
              🌙
            </button>
            <button
              @click="switchTheme('warm')"
              :class="{ active: currentTheme === 'warm' }"
              class="theme-btn"
              :title="t('themes.warm')"
            >
              🔥
            </button>
            <button
              @click="switchTheme('cold')"
              :class="{ active: currentTheme === 'cold' }"
              class="theme-btn"
              :title="t('themes.cold')"
            >
              ❄️
            </button>
          </div>
          <div class="language-switcher">
            <button
              @click="switchLanguage('en')"
              :class="{ active: locale === 'en' }"
              class="lang-btn"
            >
              EN
            </button>
            <button
              @click="switchLanguage('ru')"
              :class="{ active: locale === 'ru' }"
              class="lang-btn"
            >
              RU
            </button>
          </div>
        </div>
      </div>
    </header>

    <nav class="app-nav">
      <button
        v-for="item in navItems"
        :key="item.path"
        @click="$router.push(item.path)"
        :class="{ active: $route.path === item.path }"
        class="nav-btn"
      >
        {{ t(item.label) }}
      </button>
    </nav>

    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const navItems = [
  { path: '/excel-to-sql', label: 'nav.excelToSQL' },
  { path: '/excel-to-word', label: 'nav.excelToWord' },
  { path: '/excel-to-pdf', label: 'nav.excelToPDF' },
  { path: '/excel-to-jpg', label: 'nav.excelToJPG' },
  { path: '/pdf-to-word', label: 'nav.pdfToWord' },
  { path: '/pdf-to-excel', label: 'nav.pdfToExcel' },
  { path: '/pdf-to-jpg', label: 'nav.pdfToJPG' },
  { path: '/word-to-pdf', label: 'nav.wordToPDF' },
  { path: '/word-to-jpg', label: 'nav.wordToJPG' },
  { path: '/word-editor', label: 'nav.wordEditor' }
]

const currentTheme = ref<string>('light')

const switchLanguage = (lang: string) => {
  locale.value = lang
  localStorage.setItem('language', lang)
}

const switchTheme = (theme: string) => {
  currentTheme.value = theme
  localStorage.setItem('theme', theme)
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    currentTheme.value = savedTheme
  }
})
</script>

<style scoped>
/* Light theme (default) */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  --header-bg: #646cff;
  --header-text: white;
  --nav-bg: #f5f5f5;
  --nav-btn-bg: white;
  --nav-btn-text: #333;
  --nav-btn-border: #ddd;
  --nav-btn-hover: #646cff;
  --main-bg: white;
  --main-text: #213547;
}

/* Dark theme */
#app[data-theme="dark"] {
  --header-bg: #1a1a1a;
  --header-text: #e0e0e0;
  --nav-bg: #0a0a0a;
  --nav-btn-bg: #2a2a2a;
  --nav-btn-text: #e0e0e0;
  --nav-btn-border: #3a3a3a;
  --nav-btn-hover: #4a4aff;
  --main-bg: #1a1a1a;
  --main-text: #e0e0e0;
}

/* Warm theme */
#app[data-theme="warm"] {
  --header-bg: #d97706;
  --header-text: white;
  --nav-bg: #fef3c7;
  --nav-btn-bg: #fffbeb;
  --nav-btn-text: #78350f;
  --nav-btn-border: #fcd34d;
  --nav-btn-hover: #f59e0b;
  --main-bg: #fffbeb;
  --main-text: #78350f;
}

/* Cold theme */
#app[data-theme="cold"] {
  --header-bg: #0284c7;
  --header-text: white;
  --nav-bg: #e0f2fe;
  --nav-btn-bg: #f0f9ff;
  --nav-btn-text: #075985;
  --nav-btn-border: #7dd3fc;
  --nav-btn-hover: #0ea5e9;
  --main-bg: #f0f9ff;
  --main-text: #075985;
}

#app {
  background-color: var(--main-bg);
  color: var(--main-text);
}

.app-header {
  background-color: var(--header-bg);
  color: var(--header-text);
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.controls-group {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.theme-switcher {
  display: flex;
  gap: 0.5rem;
}

.theme-btn {
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  border: 1px solid var(--header-text);
  background-color: transparent;
  color: var(--header-text);
  font-size: 1.2rem;
  transition: all 0.3s;
  cursor: pointer;
  line-height: 1;
}

.theme-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.theme-btn.active {
  background-color: rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 255, 255, 0.9);
}

.language-switcher {
  display: flex;
  gap: 0.5rem;
}

.lang-btn {
  padding: 0.4rem 1rem;
  border-radius: 4px;
  border: 1px solid var(--header-text);
  background-color: transparent;
  color: var(--header-text);
  font-size: 0.9rem;
  transition: all 0.3s;
  cursor: pointer;
}

.lang-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.lang-btn.active {
  background-color: rgba(255, 255, 255, 0.9);
  color: var(--header-bg);
}

.app-nav {
  background-color: var(--nav-bg);
  padding: 0.5rem 2rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
}

.nav-btn {
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  border: 1px solid var(--nav-btn-border);
  background-color: var(--nav-btn-bg);
  color: var(--nav-btn-text);
  font-size: 0.9rem;
  transition: all 0.3s;
  cursor: pointer;
  white-space: nowrap;
}

.nav-btn:hover {
  background-color: var(--nav-btn-hover);
  color: white;
  border-color: var(--nav-btn-hover);
}

.nav-btn.active {
  background-color: var(--nav-btn-hover);
  color: white;
  border-color: var(--nav-btn-hover);
}

.app-main {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .app-header {
    padding: 1rem;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .controls-group {
    flex-direction: column;
    gap: 0.75rem;
  }

  .app-nav {
    padding: 0.5rem 1rem;
  }

  .app-main {
    padding: 1rem;
  }
}
</style>
