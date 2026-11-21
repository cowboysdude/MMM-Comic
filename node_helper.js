/* MagicMirror² Module: MMM-Comic
 * By cowboysdude
 *
 * Reads the comic feeds at persistent.info (daily strips from GoComics).
 * No npm install needed: uses the fetch built into Node 18+.
 */
const NodeHelper = require("node_helper");
const Log = require("logger");

module.exports = NodeHelper.create({
	start () {
		Log.log(`Starting node helper for: ${this.name}`);
	},

	decode (s) {
		return String(s)
			.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"")
			.replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, "&");
	},

	parse (xml) {
		const strips = [];
		const entries = xml.match(/<entry[\s\S]*?<\/entry>/g) || [];
		for (const e of entries) {
			const img = e.match(/<img[^>]*\ssrc=["']([^"']+)["']/i) ||
				e.match(/&lt;img[^&]*?src=(?:&quot;|")([^"&]+)/i);
			if (!img) continue;
			const title = (e.match(/<title[^>]*>([\s\S]*?)<\/title>/) || [])[1] || "";
			const date = (e.match(/<published>([^<]+)<\/published>/) ||
				e.match(/<updated>([^<]+)<\/updated>/) || [])[1] || "";
			strips.push({ src: this.decode(img[1]), title: this.decode(title).trim(), date });
		}
		return strips;
	},

	async socketNotificationReceived (notification, payload) {
		if (notification !== "COMIC_GET") return;
		const { id, url } = payload;
		try {
			const res = await fetch(url, {
				headers: { "User-Agent": "MagicMirror MMM-Comic" },
				signal: AbortSignal.timeout(20000)
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const strips = this.parse(await res.text());
			if (!strips.length) throw new Error("No comics found in the feed");
			this.sendSocketNotification("COMIC_DATA", { id, strips });
		} catch (e) {
			Log.error(`[MMM-Comic] Could not get ${url}: ${e.message}`);
			this.sendSocketNotification("COMIC_ERROR", { id, message: e.message });
		}
	}
});
