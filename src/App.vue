<template>
  <div id="app">
    <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">{{ t('appTitle') }}</h1>
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
  { path: '/word-editor', label: 'nav.wordEditor' },
  { path: '/pdf-editor', label: 'nav.pdfEditor' }
]

const switchLanguage = (lang: string) => {
  locale.value = lang
  localStorage.setItem('language', lang)
}
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background-color: #646cff;
  color: white;
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

.language-switcher {
  display: flex;
  gap: 0.5rem;
}

.lang-btn {
  padding: 0.4rem 1rem;
  border-radius: 4px;
  border: 1px solid white;
  background-color: transparent;
  color: white;
  font-size: 0.9rem;
  transition: all 0.3s;
  cursor: pointer;
}

.lang-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.lang-btn.active {
  background-color: white;
  color: #646cff;
}

.app-nav {
  background-color: #f5f5f5;
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
  border: 1px solid #ddd;
  background-color: white;
  color: #333;
  font-size: 0.9rem;
  transition: all 0.3s;
  cursor: pointer;
  white-space: nowrap;
}

.nav-btn:hover {
  background-color: #646cff;
  color: white;
  border-color: #646cff;
}

.nav-btn.active {
  background-color: #646cff;
  color: white;
  border-color: #646cff;
}

.app-main {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

@media (prefers-color-scheme: dark) {
  .app-nav {
    background-color: #1a1a1a;
  }

  .nav-btn {
    background-color: #2a2a2a;
    color: #e0e0e0;
    border-color: #3a3a3a;
  }

  .nav-btn:hover {
    background-color: #646cff;
    color: white;
    border-color: #646cff;
  }
}

@media (max-width: 768px) {
  .app-header {
    padding: 1rem;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .app-nav {
    padding: 0.5rem 1rem;
  }

  .app-main {
    padding: 1rem;
  }
}
</style>
