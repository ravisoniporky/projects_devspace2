sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'customer.porky.zcustmatv4',
            componentId: 'YCSD_CUSTOMERMATERIALList',
            contextPath: '/YCSD_CUSTOMERMATERIAL'
        },
        CustomPageDefinitions
    );
});