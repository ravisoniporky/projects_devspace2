sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'customer.porky.zfutureordere',
            componentId: 'ZCSD_PREORDERList',
            contextPath: '/ZCSD_PREORDER'
        },
        CustomPageDefinitions
    );
});