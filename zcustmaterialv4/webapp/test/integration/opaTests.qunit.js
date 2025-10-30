sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'customer/porky/zcustmaterialv4/test/integration/FirstJourney',
		'customer/porky/zcustmaterialv4/test/integration/pages/ZCSD_CUSTOMERMATERIALList',
		'customer/porky/zcustmaterialv4/test/integration/pages/ZCSD_CUSTOMERMATERIALObjectPage',
		'customer/porky/zcustmaterialv4/test/integration/pages/ZCSD_CUSTOMERMATERIALITEMObjectPage'
    ],
    function(JourneyRunner, opaJourney, ZCSD_CUSTOMERMATERIALList, ZCSD_CUSTOMERMATERIALObjectPage, ZCSD_CUSTOMERMATERIALITEMObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('customer/porky/zcustmaterialv4') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheZCSD_CUSTOMERMATERIALList: ZCSD_CUSTOMERMATERIALList,
					onTheZCSD_CUSTOMERMATERIALObjectPage: ZCSD_CUSTOMERMATERIALObjectPage,
					onTheZCSD_CUSTOMERMATERIALITEMObjectPage: ZCSD_CUSTOMERMATERIALITEMObjectPage
                }
            },
            opaJourney.run
        );
    }
);