var Client = require('node-rest-client').Client;
var xlsx = require('node-xlsx');
var fs = require('fs');
var request = require('./Request.js')
var config = require('./config.json');
var jsonfile = require('jsonfile');

// read mapping Lab folder json file
var mappingFolders = jsonfile.readFileSync(__dirname + '/mappingLab.json');

//number record to create folder
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

// recursive function to create innested folders
function createFolders(folderName, subfolders, args, parentFolder, j) {
	j++;
	args.data = request.FolderRequestLab(folderName, parentFolder);
	client.post(url + "/rest/domains/" + domain + "/projects/" + project + "/test-set-folders ", args, function (data, response) {
		if (response.statusCode != '201') {

			client.get(url + "/rest/domains/" + config.domain + "/projects/" + config.project + "/test-set-folders?query={parent-id['" + parentFolder + "']}", args, function (data, response) {
				if (response.statusCode == '200') {

					for (var i = 0; i < data['Entities'].Entity.length; i++) {
						if (data['Entities'].Entity[i].Fields[0].Field[9].Value == folderName) {
							parentFolder = data['Entities'].Entity[i].Fields[0].Field[0].Value;
						}
					}
					// save ultimate folder id	
					fs.writeFile('folderLabID.txt', parentFolder, function (err) {
						if (err)
							return console.log(err);
					});

					if (subfolders[j] != undefined)
						createFolders(subfolders[j], subfolders, args, parentFolder, j);

				}
				else {
					console.error('error with GET to retrieve folder entities - status code ' + response.statusCode);
					process.exit(1);
				}
			})
		}


		else {
			console.log("\ncreated folder in testLab '" + folderName + "'");
			var bodyResponse = data['Entity'].Fields;
			parentFolder = bodyResponse[0].Field[0].Value // id new folder

			// save ultimate folder id
			fs.writeFile('folderLabID.txt', parentFolder, function (err) {
				if (err)
					return console.log(err);
			});

			if (subfolders[j] != undefined)
				createFolders(subfolders[j], subfolders, args, parentFolder, j);
		}
	});



}


// start process

client.post(url + "/authentication-point/alm-authenticate", args, function (data, response) {

	if (response.statusCode != '200') {
		console.error('error with authentification');
		process.exit(1);
	}
	args.headers = { "Content-Type": "application/xml", "Cookie": response.rawHeaders[3] };


	var record = obj[0].data[index];
	var recordLength = record.length;
	var path;


	// retrieve path of folder with its parent id
	for (var i = 0; i < mappingFolders.length; i++) {

		if (record[recordLength - 1] == mappingFolders[i].id) {
			path = mappingFolders[i].path;

			break;
		}
	}

	var parentFolder = 0;
	var subfolders = path.split('/');
	var j = 1;
	console.log("\ncreating path '" + path + "'")
	createFolders(subfolders[j], subfolders, args, parentFolder, j);



})