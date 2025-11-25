import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import i18n from './i18n'
import router from './router'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const app = createApp(App)

app.component('QuillEditor', QuillEditor)
app.use(i18n)
app.use(router)
app.mount('#app')
