chrome.tabs.onUpdated.addListener((tabId, tab) => {
    if (urlCheck(tab.url)) {
        console.log("Sending message to", tab.url);
        chrome.tabs.sendMessage(tabId, {type: "init", site: tab.url.split(".")[1]});
    }
});