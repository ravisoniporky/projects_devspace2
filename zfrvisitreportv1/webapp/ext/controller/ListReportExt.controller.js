sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    return {
        customAction: function(oEvent) {
            MessageToast.show("Custom handler invoked.");
        },
        onInit: function(oEvent){

            debugger;
        },

        onBeforeNavigationExtension: function(oEvent) {
            debugger;
            var oNavInfo = oEvent.getParameters();

            // Only intercept Prospect navigation
            if (oNavInfo.semanticObject === "Sales" && 
                oNavInfo.action === "ZFIELDREPVISITREPORT_P") {

                // Inject CustomerAccountGroup constant
                oNavInfo.semanticAttributes = oNavInfo.semanticAttributes || {};
                oNavInfo.semanticAttributes.CustomerAccountGroup = "ZPR";
            }

              if (oNavInfo.semanticObject === "Sales" && 
                oNavInfo.action === "ZFIELDREPVISITREPORT_C") {

                // Inject CustomerAccountGroup constant
                oNavInfo.semanticAttributes = oNavInfo.semanticAttributes || {};
                oNavInfo.semanticAttributes.CustomerAccountGroup = "0001";
            }


            // Return false = do NOT cancel navigation
            return false;
        },

         adaptNavigationParameterExtension: function(oSelectionVariant, oObjectInfo) {
            // oObjectInfo contains semanticObject and action
           // debugger;
            if (oObjectInfo.semanticObject === "Sales" && 
                oObjectInfo.action === "ZFIELDREPVISITREPORT_P") {
                 oObjectInfo.action = "ZFIELDREPVISITREPORT2"
                oSelectionVariant.addSelectOption(
                    "CustomerAccountGroup",  // Parameter name
                    "I",                     // Include
                    "EQ",                    // Equal
                    "ZPR"                    // Value
                );
            }else if (oObjectInfo.semanticObject === "Sales" && 
                oObjectInfo.action === "ZFIELDREPVISITREPORT_C") {
                  oObjectInfo.action = "ZFIELDREPVISITREPORT2"
                oSelectionVariant.addSelectOption(
                    "CustomerAccountGroup",  // Parameter name
                    "I",                     // Include
                    "EQ",                    // Equal
                    "0001"                    // Value
                );
            }
            return oSelectionVariant;
        }
    };
});