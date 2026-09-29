// @ts-check

import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: "My WriteUps",
			head: [
				{
					tag: "link",
					attrs: {
						rel: "icon",
						href: "/logo.svg",
						sizes: "32x32",
					},
				},
			],
			social: [
				{
					icon: "github",
					label: "GitHub",
					href: "https://github.com/sumit-poudel",
				},
			],
			sidebar: [
				{
					label: "Linux",
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: "linux", slug: "linux/story" },
						{ label: "zeditor", slug: "linux/zeditor" },
					],
				},
			],
		}),
	],
});
