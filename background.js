chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === "captureVisibleTab") {
		chrome.tabs.captureVisibleTab(null, { format: "png" }, (screenshotUrl) => {
			sendResponse({ screenshotUrl: screenshotUrl });
		});
		return true;
	} else if (request.action === "openTab") {
		chrome.tabs.create({ url: request.url });
	}
});
