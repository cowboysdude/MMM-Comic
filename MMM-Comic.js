/* Magic Mirror
 * Module: MMM-Comic
 *
 * By Cowboysdude
 *
 */
Module.register("MMM-Comic", {

    // Module config defaults.
    defaults: {
        rotateInterval: 60 * 1000, // New every 60 Min.
        maxWidth: "100%",
        animationSpeed: 3000,
        initialLoadDelay: 4250,
        retryDelay: 2500,
        updateInterval: 60 * 1000,

    },

    getStyles: function() {
        return ["MMM-Comic.css"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);

        requiresVersion: "2.1.0",

            //  Set locale.
            this.url = "http://persistent.info/scraped/calvinandhobbes.xml";
        this.comic = [];
        this.activeItem = 0;
        this.rotateInterval = null;
        this.scheduleUpdate();
    },

    getDom: function() {

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.innerHTML = "Shuffling your comic . . .";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        var comic = this.comic;

        var keys = Object.keys(this.comic);
        if (keys.length > 0) {
            if (this.activeItem >= keys.length) {
                this.activeItem = 0;
            }
            var comic = this.comic[keys[this.activeItem]];
            console.log(comic.content[0].div[0].img[0].$.src);
            console.log(comic);
            var top = document.createElement("div");
            top.classList.add("list-row");

            // card # 1
            var pic = document.createElement("div");
            var img = document.createElement("img");
            img.classList.add("photo");
            img.src = comic.content[0].div[0].img[0].$.src;
            pic.appendChild(img);
            wrapper.appendChild(pic);
        }
        return wrapper;
    },


    processComic: function(data) {
        this.today = data.Today;
        this.comic = data;
        this.loaded = true;
    },

    scheduleCarousel: function() {
        console.log("Carousel of Cards fucktion!");
        this.rotateInterval = setInterval(() => {
            this.activeItem++;
            this.updateDom(this.config.animationSpeed);
        }, this.config.rotateInterval);
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getComic();
        }, this.config.updateInterval);
        this.getComic(this.config.initialLoadDelay);
    },

    getComic: function() {
        this.sendSocketNotification('GET_COMIC', this.url);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "COMIC_RESULT") {
            this.processComic(payload);
            if (this.rotateInterval == null) {
                this.scheduleCarousel();
            }
            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});