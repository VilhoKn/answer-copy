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
		"fill-in": 1,
		"drag-and-drop": 2,
		"matching": 3,
		"open-ended": 4,
		"multiple-answer": 5
	};
}


function initOtava() {
	console.log("Otava");
}