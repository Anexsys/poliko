AWS.config.accessKeyId = 'AKIAJBMX7NNUKGUGPFTQ';
AWS.config.secretAccessKey = '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';
AWS.config.region = 'eu-west-1';


var comprehend = new AWS.Comprehend();

function onClick() {
	$('#entityTableBody').empty();
	$('#phrasesTableBody').empty();
	$('#sentiment').text('');
	$('#targetText').empty();

	detectSentiment();
	detectEntities();
	detectKeyPhrases();
}

function toTitleCase(str) {
	return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}


function detectSentiment() {
	var params = {
		LanguageCode: 'en',
		Text: $('#sourceText').val()
	};
	comprehend.detectSentiment(params, function (err, data) {
		if (err) console.log(err, err.stack); // an error occurred
		else {
			console.log(data);           // successful response

			$('#sentiment').text(toTitleCase(data.Sentiment));
		}
	});
}

function detectEntities() {
	var params = {
		LanguageCode: 'en',
		Text: $('#sourceText').val()
	};
	comprehend.detectEntities(params, function (err, data) {
		if (err) console.log(err, err.stack); // an error occurred
		else {
			console.log(data);           // successful response

			var entities = data.Entities;

			var entityText = [];

			entities.forEach(element => {
				var percent = element.Score.toLocaleString("en", { style: "percent" });
				var cols = '<tr>';
				cols += '<td>' + element.Text + '</td>';
				switch (element.Type) {
					case 'ORGANIZATION':
						cols += '<td><i class="far fa-building organisation"></i> ' + toTitleCase(element.Type) + '</td>';
						break;
					case 'PERSON':
						cols += '<td><i class="far fa-user person"></i> ' + toTitleCase(element.Type) + '</td>';
						break;
					case 'DATE':
						cols += '<td><i class="far fa-calendar date"></i> ' + toTitleCase(element.Type) + '</td>';
						break;
					case 'LOCATION':
						cols += '<td><i class="fas fa-location-arrow location"></i> ' + toTitleCase(element.Type) + '</td>'; // style="color: #00b38f"
						break;
					case 'COMMERCIAL_ITEM':
						cols += '<td><i class="far fa-clone commercialItem"></i> Commercial Item</td>';
						break;
					case 'EVENT':
						cols += '<td><i class="far fa-calendar-alt event"></i> ' + toTitleCase(element.Type) + '</td>';
						break;
					case 'QUANTITY':
						cols += '<td><i class="fas fa-plus quantity"></i> ' + toTitleCase(element.Type) + '</td>';
						break;
					case 'TITLE':
						cols += '<td><i class="fas fa-font title"></i> ' + toTitleCase(element.Type) + '</td>';
						break;
					case 'OTHER':
						cols += '<td><i class="far fa-circle other"></i> ' + toTitleCase(element.Type) + '</td>';
						break;
				}
				//cols += '<td>' + toTitleCase(element.Type) + '</td>';
				cols += '<td>' + percent + '</td>';
				cols += '</tr>';
				$('#entityTableBody').append(cols);
				entityText.push({
					start: element.BeginOffset,
					end: element.EndOffset,
					type: element.Type
				});
			});

			highlightText(entityText.sort(compareEntities));
		}
	});
}

function detectKeyPhrases() {
	var params = {
		LanguageCode: 'en',
		Text: $('#sourceText').val()
	};
	comprehend.detectKeyPhrases(params, function (err, data) {
		if (err) console.log(err, err.stack); // an error occurred
		else {
			console.log(data);           // successful response

			var keyPhrases = data.KeyPhrases;

			keyPhrases.forEach(element => {
				var percent = element.Score.toLocaleString("en", { style: "percent" });
				var cols = '<tr>';
				cols += '<td>' + element.Text + '</td>';
				cols += '<td>' + percent + '</td>';
				cols += '</tr>';
				$('#phrasesTableBody').append(cols);
			});
		}
	});
}

function highlightText(entityText) {
	var highlightedText = '';
	var source = $('#sourceText').val();

	for (var i = 0; i < source.length; i++) {
		if (entityText.length > 0) {
			if (i == entityText[0].start) {
				highlightedText += '<span class="marked ' + getColourClass(entityText[0].type) + '">' + source[i];
			}
			else if (i == entityText[0].end) {
				highlightedText += '</span>' + source[i];
				entityText.shift();
			}
			else {
				highlightedText += source[i];
			}
		}
		else {
			break;
		}
	}

	// $('#sourceText').hide();
	// $('#analyseButton').hide();
	$('#targetText').append(highlightedText);
	$('#targetText').show();
}

function getColourClass(type) {
	switch (type) {
		case 'ORGANIZATION':
			return 'organisation-i';
		case 'PERSON':
			return 'person-i';
		case 'DATE':
			return 'date-i';
		case 'LOCATION':
			return 'location-i';
		case 'COMMERCIAL_ITEM':
			return 'commercialItem-i';
		case 'EVENT':
			return 'event-i';
		case 'QUANTITY':
			return 'quantity-i';
		case 'TITLE':
			return 'title-i';
		case 'OTHER':
			return 'other-i';
	}
	return '';
}



function compareEntities(a, b) {
	if (a.start < b.start)
		return -1;
	if (a.start > b.start)
		return 1;
	return 0;
}
