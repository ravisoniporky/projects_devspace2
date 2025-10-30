sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    return {
        onOpenCreatePage: function(oEvent) {
            MessageToast.show("Custom handler invoked.");
        },
        createCustomItemCreate: function(oEvent) {
        MessageToast.show("Custom handler invoked.");
        }
    };
});