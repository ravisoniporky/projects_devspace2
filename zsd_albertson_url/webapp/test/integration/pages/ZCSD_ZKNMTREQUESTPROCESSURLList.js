sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'customer.porky.zsdalbertsonurl',
            componentId: 'ZCSD_ZKNMTREQUESTPROCESSURLList',
            contextPath: '/ZCSD_ZKNMTREQUESTPROCESSURL'
        },
        CustomPageDefinitions
    );
});