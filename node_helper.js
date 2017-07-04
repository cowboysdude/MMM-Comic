const NodeHelper = require('node_helper');
var request = require('request');
const parser = require('xml2js').parseString;


module.exports = NodeHelper.create({
	  
    start: function() {
    	console.log("Starting module: " + this.name);
    },
    
    
     getComic: function(url) {
    	request({ 
    	          url: url,
    	          method: 'GET' 
    	        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                parser(body, (err, result)=> {
                        var result = JSON.parse(JSON.stringify(result.feed.entry));
                        this.sendSocketNotification("COMIC_RESULT", result);
                });
            }
       });
    },

    //Subclass socketNotificationReceived received.
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_COMIC') {
                this.getComic(payload);
            }
         }  
    });
