sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'zsamplecopypastetable',
            componentId: 'ZCSD_PreOrderMultiObjectPage',
            contextPath: '/ZCSD_PreOrderSingleton/_Multi'
        },
        CustomPageDefinitions
    );
});