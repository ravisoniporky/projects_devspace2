sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'customer/porky/zcustmatv4/test/integration/FirstJourney',
		'customer/porky/zcustmatv4/test/integration/pages/YCSD_CUSTOMERMATERIALList',
		'customer/porky/zcustmatv4/test/integration/pages/YCSD_CUSTOMERMATERIALObjectPage',
		'customer/porky/zcustmatv4/test/integration/pages/YCSD_CUSTOMERMATERIALITEMObjectPage'
    ],
    function(JourneyRunner, opaJourney, YCSD_CUSTOMERMATERIALList, YCSD_CUSTOMERMATERIALObjectPage, YCSD_CUSTOMERMATERIALITEMObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('customer/porky/zcustmatv4') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheYCSD_CUSTOMERMATERIALList: YCSD_CUSTOMERMATERIALList,
					onTheYCSD_CUSTOMERMATERIALObjectPage: YCSD_CUSTOMERMATERIALObjectPage,
					onTheYCSD_CUSTOMERMATERIALITEMObjectPage: YCSD_CUSTOMERMATERIALITEMObjectPage
                }
            },
            opaJourney.run
        );
    }
);