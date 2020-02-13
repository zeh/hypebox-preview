import * as React from "react";
import { useRef, useState } from "react";
import { Canvas, useFrame } from "react-three-fiber";

import Header from "../Header";
import DropTarget from "../DropTarget";

import styles from "./styles";

function Box(props: any) {
	// This reference will give us direct access to the mesh
	const mesh = useRef<any>();

	// Set up state for the hovered and active state
	const [hovered, setHover] = useState(false);
	const [active, setActive] = useState(false);

	// Rotate mesh every frame, this is outside of React without overhead
	useFrame(() => {
		if (mesh.current) {
			mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
		}
	});

	return (
		<mesh
			{...props}
			ref={mesh}
			scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
			onClick={(e) => setActive(!active)}
			onPointerOver={(e) => setHover(true)}
			onPointerOut={(e) => setHover(false)}
		>
			<boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
			<meshStandardMaterial attach="material" color={hovered ? "hotpink" : "orange"} />
		</mesh>
	);
}

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
					<Box position={[-1.2, 0, 0]} />
					<Box position={[1.2, 0, 0]} />
				</Canvas>
				<DropTarget />
			</div>
		);
	}
}
