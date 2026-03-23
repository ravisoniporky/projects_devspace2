sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'customer.porky.zmmparisxref2',
            componentId: 'ZC_ParisMaterialCrossRefObjectPage',
            contextPath: '/ZC_ParisMaterialCrossRef'
        },
        CustomPageDefinitions
    );
});