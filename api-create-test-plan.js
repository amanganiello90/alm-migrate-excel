var Client = require('node-rest-client').Client;
var xlsx = require('node-xlsx');
var fs = require('fs');
var request = require('./Request.js')
var config = require('./config.json');

// configuration variables
var url = config.server + ":" + config.port + "/" + config.instance;
var user = config.username;
var psw = config.password;
var project = config.project;
var domain = config.domain;

// read excel file
var obj = xlsx.parse(fs.readFileSync(__dirname + '/' + config.exceltestplan)); // parses a buffer

var index = process.argv[2];


var client = new Client();

// set content-type header and data as json in args parameter
var args = {
	data: "<alm-authentication><user>" + user + "</user><password>" + psw + "</password></alm-authentication>",
	headers: { "Content-Type": "application/xml" }
};

// utility function
function createSteps(testId, testName, orderStep, args, dataStepRequest) {

	args.data = "<CheckOutParameters><Comment></Comment></CheckOutParameters>";

	client.post(url + "/rest/domains/" + domain + "/projects/" + project + "/tests/" + testId + "/versions/check-out", args, function (data, response) {
		if (response.statusCode != '200') {
			console.error("\nImpossible to checkout test '" + testName + "'");
			process.exit(1);
		}
		else {
			args.data = dataStepRequest;
			client.post(url + "/rest/domains/" + domain + "/projects/" + project + "/design-steps", args, function (data, response) {

				if (response.statusCode != '201') {
					console.error("\nImpossible to create step numer " + orderStep + " for test '" + testName + "'");
				}

				args.data = "<CheckInParameters><Comment></Comment></CheckInParameters>";
				client.post(url + "/rest/domains/" + domain + "/projects/" + project + "/tests/" + testId + "/versions/check-in", args, function (data, response) {
					if (response.statusCode != '200') {
						console.error("\nImpossible to checkin test '" + testName + "'");
						process.exit(1);
					}

				})



			})

		}
	})
}


// utility to return a request field value from the json response

function returnValueFromField(fieldName, field){
	
	for (var i = 0; i < field.length; i++) {
		var currentField= field[i];
		var name= currentField['$'].Name;
		
		if(name==fieldName){
		return	currentField.Value;
			
		}
	}
	
	console.error("\nThe searched field in the request doesn't exist!!");
	process.exit(1);
	
	
}



//// start process

client.post(url + "/authentication-point/alm-authenticate", args, function (data, response) {
	// parsed response body as js object
	//console.log(data);
	// raw response
	if (response.statusCode != '200') {
		console.error('\nerror with authentification');
		process.exit(1);
	}
	args.headers = { "Content-Type": "application/xml", "Cookie": response.rawHeaders[3] };


	//var record = obj[0].data[1]; //sheet1 second line 

	fs.readFile(__dirname + '/folderTestID.txt', 'utf8', function (err, dataFolder) {
		if (err) {
			return console.log(err);
		}

		// parent id folder to create tests
		var parentFolder = dataFolder;



		var record = obj[0].data[index];

		// mapping variables
		var testName = record[0];
		var stepName = record[1];
		
		//  replace avoid xml meta character
		stepName = stepName.replace("&"," AND ");
		stepName = stepName.replace("->","PUXVARIABLE");
		stepName = stepName.replace("<","'");
		stepName = stepName.replace(">","'");
		stepName = stepName.replace("PUXVARIABLE","->");
		
		
		var businessRule = record[2];
		if (businessRule == undefined) {
			businessRule = ' ';
		}
		var configurationPoint = record[3];
		if (configurationPoint == undefined) {
			configurationPoint = ' ';
		}

		var descriptionTest = record[4];
		if(descriptionTest==undefined){
			descriptionTest= '';
		}
		else{
		
		//  replace avoid xml meta character
		descriptionTest = descriptionTest.replace("&"," AND ");
		descriptionTest = descriptionTest.replace("->","PUXVARIABLE");
		descriptionTest = descriptionTest.replace("<","'");
		descriptionTest = descriptionTest.replace(">","'");
		descriptionTest = descriptionTest.replace("PUXVARIABLE","->");
		}
		var descriptionStep = record[5];
		
		//  replace avoid xml meta character
		descriptionStep = descriptionStep.replace("&"," AND ");
		descriptionStep = descriptionStep.replace("->","PUXVARIABLE");
		descriptionStep = descriptionStep.replace("<","'");
		descriptionStep = descriptionStep.replace(">","'");
		descriptionStep = descriptionStep.replace("PUXVARIABLE","->");
			
		var expected = record[6];
		if (expected == undefined) {
			expected = '';
		}
		else{
		//  replace avoid xml meta character
		expected  = expected.replace("&"," AND ");
		expected  = expected.replace("->","PUXVARIABLE");
		expected  = expected.replace("<","'");
		expected  = expected.replace(">","'");
		expected  = expected.replace("PUXVARIABLE","->");	
			
		}
		var automatedScenario = record[7];
		if (automatedScenario == undefined) {
			automatedScenario = '';
		}

		// var changeStatus = record[8];
		var changeStatus;
		if (changeStatus == undefined) {
			changeStatus = '';
		}
		var comment = record[9];
		if (comment == undefined) {
			comment = '';
		}

		var designer = record[10];
		if (designer == undefined) {
			designer = '';
		}
		var estimated = record[11];
		if (estimated == undefined) {
			estimated = '';
		}
		var execution = record[12];
		if (execution == undefined) {
			execution = '';
		}

		var issue = record[13];
		if (issue == undefined) {
			issue = '';
		}
		var path = record[14];
		if (path == undefined) {
			path = '';
		}
		var status = record[15];
		if (status == undefined) {
			status = '';
		}
		var template = record[16];
		if (template == undefined) {
			template = '';
		}
		var type = record[17];
		if (type == undefined) {
			type = '';
		}
		var userStories = record[18];
		if (userStories == undefined) {
			userStories = '';
		}
		var orderStep = parseInt(record[19]);
		
		args.data = request.TestRequest(testName, parentFolder, descriptionTest, automatedScenario, changeStatus, comment, designer, estimated, execution, issue, path, status, template, type, userStories);
		
		// POST for test
		client.post(url + "/rest/domains/" + domain + "/projects/" + project + "/tests ", args, function (data, response) {
			var numberStep;

			if (response.statusCode != '201') {

				client.get(url + "/rest/domains/" + domain + "/projects/" + project + "/tests?query={name['" + testName + "']}", args, function (data, response) {
					if (response.statusCode != '200') {
						console.log('\n' +args.data);
						console.error("\nError with create test '" + testName + "' - " + response.statusMessage);
						process.exit(1);
					}
					else {
						var testId;

						if (data['Entities'].Entity == undefined) {
							console.error("\nError with create test '" + testName + "' ");
							process.exit(1);
						}

						for (var i = 0; i < data['Entities'].Entity.length; i++) {
							
							var ob= data['Entities'].Entity[i].Fields[0].Field;
							
							if (returnValueFromField('parent-id', ob) == parentFolder) { // find entity with the parent id of folder 
								testId = returnValueFromField('id', ob); //   test id 
								numberStep = parseInt(returnValueFromField('steps', ob));//  total number steps already inserted 

							}
						}

						
						
						dataStepRequest = request.StepRequest(stepName, testId, descriptionStep, businessRule, configurationPoint, expected);
						//console.log('\nDATA: '+dataStepRequest);

						if (orderStep > numberStep) {
							createSteps(testId, testName, orderStep, args, dataStepRequest);
						}

						else {
						
							console.log("\nStep numer " + orderStep + " for test '" + testName + "' WAS ALREADY LOADED IN ALM");
						}



					}

				})


			}
			else {

				var ob= data['Entity'].Fields[0].Field;
				var testId = returnValueFromField('id', ob) // test id

				numberStep = returnValueFromField('steps', ob)//  total number steps already inserted 
				dataStepRequest = request.StepRequest(stepName, testId, descriptionStep, businessRule, configurationPoint, expected);

				if (orderStep > numberStep) {
					createSteps(testId, testName, orderStep, args, dataStepRequest);
				}
				else {
					console.log("\nStep numer " + orderStep + " for test '" + testName + "' WAS ALREADY LOADED IN ALM");
				}
			}

		});


	});

});







