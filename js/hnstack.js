/**
 * This chrome extension walks through the hacker news website < http://news.ycombinator.com >
 * and changes entries that have already been clicked on to the bottom of the page.
 * The read entries are stored in the localStorage database with the key "hnstack_entries".
 *
 * @author Rogério Vicente < http://rogeriopvl.com >
 * @version 0.1
 * @license BSD (check LICENSE file)
 */

chrome.extension.sendRequest("show_page_action");

window.addEventListener("load", function(){
		
	var tables = document.getElementsByTagName("table");
	var itemsTable = tables[2];
	itemsTable.id = "hn_items";

	// get the news table
	var tableBody = itemsTable.getElementsByTagName("tbody")[0];
	
	// create the table extension dividing the unread items from the read items
	var trSpacer = document.createElement("tr");
	trSpacer.style.height = "30px";
	tableBody.appendChild(trSpacer);
	
	var trReadItems = document.createElement("tr");
	trReadItems.innerHTML = "<td colspan=\"2\"></td><td class=\"title\"><h3>Read Items</h3></td>";
	tableBody.appendChild(trReadItems);

	var tableRows = itemsTable.getElementsByTagName("tr");

	for (var i=0; i<tableRows.length; i++) {

		// ignore empty tr
		if (!tableRows[i].hasChildNodes()) {
			continue;
		}
		
		var rowTitles = tableRows[i].getElementsByClassName("title");
		
		if (tableRows[i].className != "read_item" && rowTitles.length == 0) {

			var rowSpan = tableRows[i].getElementsByTagName("span");
			var itemID = rowSpan[0].id.substr(6); // remove the score_ prefix

			if (hasReadEntry(itemID)) {
				if (tableRows[i-2]) {
					tableRows[i-2].style.height = "0";
				}
				var currentTr = tableRows[i];
				currentTr.className = "read_item";
				tableBody.appendChild(tableRows[i-1]);
				tableBody.appendChild(currentTr);
				
				var trSpacer = document.createElement("tr");
				trSpacer.style.height = "5px";
				tableBody.appendChild(trSpacer);
			}
			else {
				var previousTr = tableRows[i-1];
				var tdItems = previousTr.getElementsByTagName("td");
				var mainTd = tdItems[tdItems.length-1];
				mainTd.id = itemID;
				mainTd.addEventListener("click", function(){
					markEntryHasRead(this.id);
				});
			}
		}
		else { continue; }
	}
});

/* Adds an entry to the localStorage string */
function markEntryHasRead(id) {
	if (localStorage["hnstack_entries"]) {
		cleanupOldEntries();
		localStorage["hnstack_entries"] += (id+";");
	}
	else {
		localStorage["hnstack_entries"] = id+";";
	}
}

/* Checks if and entry is in the localStorage string */
function hasReadEntry(id) {
	return localStorage["hnstack_entries"] ? localStorage["hnstack_entries"].indexOf(id) != -1 : false;
}

/* Removes entries that are 2 weeks old */
function cleanupOldEntries() {
	if (localStorage["hnstack_entries"].length >= 10000) {
		var firstMarker = localStorage["hnstack_entries"].indexOf(";");
		localStorage["hnstack_entries"] = localStorage["hnstack_entries"].substr(firstMarker+1);
	}
}
