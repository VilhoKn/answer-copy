function urlCheck(url) {
   return url && ((url.includes("kampus.sanomapro.fi/content-feed") && url.includes("item")) || url.includes("materiaalit.otava.fi/web/"))
}

chrome.tabs.onUpdated.addListener((tabId, tab) => {
    if (urlCheck(tab.url)) {
        chrome.tabs.sendMessage(tabId, {type: "init", site: tab.url.split(".")[1], url: tab.url});
    }
});

chrome.runtime.onMessage.addListener((obj, sender, sendRes) => {
	if (!obj.type === "nimi") return
	chrome.storage.local.get("nimi").then(res => {
		sendRes({"nimi": res.nimi ? res.nimi : null})
	})
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

