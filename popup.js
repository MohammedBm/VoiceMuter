// Get host from URL

function getHost(url) {
  let hostRegex = /[\w-]+(\.[\w-]+)+/

  let result = hostRegex.exec(url)

  if (!result)
    return null
  else
    return result[0]
}


// save input url

function saveURL(url){
  url = getHost(url)

  if (!url) {
    createMessage("Invalid site name.", "red")
    return
  }

  let newObj = {}
  newObj[url] = url

  chrome.storage.sync.set(newObj, () => {
    createMessage(`Added ${url}`, "green")
  })

  updateList()
}

// create message under the site list

function createMessage(str, color) {
  const message = document.querySelector('#message')

  message.style.color = color
  message.innerHTML = str
}

//update the list 
function updateList() {
  const list = document.querySelector('#site-list')
  list.innerHTML = ''

  chrome.storage.sync.get(null, (items) => {
    for (item in items) {
      // anchor button
      let xBtn = document.createElement("A")
      let xClass = document.createAttribute("class")
      xClass.value = "fa fa-times"
      let xHref = document.createAttribute("href")
      xHref.value = ""
      let xData = document.createAttribute("data-site")
      xData.value = `${item}`
      xBtn.setAttributeNode(xClass)
      xBtn.setAttributeNode(xHref)
      xBtn.setAttributeNode(xData)

      // list item
      let liNode = document.createElement("LI")
      let textnode = document.createTextNode(item)
      liNode.appendChild(xBtn)
      liNode.appendChild(textnode)

      list.appendChild(liNode)

      // Button logic
      xBtn.addEventListener("click", (event) => {
        event.preventDefault()
        let site = event.target.attributes["data-site"].nodeValue
        removeSite(site)
      })
    }
  })
}

function removeSite(site) {
  chrome.storage.sync.remove(site, () => {
    createMessage(`Removed ${site}`, "green")
    updateList()
  })
}

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#add-btn")
  const input = document.querySelector("#site-input")

  const addCurrentBtn = document.querySelector('#add-current-btn')

  updateList()

  addBtn.addEventListener("click", () => {
    saveURL(input.value)
  })

  chrome.tabs.query({ "highlighted": true, "currentWindow": true }, (tabs) => {
    let { url } = tabs[0]
    input.value = getHost(url)
  })
})
