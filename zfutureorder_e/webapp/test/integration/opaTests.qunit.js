sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'customer/porky/zfutureordere/test/integration/FirstJourney',
		'customer/porky/zfutureordere/test/integration/pages/ZCSD_PREORDERList',
		'customer/porky/zfutureordere/test/integration/pages/ZCSD_PREORDERObjectPage'
    ],
    function(JourneyRunner, opaJourney, ZCSD_PREORDERList, ZCSD_PREORDERObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('customer/porky/zfutureordere') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheZCSD_PREORDERList: ZCSD_PREORDERList,
					onTheZCSD_PREORDERObjectPage: ZCSD_PREORDERObjectPage
                }
            },
            opaJourney.run
        );
    }
);