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
      chrome.storage.local.get("nimi").then(res => {
        console.log(res.nimi, obj)
        if (!res.nimi) return
        obj.options.body.document.name = res.nimi
        obj.optionsFind.body.filter.name = res.nimi
        obj.options.body = JSON.stringify(obj.options.body)
        obj.optionsFind.body = JSON.stringify(obj.optionsFind.body)
        console.log(obj.findUrl, obj.newUrl)
        fetch(obj.findUrl, obj.optionsFind).then(res => res.json()).then(response => {
          console.log(response)
          //if (response.documents.length < 3) {
            fetch(obj.newUrl, obj.options).then(res=>{console.log(res);return res.json()}).then(res=>console.log(res))
          //}
        })
        sendRes({ok:true})
      })
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

