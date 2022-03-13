/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_API_PORT: number;
	readonly VITE_HOST: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}