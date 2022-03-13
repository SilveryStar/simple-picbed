<template>
	<div class="upload-container">
		<div
			class="drop-box"
			:class="{ 'dark-box': state.dragover }"
			@click="onInput"
		>
			<h2 v-if="!state.dragover">点击/拖拽上传图片</h2>
			<h2 v-else>松开鼠标以上传图片</h2>
		</div>
		<input
			id="input-box"
			type="file"
			multiple
			ref="input"
			@change="onChange"
		/>
		<div class="button-line">
			<div class="upload-button button" @click="upload">确认上传</div>
			<div class="clear-button button" @click="clear">清空列表</div>
		</div>
		<div class="file-list">
			<div v-for="file in state.fileList" class="file-item">
				<span class="filename">{{ file.name }}</span>
				<svg
					class="delete"
					viewBox="0 0 1024 1024"
					xmlns="http://www.w3.org/2000/svg"
					@click="deleteFile( file.id )"
				>
					<path d="M896 217.6L601.6 512l294.4 294.4-89.6 89.6L512 601.6 217.6 896 128 806.4 422.4 512 128 217.6 217.6 128 512 422.4 806.4 128 896 217.6z" />
				</svg>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { notification } from "/@/utils/notification";
import { instance } from "/@/main";

let index: number = 0;
let uploading: boolean = false;

const input = ref<any>( "" );
const state = reactive( {
	fileList: <FileInfo[]>[],
	dragover: false
} );

onMounted( () => {
	disableDefaultEvents();
	initDropEvent( ".drop-box" );
} );

function onDrop( e: DragEvent ) {
	const list = []
		.slice.call( e.dataTransfer.files )
		.filter( file => {
			return checkFile( file );
		} )
		.map( el => handleStart( el ) );
	state.fileList.push( ...list );
}

function onInput() {
	const input: HTMLInputElement = document.querySelector( "#input-box" );
	input.click();
}

function onChange( e ) {
	for ( const file of e.target.files ) {
		if ( checkFile( file ) ) {
			state.fileList.push( handleStart( file ) );
		}
	}
	input.value.value = "";
}

function checkFile( file: File ): boolean {
	const name: string = file.name;
	const type: boolean = /.+?\.(jpg|jpeg|png|webp|gif|jfif|ico|svg)$/.test( name );
	const exists: boolean = state.fileList.some( el => el.name === file.name );

	return type && !exists;
}

interface FileInfo {
	id: string;
	status: string;
	name: string;
	size: number;
	percentage: number;
	raw: File;
}

function handleStart( file: File ): FileInfo {
	const id: string = Date.now().toString() + ( "00" + index.toString() ).slice( -2 );
	if ( index++ > 99 ) {
		index = 0;
	}

	return {
		id,
		status: "ready",
		name: file.name,
		size: file.size,
		percentage: 0,
		raw: file,
	}
}

function disableDefaultEvents(): void {
	const doc = document.documentElement;
	doc.addEventListener( "dragleave", e => e.preventDefault() );
	doc.addEventListener( "drop", e => e.preventDefault() );
	doc.addEventListener( "dragenter", e => e.preventDefault() );
	doc.addEventListener( "dragover", e => e.preventDefault() );
}

function initDropEvent( selector: string ): void {
	const el = document.querySelector( selector );
	el.addEventListener( "dragover", () => {
		state.dragover = true;
	} );
	el.addEventListener( "dragleave", () => {
		state.dragover = false;
	} );
	el.addEventListener( "drop", ( e: DragEvent ) => {
		state.dragover = false;
		e.preventDefault();
		onDrop( e );
	} );
}

function upload() {
	if ( uploading ) {
		notification( "warning", "警告", "正在上传图片，请完成后再操作" );
	}
	if ( state.fileList.length === 0 ) {
		notification( "warning", "警告", "图片列表为空" );
		return;
	}

	notification( "info", "提示", "开始上传图片" );
	uploading = true;

	const formData = new FormData();
	state.fileList.forEach( file => {
		formData.append( `${ file.id }.${ file.name.split( "." ).pop() }`, file.raw );
	} );

	instance.post( `/upload`, formData, {
		headers: {
			"Content-Type": "multipart/form-data"
		}
	} )
		.then( () => {
			notification( "success", "成功", "图片上传完成" );
			uploading = false;
			state.fileList = [];
		} )
		.catch( error => {
			console.log( error );
			notification( "error", "错误", "上传过程发生错误，请使用 F12 打开控制台查看" );
			uploading = false;
		} );
}

function clear() {
	if ( state.fileList.length !== 0 ) {
		state.fileList = [];
		notification( "success", "成功", "图片列表已清空" );
	} else {
		notification( "info", "提示", "图片列表为空" );
	}
}

function deleteFile( id: string ) {
	const index: number = state.fileList.findIndex( el => el.id === id );
	if ( index > -1 ) {
		state.fileList.splice( index, 1 );
	}
}
</script>

<style scoped lang="scss">
.upload-container {
	position: relative;
	left: 0;
	right: 0;
	top: 0;
	width: 48%;
	margin: 24px 26%;
}

.drop-box {
	position: relative;
	display: table;
	width: 100%;
	aspect-ratio: 5/2;
	border-radius: 16px;
	border: dashed 3.5px;
	background-color: #fdfdfd;
	text-align: center;
	z-index: 1000;

	& > h2 {
		display: table-cell;
		vertical-align: middle;
		user-select: none;
	}

	&:hover {
		background-color: #f4f4f4;
	}
}

.dark-box {
	background-color: #f4f4f4;
}

#input-box {
	position: fixed;
	top: -100px;
	left: -100px;
	visibility: hidden;
}

.button-line {
	position: relative;
	display: flex;
	justify-content: center;
	margin: 1rem 0;
	width: 100%;
	color: #FFFFFF;
	font-weight: 700;
	cursor: pointer;

	& > .button {
		position: relative;
		display: inline-block;
		padding: 0.35rem 0.7rem;
		flex-flow: row nowrap;
		border-radius: 0.6rem;
		margin: 0 7.5%;
		user-select: none;
	}
}

.upload-button {
	background-color: #55DB2C;

	&:hover {
		background-color: #4BCB22;
	}
}

.clear-button {
	background-color: #FF0000;

	&:hover {
		background-color: #EF0000;
	}
}

.file-item {
	height: 2rem;
	font-size: 1.05rem;
	display: flex;
	justify-content: space-between;

	& > .filename {
		line-height: 2;
		font-family: Consolas, "宋体", sans-serif;
		vertical-align: middle;
		margin-left: 1.5rem;
		user-select: none;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		max-width: calc( 80% - 1.8rem );
	}

	& > .delete {
		width: 1.2rem;
		margin: 0.55rem 3rem 0.25rem 0;
		vertical-align: middle;
		cursor: pointer;
	}

	&:hover {
		background-color: rgba( #3178C6, .15 );
	}
}

@media (max-width: 992px) {
	.upload-container {
		width: 70%;
		margin: 22px 15%;
	}

	.filename {
		margin-left: 0.25rem !important;
	}

	.delete {
		margin-right: 1.5rem !important;
	}
}

@media (max-width: 768px) {
	.drop-box {
		min-height: 160px;
	}

	.upload-container {
		width: 90%;
		margin: 18px 5%;
	}

	.delete {
		margin-right: 0.5rem !important;
	}
}
</style>