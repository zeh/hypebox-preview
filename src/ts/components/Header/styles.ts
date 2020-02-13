import { stylesheet } from "typestyle";

import Fonts from "../../styles/Fonts";

export default stylesheet({
	main: {
		...Fonts.Body,
		color: "white",
		position: "absolute",
		textAlign: "center",
		width: "100%",
	},
});
