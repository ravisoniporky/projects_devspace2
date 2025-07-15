sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    return {
        addDefault: function(oEvent) {
            MessageToast.show("Custom handler invoked.");
        },
        ext_objpage: function(oEvent) {
        MessageToast.show("Custom handler invoked.");
        },
        ext_objpage: function(oEvent) {
        MessageToast.show("Custom handler invoked.");
        }
    };
});