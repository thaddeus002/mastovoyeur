;(function(root) {

    "use strict";

    /**
     * Contains functions to retreive data from Mastodon API.
     */
    let MASTO = {};


    /**
     * Get the timeline of an instance and call a callback function on
     * each status of this timeline.
     * @param instance_url url of a Mastodon instance
     * @param range can be "local" for the local timeline or
     *        "federated" for the federated timeline
     * @param id the mix id of the wanted statuses
     * @param callback a function taking a status as parameter 
     */
    MASTO.getTimeline = function(instance_url, range, id, callback) {

        const req = new XMLHttpRequest();

        var local="local=yes&";
        var maxid="";

        if(range == "federated") {
            local = "";
        }

        if(id!=0) {
            maxid="&max_id="+id;
        }
        
        req.open("GET", instance_url + "/api/v1/timelines/public?"+local+"limit=40"+maxid, true);

        req.onload = function() {

            if (this.status != 200) {
                throw new Error("HTTP Error "+this.status+" : "+this.responseText);
            }

            var statuses = JSON.parse(this.responseText);
            statuses.forEach(callback);
        };
        req.send(null);
    }

    root.MASTO = MASTO;
}(this));
