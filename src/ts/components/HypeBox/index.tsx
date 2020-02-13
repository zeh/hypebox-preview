import * as React from "react";
import * as THREE from "three";
import { ReactThreeFiber } from "react-three-fiber";

export default class HypeBox extends React.Component {
	private meshRef = React.createRef<ReactThreeFiber.Object3DNode<THREE.Mesh, typeof THREE.Mesh>>();

	public constructor(props: any) {
		super(props);

		this.handleFrame = this.handleFrame.bind(this);
	}

	public componentDidMount(): void {
		this.handleFrame();
	}

	public render(): JSX.Element {
		// With fragment shader too:
		// https://codesandbox.io/s/react-three-fiber-custom-geometry-with-fragment-shader-material-vxswf?from-embed
		// geometry =
		//<sphereGeometry attach={"geometry"} args={[1, 16, 16]} />

		const [vertices, faces] = this.generateMesh();

		return (
			<mesh ref={this.meshRef} position={[0, 0, 0]} rotation={[0, 0, 0]}>
				<geometry
					attach={"geometry"}
					vertices={vertices}
					faces={faces}
					onUpdate={(self) => self.computeFaceNormals()}
				/>
				<meshStandardMaterial attach={"material"} color={"#999999"} transparent={true} />
			</mesh>
		);
	}

	private handleFrame(): void {
		if (this.meshRef.current && this.meshRef.current.rotation) {
			const rotation = this.meshRef.current.rotation as THREE.Euler;
			rotation.x = rotation.y += 0.01;
		}
		requestAnimationFrame(this.handleFrame);
	}

	private generateMesh(): [THREE.Vector3[], THREE.Face3[]] {
		const diameter = 2.5;
		const thickness = 0.2;

		const ddo = diameter / 2;
		const ddi = ddo - thickness;

		// Outside: top (clockwise), bottom (clockwise)
		// Inside: top (clockwise), bottom (clockwise)
		const cubeVertices: Array<[number, number, number]> = [
			// Outside, top
			[-ddo, ddo, -ddo],
			[ddo, ddo, -ddo],
			[ddo, ddo, ddo],
			[-ddo, ddo, ddo],
			// Outside, bottom
			[-ddo, -ddo, -ddo],
			[ddo, -ddo, -ddo],
			[ddo, -ddo, ddo],
			[-ddo, -ddo, ddo],
			// Inside, top
			[-ddi, ddi, -ddo],
			[ddi, ddi, -ddo],
			[ddi, ddi, ddo],
			[-ddi, ddi, ddo],
			// Inside, bottom
			[-ddi, -ddi, -ddo],
			[ddi, -ddi, -ddo],
			[ddi, -ddi, ddo],
			[-ddi, -ddi, ddo],
		];

		const cubeFaces: Array<[number, number, number]> = [
			// Outside

			// Top
			[0, 3, 2],
			[2, 1, 0],
			// Left
			[0, 4, 3],
			[3, 4, 7],
			// Right,
			[2, 6, 5],
			[2, 5, 1],
			// Back
			[0, 1, 5],
			[0, 5, 4],
			// Front - top
			[3, 11, 2],
			[2, 11, 10],
			// Front - left
			[3, 15, 11],
			[3, 7, 15],
			// Front - bottom
			[7, 14, 15],
			[7, 6, 14],
			// Front - right
			[2, 10, 6],
			[6, 10, 14],
			// Bottom
			[4, 5, 6],
			[6, 7, 4],

			// Inside

			// Top
			[8, 9, 10],
			[10, 11, 8],
			// Left
			[9, 13, 14],
			[14, 10, 9],
			// Right
			[8, 15, 12],
			[15, 8, 11],
			// Back
			[8, 12, 13],
			[13, 9, 8],
			// Bottom
			[12, 15, 14],
			[14, 13, 12],
		];

		return [cubeVertices.map((v) => new THREE.Vector3(...v)), cubeFaces.map((f) => new THREE.Face3(...f))];
	}
}
