sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'customer.porky.zcustmatv5',
            componentId: 'ZCSD_CUSTOMERMATERIALList',
            contextPath: '/ZCSD_CUSTOMERMATERIAL'
        },
        CustomPageDefinitions
    );
});