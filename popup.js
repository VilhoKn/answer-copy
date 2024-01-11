

document.addEventListener('DOMContentLoaded', async () => {
	getCurrentTab().then(tab => {
		if (!(urlCheck(tab.url))) {
			console.log(urlCheck(tab.url), "cehc")
			document.querySelector(".error").style.display = "block"
			return
		} else {
			const site = tab.url.includes("sanomapro") ? "sanomapro" : "otava"
			document.querySelector(".header-site").textContent = site.charAt(0).toUpperCase() + site.slice(1)
		}
	})

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

	const newUrl = 'https://corsproxy.io/?' + encodeURIComponent('https://eu-central-1.aws.data.mongodb-api.com/app/data-mgjos/endpoint/data/v1/action/find');

	getCurrentTab().then(tab => {
		const site = tab.url.includes("sanomapro") ? "sanomapro" : "otava"
		const questionPath = site === "sanomapro" ? tab.url.split("content-feed/")[1] : ""
		options.body.collection = site
		options.body.filter.questionPath = questionPath
		options.body = JSON.stringify(options.body)
		fetch(newUrl, options).then(res => res.json()).then(response =>{
			console.log(response, "response", response.documents)
			if(response.documents.length > 0) {
				document.querySelector(".header-assignment").textContent = response.documents[0].assignmentName
				const answerContainer = document.querySelector(".answer-entry-container")
				for(let entry of response.documents) {
					addNewEntryElement(entry, answerContainer)
				}
			}
		});
	})
});

function addNewEntryElement(entry, parent) {
	const entryContainer = document.createElement("div")
	entryContainer.classList.add("entry-container")
	entryContainer.addEventListener("click", () => {
		sendToWebsite(entry.answers, entry.questionType)
	})
	const entryTitle = document.createElement("h1")
	const entryDate = document.createElement("p")
	entryDate.classList.add("entry-date")
	entryTitle.classList.add("entry-title")
	entryTitle.textContent = entry.name
	entryDate.textContent = new Date(entry.timestamp).toLocaleString()
	entryContainer.appendChild(entryTitle)
	entryContainer.appendChild(entryDate)
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
	console.log(url, "check")
	return url && ((url.includes("kampus.sanomapro.fi/content-feed") && url.includes("item")) || url.includes("materiaalit.otava.fi/web/"))
}