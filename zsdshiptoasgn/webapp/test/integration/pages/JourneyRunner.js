sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"customer/porky/zsdshiptoasgn/test/integration/pages/ZCSD_SHIPTO_PARTNERSList",
	"customer/porky/zsdshiptoasgn/test/integration/pages/ZCSD_SHIPTO_PARTNERSObjectPage"
], function (JourneyRunner, ZCSD_SHIPTO_PARTNERSList, ZCSD_SHIPTO_PARTNERSObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('customer/porky/zsdshiptoasgn') + '/test/flp.html#app-preview',
        pages: {
			onTheZCSD_SHIPTO_PARTNERSList: ZCSD_SHIPTO_PARTNERSList,
			onTheZCSD_SHIPTO_PARTNERSObjectPage: ZCSD_SHIPTO_PARTNERSObjectPage
        },
        async: true
    });

    return runner;
});

