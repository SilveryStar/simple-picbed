import { createRouter, createWebHistory } from "vue-router";

import "nprogress/nprogress.css";
import NProgress from "nprogress";
import Layout from "/@/layout/index.vue"

NProgress.configure( {
	easing: "ease",
	speed: 400,
	showSpinner: true,
	minimum: 0.25
} );

const router = createRouter( {
	history: createWebHistory(),
	routes: [ {
		path: "/",
		name: "Album",
		component: Layout,
		redirect: "/album",
		children: [ {
			path: "/album",
			name: "AlbumPage",
			component: () => import( "/@/components/album.vue" ),
			meta: {
				title: "相册",
			}
		} ]
	}, {
		path: "/upload",
		name: "Upload",
		component: Layout,
		children: [ {
			path: "/upload",
			name: "UploadPage",
			component: () => import( "/@/components/upload.vue" ),
			meta: {
				title: "上传图片",
			}
		} ]
	}, {
		path: "/error",
		name: "Error",
		component: Layout,
		children: [ {
			path: "/error",
			name: "NotFound",
			component: () => import( "/@/components/not-found.vue" ),
			meta: {
				title: "未找到此页面",
			}
		} ]
	}, {
		path: "/:pathMatch(.*)*",
		redirect: "/error"
	} ]
} );

router.beforeEach( ( to, from, next ) => {
	NProgress.start();
	if ( to.meta.title ) {
		document.title = <string>to.meta.title
	}
	next();
} );

router.afterEach( () => {
	NProgress.done();
} )

export default router;