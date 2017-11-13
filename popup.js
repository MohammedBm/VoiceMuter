// Get host from URL

function getHost(url) {
  let hostRegex = /[\w-]+(\.[\w-]+)+/

  let result = hostRegex.exec(url)

  if (!result)
    return null
  else
    return result[0]
}
