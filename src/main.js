import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueDatePicker from '@vuepic/vue-datepicker'

import App from './App.vue'
import router from './router'

import './css/main.scss'
import '@vuepic/vue-datepicker/dist/main.css'

const app = createApp(App)
app.component('vueDatePicker', VueDatePicker)

app.use(createPinia())
app.use(router)

app.mount('#app')
