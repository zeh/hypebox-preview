import * as React from "react";
import cx from "classnames";

import styles from "./styles";

interface IProps {
	onDropFiles?: (files: File[]) => void;
}

interface IState {
	isDraggingOverWindow: boolean;
}

export default class DropTarget extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);

		this.handleDrop = this.handleDrop.bind(this);
		this.handleDragOver = this.handleDragOver.bind(this);
		this.handleDragLeave = this.handleDragLeave.bind(this);
		this.handleWindowDragEnter = this.handleWindowDragEnter.bind(this);
		this.handleWindowDrop = this.handleWindowDrop.bind(this);

		this.state = {
			isDraggingOverWindow: false,
		};
	}

	public componentDidMount(): void {
		window.addEventListener("dragenter", this.handleWindowDragEnter);
		window.addEventListener("drop", this.handleWindowDrop);
	}

	public componentWillUnmount(): void {
		window.removeEventListener("dragenter", this.handleWindowDragEnter);
		window.removeEventListener("drop", this.handleWindowDrop);
	}

	public render(): JSX.Element {
		const { isDraggingOverWindow } = this.state;

		const classes = [styles.main, isDraggingOverWindow ? undefined : styles.hidden];

		return (
			<div
				className={cx(classes)}
				onDrop={this.handleDrop}
				onDragOver={this.handleDragOver}
				onDragLeave={this.handleDragLeave}
			/>
		);
	}

	private handleDrop(e: React.DragEvent<HTMLDivElement>): void {
		// Prevent default behavior (Prevent file from being opened)
		e.preventDefault();

		if (e.dataTransfer.items) {
			// Use DataTransferItemList interface to access the file(s)
			const files: File[] = [];
			for (let i = 0; i < e.dataTransfer.items.length; i++) {
				// If dropped items aren't files, reject them
				if (e.dataTransfer.items[i].kind === "file") {
					const file = e.dataTransfer.items[i].getAsFile();
					if (file) files.push(file);
				}
			}
			this.handleFilesDrop(files);
		} else {
			// Use DataTransfer interface to access the file(s)
			const files: File[] = [];
			for (let i = 0; i < e.dataTransfer.files.length; i++) {
				const file = e.dataTransfer.files[i];
				if (file) files.push(file);
			}
			this.handleFilesDrop(files);
		}
		// TODO: Maybe read with https://developer.mozilla.org/en-US/docs/Web/API/File
	}

	private handleFilesDrop(files: File[]): void {
		if (files.length > 0 && this.props.onDropFiles) {
			this.props.onDropFiles(files);
		}
	}

	private handleDragOver(e: React.DragEvent<HTMLDivElement>): void {
		e.preventDefault();
	}

	private handleDragLeave(): void {
		this.setState({
			isDraggingOverWindow: false,
		});
	}

	private handleWindowDragEnter(): void {
		if (!this.state.isDraggingOverWindow) {
			this.setState({
				isDraggingOverWindow: true,
			});
		}
	}

	private handleWindowDrop(e: DragEvent): void {
		this.setState({
			isDraggingOverWindow: false,
		});
		e.preventDefault();
	}
}
