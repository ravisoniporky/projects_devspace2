sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"customer/porky/zcustmatv5/test/integration/pages/ZCSD_CUSTOMERMATERIALList",
	"customer/porky/zcustmatv5/test/integration/pages/ZCSD_CUSTOMERMATERIALObjectPage",
	"customer/porky/zcustmatv5/test/integration/pages/ZCSD_CUSTOMERMATERIALITEMObjectPage"
], function (JourneyRunner, ZCSD_CUSTOMERMATERIALList, ZCSD_CUSTOMERMATERIALObjectPage, ZCSD_CUSTOMERMATERIALITEMObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('customer/porky/zcustmatv5') + '/index.html',
        pages: {
			onTheZCSD_CUSTOMERMATERIALList: ZCSD_CUSTOMERMATERIALList,
			onTheZCSD_CUSTOMERMATERIALObjectPage: ZCSD_CUSTOMERMATERIALObjectPage,
			onTheZCSD_CUSTOMERMATERIALITEMObjectPage: ZCSD_CUSTOMERMATERIALITEMObjectPage
        },
        async: true
    });

    return runner;
});

