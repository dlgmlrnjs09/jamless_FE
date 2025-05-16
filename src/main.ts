// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'  // Tailwind CSS 스타일시트 (별도 설정 필요)

const app = createApp(App)
app.mount('#app')