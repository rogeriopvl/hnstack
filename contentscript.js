var entries = document.getElementsByClassName('title');

for (var i=0; i<entries.length; i+=2) {
	var entryRow = entries[i].parentNode;
	var entryId = entries[i].nextSibling.getElementsByTagName('a')[0].id;

	if (localStorage[entryId]) {
		entryRow.style.display = 'none';
		// i have to remove also the author line
	}

	console.log(entryRow);
	entryRow.addEventListener('click', function(){
		localStorage[entryId] = 1;
		this.style.display = 'none'; // change this to only hide after x minutes
	});
}
