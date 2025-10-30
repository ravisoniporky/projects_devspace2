sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"customer/porky/zsdalbertsonmr/test/integration/pages/ZCSD_ZKNMTRequestProcessHeaderList",
	"customer/porky/zsdalbertsonmr/test/integration/pages/ZCSD_ZKNMTRequestProcessHeaderObjectPage",
	"customer/porky/zsdalbertsonmr/test/integration/pages/ZCSD_ZKNMTRequestProcessObjectPage"
], function (JourneyRunner, ZCSD_ZKNMTRequestProcessHeaderList, ZCSD_ZKNMTRequestProcessHeaderObjectPage, ZCSD_ZKNMTRequestProcessObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('customer/porky/zsdalbertsonmr') + '/test/flp.html#app-preview',
        pages: {
			onTheZCSD_ZKNMTRequestProcessHeaderList: ZCSD_ZKNMTRequestProcessHeaderList,
			onTheZCSD_ZKNMTRequestProcessHeaderObjectPage: ZCSD_ZKNMTRequestProcessHeaderObjectPage,
			onTheZCSD_ZKNMTRequestProcessObjectPage: ZCSD_ZKNMTRequestProcessObjectPage
        },
        async: true
    });

    return runner;
});

