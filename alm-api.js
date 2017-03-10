var shell_exec = require('shell_exec').shell_exec;
var xlsx = require('node-xlsx');
var fs = require('fs');
var config = require('./config.json');

var record;
var parentId = 0;

var ProgressBar = require('progress');

//name process
var typeProcess = process.argv[2];

//mapping folder
console.log(shell_exec('node mapping-folders ' + typeProcess));

var bar = new ProgressBar('  STATUS [:bar] :percent :etas', {
  complete: '='
  , incomplete: ' '
  , width: 15
  , total: numberRecord - 1
});

if (typeProcess == "plan") {


  var obj = xlsx.parse(fs.readFileSync(__dirname + '/' + config.exceltestplan)); // parses a buffer
  var numberRecord = obj[0].data.length;

  var bar = new ProgressBar('  STATUS [:bar] :percent :etas', {
    complete: '='
    , incomplete: ' '
    , width: 15
    , total: numberRecord - 1
  });

  var recordLength = obj[0].data[1].length;
  console.log('\nSTART TEST PLAN MIGRATION PROCESS...WAIT UNTIL THE FINISH MESSAGE\n');


  for (var i = 1; i < numberRecord; i++) {
    record = obj[0].data[i];


    if (record[recordLength - 1] != parentId) {
      console.log(shell_exec('node api-create-test-folder ' + i));

      parentId = record[recordLength - 1];

    }

    console.log(shell_exec('node api-create-test-plan ' + i));
    bar.tick();
  }

  console.log('\nSUCCESS TEST PLAN MIGRATION PROCESS');

}

else if (typeProcess == "lab") {

  var obj = xlsx.parse(fs.readFileSync(__dirname + '/' + config.exceltestlab)) // parses a buffer	
  var numberRecord = obj[0].data.length;

  var bar = new ProgressBar('  STATUS [:bar] :percent :etas', {
    complete: '='
    , incomplete: ' '
    , width: 15
    , total: numberRecord - 1
  });

  var recordLength = obj[0].data[1].length;
  console.log('\nSTART TEST LAB MIGRATION PROCESS...WAIT UNTIL THE FINISH MESSAGE\n');


  for (var i = 1; i < numberRecord; i++) {
    record = obj[0].data[i];

    if (record[recordLength - 1] != parentId) {
      console.log(shell_exec('node api-create-lab-folder ' + i));
      parentId = record[recordLength - 1];
    }

    console.log(shell_exec('node get-test-parent-id ' + i));
    console.log(shell_exec('node api-create-test-lab ' + i));
    bar.tick();
  }

  console.log('\nSUCCESS TEST LAB MIGRATION PROCESS');



}
else {


  console.log("\nError: you have to specify 'plan' for TEST PLAN and 'lab' for TEST LAB");
}

