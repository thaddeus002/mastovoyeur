;(function() {

    "use strict";

    var instance_url = "https://framapiaf.org"

    var title = document.getElementById("title");

    var body = document.getElementById("body");
    var ex = document.getElementById("model");

    body.removeChild(ex);

    title.textContent = title.textContent + instance_url;


    /**
     * Create an HTML element from a String.
     * @param html a String representing a HTML element
     * @return the corresponding element
     */
    function createElementFromHTML(html) {
        var template = document.createElement('template');
        template.innerHTML = html.trim();
        return template.content.firstChild;
    }


    /**
     * Appends a status in the table.
     * @param status the status to show
     */
    function showStatus(status) {

        var tr = ex.cloneNode(true);
        console.log(tr.childNodes.length);
        tr.children[0].textContent = status.created_at;

        var avatar = document.createElement('img');
        avatar.setAttribute('src',status.account.avatar);
        avatar.setAttribute('width', 80);
        tr.children[1].appendChild(avatar);
        var br = document.createElement('br');
        tr.children[1].appendChild(br);
        tr.children[1].append(status.account.display_name);
        
        tr.children[2].appendChild(createElementFromHTML(status.content));

        body.appendChild(tr);
    }


    /**
     * Get the public local timeline with instance API and fill the
     * table.
     */
    function getTimeline() {
            
        const req = new XMLHttpRequest();

        req.open("GET", instance_url + "/api/v1/timelines/public?local=yes", true);

        req.onload = function() {

            if (this.status != 200) {
                throw new Error("HTTP Error "+this.status+" : "+this.responseText);
            }

            var statuses = JSON.parse(this.responseText);
            statuses.forEach(showStatus);
        };
        req.send(null);
    }


    getTimeline();  
}());
