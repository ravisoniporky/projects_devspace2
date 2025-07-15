/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"customerporky/zmm_mat_list/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
