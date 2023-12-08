(() => {
	chrome.runtime.onMessage.addListener((obj, sender) => {
		if (obj.type === "init") {
			if (obj.site === "sanomapro") {
				initSanomapro();
			} else if (obj.site === "otava") {
				initOtava();
			}
		}
	})
})();

function initSanomapro() {
	console.log("Initializing Sanomapro")
	setTimeout(() => {
		const button = document.createElement("button");
		button.innerText = "Tallenna";
		button.id = "save-button";
		button.style.cssText = "font-size:14px;position:absolute;left:150px;"
		button.addEventListener("click", () => saveSanomapro());
		const buttonContainer = document.querySelector("app-module-content-buttons").firstChild.firstChild;
		buttonContainer.appendChild(button);
	}, 1500);

}  

function saveSanomapro() {
	const questionTypeMap = {
		"OpenQuestionModelAnswerInteraction": 0,
		"ClozeCombiInteraction": 1,
		"ChoiceInteractionXopus": 2,
	};

	const questionType = questionTypeMap[document.querySelector("app-document").getAttribute("content-type")]
	const questionPath = getCurrentTab().url.split("content-feed/")[1]
	const answers = getSanomaAnswers()

	const urlEndpoint = "https://eu-central-1.aws.data.mongodb-api.com/app/data-mgjos/endpoint/data/v1"

	const options = {
		url: urlEndpoint+"/insertDocument",
		method: 'POST',
		headers: {
		  'Accept': 'application/json',
		  'Content-Type': 'application/json',
		  'apiKey': ""
		},
		data: JSON.stringify({
			
			"dataSource": "mongodb-atlas",
			"database": "Cluster0",
			"collection": "sanomapro",
			"document": {
				name: getName(),
				questionType,
				questionPath,
				answers,
			}
			
		})
	};

}

function getSanomaAnswers(type) {
	if(type === 0) {

	}
	else if(type === 1) {

	}
	else if(type === 2) {

	}
}

function getName() {
	return "Vilho"
}


function initOtava() {
	console.log("Otava");
}

function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = chrome.tabs.query(queryOptions);
    return tab;
  }
