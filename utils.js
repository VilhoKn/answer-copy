function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = chrome.tabs.query(queryOptions);
    return tab;
}

function urlCheck(url) {
   return url && ((url.includes("kampus.sanomapro.fi/content-feed") && url.includes("item")) || url.includes("materiaalit.otava.fi/web/"))
}