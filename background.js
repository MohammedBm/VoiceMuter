// Returns true if site is trusted, otherwise false

function isTrusted(url) {
  return new Promise((res, rej) => {
    chrome.storage.sync.get(url, (items) => {
      if (items[url]) {
        res(true)
      } else {
        rej(false)
      }
    })
  })
}

// Get host from URL
function getHost(url) {
  let hostRegex = /[\w-]+(\.[\w-]+)+/

  let result = hostRegex.exec(url)

  if (!result)
    return null
  else
    return result[0]
}

// Destroy audible, inactive, distrusted tabs

function muteTab(tab) {
  let url = getHost(tab["url"])

  isTrusted(url)
    .then(() => {
      chrome.tabs.update(tab["id"], { "muted": false })
    })
    .catch(() => {
      if (tab["audible"] && !tab["highlighted"]) {
        chrome.tabs.update(tab["id"], { "muted": true })
      } else {
        chrome.tabs.update(tab["id"], { "muted": false })
      }
    })
}

// when tabs start palying sounds it will be muted

chrome.tabs.onUpdated.addListener((id, info, tab) => {
  muteTab(tab)
})

// when the user move tab it will mute it
chrome.tabs.onHighlightChanged.addListener((info) => {
  chrome.tabs.query({ "audible": true }, (tabs) => {
    for (tab of tabs) {
      muteTab(tab)
    }
  })
})
