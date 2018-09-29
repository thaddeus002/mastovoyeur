;(function(root) {

    "use strict";

    /**
     * Fills the HTML page with Mastodon's data.
     */
    let IHM = {};

    var input = document.getElementById("instance");

    var body = document.getElementById("body");
    var ex = document.getElementById("model");

    /** Id of the oldest loaded status */
    var lastStatusId = 0;

    body.removeChild(ex);


    /**
     * Create a html table of the attached files, with links to them.
     * @param attachments a list of objects
     * @return the new html element 
     */
    function createAttachmentsTable(attachments) {
        var table = document.createElement('table');
        table.setAttribute("class", "attachments_t");
        
        var i;

        for(i=0; i<attachments.length; i++) {

            var tr = document.createElement('tr');
            var item = document.createElement('td');
            var link = document.createElement('a');

            link.setAttribute('href', attachments[i].url);
            link.setAttribute('target', '_blank');
            if(attachments[i].type=="image") {
                var img = document.createElement('img');
                img.setAttribute('src', attachments[i].preview_url);
                img.setAttribute('width', attachments[i].meta.small.width);
                img.setAttribute('height', attachments[i].meta.small.height);
                link.appendChild(img);
            } else {
                link.textContent = attachments[i].type;
            }
            
            if(attachments[i].description != null) {
                link.setAttribute('alt', attachments[i].description);
            }
            item.appendChild(link);

            tr.appendChild(item);
            table.appendChild(tr);
        }

        return table;
    }


    /**
     * Remove all shown statuses from table.
     */
    function cleanStatuses() {
        HTML.removeChildren(body);
        lastStatusId = 0;
    }


    /**
     * Appends a status in the table.
     * @param status the status to show
     */
    function showStatus(status) {

        var tr = ex.cloneNode(true);
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
            HTML.addChildren(tr.children[2], HTML.createElementsFromHTML(status.content));
        }

        if(status.in_reply_to_id != null) {
            tr.children[2].appendChild(HTML.createElementParagraph("Follow discussion"));
        }


        if(status.media_attachments.length > 0) {
            var attach_st = status.media_attachments.length + " attachment";
            if(status.media_attachments.length > 1) {
                attach_st = attach_st + "s";
            }

            var p = HTML.createElementParagraph(attach_st);
            p.setAttribute('class', "attachments_h");

            tr.children[2].appendChild(p);
            tr.children[2].appendChild(createAttachmentsTable(status.media_attachments));
        }

        lastStatusId = status.id;
        body.appendChild(tr);
    }


    /**
     * Get the public timeline with instance API and fill the
     * table.
     */
    function getTimeline(id) {

        var instance_url = input.value;
        if(!instance_url) {
            instance_url = input.placeholder;
        }
        if(!instance_url) {
            instance_url = "https://mastodon.social";
        }

        var rangeList = document.getElementById("range");
        var range = rangeList.options[rangeList.selectedIndex].value;

        MASTO.getTimeline(instance_url, range, id, showStatus);
    }


    /**
     * Get the public timeline with instance API and fill the
     * table, removing old stuff.
     */
    IHM.refreshTimeline = function () {
        cleanStatuses();
        getTimeline(0);
    }


    IHM.loadMore = function() {
        getTimeline(lastStatusId);
    }


    root.IHM = IHM;
}(this));