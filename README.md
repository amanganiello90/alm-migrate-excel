## ALM REST API migration tool

A simple Node API client to migrate to HP ALM using REST service.
It read various excel files that contains your test plan (or test lab) entity data.
The excel files must be configured as the template excel file that you find in the **query** folder.

### Excel file configuration

To understand the mapping field open the query-final.txt file under the **query** folder (it is the query used in the QC dashboard to extract data from its SQL server db in the excel files).

### Features
Read test-plan and test-lab entities from excel file and migrate on the ALM 11 HP platform.

### Installing
You must have installed Node.js. To download it go to https://nodejs.org/it/
You have a right excel file that contains your data.
You can extract the data with the QC query builder in the dashboard as the query.txt file example (read the **Excel file configuration** section).

After these prerequisites, you can download this repo and run:

```
npm install
```

### Execution

First of all, configure the config.json file with your server and credentials:

```javaScript
{
  "exceltestplan": "yourtestplanexcel.xls",
  "exceltestplanfolder": "folder-test-plan-table.xls",
  "exceltestlabfolder": "folder-test-lab-table.xls" ,
  "exceltestlab" : "yourtestlabexcel.xls",
  "server": "http://alm-server",
  "port": "8080",
  "instance": "qcbin",
  "domain": "yourdomain",
  "project": "yourproject",
  "username": "yourusername",
  "password": "yourpassword"
}
```
N.B. the excel files must be in this repo folder.
Remember that the users defined in your excel fields must be created in your alm.

Execute this shell command:

```javaScript
node alm-api <type>
```
Where "type" is your typology of tests that you want migrate: "plan" for the TEST PLAN and "lab" for TEST LAB

### XML request example
You can find the xml request example, with the list of the request mandatory fields, under the **xml** folder.

### REST API Overview
http://alm-help.saas.hpe.com/en/12.20/api_refs/REST_TECH_PREVIEW/ALM_REST_API_TP.html




