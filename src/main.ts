import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import i18n from './i18n'
import router from './router'
// @ts-ignore
import Vueditor from 'vueditor'
import 'vueditor/dist/style/vueditor.min.css'

const app = createApp(App)

// Configure Vueditor
const config = {
  toolbar: [
    'removeFormat', 'undo', 'redo', '|',
    'bold', 'italic', 'underline', 'strikeThrough', '|',
    'fontName', 'fontSize', 'foreColor', 'backColor', '|',
    'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', '|',
    'insertOrderedList', 'insertUnorderedList', 'indent', 'outdent', '|',
    'link', 'unlink', 'table', '|',
    'formatBlock', 'subscript', 'superscript', 'hr', '|',
    'sourceCode', 'fullscreen'
  ],
  fontName: [
    { val: 'Arial', abbr: 'Arial' },
    { val: 'Calibri', abbr: 'Calibri' },
    { val: 'Georgia', abbr: 'Georgia' },
    { val: 'Times New Roman', abbr: 'Times' },
    { val: 'Verdana', abbr: 'Verdana' }
  ],
  fontSize: ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'],
  uploadUrl: ''
}

app.use(Vueditor, config)
app.use(i18n)
app.use(router)
app.mount('#app')
