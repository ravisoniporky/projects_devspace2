/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"customerporky/zsdinfoovp_c/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
