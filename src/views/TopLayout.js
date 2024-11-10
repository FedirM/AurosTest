import { View } from "dhx-optimus";

import { ToolbarView } from "./ToolbarView";
import { FirstTaskView } from "./FirstTaskView";
import { SecondTaskView } from "./SecondTaskView";

export class TopLayout extends View {

	init() {
		return (this.layout = new dhx.Layout(null, {
			cols: [
				{
					id: "page-cell",
					rows: [
						{
							id: "tl-toolbar",
							height: "content",
							init: cell => this.show(cell, ToolbarView),
						},
						{
							id: 'content'
						}
					]
				}
			],
		}));
	}

	ready() {
		this.observe(
			state => state.active,
			active => {
				let view;
				switch (active) {
					case "first":
						view = FirstTaskView;
						break;
					case "second":
						view = SecondTaskView;
						break;
					default:
						view = null;
				}

				if (view) {
					const contentCell = this.layout.getCell("content");
					if (contentCell) {
						this.show(contentCell, view);
					} else {
						console.warn("Content cell not found for displaying view:", view);
					}
				}
			}
		);
	}
}