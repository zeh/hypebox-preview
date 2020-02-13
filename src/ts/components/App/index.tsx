import * as React from "react";
import { Canvas } from "react-three-fiber";

import Header from "../Header";
import DropTarget from "../DropTarget";
import HypeBox from "../HypeBox";

import styles from "./styles";

interface IState {
	currentTexture: HTMLImageElement | undefined;
}

export default class App extends React.Component<any, IState> {
	public constructor(props: any) {
		super(props);

		this.handleDropFiles = this.handleDropFiles.bind(this);

		this.state = {
			currentTexture: undefined,
		};
	}

	public render(): JSX.Element {
		const { currentTexture } = this.state;

		return (
			<div className={styles.main}>
				<Header />
				<Canvas>
					<ambientLight />
					<pointLight position={[10, 10, 10]} />
					<HypeBox image={currentTexture} />
				</Canvas>
				<DropTarget onDropFiles={this.handleDropFiles} />
			</div>
		);
	}

	private handleDropFiles(files: File[]): void {
		const file = files.find((f) => f.name.endsWith(".png") || f.name.endsWith(".jpg"));
		if (file) {
			const reader = new FileReader();
			reader.addEventListener("load", (e) => {
				if (e.target && typeof e.target.result === "string") {
					const img = new Image();
					img.src = e.target.result;
					this.setState({ currentTexture: img });
				}
			});
			reader.readAsDataURL(file);
		}
	}
}
