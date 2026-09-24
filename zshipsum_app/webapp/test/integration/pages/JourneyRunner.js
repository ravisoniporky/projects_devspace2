sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"customer/porky/zshipsumapp/test/integration/pages/ZC_ShipmentBlotter_HeaderList.gen",
	"customer/porky/zshipsumapp/test/integration/pages/ZC_ShipmentBlotter_HeaderObjectPage.gen",
	"customer/porky/zshipsumapp/test/integration/pages/ZC_ShipmentBlotter_ItemObjectPage.gen"
], function (JourneyRunner, ZC_ShipmentBlotter_HeaderListGenerated, ZC_ShipmentBlotter_HeaderObjectPageGenerated, ZC_ShipmentBlotter_ItemObjectPageGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('customer/porky/zshipsumapp') + '/test/flp.html#app-preview',
        pages: {
			onTheZC_ShipmentBlotter_HeaderListGenerated: ZC_ShipmentBlotter_HeaderListGenerated,
			onTheZC_ShipmentBlotter_HeaderObjectPageGenerated: ZC_ShipmentBlotter_HeaderObjectPageGenerated,
			onTheZC_ShipmentBlotter_ItemObjectPageGenerated: ZC_ShipmentBlotter_ItemObjectPageGenerated
        },
        async: true
    });

    return runner;
});

