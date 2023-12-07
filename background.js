chrome.tabs.onUpdated.addListener(function(tabId, tab) {
    if (tab.url && tab.url.includes("sanomapro.fi")) {
        chrome.tabs.sendMessage(tabId, {greeting: "hello"}, (response) => {
            console.log(response);
        });
    }
});