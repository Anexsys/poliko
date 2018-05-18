function log(text) {
	document.getElementById('output').value += text
}

function clearLog(text) {
	document.getElementById('output').value = "";
}


// Initialize the Amazon Cognito credentials provider
AWS.config.accessKeyId = 'AKIAJBMX7NNUKGUGPFTQ';
AWS.config.secretAccessKey = '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';
AWS.config.region = 'eu-west-1';


var translate = new AWS.Translate();

var typingTimer;                //timer identifier
var doneTypingInterval = 500;  //time in ms

function onClick() {
	doneTyping();
}

function onload() {
	//on keyup, start the countdown
	$('#sourceText').keyup(function () {
		clearTimeout(typingTimer);
		if ($('#sourceText').val()) {
			typingTimer = setTimeout(doneTyping, doneTypingInterval);
		}
		else {
			$('#targetText').val('');
		}
	});
}

//user is "finished typing," do something
function doneTyping() {
	var sourceLan = $('#sourceLang')[0].value;
	var targetLan = $('#targetLang')[0].value;
	var text = $('#sourceText').val();

	var params = {
		SourceLanguageCode: sourceLan,
		TargetLanguageCode: targetLan,
		Text: text
	};

	translate.translateText(params, function (err, data) {
		if (err) console.log(err, err.stack); // an error occurred
		else {
			console.log(data);           // successful response

			//display translated text in text box
			$('#targetText').val(data.TranslatedText);
		}
	});
}





