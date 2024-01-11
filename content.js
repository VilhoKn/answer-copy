(() => {
	chrome.runtime.onMessage.addListener((obj, sender) => {
		if (obj.type === "init") {
			if (obj.site === "sanomapro") {
				initSanomapro(obj.url);
			} else if (obj.site === "otava") {
				initOtava(obj.url);
			}
		}
	})
})();

function urlCheck(url) {
   return url && ((url.includes("kampus.sanomapro.fi/content-feed") && url.includes("item")) || url.includes("materiaalit.otava.fi/web/"))
}

function initSanomapro(url) {
	console.log("Initializing Sanomapro")
	setTimeout(() => {
		const button = document.createElement("button");
		button.innerText = "Tallenna";
		button.id = "save-button";
		button.style.cssText = "font-size:14px;position:absolute;left:150px;"
		button.addEventListener("click", () => saveSanomapro(url));
		const buttonContainer = document.querySelector("app-module-content-buttons").firstChild.firstChild;
		buttonContainer.appendChild(button);
	}, 1000);

}  

function saveSanomapro(url) {
	const questionTypeMap = {
		"OpenQuestionModelAnswerInteraction": 0,
		"ClozeCombiInteraction": 1,
		"ChoiceInteractionXopus": 2,
	};

	const questionType = questionTypeMap[document.querySelector("app-document").getAttribute("content-type")]
	const questionPath = url.split("content-feed/")[1]
	const answers = getSanomaAnswers(questionType)
	const assignmentName = document.querySelector("app-module-content-title").textContent

	const options = {
		method: 'POST',
		headers: {
		  'Accept': 'application/json',
		  'Content-Type': 'application/json',
		  'apiKey': "Y2AFVQjnzp0gnzZF8i2LGrBkPeP6oYUedFSaCv0ZbWyRKLWQraub34qgeJJLM3vP"
		},
		body: JSON.stringify({
			
			"dataSource": "Cluster0",
			"database": "sites",
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

	const newUrl = 'https://corsproxy.io/?' + encodeURIComponent('https://eu-central-1.aws.data.mongodb-api.com/app/data-mgjos/endpoint/data/v1/action/insertDocument');
	fetch(newUrl, options).then(response => response.json()).then(data => console.log(data));

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


function initOtava(url) {
	console.log("Otava");
}
