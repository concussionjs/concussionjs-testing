var Browser = require("zombie");
var assert = require("assert");
var nta = require("/home/concussed/concussionjs-testdrive/node_modules/nextera/nextera.js");

var contactsForm;

// button arrays
var deleteButtonsArr;
var updateButtonsArr;

// individual buttons
var deleteButton;
var updateButton;

// field arrays
var fnFieldsArr;
var nameFieldsArr;

// individual arrays
var fnField;
var nameField;

// assertion counts
var preDeleteCount;
var preAddCount;
var postDeleteCount;

// variables for storing form data
var startFn = "John Doe";
var startEmail = 'john.doe@concussionjs.com';
var endFn = "Ben Frenkel";
var endEmail = "ben@concussionjs.com"
var vcards = "";

// Set up browser object, pointing to the local proxy


var browser = new Browser();
browser.proxy="http://localhost:80";
browser.debug=true;
browser.silent=false;
browser.site="testdrive.local-concussionjs.com/getPage?id=testId&pagename=testPage"

// setUp and cleanUp variables
var tempPageId="";
var tempObjectId="";
function setUp()
{
	nta.debug = true;
	nta.initiateDB(function(db){
		var testPage = { "id" : "testId", "html" : "<html>\r\n<head>\r\n    <title>Contacts</title>\r\n    <meta charset=\"utf-8\">\r\n\t<link rel=\"stylesheet\" href=\"contacts-style.css\">\r\n <script src=\"http://testdrive.local-concussionjs.com/concussion.js\"></script> </head>\r\n\t<body>\r\n        <form data-bind=\"submit:contacts_create\">\r\n        <div class=\"new-contact\">\r\n\t\t\t<input name=\"fn\" class=\"fn\" type=\"text\" placeholder=\"Contact Name\" data-bind=\"value:contacts_Name\">\r\n\t\t\t<input name=\"phone\" class=\"phone\" type=\"text\" placeholder=\"Phone Number\" data-bind=\"value:contacts_phoneNumber\">\r\n\t\t\t<input name=\"email\" class=\"email\" type=\"text\" placeholder=\"Email Address\" data-bind=\"value:contacts_emailAddress\">\r\n            <button type=\"submit\" value=\"Save\">Add record</button>    \r\n\t    </div>\r\n        </form>\r\n\t    <div id=\"contacts\" data-bind=\"foreach:contacts\">\r\n        \t<div class=\"vcard\" data-bind=\"attr:{id:id}\">\r\n    \t\t\t<input class=\"fn\" data-bind=\"value:Name,attr:{name:id() +'_fn'}\">\r\n    \t\t\t<input class=\"phone\" data-bind=\"value:phoneNumber,attr:{name:id() +'_phone'}\">\r\n                <input class=\"email\" data-bind=\"value:emailAddress,attr:{name:id() +'_email'}\">\r\n                <button data-bind=\"click:contacts_update,attr:{name:id() +'_update'}\">Save</button><button data-bind=\"click:contacts_delete,attr:{name:id() +'_delete'}\">Delete</button>\r\n    \t\t</div>\r\n        </div>\r\n </body>\r\n</html>", "name" : "testPage", "_search_keys" : [         "544447760",    "<html>\r\n<head>\r\n    <title>Contacts</title>\r\n    <meta charset=\"utf-8\">\r\n\t<link rel=\"stylesheet\" href=\"contacts-style.css\">\r\n</head>\r\n\t<body>\r\n        <form data-bind=\"submit:contacts_create\">\r\n        <div class=\"new-contact\">\r\n\t\t\t<input name=\"fn\" class=\"fn\" type=\"text\" placeholder=\"Contact Name\" data-bind=\"value:contacts_Name\">\r\n\t\t\t<input name=\"phone\" class=\"phone\" type=\"text\" placeholder=\"Phone Number\" data-bind=\"value:contacts_phoneNumber\">\r\n\t\t\t<input name=\"email\" class=\"email\" type=\"text\" placeholder=\"Email Address\" data-bind=\"value:contacts_emailAddress\">\r\n            <button type=\"submit\" value=\"Save\">Add record</button>    \r\n\t    </div>\r\n        </form>\r\n\t    <div id=\"contacts\" data-bind=\"foreach:contacts\">\r\n        \t<div class=\"vcard\" data-bind=\"attr:{id:id}\">\r\n    \t\t\t<input class=\"fn\" data-bind=\"value:Name,attr:{name:id() +'_fn'}\">\r\n    \t\t\t<input class=\"phone\" data-bind=\"value:phoneNumber,attr:{name:id() +'_phone'}\">\r\n                <input class=\"email\" data-bind=\"value:emailAddress,attr:{name:id() +'_email'}\">\r\n                <button data-bind=\"click:contacts_update,attr:{name:id() +'_update'}\">Save</button><button data-bind=\"click:contacts_delete,attr:{name:id() +'_delete'}\">Delete</button>\r\n    \t\t</div>\r\n        </div>\r\n </body>\r\n</html>" ] }
		var testObject = {"fields" : [    {       "name" : "Name" },       {       "name" : "phoneNumber" },       {       "name" : "emailAddress" } ], "children" : [ ], "name" : "id_testId_contacts", "type" : "array", "varname" : "contacts" };
		nta.createEntry(testPage,"pages",function(status,objs){
			console.log(JSON.stringify(objs));
			tempPageId = ("" + objs[0]._id).replace(/' '*/ig,"");
			console.log("tempPageId: ",tempPageId);
			
			nta.createEntry(testObject,"nextera_objects",function(status,objs){
				console.log(JSON.stringify(objs));
				tempObjectId = ("" + objs[0]._id).replace(/' '*/ig,"");
				console.log("tempObjectId: ",tempObjectId);
				db.close();
			});
		});

		
	});
}

function cleanUp()
{
	nta.initiateDB(function(db){
		console.log("***deleting page ", tempPageId, "***");
		nta.deleteEntry(tempPageId,"pages",function(status,objs){
			console.log("page deleted");
			console.log("***deleting nextera_object ", tempObjectId,"***");
				nta.deleteEntry(tempObjectId,"nextera_objects",function(status,objs){
				console.log("nextera_object deleted");
				db.close();
			});
		});
	});	
}
//cleanUp();
setUp();

browser.visit("http://testdrive.local-concussionjs.com/getPage?id=testId&pagename=testPage",function (e, browser) {
	if (browser.error )
    		console.dir("Errors reported:", browser.errors);
  // Fill first name, email and submit form
  	//browser.localStorage("http://testdrive.local-concussionjs.com").setItem("sessionId","testId");
    console.log("before: " + browser.localStorage("testdrive.local-concussionjs.com").getItem("sessionId"));  
  	console.log("cookie:" + browser.cookies().dump());

  	browser.wait(5000, function(){
  		console.log("after: " + browser.localStorage("http://testdrive.local-concussionjs.com").getItem("sessionId"));
      	contactsForm = browser.document.querySelector("[id^='contacts']");
      	deleteButtonsArr = contactsForm.querySelectorAll("[name*='_delete']");
      	preAddCount = deleteButtonsArr.length;

      	browser.
      	fill("fn", startFn).
      	fill("email", startEmail).
    	pressButton("Add record", function() {
 			//browser.resources.dump();
     		assert.ok(browser.success);
     		assert.equal(browser.text("title"), "Contacts");
     		console.log("***after add record***");
			contactsForm = browser.document.querySelector("[id^='contacts']");
			//browser.resources.dump();			
			// testing add
			vcards = contactsForm.querySelectorAll("[class*='vcard']");
			console.log("vcards length: ",vcards.length);
			console.log("fn: ", vcards[vcards.length-1].querySelector("[class*='fn']").value);
			console.log("email: ", vcards[vcards.length-1].querySelector("[class*='email']").value);
			assert.equal(startEmail, vcards[vcards.length-1].querySelector("[class*='email']").value);
			assert.equal(startFn, vcards[vcards.length-1].querySelector("[class*='fn']").value)
			browser.resources.dump();
			// setup update buttons array
			updateButtonsArr = contactsForm.querySelectorAll("[name*='_update']");
			updateButton = updateButtonsArr[updateButtonsArr.length-1];
			
			// setup update form elements
			fnFieldsArr = contactsForm.querySelectorAll("[name*='_fn']");
			emailFieldsArr = contactsForm.querySelectorAll("[name*='_email']");

			fnField = fnFieldsArr[fnFieldsArr.length-1];
			emailField = emailFieldsArr[emailFieldsArr.length-1];

      		browser.
      		fill(fnField.name, endFn).
      		fill(emailField.name, endEmail).
    		pressButton(updateButton.name, function() {
				// testing update
				console.log("***after update record***");
				console.log("fn: ", vcards[vcards.length-1].querySelector("[class*='fn']").value);
				console.log("email: ", vcards[vcards.length-1].querySelector("[class*='email']").value);
				assert.equal(endEmail, vcards[vcards.length-1].querySelector("[class*='email']").value);
				assert.equal(endFn, vcards[vcards.length-1].querySelector("[class*='fn']").value)

				// setup delete buttons array
				deleteButtonsArr = contactsForm.querySelectorAll("[name*='_delete']");
				deleteButton = deleteButtonsArr[deleteButtonsArr.length-1];
				preDeleteCount = deleteButtonsArr.length;

				// check to see if the count of contacts increased by one after the add button was hit
				assert.equal(preAddCount,preDeleteCount-1);
				console.log("before ", deleteButtonsArr.length);
	
				browser.pressButton(deleteButtonsArr[deleteButtonsArr.length-1].name,function(){
					console.log("***after delete record***");
					var postDeleteCount = contactsForm.querySelectorAll("[name*='_delete']").length;
					console.log("after: ",postDeleteCount, " at start: ", preAddCount);
					assert.equal(preAddCount, postDeleteCount);
					cleanUp();
				});
			});
			console.log("Success");
			
   		});
	});
});
