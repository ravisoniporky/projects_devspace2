sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"customer/porky/zsdalbertsonurl/test/integration/pages/ZCSD_ZKNMTREQUESTPROCESSURLList",
	"customer/porky/zsdalbertsonurl/test/integration/pages/ZCSD_ZKNMTREQUESTPROCESSURLObjectPage"
], function (JourneyRunner, ZCSD_ZKNMTREQUESTPROCESSURLList, ZCSD_ZKNMTREQUESTPROCESSURLObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('customer/porky/zsdalbertsonurl') + '/test/flp.html#app-preview',
        pages: {
			onTheZCSD_ZKNMTREQUESTPROCESSURLList: ZCSD_ZKNMTREQUESTPROCESSURLList,
			onTheZCSD_ZKNMTREQUESTPROCESSURLObjectPage: ZCSD_ZKNMTREQUESTPROCESSURLObjectPage
        },
        async: true
    });

    return runner;
});

