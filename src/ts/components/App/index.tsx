import * as React from "react";
import * as THREE from "three";
import { Canvas } from "react-three-fiber";

import Header from "../Header";
import DropTarget from "../DropTarget";
import HypeBox from "../HypeBox";

import styles from "./styles";

interface IState {
	camera: THREE.Camera | null;
	currentTexture: HTMLImageElement | undefined;
}

export default class App extends React.Component<any, IState> {
	private _cursorX = 0;
	private _cursorY = 0;
	private _cameraX = 0;
	private _cameraY = 0;

	public constructor(props: any) {
		super(props);

		this.handleDropFiles = this.handleDropFiles.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleFrame = this.handleFrame.bind(this);
		this.handleCanvasCreated = this.handleCanvasCreated.bind(this);

		this.state = {
			currentTexture: undefined,
			camera: null,
		};
	}

	public componentDidMount(): void {
		this.handleFrame();
	}

	public render(): JSX.Element {
		const { currentTexture } = this.state;

		// const controls = new THREE.TrackballControls( camera );
		// controls.target.set( 0, 0, 0 )
		// position: [0, 0, 30]

		const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

		//console.log(cameraRotation);

		return (
			<div className={styles.main} onMouseMove={this.handleMouseMove}>
				<Header />
				<Canvas
					onCreated={this.handleCanvasCreated}
					pixelRatio={Math.min(2, isMobile ? window.devicePixelRatio : 1)}
					camera={{ fov: 55 }}
				>
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

	private handleMouseMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
		this._cursorX = (e.pageX / window.innerWidth) * 2 - 1;
		this._cursorY = (e.pageY / window.innerHeight) * 2 - 1;
	}

	private handleFrame(): void {
		const { camera } = this.state;
		const nx = this._cameraX + (this._cursorX - this._cameraX) / 2;
		const ny = this._cameraY + (this._cursorY - this._cameraY) / 2;
		if (nx !== this._cameraX || ny !== this._cameraY) {
			this._cameraX = nx;
			this._cameraY = ny;
		}

		if (camera) {
			const r = 5;
			const d2r = (1 / 180) * Math.PI;
			const angleX = this._cursorX * -90 * d2r;
			const angleY = this._cursorY * 90 * d2r;

			camera.rotation.set(0, 0, 0);
			camera.position.set(0, 0, 0);
			camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), angleX);
			camera.position.set(0, 0, 5);

			// Brute-forced this solution; could be better with just a proper rotation
			const pX = [1 * Math.sin(angleX), 0, 1 * Math.cos(angleX)];
			const pY = [0, 1 * Math.sin(angleY), 1 * Math.cos(angleY)];
			const p = [r * pX[0], r * pY[1], r * pX[2] * pY[2]];

			camera.position.set(p[0], p[1], p[2]);
			camera.lookAt(0, 0, 0);
		}

		requestAnimationFrame(this.handleFrame);
	}

	private handleCanvasCreated(data: { camera: THREE.Camera }): void {
		this.setState({
			camera: data.camera,
		});
	}
}
