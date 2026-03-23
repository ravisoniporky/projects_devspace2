sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'customer.porky.zsdshiptoasgn',
            componentId: 'ZCSD_SHIPTO_PARTNERSObjectPage',
            contextPath: '/ZCSD_SHIPTO_PARTNERS'
        },
        CustomPageDefinitions
    );
});