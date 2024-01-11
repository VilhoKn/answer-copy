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
					answerElement.innerHTML = ""
					for (let j of answers[i]) {
						if (j.type === "textContent" || j.type === "text") {
							const text = document.createElement("div")
							text.textContent = j.text
							answerElement.appendChild(text)
						}
						else if (j.type === "img") {
							const div = document.createElement("div")
							const img = document.createElement("img")
							const br = document.createElement("br")
							img.src = j.src
							img.alt = j.alt
							div.appendChild(img)
							div.appendChild(br)
							answerElement.appendChild(div)
						}
						else if (j.type === "br") {
							const br = document.createElement("br")
							answerElement.appendChild(br)
						}
					}
				}
				else if (containers[i].querySelector("textarea")) {
					containers[i].querySelector("textarea").value = answers[i][0].text
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
			"collection": "sanomapro",
			"document": {
				name: getName(),
				questionType,
				questionPath,
				answers,
				timestamp: new Date().getTime(),
				assignmentName,
			}
			
		})
	}

	const newUrl = 'https://corsproxy.io/?' + encodeURIComponent('https://eu-central-1.aws.data.mongodb-api.com/app/data-mgjos/endpoint/data/v1/action/insertOne');
	fetch(newUrl, options).then(response => response.json()).then(data => console.log(data));

}

function getSanomaAnswers(type) {
	const answers = []
	switch(type) {
		case 0:
			const containers = document.querySelectorAll("app-text-entry-interaction")
			for (let i of containers) {
				const tempAnswers = []
				if (i.querySelector("iframe")) {
					const answerElement = i.querySelector("iframe").contentWindow.document.querySelector(".answer")
					for (let j of answerElement.childNodes) {
						if (j.nodeName === "#text") {
							tempAnswers.push({type: "textContent", text: j.textContent})
						}
						else if (j.nodeName === "DIV") {
							if (j.firstChild.nodeName === "IMG") {
								tempAnswers.push({type: "img", src: j.firstChild.src, alt: j.firstChild.alt})
							}
							else if (j.firstChild.nodeName === "BR") {
								tempAnswers.push({type: "br"})
							} else if (j.firstChild.nodeName === "#text") {
								tempAnswers.push({type: "text", text: j.firstChild.textContent})
							}
						}
					}
				}
				else if (i.querySelector("textarea")) {
					tempAnswers.push({type: "textarea", text: i.querySelector("textarea").value})
				}
				answers.push(tempAnswers)
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

function getName() {
	return "Vilho"
}


function initOtava(url) {
	console.log("Otava");
}
