function urlCheck(url) {
   return url && ((url.includes("kampus.sanomapro.fi/content-feed") && url.includes("item")) || url.includes("materiaalit.otava.fi/web/"))
}

chrome.tabs.onUpdated.addListener((tabId, tab) => {
    if (urlCheck(tab.url)) {
        console.log("Sending message to", tab.url);
        chrome.tabs.sendMessage(tabId, {type: "init", site: tab.url.split(".")[1], url: tab.url});
    }
});

