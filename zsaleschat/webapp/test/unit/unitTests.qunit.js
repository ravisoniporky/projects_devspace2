/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"shell/porky/zsaleschat/zsaleschat/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
