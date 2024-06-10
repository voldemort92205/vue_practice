import { createApp } from 'vue'
import './style.css'
import App from './App.vue';


/* change to tailwindcss
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
*/

import OpenLayersMap from "vue3-openlayers";
import "vue3-openlayers/dist/vue3-openlayers.css";

createApp(App).use(OpenLayersMap).mount('#app')


