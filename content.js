(() => {
	chrome.runtime.onMessage.addListener((obj, sender, response) => {
		console.log(obj);
		if (obj.greeting === "hello")
			response({farewell: "goodbye"});
		}
	)
})();

