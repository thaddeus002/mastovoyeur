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
     * Create a html list of the attached files, with links to them.
     * @param attachments a list of objects
     * @return the new html element 
     */
    function createAttachmentsList(attachments) {
		var list = document.createElement('ul');
        var i;

        for(i=0; i<attachments.length; i++) {

            var item = document.createElement('li');
            var link = document.createElement('a');

            link.setAttribute('href', attachments[i].url);
            link.textContent = attachments[i].type;
            if(attachments[i].description != null) {
                link.setAttribute('alt', attachments[i].description);
		    }
            item.appendChild(link);

            list.appendChild(item);
		}

		return list;
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
        var name = status.account.display_name;
        if(name.trim().length === 0) {
			name = status.account.acct;
		}
        tr.children[1].append(name);

        // an error can occur without this test
        if(status.content.length > 0) {
            tr.children[2].appendChild(createElementFromHTML(status.content));
        }

        tr.children[3].appendChild(createAttachmentsList(status.media_attachments));

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
