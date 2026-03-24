sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"customer/porky/zmmmatverify3/test/integration/pages/ZC_ProductList",
	"customer/porky/zmmmatverify3/test/integration/pages/ZC_ProductObjectPage"
], function (JourneyRunner, ZC_ProductList, ZC_ProductObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('customer/porky/zmmmatverify3') + '/test/flp.html#app-preview',
        pages: {
			onTheZC_ProductList: ZC_ProductList,
			onTheZC_ProductObjectPage: ZC_ProductObjectPage
        },
        async: true
    });

    return runner;
});

