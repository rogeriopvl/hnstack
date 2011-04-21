window.addEventListener('load', function(){
	var entries = document.getElementsByClassName('title');

	for (var i=0; i<entries.length; i+=2) {
		var entryRow = entries[i].parentNode;
		var nextElem = entries[i].nextSibling;

		if (nextElem) {
			var voteLink = nextElem.getElementsByTagName('a')[0];
			if (voteLink) {
				var entryId = voteLink.id;
			}
			else { continue; }
		}
		else { continue; }

		if (localStorage[entryId] == "1") {
			console.log('found '+entryId);
			entryRow.style.display = 'none';
			// i have to remove also the author line
		}
		else {
			entryRow.addEventListener('click', function(){
				localStorage[entryId] = 1;
				//this.style.display = 'none'; // change this to only hide after x minutes
			});
		}
	}
});
