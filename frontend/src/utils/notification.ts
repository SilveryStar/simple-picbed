import { ElNotification } from "element-plus";

export function notification(
	type: "info" | "warning" | "error" | "success",
	title: string, msg: string, duration: number = 1800
) {
	ElNotification( {
		type,
		title,
		duration,
		message: msg
	} );
}