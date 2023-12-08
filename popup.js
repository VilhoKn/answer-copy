const getCurrentTab = () => {}
const urlCheck = () => {}

document.addEventListener('DOMContentLoaded', () => {
	const currentUrl = getCurrentTab().url
	if (urlCheck(currentUrl)) {

		const site = currentUrl.includes("sanomapro") ? "sanomapro" : "otava"
		const questionPath = site === "sanomapro" ? currentUrl.split("content-feed/") : ""

		const options = {
			url: "https://eu-central-1.aws.data.mongodb-api.com/app/data-mgjos/endpoint/data/v1/action/find",
			method: 'POST',
			headers: {
			  'Accept': 'application/json',
			  'Content-Type': 'application/json',
			  'apiKey': ""
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
	
		axios(options).then(response => {
			if(response.data) {
				const answerContainer = document.querySelector(".answer-entry-container")
				for(const entry of response.data) {

				}
			}
		});
	}
});

function addNewEntryElement(entry, parent) {
	
}