

document.addEventListener('DOMContentLoaded', async () => {
	const currentUrl = await getCurrentTab().url
	if (!urlCheck(currentUrl)) {
		document.querySelector(".error").style.display = "block"
		return
	}

	chrome.storage.local.get("nimi").then(res => {
		if(!res.nimi) {
			const nameContainer = document.querySelector(".name-container")
			nameContainer.style.display = "block"
			const nameInput = document.querySelector(".name-input")
			nameInput.addEventListener("keydown", e => {
				if (e.key === "Enter") {
					chrome.storage.local.set({nimi: nameInput.value})
					nameContainer.style.display = "none"
				}
			})
		}
	})

	const site = currentUrl.includes("sanomapro") ? "sanomapro" : "otava"
	const questionPath = site === "sanomapro" ? currentUrl.split("content-feed/") : ""
	document.querySelector(".header-site").textContent = site.charAt(0).toUpperCase() + site.slice(1)


	const options = {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'apiKey': "APIKEY"
		},
		data: JSON.stringify({
			
			"dataSource": "mongodb-atlas",
			"database": "Cluster0",
			"collection": site,
			"filter": {
				questionPath
			},
			"sort": { "timestamp": 1 },
			"limit": 10
		})
	}

	const newUrl = 'https://corsproxy.io/?' + encodeURIComponent('https://eu-central-1.aws.data.mongodb-api.com/app/data-mgjos/endpoint/data/v1/action/find');
	fetch(newUrl, options).then(response => {
		if(response.data) {
			document.querySelector(".header-assignment").textContent = response.data[0].assignmentName
			const answerContainer = document.querySelector(".answer-entry-container")
			for(const entry of response.data) {
				addNewEntryElement(entry, answerContainer)
			}
		}
	});
});

function addNewEntryElement(entry, parent) {
	const entryContainer = document.createElement("div").classList.add("entry-container")
	const entryTitle = document.createElement("h1").classList.add("entry-title")
	entryTitle.textContent = entry.name
	entryContainer.appendChild(entryTitle)
	parent.appendChild(entryContainer)
}

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

function urlCheck(url) {
   return url && ((url.includes("kampus.sanomapro.fi/content-feed") && url.includes("item")) || url.includes("materiaalit.otava.fi/web/"))
}