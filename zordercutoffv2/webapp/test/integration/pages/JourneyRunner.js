sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"customer/porky/zordercutoffv2/test/integration/pages/ZC_ORDERCUTOFFQV1List.gen",
	"customer/porky/zordercutoffv2/test/integration/pages/ZC_ORDERCUTOFFQV1ObjectPage.gen"
], function (JourneyRunner, ZC_ORDERCUTOFFQV1ListGenerated, ZC_ORDERCUTOFFQV1ObjectPageGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('customer/porky/zordercutoffv2') + '/test/flp.html#app-preview',
        pages: {
			onTheZC_ORDERCUTOFFQV1ListGenerated: ZC_ORDERCUTOFFQV1ListGenerated,
			onTheZC_ORDERCUTOFFQV1ObjectPageGenerated: ZC_ORDERCUTOFFQV1ObjectPageGenerated
        },
        async: true
    });

    return runner;
});

