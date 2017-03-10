var Client = require('node-rest-client').Client;
var xlsx = require('node-xlsx');
var fs = require('fs');
var request = require('./Request.js')
var config = require('./config.json');


//number record 
var index = process.argv[2];

// configuration variables
var url = config.server + ":" + config.port + "/" + config.instance;
var user = config.username;
var psw = config.password;
var project = config.project;
var domain = config.domain;



// read excel file
var obj = xlsx.parse(fs.readFileSync(__dirname + '/' + config.exceltestlab)); // parses a buffer



var client = new Client();

// set content-type header and data as json in args parameter
var args = {
	data: "<alm-authentication><user>" + user + "</user><password>" + psw + "</password></alm-authentication>",
	headers: { "Content-Type": "application/xml" }
};

// utility function

function createTestInstance(testName, CycleId, testOrder, owner, tester) {

	fs.readFile(__dirname + '/folderTestID.txt', 'utf8', function (err, dataFolder) {
		if (err) {
			return console.log(err);
		}
		// parent id folder where I have created test folder
		var parentTestFolder = dataFolder;

		client.get(url + "/rest/domains/" + domain + "/projects/" + project + "/tests?query={name['" + testName + "']}", args, function (data, response) {
			if (response.statusCode != '200') {
				console.error("error with retrieve test Plan id '" + testName + "' - " + response.statusMessage);
				process.exit(1);
			}
			else {
				var testId;
				if (data['Entities'].Entity == undefined) {

					console.error("error with retrieve test plan with name '" + testName + "', it doesn't exist");
					process.exit(1);
				}

				for (var i = 0; i < data['Entities'].Entity.length; i++) {
					if (data['Entities'].Entity[i].Fields[0].Field[32].Value == parentTestFolder) { // find entity with the parent id of folder 
						testId = data['Entities'].Entity[i].Fields[0].Field[7].Value; //   test id 


					}
				}



				client.get(url + "/rest/domains/" + domain + "/projects/" + project + "/test-instances?query={test-id['" + testId + "']}", args, function (data, response) {
					if (response.statusCode != '200') {

						console.error("Error with retrieve test instance of test plan '" + testName + "' - " + response.statusMessage);
						process.exit(1);
					}
					if (data['Entities'].Entity == undefined) {

						// the test instance with this name don't exist. create test instance

						args.data = request.TestInstanceRequest(CycleId, testId, testOrder, owner, tester);


						client.post(url + "/rest/domains/" + domain + "/projects/" + project + "/test-instances ", args, function (data, response) {
							if (response.statusCode != '201') {
								//console.error(data);
								console.error("Error with create test instance of test plan '" + testName + "' - " + response.statusMessage);
								process.exit(1);
							}


						});

					}
					else {
						for (var i = 0; i < data['Entities'].Entity.length; i++) {



							if (data['Entities'].Entity[i].Fields[0].Field[13].Value == parseInt(CycleId) && data['Entities'].Entity[i].Fields[0].Field[25].Value == testOrder) { // find test instance with that cycleID
								// nothing, the test instance already exist 
								console.log("\nTest Instance with name '" + testName + "' and test-order '" + testOrder + "' WAS ALREADY LOADED IN ALM");
								return;

							}
						}


						args.data = request.TestInstanceRequest(CycleId, testId, testOrder, owner, tester);
						client.post(url + "/rest/domains/" + domain + "/projects/" + project + "/test-instances", args, function (data, response) {
							if (response.statusCode != '201') {
								console.error("Error with create test instance of test plan '" + testName + "' - " + response.statusMessage);
								process.exit(1);
							}

						});
					}
				})

			}

		})




	})



}

//// start process

client.post(url + "/authentication-point/alm-authenticate", args, function (data, response) {
	// parsed response body as js object
	//console.log(data);
	// raw response
	if (response.statusCode != '200') {
		console.error('error with authentification');
		process.exit(1);
	}
	args.headers = { "Content-Type": "application/xml", "Cookie": response.rawHeaders[3] };


	//var record = obj[0].data[1]; //sheet1 second line 

	fs.readFile(__dirname + '/folderLabID.txt', 'utf8', function (err, dataFolder) {
		if (err) {
			return console.log(err);
		}

		// parent id folder where I have created test lab folder
		var parentFolder = dataFolder;

		var path;

		var record = obj[0].data[index];

		// mapping variables
		var testLabName = record[0];
		var status = record[1];
		if (status == undefined) {
			status = ' ';
		}
		var testOrder = parseInt(record[2]);

		var owner = record[3];
		if (owner == undefined) {
			owner = ' ';
		}

		var tester = record[4];
		if (tester == undefined) {
			tester = ' ';
		}
		var testName = record[5];

		var folderName = record[6];


		args.data = request.TestLabRequest(testLabName, parentFolder, status);




		// POST for test
		client.post(url + "/rest/domains/" + domain + "/projects/" + project + "/test-sets ", args, function (data, response) {
			var numberInstance;
			if (response.statusCode != '201') {

				client.get(url + "/rest/domains/" + domain + "/projects/" + project + "/test-sets?query={name['" + testLabName + "']}", args, function (data, response) {
					if (response.statusCode != '200') {
						console.error("error with create test lab '" + testLabName + "' - " + response.statusMessage);
						process.exit(1);
					}
					else {
						var CycleId;
						if (data['Entities'].Entity == undefined) {

							console.error("error with create testLab '" + testLabName + "' ");
							process.exit(1);
						}

						for (var i = 0; i < data['Entities'].Entity.length; i++) {
							if (data['Entities'].Entity[i].Fields[0].Field[12].Value == parentFolder) { // find entity with the parent id of folder 
								CycleId = data['Entities'].Entity[i].Fields[0].Field[11].Value; //   testLab id 


							}
						}

						createTestInstance(testName, CycleId, testOrder, owner, tester);


					}

				})


			}
			else {

				var CycleId = data['Entity'].Fields[0].Field[11].Value // testLab id

				createTestInstance(testName, CycleId, testOrder, owner, tester);


			}

		});


	});

});







