import { View } from "dhx-optimus";

export class ToolbarView extends View {
	init() {
		return (this.toolbar = new dhx.Toolbar(null, {
			css: "toolbar",
			data: [
				{
					type: "spacer",
				},
				{
					id: "first",
					value: "First Task",
					group: "views",
				},
				{
					id: "second",
					value: "Second Task",
					group: "views",
				},
				{
					type: "spacer",
				},
			],
		}));
	}

	ready() {
		this.observe(
			state => state.active,
			active => {
				this.toolbar.select(active);
			}
		);

		this.toolbar.events.on("click", id => {
			this.fire("viewChange", [id]);
		});
	}
}
