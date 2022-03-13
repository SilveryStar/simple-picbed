<template>
	<div :class="setting.classes" class="app-wrapper">
		<Header />
		<el-scrollbar>
			<AppMain />
		</el-scrollbar>
	</div>
</template>

<script setup lang="ts">
import { useEventListener } from "@vueuse/core";
import { useAppStore } from "/@/store/modules/app";
import { computed, reactive, ref, onMounted, onBeforeMount } from "vue";
import { operate } from "/@/utils/operate";

import AppMain from "./main.vue";
import Header from "./header.vue";

const AppStore = useAppStore();
const Width = ref<number>( 768 );

const setting = reactive( {
	device: computed( () => AppStore.device ),
	classes: computed( () => ( {
		mobile: setting.device === "mobile"
	} ) )
} );

function $_isMobile() {
	const width: number = document.body.getBoundingClientRect().width;
	return width - 1 < Width.value;
}

function $_resizeHandler() {
	if ( !document.hidden ) {
		const isMobile = $_isMobile();
		AppStore.switchDevice( isMobile ? "mobile" : "desktop" );
	}
}

onBeforeMount( () => {
	useEventListener( "resize", $_resizeHandler );
} );

onMounted( () => {
	const isMobile = $_isMobile();
	if ( isMobile ) {
		AppStore.switchDevice( "mobile" );
	}
	operate.chgClass(
		true,
		"hidden-main-container",
		document.querySelector( ".main-container" )
	)
} );
</script>

<style scoped lang="scss">
.el-scrollbar {
	position: absolute;
	top: 56px;
	width: 100vw;
	height: calc( 100vh - 56px );
}

.el-scrollbar__thumb {
	background-color: transparent !important;
}
</style>