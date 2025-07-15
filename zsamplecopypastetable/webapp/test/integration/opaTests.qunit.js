sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'zsamplecopypastetable/test/integration/FirstJourney',
		'zsamplecopypastetable/test/integration/pages/ZCSD_PreOrderSingletonList',
		'zsamplecopypastetable/test/integration/pages/ZCSD_PreOrderSingletonObjectPage',
		'zsamplecopypastetable/test/integration/pages/ZCSD_PreOrderMultiObjectPage'
    ],
    function(JourneyRunner, opaJourney, ZCSD_PreOrderSingletonList, ZCSD_PreOrderSingletonObjectPage, ZCSD_PreOrderMultiObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('zsamplecopypastetable') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheZCSD_PreOrderSingletonList: ZCSD_PreOrderSingletonList,
					onTheZCSD_PreOrderSingletonObjectPage: ZCSD_PreOrderSingletonObjectPage,
					onTheZCSD_PreOrderMultiObjectPage: ZCSD_PreOrderMultiObjectPage
                }
            },
            opaJourney.run
        );
    }
);