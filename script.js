;(function(root) {

    "use strict";

    let MASTO = {};

    var input = document.getElementById("instance");

    var body = document.getElementById("body");
    var ex = document.getElementById("model");

    var rangeList= document.getElementById("range");
    var range = rangeList.options[rangeList.selectedIndex].value;

    body.removeChild(ex);



    /**
     * Create HTML elements from a String.
     * @param html a String representing an or more HTML element
     * @return the corresponding array of elements
     */
    function createElementsFromHTML(html) {
        var template = document.createElement('template');
        template.innerHTML = html.trim();
        return template.content.children;
    }


    /**
     * Create a new HTML paragraph with a given text.
     */
    function createElementParagraph(text) {
        var p = document.createElement('p');
        p.textContent = text;
        return p;
    }


    /**
     * Add children to an HTML element.
     * @param parent the parent where add the children
     * @param children an array of children to add
     *
     */
    function addChildren(parent, children) {
        for(var i=0; i<children.length; i++) {
            parent.appendChild(children[i]);
        }
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
            link.setAttribute('target', '_blank');
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
        var linkn = document.createElement('a');
        linkn.setAttribute('href', status.account.url);
        linkn.textContent=name;
        tr.children[1].appendChild(linkn);

        // an error can occur without this test
        if(status.content.length > 0) {
            addChildren(tr.children[2], createElementsFromHTML(status.content));
        }
        if(status.in_reply_to_id != null) {
            tr.children[2].appendChild(createElementParagraph("Follow discussion"));
        }

        tr.children[3].appendChild(createAttachmentsList(status.media_attachments));

        body.appendChild(tr);
    }



    /**
     * Get the public local timeline with instance API and fill the
     * table.
     */
    MASTO.getTimeline = function () {
            
        const req = new XMLHttpRequest();

        var local="local=yes&";

        var instance_url = input.value;
        if(!instance_url) {
            instance_url = "https://framapiaf.org";
        }

        if(range == "federated") {
            local = "";
        }
        req.open("GET", instance_url + "/api/v1/timelines/public?"+local+"limit=40", true);

        req.onload = function() {

            if (this.status != 200) {
                throw new Error("HTTP Error "+this.status+" : "+this.responseText);
            }

            var statuses = JSON.parse(this.responseText);
            statuses.forEach(showStatus);
        };
        req.send(null);
    }

    root.MASTO = MASTO;
}(this));
