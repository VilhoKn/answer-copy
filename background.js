function urlCheck(url) {
   return url && (url.includes("kampus.sanomapro.fi/content-feed") || url.includes("materiaalit.otava.fi/web/"))
}

chrome.tabs.onUpdated.addListener((tabId, tab) => {
    if (urlCheck(tab.url)) {
        chrome.tabs.sendMessage(tabId, {type: "init", site: tab.url.split(".")[1], url: tab.url});
    }
});

chrome.runtime.onMessage.addListener((obj, sender, sendRes) => {
  const acceptedTypes = [
    "insert"
  ]

	if (!acceptedTypes.includes(obj.type)) return

  switch (obj.type) {
    case "insert":
      [ options, optionsFind, findUrl, newUrl ] = obj
      const nimi = chrome.storage.local.get("nimi")

      if (!nimi) return
      options.body.document.name = res.nimi
      optionsFind.body.filter.name = res.nimi
      options.body = JSON.stringify(options.body)
      optionsFind.body = JSON.stringify(optionsFind.body)
      fetch(findUrl, optionsFind).then(res => res.json()).then(response => {
        if (response.documents.length < 3) {
          fetch(newUrl, options)
        }
      })
      sendRes({ok:true})
      break
  }
	
	return true
})

chrome.runtime.onInstalled.addListener(async () => {
    for (const cs of chrome.runtime.getManifest().content_scripts) {
      for (const tab of await chrome.tabs.query({url: cs.matches})) {
        chrome.scripting.executeScript({
          target: {tabId: tab.id},
          files: cs.js,
        });
      }
    }
  });

