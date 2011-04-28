/**
 * This chrome extension walks through the hacker news website < http://news.ycombinator.com >
 * and hides entries that have already been clicked on.
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

	var tableBody = itemsTable.getElementsByTagName("tbody")[0];
	tableBody.innerHTML += "<tr height=\"10px\"></tr><tr><td colspan=\"2\"></td><td class=\"title\"><h3>Read Items</h3></td><tr>";

	var tableRows = itemsTable.getElementsByTagName("tr");

	for (var i=0; i<tableRows.length; i++) {

		var rowLinks = tableRows[i].getElementsByTagName("a");

		if (tableRows[i].className != "read_item" && rowLinks[0] && rowLinks[0].id.indexOf("up_") != -1) {
			tableRows[i].id = rowLinks[0].id;

			if (hasReadEntry(rowLinks[0].id)) {
				tableRows[i].className = "read_item";
				var nextTr = tableRows[i+1];
				tableBody.appendChild(tableRows[i]);
				if (nextTr) {
					nextTr.className = "read_item";
					tableBody.appendChild(nextTr);
				}
			}
			else {
				tableRows[i].addEventListener("click", function(){
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
