/**
 * This chrome extension walks through the hacker news website < http://news.ycombinator.com >
 * and changes entries that have already been clicked on to the bottom of the page.
 * The read entries are stored in the localStorage database with the key "hnstack_entries".
 *
 * @author Rogério Vicente < http://rogeriopvl.com >
 * @version 0.6.1
 * @license BSD (check LICENSE file)
 */

chrome.extension.sendRequest("show_page_action");

window.addEventListener("load", function(){
    var hnstack = new HNStack();
    hnstack.renderReadContainer();
    hnstack.parseReadItems();
});

/**
 * HNStack constructor
 */
var HNStack = function(){
    // initialize localStorage if its first run
    localStorage.hnstack_entries = localStorage.hnstack_entries || "";

    var mainTable = document.getElementsByTagName("table")[2];
    mainTable.id = "hn_items";

    this.newsTable = mainTable.getElementsByTagName("tbody")[0];
    this.noReadItems = true;
};

/**
 * Creates a new set of <tr> elements in the table
 * to contain the items that were read.
 */
HNStack.prototype.renderReadContainer = function(){
    // create the tr spacer
    var trSpacer = document.createElement("tr");
    trSpacer.style.height = "30px";
    // create the read items header
    var trReadItems = document.createElement("tr");
    trReadItems.innerHTML = "<td colspan=\"2\"></td><td class=\"title\"><h3>Read News</h3></td>";

    this.newsTable.appendChild(trSpacer);
    this.newsTable.appendChild(trReadItems);
};

/**
 * Hide the table items that were read
 */
HNStack.prototype.parseReadItems = function(){
    var tableRows = this.newsTable.getElementsByTagName("tr");

    // callback for the click event
    var self = this;
    var clickCallback = function(){
        self.markRead(this.id);
    };

    for (var i=0; i<tableRows.length; i++){

        // ignore empty tr
        if (!tableRows[i].hasChildNodes()){
            continue;
        }

        var rowTitles = tableRows[i].getElementsByClassName("title");

        if (tableRows[i].className != "read_item" && rowTitles.length === 0){
            var rowSpan = tableRows[i].getElementsByTagName("span");
            if (rowSpan.length < 1){ continue; }
            var itemID = rowSpan[0].id.substr(6); // remove the score_ prefix

            if (this.isRead(itemID)){
                this.noReadItems = false;
                if (tableRows[i-2]){
                    tableRows[i-2].style.height = "0";
                }
                var currentTr = tableRows[i];
                currentTr.className = "read_item";
                this.newsTable.appendChild(tableRows[i-1]);
                this.newsTable.appendChild(currentTr);

                var trSpacer = document.createElement("tr");
                trSpacer.style.height = "5px";
                this.newsTable.appendChild(trSpacer);
            }
            else {
                var previousTr = tableRows[i-1];
                var tdItems = previousTr.getElementsByTagName("td");
                var mainTd = tdItems[tdItems.length-1];
                mainTd.id = itemID;
                mainTd.addEventListener("click", clickCallback);
            }
        }
        else { continue; }
    }

    // if no read items were found, place instructions
    if (this.noReadItems) {
        var trEmptyMessage = document.createElement("tr");
        var msgStr = "<td colspan=2></td><td>This is the place ";
        msgStr += "where the read news will appear. Click a ";
        msgStr += "news item and it will show up here when ";
        msgStr += "you return to this page.</td>";
        trEmptyMessage.innerHTML = msgStr;
        this.newsTable.appendChild(trEmptyMessage);
    }
    
};

/**
 * Marks an entry has read (adds its id to localStorage)
 * @param {String} id the id of the entry to mark has read
 */
HNStack.prototype.markRead = function(id){
    if (localStorage.hnstack_entries){
        // check if storage has more than 500 entries, if so, trim it
        if ((localStorage.hnstack_entries.match(/;/g)||[]).length > 501){
            this.cleanup();
        }
        localStorage.hnstack_entries += (id+";");
    }
    else {
        localStorage.hnstack_entries = ";"+id+";";
    }
};

/**
 * Checks if given entry was already read
 * @param {String} id the of the entry to check
 */
HNStack.prototype.isRead = function(id){
    return localStorage.hnstack_entries.indexOf(';'+id+';') !== -1;
};

/**
 * Removes first half entries from storage
 * This function is just to control the size of storage to avoid performance issues
 */
HNStack.prototype.cleanup = function(){
    var cutPoint = Math.round(localStorage.hnstack_entries.length / 2);
    var auxStr = localStorage.hnstack_entries.substr(cutPoint);
    var firstMarker = auxStr.indexOf(";");
    localStorage.hnstack_entries = auxStr.substr(firstMarker);
};
