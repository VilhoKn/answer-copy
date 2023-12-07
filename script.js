const copyButton = document.querySelector('#copy')

copyButton.addEventListener('click', () => {
	console.log("copy")
	copyTest()
})

async function copyTest() {
	const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
  	const response = await chrome.tabs.sendMessage(tab.id, {greeting: "hello"});
  	// do something with response here, not outside the function
	console.log(response);
}