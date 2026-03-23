sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    return {
        
        onInit: function(oEvent){

            var that = this;
            // setTimeout(() => {
                
            //     console.log(that.getView())
                that.getView().byId("customer.porky.zsdprospectmng::sap.suite.ui.generic.template.ListReport.view.ListReport::ZCSD_PROSPECT_MANAGEMENT--addEntry").setVisible(false);
            // }, 500);
        },
        hideCreateAction: function(oEvent) {
            MessageToast.show("Custom handler invoked.");
        }
    }
});
