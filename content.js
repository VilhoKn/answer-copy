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
	let containers;
	switch(questionType) {
		case 0:
			containers = document.querySelectorAll("app-text-entry-interaction")
			for (let i=0; i<containers.length; i++) {
				if (containers[i].querySelector("iframe")) {
					const answerElement = containers[i].querySelector("iframe").contentWindow.document.querySelector(".answer")
					answerElement.innerHTML = answers[i].text
				}
				else if (containers[i].querySelector("textarea")) {
					containers[i].querySelector("textarea").value = answers[i].text
				}
			}
			break;
		case 1:
			containers = document.querySelectorAll("app-extended-text-interaction")
			for (let i=0; i<containers.length; i++) {
				if (containers[i].querySelector("textarea")) {
					containers[i].querySelector("textarea").value = answers[i].text
				}
			}
			break;
	}
}

function initSanomapro(url) {
	console.log("Initializing Sanomapro")
	const checkExists = setInterval(() => {
		if (!document.querySelector("app-module-content-buttons")) return
		clearInterval(checkExists);
		const button = document.createElement("button");
		button.classList.add("save-button");
		button.innerText = "Tallenna";
		button.id = "save-button";
		button.style.cssText = "font-size:14px;position:absolute;left:150px;border:1.2px solid rgb(100, 54, 149);border-radius:4px;padding:11px;cursor:pointer;background-color:white;color:rgb(100, 54, 149);font-weight:600;"
		button.addEventListener("click", () => {
			button.style.backgroundColor = "rgb(100, 54, 149)"
			button.style.color = "white"
			setTimeout(() => {button.style.backgroundColor = "white"; button.style.color = "rgb(100, 54, 149)"}, 150)
			saveSanomapro(url)
		});
		button.addEventListener("mouseover", () => {
			button.style.backgroundColor = "#f0ecf5";
		});
		button.addEventListener("mouseout", () => {
			button.style.backgroundColor = "white";
		});
		const buttonContainer = document.querySelector("app-module-content-buttons").firstChild.firstChild;
		buttonContainer.appendChild(button);
		console.log("Sanomapro initialized")
	}, 100);

}  

function saveSanomapro(url) {
	const questionTypeMap = {
		"OpenQuestionModelAnswerInteraction": 0,
		"ExtendedTextInteraction": 1,
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
		if (!res.nimi) return
		options.body.document.name = res.nimi
		optionsFind.body.filter.name = res.nimi
		options.body = JSON.stringify(options.body)
		optionsFind.body = JSON.stringify(optionsFind.body)
		fetch(findUrl, optionsFind).then(res => res.json()).then(response => {
			if (response.documents.length < 3) {
				fetch(newUrl, options)
			}
		});
	})
}

function getSanomaAnswers(type) {
	const answers = []
	let containers;
	switch(type) {
		case 0:
			containers = document.querySelectorAll("app-text-entry-interaction")
			for (let i of containers) {
				if (i.querySelector("iframe")) {
					const answerElement = i.querySelector("iframe").contentWindow.document.querySelector(".answer")
					answers.push({type: "text", text: answerElement.innerHTML})
				}
				else if (i.querySelector("textarea")) {
					answers.push({type: "textarea", text: i.querySelector("textarea").value})
				}
			}
			break;
		case 1:
			containers = document.querySelectorAll("app-extended-text-interaction")
			for (let i of containers) {
				if (i.querySelector("textarea")) {
					answers.push({type: "textarea", text: i.querySelector("textarea").value})
				}
			}
			break;
		case 2:
			
			break;
	}
	return answers
}

function initOtava(url) {
	console.log("Initializing Otava")
	const checkExists = setInterval(() => {
		if (!document.querySelector(".cb-menu-list") || document.querySelector(".save-button")) return
		clearInterval(checkExists);
		const button = document.createElement("button");
		const buttonWrapper = document.createElement("div");
		buttonWrapper.style.cssText = "position:relative;width:50px;height:50px;"
		button.classList.add("save-button");
		button.innerText = "T";
		button.id = "save-button";
		button.style.cssText = "position:absolute;bottom:0;left:0;font-size:20px;cursor:pointer;color:white;background-color:black;border-radius:50%;width:40px;height:40px;border:none;"
		button.addEventListener("click", () => {
			button.style.color = "grey"
			setTimeout(() => {button.style.backgroundColor = "black"}, 150)
			saveOtava(url)
		});
		button.addEventListener("mouseover", () => {
			button.style.backgroundColor = "white";
			button.style.color = "black"
		});
		button.addEventListener("mouseout", () => {
			button.style.backgroundColor = "black";
			button.style.color = "white"
		});
		const buttonContainer = document.querySelector(".cb-right-items").querySelector(".cb-menu-list");
		buttonWrapper.appendChild(button)
		buttonContainer.appendChild(buttonWrapper);
		console.log("Otava initialized")
	}, 100);

}  

function saveOtava(url) {

	const questionPath = url.split("web/")[1]
	const answers = getOtavaAnswers()
	const assignmentName = document.querySelector(".o-topbar-breadcrumb").lastElementChild.textContent

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
			"collection": "otava",
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
			"collection": "otava",
			"document": {
				"name": "",
				questionType,
				questionPath,
				answers,
				timestamp: new Date().getTime(),
				assignmentName,
				site: "otava"
			}
			
		}
	}

	const newUrl = 'https://corsproxy.io/?' + encodeURIComponent('https://eu-central-1.aws.data.mongodb-api.com/app/data-mgjos/endpoint/data/v1/action/insertOne');
	
	

	chrome.runtime.sendMessage({type: "nimi"}, res => {
		if (!res.nimi) return
		options.body.document.name = res.nimi
		optionsFind.body.filter.name = res.nimi
		options.body = JSON.stringify(options.body)
		optionsFind.body = JSON.stringify(optionsFind.body)
		fetch(findUrl, optionsFind).then(res => res.json()).then(response => {
			if (response.documents.length < 3) {
				fetch(newUrl, options)
			}
		});
	})
}

function getOtavaAnswers() {
	const answers = []

	const column = document.querySelectorAll(".column")[0]
	const questionContainer = document.querySelector(".question-container")
	if (column) {
		for (let i of column.querySelectorAll(".item")) {
			const parent = i.querySelector(".fr-element")
			answers.push({type: "item-text", text: parent.innerHTML})
		}
	}
	else if (questionContainer) {
		
	}
}

function sendToOtava(answers) {
	let containers;
	switch(questionType) {
		case 0:
			containers = document.querySelectorAll("app-text-entry-interaction")
			for (let i=0; i<containers.length; i++) {
				if (containers[i].querySelector("iframe")) {
					const answerElement = containers[i].querySelector("iframe").contentWindow.document.querySelector(".answer")
					answerElement.innerHTML = answers[i].text
				}
				else if (containers[i].querySelector("textarea")) {
					containers[i].querySelector("textarea").value = answers[i].text
				}
			}
			break;
		case 1:
			containers = document.querySelectorAll("app-extended-text-interaction")
			for (let i=0; i<containers.length; i++) {
				if (containers[i].querySelector("textarea")) {
					containers[i].querySelector("textarea").value = answers[i].text
				}
			}
			break;
	}
}