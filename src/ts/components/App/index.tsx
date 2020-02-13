import * as React from "react";
import { Canvas } from "react-three-fiber";

import Header from "../Header";
import DropTarget from "../DropTarget";
import HypeBox from "../HypeBox";

import styles from "./styles";

export default class App extends React.Component {
	public constructor(props: any) {
		super(props);
	}

	public render(): JSX.Element {
		return (
			<div className={styles.main}>
				<Header />
				<Canvas>
					<ambientLight />
					<pointLight position={[10, 10, 10]} />
					<HypeBox />
				</Canvas>
				<DropTarget />
			</div>
		);
	}
}
