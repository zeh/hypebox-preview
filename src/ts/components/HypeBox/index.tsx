import * as React from "react";
import * as THREE from "three";

const BOX_DIAMETER = 2.5;
const BOX_THICKNESS = 0.2;
const DOOR_INDENT = 0.15;

interface IProps {
	image?: HTMLImageElement;
}

export default class HypeBox extends React.Component<IProps> {
	public constructor(props: IProps) {
		super(props);
	}

	public render(): JSX.Element {
		// With fragment shader too:
		// https://codesandbox.io/s/react-three-fiber-custom-geometry-with-fragment-shader-material-vxswf?from-embed
		// geometry =
		//<sphereGeometry attach={"geometry"} args={[1, 16, 16]} />
		// onClick={(e) => setActive(!active)}
		// onPointerOver={(e) => setHover(true)}
		// onPointerOut={(e) => setHover(false)}

		const [doorVertices, doorFaces, doorUVs] = this.generateDoorMesh();
		const [boxVertices, boxFaces] = this.generateBoxMesh();

		// TODO: memoize this, regenerate as needed instead
		const { image } = this.props;
		let texture: THREE.Texture | null = null;
		if (image) {
			texture = new THREE.Texture(image);
			texture.needsUpdate = true;
		}

		return (
			<group>
				<mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
					<geometry
						attach={"geometry"}
						vertices={doorVertices}
						faces={doorFaces}
						faceVertexUvs={doorUVs}
						onUpdate={(self) => self.computeFaceNormals()}
					/>
					{texture ? (
						<meshBasicMaterial attach={"material"} map={texture} transparent={true} blending={THREE.MultiplyBlending} />
					) : (
						<meshStandardMaterial attach={"material"} color={"#999999"} transparent={true} />
					)}
				</mesh>
				<mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
					<geometry
						attach={"geometry"}
						vertices={boxVertices}
						faces={boxFaces}
						onUpdate={(self) => self.computeFaceNormals()}
					/>
					<meshStandardMaterial attach={"material"} color={"#999999"} transparent={true} />
				</mesh>
			</group>
		);
	}

	private generateDoorMesh(): [THREE.Vector3[], THREE.Face3[], THREE.Vector2[][][]] {
		const ddi = BOX_DIAMETER / 2 - BOX_THICKNESS;
		const ddd = BOX_DIAMETER / 2 - DOOR_INDENT;

		const vertices: Array<[number, number, number]> = [
			[-ddi, ddi, ddd],
			[ddi, ddi, ddd],
			[ddi, -ddi, ddd],
			[-ddi, -ddi, ddd],
		];

		const faces: Array<[number, number, number]> = [
			[0, 3, 2],
			[2, 1, 0],
		];

		// Material (unused here), face, vertex
		const uvs: Array<Array<[number, number]>> = [
			[
				[0, 1],
				[0, 0],
				[1, 0],
			],
			[
				[1, 0],
				[1, 1],
				[0, 1],
			],
		];

		return [
			vertices.map((v) => new THREE.Vector3(...v)),
			faces.map((f) => new THREE.Face3(...f)),
			[uvs.map((f) => f.map((v) => new THREE.Vector2(...v)))],
		];
	}

	private generateBoxMesh(): [THREE.Vector3[], THREE.Face3[]] {
		const ddo = BOX_DIAMETER / 2;
		const ddi = ddo - BOX_THICKNESS;

		// Outside: top (clockwise), bottom (clockwise)
		// Inside: top (clockwise), bottom (clockwise)
		const vertices: Array<[number, number, number]> = [
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

		const faces: Array<[number, number, number]> = [
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

		return [vertices.map((v) => new THREE.Vector3(...v)), faces.map((f) => new THREE.Face3(...f))];
	}
}
