sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'customer.porky.zfutureordere',
            componentId: 'ZCSD_PREORDERObjectPage',
            contextPath: '/ZCSD_PREORDER'
        },
        CustomPageDefinitions
    );
});