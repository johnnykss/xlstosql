import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    redirect: '/excel-to-sql'
  },
  {
    path: '/excel-to-sql',
    name: 'ExcelToSQL',
    component: () => import('../views/ExcelToSQL.vue')
  },
  {
    path: '/excel-to-word',
    name: 'ExcelToWord',
    component: () => import('../views/ExcelToWord.vue')
  },
  {
    path: '/excel-to-pdf',
    name: 'ExcelToPDF',
    component: () => import('../views/ExcelToPDF.vue')
  },
  {
    path: '/excel-to-jpg',
    name: 'ExcelToJPG',
    component: () => import('../views/ExcelToJPG.vue')
  },
  {
    path: '/pdf-to-word',
    name: 'PDFToWord',
    component: () => import('../views/PDFToWord.vue')
  },
  {
    path: '/pdf-to-excel',
    name: 'PDFToExcel',
    component: () => import('../views/PDFToExcel.vue')
  },
  {
    path: '/pdf-to-jpg',
    name: 'PDFToJPG',
    component: () => import('../views/PDFToJPG.vue')
  },
  {
    path: '/word-editor',
    name: 'WordEditor',
    component: () => import('../views/WordEditor.vue')
  },
  {
    path: '/word-to-pdf',
    name: 'WordToPDF',
    component: () => import('../views/WordToPDF.vue')
  },
  {
    path: '/word-to-jpg',
    name: 'WordToJPG',
    component: () => import('../views/WordToJPG.vue')
  },
  {
    path: '/md-to-pdf',
    name: 'MDToPDF',
    component: () => import('../views/MDToPDF.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
