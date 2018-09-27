;(function(root) {

    "use strict";

    /**
     * Add some HTML utilities.
     */
    let HTML = {};


    /**
     * Create HTML elements from a String.
     * @param html a String representing an or more HTML element
     * @return the corresponding array of elements
     */
    HTML.createElementsFromHTML = function(html) {
        var template = document.createElement('template');
        template.innerHTML = html.trim();
        return template.content.children;
    }


    /**
     * Create a new HTML paragraph with a given text.
     */
    HTML.createElementParagraph = function(text) {
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
    HTML.addChildren = function (parent, children) {
        for(var i=0; i<children.length; i++) {
            parent.appendChild(children[i]);
        }
    }


    /**
     * Remove the chidren of an HTML element.
     * @param parent the html node to empty
     */
    HTML.removeChildren = function(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }


    root.HTML = HTML;
}(this));
