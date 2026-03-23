sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'customer.porky.zmmparisxref2',
            componentId: 'ZC_ParisMaterialCrossRefList',
            contextPath: '/ZC_ParisMaterialCrossRef'
        },
        CustomPageDefinitions
    );
});