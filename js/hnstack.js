/**
 * This chrome extension walks through the hacker news website < http://news.ycombinator.com >
 * and changes entries that have already been clicked on to the bottom of the page.
 * The read entries are stored in the localStorage database with the key "hnstack_entries".
 */

chrome.extension.sendRequest('show_page_action')

window.addEventListener('load', function () {
  var hnstack = new HNStack()
  hnstack.renderReadContainer()
  hnstack.parseReadItems()
})

var HNStack = function () {
  // initialize localStorage if its first run
  localStorage.hnstack_entries = localStorage.hnstack_entries || ''

  var mainTable = document.querySelector('.itemlist')
  this.newsTable = mainTable.querySelector('tbody')
  this.noReadItems = true
}

HNStack.prototype.renderReadContainer = function () {
  var trSpacer = document.createElement('tr')
  trSpacer.style.height = '30px'

  var trReadItems = document.createElement('tr')
  trReadItems.innerHTML =
    '<td colspan="2"></td><td class="title"><h3>Read News</h3></td>'

  this.newsTable.appendChild(trSpacer)
  this.newsTable.appendChild(trReadItems)
}

HNStack.prototype.parseReadItems = function () {
  var self = this

  var clickCallback = function (ev) {
    var el = ev.target
    if (el.tagName === 'A' && el.classList.contains('storylink')) {
      self.markRead(el.parentNode.parentNode.id)
    }
  }

  this.newsTable.addEventListener('click', clickCallback)

  var items = this.newsTable.querySelectorAll('.athing')

  items.forEach(function (item) {
    if (item.id && self.isRead(item.id)) {
      self.noReadItems = false

      var footer = item.nextElementSibling
      var spacer = footer.nextElementSibling

      self.newsTable.appendChild(item)
      self.newsTable.appendChild(footer)
      self.newsTable.appendChild(spacer)
    }
  })

  if (this.noReadItems) {
    var trEmptyMessage = document.createElement('tr')
    var msgStr = '<td colspan=2></td><td>This is the place '
    msgStr += 'where the read news will appear. Click a '
    msgStr += 'news item and it will show up here when '
    msgStr += 'you return to this page.</td>'
    trEmptyMessage.innerHTML = msgStr
    this.newsTable.appendChild(trEmptyMessage)
  }
}

HNStack.prototype.markRead = function (id) {
  if (localStorage.hnstack_entries) {
    // check if storage has more than 500 entries, if so, trim it
    if ((localStorage.hnstack_entries.match(/;/g) || []).length > 501) {
      this.cleanup()
    }
    localStorage.hnstack_entries += id + ';'
  } else {
    localStorage.hnstack_entries = ';' + id + ';'
  }
}

HNStack.prototype.isRead = function (id) {
  return localStorage.hnstack_entries.indexOf(';' + id + ';') !== -1
}

/**
 * Removes first half entries from storage
 * This function is just to control the size of storage to avoid performance issues
 */
HNStack.prototype.cleanup = function () {
  var cutPoint = Math.round(localStorage.hnstack_entries.length / 2)
  var auxStr = localStorage.hnstack_entries.substr(cutPoint)
  var firstMarker = auxStr.indexOf(';')
  localStorage.hnstack_entries = auxStr.substr(firstMarker)
}
