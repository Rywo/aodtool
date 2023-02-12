import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import UUID from "vue3-uuid";
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

let app = createApp(App)
app.use(UUID)
app.use(ElementPlus)
app.use(VueSweetalert2);
app.mount('#app')