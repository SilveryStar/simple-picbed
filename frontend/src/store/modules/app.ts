import { defineStore } from "pinia";
import store from "/@/store";

interface AppState {
	device: string;
}

export const AppStore = defineStore( {
	id: "App",
	state: (): AppState => ( {
		device: "desktop"
	} ),
	getters: {
		getDevice() {
			return this.device;
		}
	},
	actions: {
		switchDevice( device: string ) {
			this.device = device;
		}
	}
} );

export function useAppStore() {
	return AppStore( store );
}