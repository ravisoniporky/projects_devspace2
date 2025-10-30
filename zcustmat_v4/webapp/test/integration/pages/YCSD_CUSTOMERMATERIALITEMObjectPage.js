sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'customer.porky.zcustmatv4',
            componentId: 'YCSD_CUSTOMERMATERIALITEMObjectPage',
            contextPath: '/YCSD_CUSTOMERMATERIAL/_Items'
        },
        CustomPageDefinitions
    );
});