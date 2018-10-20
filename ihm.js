;(function(root) {

    "use strict";

    /**
     * Fills the HTML page with Mastodon's data.
     */
    let IHM = {};

    var input = document.getElementById("instance");

    var body = document.getElementById("body");

    /** Id of the oldest loaded status */
    var lastStatusId = 0;

    var discussion = document.getElementById("discussion");
    var timeline = document.getElementById("statuses");
    var dbody = document.getElementById("discussion_body");


    /**
     * Create a html table of the attached files, with links to them.
     * @param attachments a list of objects
     * @param sensitive true if the status is sensitive. Then don't show
     *        the images
     * @return the new html element 
     */
    function createAttachmentsTable(attachments, sensitive) {
        var table = document.createElement('table');
        table.setAttribute("class", "attachments_t");
        
        var i;

        for(i=0; i<attachments.length; i++) {

            var tr = document.createElement('tr');
            var item = document.createElement('td');
            var link = document.createElement('a');

            link.setAttribute('href', attachments[i].url);
            link.setAttribute('target', '_blank');
            if(attachments[i].type=="image" && !sensitive) {
                var img = document.createElement('img');
                img.setAttribute('src', attachments[i].preview_url);
                img.setAttribute('width', attachments[i].meta.small.width);
                img.setAttribute('height', attachments[i].meta.small.height);
                link.appendChild(img);
            } else {
                link.textContent = attachments[i].type;
                if(sensitive) {
                    link.textContent = link.textContent + " (sensitive)";
                }
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
     * Shows a status metadata as time and user.
     * @param cell a HTML element where show the infos
     * @param status a Mastodon status
     */
    function showStatusMetadata(cell, status) {

        var avatar = document.createElement('img');
        avatar.setAttribute('src',status.account.avatar);
        avatar.setAttribute('width', 80);
        cell.appendChild(avatar);
        var br = document.createElement('br');
        cell.appendChild(br);
        var name = status.account.display_name;
        if(name.trim().length === 0) {
            name = status.account.acct;
        }
        var linkn = document.createElement('a');
        linkn.setAttribute('href', status.account.url);
        linkn.textContent=name;
        cell.appendChild(linkn);
    }


    /**
     * Create an html table line to show the status in.
     * @return a tr element with 3 td
     */
    function createStatusLine() {
        var tr = document.createElement('tr');
        tr.appendChild(document.createElement('td'));
        tr.appendChild(document.createElement('td'));
        tr.appendChild(document.createElement('td'));
        return tr;
    }


    /**
     * Appends a status in the table.
     * @param status the status to show
     */
    function showStatus(status) {

        var tr = createStatusLine();

        tr.children[0].textContent = status.created_at;

        showStatusMetadata(tr.children[1], status);

        // an error can occur without this test
        if(status.content.length > 0) {
            HTML.addChildren(tr.children[2], HTML.createElementsFromHTML(status.content));
        }

        if(status.in_reply_to_id != null) {
            var button = document.createElement("button");
            button.textContent = "Follow discussion";
            button.setAttribute("onclick", "IHM.followDiscussion(\""+status.id+"\")");
            tr.children[2].appendChild(button);
        }

        if(status.media_attachments.length > 0) {
            var attach_st = status.media_attachments.length + " attachment";
            if(status.media_attachments.length > 1) {
                attach_st = attach_st + "s";
            }

            var p = HTML.createElementParagraph(attach_st);
            p.setAttribute('class', "attachments_h");

            tr.children[2].appendChild(p);
            tr.children[2].appendChild(createAttachmentsTable(status.media_attachments, status.sensitive));
        }

        lastStatusId = status.id;
        body.appendChild(tr);
    }


    /**
     * get the url of the instane of interest.
     */
    function instance_url() {

        var instance_url = input.value;
        if(!instance_url) {
            instance_url = input.placeholder;
        }
        if(!instance_url) {
            instance_url = "https://mastodon.social";
        }
        return instance_url;
    }


    /**
     * Appends a status in the table discussion table with its history.
     * @param status the status to show
     */
    function showDiscussionStatus(status) {

        var tr = createStatusLine();
        tr.children[0].textContent = status.created_at;

        showStatusMetadata(tr.children[1], status);

        // an error can occur without this test
        if(status.content.length > 0) {
            HTML.addChildren(tr.children[2], HTML.createElementsFromHTML(status.content));
        }

        if(status.media_attachments.length > 0) {
            var attach_st = status.media_attachments.length + " attachment";
            if(status.media_attachments.length > 1) {
                attach_st = attach_st + "s";
            }

            var p = HTML.createElementParagraph(attach_st);
            p.setAttribute('class', "attachments_h");

            tr.children[2].appendChild(p);
            tr.children[2].appendChild(createAttachmentsTable(status.media_attachments, status.sensitive));
        }

        dbody.appendChild(tr);

        if(status.in_reply_to_id != null) {
            MASTO.getStatus(instance_url(), status.in_reply_to_id, showDiscussionStatus);
        }
    }


    /**
     * Get the public timeline with instance API and fill the
     * table.
     */
    function getTimeline(id) {

        var rangeList = document.getElementById("range");
        var range = rangeList.options[rangeList.selectedIndex].value;

        MASTO.getTimeline(instance_url(), range, id, showStatus);
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


    IHM.followDiscussion = function(statusId) {
        discussion.style.display = "block";
        timeline.style.display = "none";
        HTML.removeChildren(dbody);
        console.log("get status "+statusId);
        MASTO.getStatus(instance_url(), statusId, showDiscussionStatus);        
    }


    IHM.goBackToTimeline = function() {
        discussion.style.display = "none";
        timeline.style.display = "block";
    }

    root.IHM = IHM;
}(this));
