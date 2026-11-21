/* MagicMirror² Module: MMM-Comic
 * By cowboysdude
 *
 * Shows the newest Calvin and Hobbes or Frazz comic strip
 * (or flips through the last couple of weeks of strips).
 */
Module.register("MMM-Comic", {
	defaults: {
		type: "calvin",          // "calvin" or "frazz"
		feedUrl: "",             // optional: any other persistent.info/scraped/... feed
		showTitle: true,         // show the comic name and date above the strip
		rotate: false,           // true = flip through recent strips instead of only the newest
		rotateInterval: 30 * 60 * 1000,  // with rotate: true, next strip every 30 minutes
		updateInterval: 60 * 60 * 1000,  // check for a new strip every hour
		retryDelay: 5 * 60 * 1000,       // try again after 5 minutes if it fails
		maxWidth: "800px",
		grayscale: false,        // true = black and white (the Sunday strips are in color)
		animationSpeed: 1000
	},

	feeds: {
		calvin: { name: "Calvin and Hobbes", url: "http://persistent.info/scraped/calvinandhobbes.xml" },
		frazz: { name: "Frazz", url: "http://persistent.info/scraped/frazz.xml" }
	},

	getStyles () {
		return [this.file("MMM-Comic.css")];
	},

	start () {
		Log.info(`Starting module: ${this.name}`);
		this.strips = [];
		this.index = 0;
		this.error = null;
		const feed = this.feeds[String(this.config.type).toLowerCase()];
		this.url = this.config.feedUrl || (feed && feed.url) || null;
		this.comicName = feed && !this.config.feedUrl ? feed.name : "";
		if (!this.url) return;
		this.request();
		setInterval(() => this.request(), this.config.updateInterval);
		if (this.config.rotate) {
			setInterval(() => {
				if (this.strips.length > 1) {
					this.index = (this.index + 1) % this.strips.length;
					this.updateDom(this.config.animationSpeed);
				}
			}, this.config.rotateInterval);
		}
	},

	request () {
		this.sendSocketNotification("COMIC_GET", { id: this.identifier, url: this.url });
	},

	socketNotificationReceived (notification, payload) {
		if (!payload || payload.id !== this.identifier) return;
		if (notification === "COMIC_DATA") {
			const newest = this.strips[0] && this.strips[0].src;
			this.strips = payload.strips;
			this.error = null;
			if (!this.config.rotate || this.index >= this.strips.length) this.index = 0;
			if (newest === this.strips[0].src && this.loadedOnce) return; // nothing new
			this.loadedOnce = true;
		} else if (notification === "COMIC_ERROR") {
			this.error = payload.message;
			clearTimeout(this.retryTimer);
			this.retryTimer = setTimeout(() => this.request(), this.config.retryDelay);
			if (this.strips.length) return; // keep showing the last good strip
		}
		this.updateDom(this.config.animationSpeed);
	},

	niceDate (iso) {
		const d = new Date(iso);
		if (isNaN(d)) return "";
		return d.toLocaleDateString(config.language || "en",
			{ weekday: "long", month: "long", day: "numeric", timeZone: "UTC" });
	},

	getDom () {
		const wrap = document.createElement("div");
		wrap.className = "comic";
		wrap.style.maxWidth = this.config.maxWidth;

		if (!this.url) {
			wrap.className = "small dimmed";
			wrap.textContent = `MMM-Comic: type must be "calvin" or "frazz" (or set feedUrl).`;
			return wrap;
		}
		if (!this.strips.length) {
			wrap.className = "small dimmed";
			wrap.textContent = this.error ? "Comic not available right now. Trying again soon." : "Getting your comic…";
			return wrap;
		}

		const strip = this.strips[this.index];
		if (this.config.showTitle) {
			const t = document.createElement("div");
			t.className = "comic-title xsmall dimmed";
			const name = this.comicName || strip.title.split(" for ")[0] || "";
			const date = this.niceDate(strip.date);
			t.textContent = [name, date].filter(Boolean).join("  ·  ");
			wrap.appendChild(t);
		}
		const img = document.createElement("img");
		img.className = "comic-strip";
		if (this.config.grayscale) img.classList.add("comic-gray");
		img.src = strip.src;
		img.alt = strip.title;
		img.referrerPolicy = "no-referrer";
		wrap.appendChild(img);
		return wrap;
	}
});
