import { createApp } from "vue"
import App from "./App.vue"
const app = createApp(App)
import router from "./router"
import { reactive } from "vue";

import  VueShepherd from 'vue-shepherd';
import 'shepherd.js/dist/css/shepherd.css';

//socket config
export const state = reactive({
    connected: false,
});
//'https://dev.more.fpland.vn/' 'http://localhost:3000'

import io from 'socket.io-client';
const socket = io(import.meta.env.BACKEND_URL || 'https://dev.more.fpland.vn/' ,{});
socket.on("connect", () => {
    state.connected = true;
});

socket.on("disconnect", () => {
    state.connected = false;
});
app.provide('socket', socket);


import store from './store/store';
app.use(store);

// Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import "./assets/main.css"

import  '@vueuse/core'

//vue-lottie
import Vue3Lottie from 'vue3-lottie'
app.use(Vue3Lottie)

import '@vueform/slider/themes/default.css'
import '@vueform/slider'

// vue gtag
import VueGtag from 'vue-gtag'
app.use(VueGtag, {
    config: { id: 'G-P2VPTT8JD9' }
})

// Vue Datepicker
import DatePicker from 'vue-datepicker-next';
app.component('DatePicker', DatePicker);

import 'vue3-google-map'

app.use(router)
app.use(VueShepherd)
app.mount("#app")
