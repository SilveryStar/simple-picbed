<template>
	<section class="app-main">
		<router-view :key="key" v-slot="{ Component }">
			<transition name="fade-transform" mode="out-in" appear>
				<keep-alive>
					<component :is="Component"/>
				</keep-alive>
			</transition>
		</router-view>
	</section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const key = computed( () => route.path );
</script>

<style scoped lang="scss">
.app-main {
	position: relative;
	top: 0;
	left: 0;
	right: 0;
}
</style>