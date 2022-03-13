import { UserConfigExport } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default (): UserConfigExport => {
	return {
		plugins: [ vue() ],
		base: "./",
		resolve: {
			alias: {
				"/@": resolve( __dirname, "src" )
			}
		},
		server: {
			port: 80,
			open: false,
			cors: true,
			https: false
		}
	};
};
