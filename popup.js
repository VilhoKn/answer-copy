const VERSION = "1.3"

document.addEventListener('DOMContentLoaded', async () => {

	const optionsVersion = {
		method: 'POST',
		headers: {
			'Access-Control-Request-Headers': '*',
			'Content-Type': 'application/json',
			'api-key': "D3bSVpjbj1xU42dhFznHcUfiGhQdzPw4KXHzHfpFYoJgwSJnSRLtuvrbaqmxwcF2"
		},
		body: JSON.stringify({
			"dataSource": "Cluster0",
			"database": "version",
			"collection": "version"
		})
	}

	const newUrl = 'https://corsproxy.io/?' + encodeURIComponent('https://eu-central-1.aws.data.mongodb-api.com/app/data-mgjos/endpoint/data/v1/action/find');
	const versionUrl = 'https://corsproxy.io/?' + encodeURIComponent('https://eu-central-1.aws.data.mongodb-api.com/app/data-mgjos/endpoint/data/v1/action/findOne');

	fetch(versionUrl, optionsVersion).then(res => res.json()).then(response =>{
		if (!response?.document?.version) return
		if (response.document.version != VERSION) {
			const versionText = document.createElement("p")
			versionText.classList.add("version-text")
			versionText.textContent = "Uusin versio "+response.document.version+" (nykyinen "+VERSION+")"
			document.querySelector("body").appendChild(versionText)
		}
	});

	getCurrentTab().then(tab => {
		if (!(urlCheck(tab.url))) {
			document.querySelector(".error").style.display = "block"
			document.querySelector(".header-assignment").textContent = ""
			return
		} else {
			const site = tab.url.includes("sanomapro") ? "sanomapro" : "otava"
			document.querySelector(".header-site").textContent = site.charAt(0).toUpperCase() + site.slice(1)
		}
	})

	chrome.storage.local.get("nimi").then(res => {
		if(!res.nimi) {
			const nameContainer = document.querySelector(".name-container")
			nameContainer.style.display = "flex"
			const nameInput = document.querySelector(".name-input")
			nameInput.addEventListener("keydown", e => {
				if (e.key === "Enter") {
					chrome.storage.local.set({nimi: nameInput.value})
					nameContainer.style.display = "none"
				}
			})
		}
	})

	const options = {
		method: 'POST',
		headers: {
			'Access-Control-Request-Headers': '*',
			'Content-Type': 'application/json',
			'api-key': "D3bSVpjbj1xU42dhFznHcUfiGhQdzPw4KXHzHfpFYoJgwSJnSRLtuvrbaqmxwcF2"
		},
		body: {
			"dataSource": "Cluster0",
			"database": "sites",
			"collection": "",
			"filter": {
				"questionPath":""
			},
			"sort": { "timestamp": -1 },
			"limit": 10
		}
	}
	
	getCurrentTab().then(tab => {
		if (!urlCheck(tab.url)) return
		const site = tab.url.includes("sanomapro") ? "sanomapro" : "otava"
		const questionPath = site === "sanomapro" ? tab.url.split("content-feed/")[1] : tab.url.split("web/")[1]
		options.body.collection = site
		options.body.filter.questionPath = questionPath
		options.body = JSON.stringify(options.body)
		fetch(newUrl, options).then(res => res.json()).then(response =>{
			if(response.documents.length > 0) {
				document.querySelector(".name-container").style.top = "85%"
				document.querySelector(".header-assignment").textContent = response.documents[0].assignmentName.length <= 25 ? response.documents[0].assignmentName : response.documents[0].assignmentName.slice(0, 23) + "..."
				const answerContainer = document.querySelector(".answer-entry-container")
				for(let entry of response.documents) {
					addNewEntryElement(entry, answerContainer)
				}
			} else {
				document.querySelector(".name-container").style.top = "75%"
			}
		});
	})
});

function addNewEntryElement(entry, parent) {
	const entryContainer = document.createElement("div")
	entryContainer.classList.add("entry-container")
	const entryTitle = document.createElement("h1")
	const entryDate = document.createElement("p")
	const entryText = document.createElement("div")
	entryText.classList.add("entry-text")
	entryText.addEventListener("click", () => {
		sendToWebsite(entry.answers, entry.questionType)
	})
	entryDate.classList.add("entry-date")
	entryTitle.classList.add("entry-title")
	entryTitle.textContent = entry.name
	entryDate.textContent = new Date(entry.timestamp).toLocaleDateString(
		'en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'}
		) + ' ' + new Date(entry.timestamp).toLocaleTimeString(
			'en-GB', {hour: '2-digit', minute: '2-digit', second: '2-digit'}
			);
	entryText.appendChild(entryTitle)
	entryText.appendChild(entryDate)
	entryContainer.appendChild(entryText)

	chrome.storage.local.get(["nimi", "admin"]).then(res => {
		if (res.nimi === entry.name || res.admin) {
			const entryDelete = document.createElement("button")
			entryDelete.classList.add("entry-delete")
			entryDelete.textContent = "X"
			entryDelete.addEventListener("click", () => {
				const options = {
					method: 'POST',
					headers: {
						'Access-Control-Request-Headers': '*',
						'Content-Type': 'application/json',
						'api-key': "D3bSVpjbj1xU42dhFznHcUfiGhQdzPw4KXHzHfpFYoJgwSJnSRLtuvrbaqmxwcF2"
					},
					body: JSON.stringify({
						"dataSource": "Cluster0",
						"database": "sites",
						"collection": entry.site,
						"filter": {
							"questionPath": entry.questionPath,
							"name": entry.name,
							"timestamp": entry.timestamp
						}
					})
				}
				const newUrl = 'https://corsproxy.io/?' + encodeURIComponent('https://eu-central-1.aws.data.mongodb-api.com/app/data-mgjos/endpoint/data/v1/action/deleteOne');
				fetch(newUrl, options).then(res => res.json()).then(response =>{
					if(response.deletedCount === 1) {
						entryContainer.remove()
					}
				});
			})
			entryContainer.appendChild(entryDelete)
		}
	})

	parent.appendChild(entryContainer)
}

async function sendToWebsite(answers, questionType) {
	let tab = await getCurrentTab();
	chrome.tabs.sendMessage(tab.id, {type: "send", answers, site: tab.url.split(".")[1], questionType});
}

async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let tabs = await chrome.tabs.query(queryOptions);
    return tabs[0];
}

function urlCheck(url) {
	return url && (url.includes("kampus.sanomapro.fi/content-feed") || url.includes("materiaalit.otava.fi/web/"))
}