chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.action === "scanQRCode") {
		chrome.runtime.sendMessage(
			{ action: "captureVisibleTab" },
			function (response) {
				let screenshotUrl = response.screenshotUrl;
				processScreenshot(screenshotUrl);
			}
		);
	}
});

function processScreenshot(screenshotUrl) {
	let img = new Image();
	img.onload = function () {
		let canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;
		let ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0);

		let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		let code = jsQR(imageData.data, imageData.width, imageData.height);

		if (code) {
			handleQRCodeDecoded(code.data);
		} else {
			alert("No QR code found!");
		}
	};
	img.src = screenshotUrl;
}

function handleQRCodeDecoded(decodedData) {
	decodedData = decodedData.trim();

	chrome.runtime.sendMessage({ action: "openTab", url: decodedData });
}
