sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'zsamplecopypastetable',
            componentId: 'ZCSD_PreOrderSingletonObjectPage',
            contextPath: '/ZCSD_PreOrderSingleton'
        },
        CustomPageDefinitions
    );
});