sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"customer/porky/zmmparisxref2/test/integration/pages/ZC_ParisMaterialCrossRefList",
	"customer/porky/zmmparisxref2/test/integration/pages/ZC_ParisMaterialCrossRefObjectPage"
], function (JourneyRunner, ZC_ParisMaterialCrossRefList, ZC_ParisMaterialCrossRefObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('customer/porky/zmmparisxref2') + '/test/flp.html#app-preview',
        pages: {
			onTheZC_ParisMaterialCrossRefList: ZC_ParisMaterialCrossRefList,
			onTheZC_ParisMaterialCrossRefObjectPage: ZC_ParisMaterialCrossRefObjectPage
        },
        async: true
    });

    return runner;
});

