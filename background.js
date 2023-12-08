chrome.tabs.onUpdated.addListener((tabId, tab) => {
    if (tab.url && ((tab.url.includes("kampus.sanomapro.fi/content-feed") && tab.url.includes("item")) || tab.url.includes("materiaalit.otava.fi/web/"))) {
        console.log("Sending message to", tab.url);
        chrome.tabs.sendMessage(tabId, {type: "init", site: tab.url.split(".")[1]});
    }
});