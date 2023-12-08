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
	const answers = getSanomaAnswers(questionType)
	const assignmentName = document.querySelector("app-module-content-title").textContent

	const options = {
		url: "https://eu-central-1.aws.data.mongodb-api.com/app/data-mgjos/endpoint/data/v1/action/insertDocument",
		method: 'POST',
		headers: {
		  'Accept': 'application/json',
		  'Content-Type': 'application/json',
		  'apiKey': APIKEY
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
				timestamp: new Date().getTime(),
				assignmentName
			}
			
		})
	}

	axios(options).then(response => {
    	console.log(response.status);
	});

}

function getSanomaAnswers(type) {
	answers = {}
	if(type === 0) {

	}
	else if(type === 1) {

	}
	else if(type === 2) {

	}
	return answers
}

function getName() {
	return "Vilho"
}


function initOtava() {
	console.log("Otava");
}
