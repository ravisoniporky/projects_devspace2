/*global QUnit*/

sap.ui.define([
	"customerporky/zbpcontactcreate/controller/CreateContact.controller"
], function (Controller) {
	"use strict";

	QUnit.module("CreateContact Controller");

	QUnit.test("I should test the CreateContact controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
