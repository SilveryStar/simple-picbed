<template>
	<div class="album-container" v-if="!state.empty">
		<div class="pic-container">
			<div v-for="group in state.groups" class="pic-column">
				<el-image
					v-for="pic in group"
					:key="pic"
					:src="pic"
					:preview-src-list="[ pic ]"
					fit="cover"
					infinite="false"
					lazy
					hide-on-click-modal
				/>
			</div>
		</div>
		<el-pagination
			v-model:current-page="state.curPage"
			:page-size="state.numPerPage"
			:total="state.data.length"
			:pager-count="7"
			layout="prev, pager, next"
			hide-on-single-page
		/>
	</div>
	<span class="empty-text" v-else>暂无图片</span>
</template>

<script setup lang="ts">
import { useEventListener } from "@vueuse/core";
import { reactive, onBeforeMount, watch } from "vue";
import { notification } from "/@/utils/notification";
import { instance } from "/@/main";

const state = reactive( {
	empty: false,
	data: <string[]>[],
	pageData: <string[][]>[],
	groups: <string[][]>[],
	column: 0,
	curPage: 1,
	numPerPage: 100
} );

function splitArray<T>( arr: Array<T>, step: number ): T[][] {
	const newArray: T[][] = [];
	const len = arr.length;
	let index: number = 0;

	while ( index < len ) {
		newArray.push( arr.slice( index, index += step ) );
	}

	return newArray;
}

function grouping( force: boolean = false ) {
	const width: number = window.outerWidth;
	const oldCol: number = state.column;
	if ( width <= 992 ) {
		state.column = 1;
	} else if ( width < 1920 ) {
		state.column = 2;
	} else if ( width < 2560 ) {
		state.column = 3;
	} else {
		state.column = 4;
	}

	if ( oldCol !== state.column || force ) {
		let now: number = 0;
		const data: string[] = state.pageData[state.curPage - 1];
		state.groups = [];
		for ( let i = 0; i < state.column; i++) {
			state.groups[i] = [];
		}
		for ( const el of data ) {
			state.groups[now].push( `http://${ import.meta.env.VITE_HOST }:${ import.meta.env.VITE_API_PORT }/${ el }` );
			now = now === state.column - 1 ? 0 : now + 1;
		}
	}
}

watch( () => state.curPage, () => {
	grouping( true );
} );

onBeforeMount( () => {
	instance.get( "/pic" )
		.then( res => {
			if ( res.status !== 200 ) {
				notification( "error", "错误", "加载图片错误" );
				return;
			}
			if ( res.data.length === 0 ) {
				state.empty = true;
				return;
			}

			state.data = res.data.reverse();
			state.pageData = splitArray( state.data, state.numPerPage );
			grouping();
			useEventListener( "resize", () => grouping() );
		} )
		.catch( error => {
			console.log( error );
			notification( "error", "错误", "获取图片错误，请使用 F12 打开控制台查看" );
		} );
} );
</script>

<style scoped lang="scss">
.album-container {
	position: relative;
	left: 0;
	right: 0;
	top: 0;
	width: 70%;
	margin: 24px 15%;
}

.pic-container {
	position: relative;
	display: flex;
	left: 0;
	top: 0;
	width: 100%;
}

.pic-column {
	position: relative;
	display: inline-block;

	& > .el-image {
		width: 100%;
		user-select: none;
	}
}

.el-pagination {
	justify-content: center
}

.empty-text {
	position: absolute;
	width: 20vw;
	text-align: center;
	margin: calc( 15vh + 56px ) 40vw;
	font-size: 2.5rem;
	font-weight: 1000;
}

@media (min-width: 2560px) {
	.pic-column {
		width: 24.2%;
		margin: 16px 0.4%;

		& > .el-image {
			margin: 4px 0;
		}
	}
}

@media (max-width: 2559px) {
	.pic-column {
		width: 32.3%;
		margin: 12px 0.5%;

		& > .el-image {
			margin: 3.5px 0;
		}
	}
}

@media (max-width: 1919px) {
	.pic-column {
		width: 48.4%;
		margin: 8px 0.8%;
	}
}

@media (max-width: 992px) {
	.album-container {
		width: 88%;
		margin: 16px 6%;
	}

	.pic-column {
		width: 100%;
	}
}
</style>