sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'customer.porky.zcustmaterialv4',
            componentId: 'ZCSD_CUSTOMERMATERIALObjectPage',
            contextPath: '/ZCSD_CUSTOMERMATERIAL'
        },
        CustomPageDefinitions
    );
});