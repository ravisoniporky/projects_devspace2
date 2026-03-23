/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"customer/porky/zfieldprospectcr/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
