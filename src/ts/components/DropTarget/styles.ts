import { stylesheet } from "typestyle";

export default stylesheet({
	main: {
		backgroundColor: "rgba(255, 255, 0, 0.4)",
		height: "100%",
		position: "absolute",
		width: "100%",
		zIndex: 99999,
	},
	hidden: {
		display: "none",
	},
});
