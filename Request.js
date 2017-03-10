module.exports = {

	FolderRequestTest: function (folder1, parentId) {
		return "<Entity Type='test-folder'><Fields> <Field Name='name'> <Value>" + folder1 + "</Value> </Field>   <Field Name='parent-id'> <Value>" + parentId + "</Value> </Field></Fields><RelatedEntities/></Entity>";
	},

	TestRequest: function (testName, parentId, descriptionTest, automatedScenario, changeStatus, comment, designer, estimated, execution, issue, path, status, template, type, userStories) {
		return "<Entity Type='test'><Fields> <Field Name='owner'><Value>" + designer + "</Value> </Field><Field Name='bpta-change-detected'><Value>" + changeStatus + "</Value> </Field> <Field Name='parent-id'><Value>" + parentId + "</Value> </Field><Field Name='user-02'><Value>" + issue + "</Value></Field><Field Name='user-01'> <Value>" + automatedScenario + "</Value></Field><Field Name='user-03'> <Value>" + userStories + "  </Value> </Field><Field Name='dev-comments'> <Value>" + comment + " </Value> </Field><Field Name='description'><Value>"+descriptionTest+"</Value> </Field>  <Field Name='estimate-devtime'>   <Value>" + estimated + "</Value>   </Field>	  <Field Name='exec-status'> <Value>" + execution + "</Value>   </Field><Field Name='storage-path'> <Value>" + path + "</Value> </Field>  <Field Name='status'>  <Value>" + status + "</Value>   </Field><Field Name='template'>   <Value>" + template + "</Value>   </Field>  <Field Name='name'> <Value>" + testName + "</Value>   </Field><Field Name='subtype-id'>  <Value>" + type + "</Value>  </Field> </Fields> <RelatedEntities/></Entity>";
	},

	StepRequest: function (stepName, parentId, descriptionStep, businessRule, configurationPoint, expected) {
		return "<Entity Type='design-step'><Fields><Field Name='user-02'><Value></Value> </Field> <Field Name='user-01'><Value>" + businessRule + "</Value> </Field><Field Name='description'>  <Value>" + descriptionStep + "</Value>  </Field>    <Field Name='expected'>   <Value>" + expected + "</Value>   </Field>   <Field Name='name'> <Value>" + stepName + "</Value></Field><Field Name='parent-id'> <Value>" + parentId + "</Value>  </Field></Fields> <RelatedEntities/></Entity>";
	},
	FolderRequestLab: function (folder1, parentId) {
		if (parentId == '0') {
			return "<Entity Type='test-set-folder'><Fields> <Field Name='name'> <Value>" + folder1 + "</Value> </Field>   <Field Name='parent-id'> <Value></Value> </Field></Fields><RelatedEntities/></Entity>";
		}
		else
			return "<Entity Type='test-set-folder'><Fields> <Field Name='name'> <Value>" + folder1 + "</Value> </Field>   <Field Name='parent-id'> <Value>" + parentId + "</Value> </Field></Fields><RelatedEntities/></Entity>";
	},

	TestLabRequest: function (testLabName, parentId, status) {
		return "<Entity Type='test-set'><Fields> <Field Name='name'> <Value>" + testLabName + "</Value> </Field>  <Field Name='parent-id'> <Value>" + parentId + "</Value>  </Field>   <Field Name='subtype-id'> <Value>hp.qc.test-set.default</Value> </Field><Field Name='status'><Value>" + status + "</Value> </Field> </Fields> <RelatedEntities/></Entity>";
	},
	TestInstanceRequest: function (CycleId, testInstanceId, testOrder, owner, tester) {
		return "<Entity Type='test-instance'> <Fields> <Field Name='test-order'> <Value>" + testOrder + "</Value></Field> <Field Name='cycle-id'> <Value>" + CycleId + "</Value></Field> <Field Name='test-id'><Value>" + testInstanceId + "</Value> </Field><Field Name='subtype-id'><Value>hp.qc.test-instance.MANUAL</Value> </Field> <Field Name='owner'> <Value>" + owner + "</Value> </Field><Field Name='actual-tester'><Value>" + tester + "</Value> </Field> </Fields> <RelatedEntities/></Entity>";
	}


};