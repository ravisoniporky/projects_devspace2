sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'customer.porky.zmmmatverify3',
            componentId: 'ZC_ProductObjectPage',
            contextPath: '/ZC_Product'
        },
        CustomPageDefinitions
    );
});