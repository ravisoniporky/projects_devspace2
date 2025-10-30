sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'customer.porky.zsdalbertsonmr',
            componentId: 'ZCSD_ZKNMTRequestProcessHeaderObjectPage',
            contextPath: '/ZCSD_ZKNMTRequestProcessHeader'
        },
        CustomPageDefinitions
    );
});