import { createApp } from "vue";
import App from "./App.vue";

import ElementPlus from "element-plus";
import router from "/@/router";
import store from "/@/store";
import axios from "axios";

import "/@/styles/index.scss";
import "element-plus/theme-chalk/index.css";

createApp( App )
	.use( ElementPlus )
	.use( store )
	.use( router )
	.mount( "#app" );

export const instance = axios.create( {
	baseURL: `http://${ import.meta.env.VITE_HOST }:${ import.meta.env.VITE_API_PORT }`
} );