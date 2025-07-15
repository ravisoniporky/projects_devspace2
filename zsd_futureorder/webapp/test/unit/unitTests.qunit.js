/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"customerporky/zsd_futureorder/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
