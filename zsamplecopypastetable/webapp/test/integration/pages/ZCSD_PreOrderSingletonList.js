sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'zsamplecopypastetable',
            componentId: 'ZCSD_PreOrderSingletonList',
            contextPath: '/ZCSD_PreOrderSingleton'
        },
        CustomPageDefinitions
    );
});