(() => {
	chrome.runtime.onMessage.addListener((obj, sender) => {
		if (obj.type === "init") {
			if (obj.site === "sanomapro") {
				initSanomapro(obj.url);
			} else if (obj.site === "otava") {
				initOtava(obj.url);
			}
		}
		if (obj.type === "send") {
			console.log("Sending", obj.answers)
			if (obj.site === "sanomapro") {
				sendToSanomapro(obj.answers, obj.questionType)
			}
			else if (obj.site === "otava") {
				sendToOtava(obj.answers, questionType)
			}
		}
	})
})();

function sendToSanomapro(answers, questionType) {
	switch(questionType) {
		case 0:
			const containers = document.querySelectorAll("app-text-entry-interaction")
			for (let i=0; i<containers.length; i++) {
				if (containers[i].querySelector("iframe")) {
					const answerElement = containers[i].querySelector("iframe").contentWindow.document.querySelector(".answer")
					console.log(answers, answers[i], answers[i].text, answerElement)
					answerElement.innerHTML = answers[i].text
				}
				else if (containers[i].querySelector("textarea")) {
					containers[i].querySelector("textarea").value = answers[i].text
				}
			}
			break;
		case 1:
			break;
	}
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
	}, 2000);

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

	if (answers.length === 0) return

	const findUrl = 'https://corsproxy.io/?' + encodeURIComponent('https://eu-central-1.aws.data.mongodb-api.com/app/data-mgjos/endpoint/data/v1/action/find');
	
	const optionsFind = {
		method: 'POST',
		headers: {
			'Access-Control-Request-Headers': '*',
			'Content-Type': 'application/json',
			'api-key': "D3bSVpjbj1xU42dhFznHcUfiGhQdzPw4KXHzHfpFYoJgwSJnSRLtuvrbaqmxwcF2"
		},
		body: {
			"dataSource": "Cluster0",
			"database": "sites",
			"collection": "sanomapro",
			"filter": {
				questionPath,
				"name":""
			},
			"sort": { "timestamp": -1 },
			"limit": 10
		}
	}

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
			"collection": "sanomapro",
			"document": {
				"name": "",
				questionType,
				questionPath,
				answers,
				timestamp: new Date().getTime(),
				assignmentName,
				site: "sanomapro"
			}
			
		}
	}

	const newUrl = 'https://corsproxy.io/?' + encodeURIComponent('https://eu-central-1.aws.data.mongodb-api.com/app/data-mgjos/endpoint/data/v1/action/insertOne');
	
	chrome.runtime.sendMessage({type: "nimi"}, res => {
		if (!res?.nimi) return
		options.body.document.name = res.nimi
		optionsFind.body.filter.name = res.nimi
		options.body = JSON.stringify(options.body)
		optionsFind.body = JSON.stringify(optionsFind.body)
		fetch(findUrl, optionsFind).then(res => res.json()).then(response => {
			if (response.documents.length < 3) {
				fetch(newUrl, options).then(resp => resp.json()).then(data => console.log(data));
			}
		});
	})
}

function getSanomaAnswers(type) {
	const answers = []
	switch(type) {
		case 0:
			const containers = document.querySelectorAll("app-text-entry-interaction")
			for (let i of containers) {
				if (i.querySelector("iframe")) {
					const answerElement = i.querySelector("iframe").contentWindow.document.querySelector(".answer")
					answers.push({type: "text", text: answerElement.innerHTML})
				}
				else if (i.querySelector("textarea")) {
					answers.push({type: "textarea", text: i.querySelector("textarea").value})
				}
			}
			console.log(answers)
			break;
		case 1:
			
			break;
		case 2:
			
			break;
	}
	return answers
}

function initOtava(url) {
	console.log("Otava");
}
