sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function(MessageToast, MessageBox) {
    'use strict';

    console.error("========================================");
    console.error("✅ CONTROLLER LOADED!");
    console.error("========================================");
     alert("CONTROLLER LOADED!");
    return {
        
        // Try variation 1 (current)
        
        onClickActionZCSD_SELECTOR_BILLER_PARTNERprintForm: function(oEvent) {
            console.error("🔴 METHOD 1 TRIGGERED!");
            this._executePrintForm(oEvent);

              alert("UI METHOD TRIGGERED!");
        },
        
        // Try variation 2 (without entity name)
        onClickActionprintForm: function(oEvent) {
            console.error("🔴 METHOD 2 TRIGGERED!");
            this._executePrintForm(oEvent);
              alert("UI METHOD TRIGGERED2!");
        },
        
        // Try variation 3 (simple name)
        printForm: function(oEvent) {
            console.error("🔴 METHOD 3 TRIGGERED!");
            this._executePrintForm(oEvent);
              alert("UI METHOD TRIGGERED3!");
        },
        
        // Try variation 4 (with different prefix)
        onActionprintForm: function(oEvent) {
            console.error("🔴 METHOD 4 TRIGGERED!");
            this._executePrintForm(oEvent);
              alert("UI METHOD TRIGGERED!");
        },
        
        // The actual logic (called by whichever method works)
        _executePrintForm: function(oEvent) {
            
            console.error("========================================");
            console.error("🔴 EXECUTING PRINT FORM!");
            console.error("========================================");
            
            var aSelectedContexts = this.extensionAPI.getSelectedContexts();
            
            if (!aSelectedContexts || aSelectedContexts.length === 0) {
                MessageBox.warning("Please select at least one row");
                return;
            }
            
            sap.ui.core.BusyIndicator.show(0);
            
            var oModel = this.getView().getModel();
            var oFirstContext = aSelectedContexts[0];
            
            var sPartner = oFirstContext.getProperty("Partner");
            var sSalesOrg = oFirstContext.getProperty("SalesOrganization");
            
            console.log("Partner:", sPartner);
            console.log("Sales Org:", sSalesOrg);
            
            var sEntityPath = oModel.createKey("/ZCSD_SELECTOR_BILLER_PARTNER", {
                Partner: sPartner,
                SalesOrganization: sSalesOrg
            });
            
            console.log("Calling:", sEntityPath + "/printForm");
            
            oModel.callFunction(sEntityPath + "/printForm", {
                method: "POST",
                success: function(oData, oResponse) {
                    console.error("✅ BACKEND SUCCESS!");
                    console.log("Full response:", oData);
                    
                    sap.ui.core.BusyIndicator.hide();
                    
                    var sODataUrl = oData.odata_url;
                    var sUrlKey = oData.urlkey;
                    
                    console.log("URL Key:", sUrlKey);
                    console.log("OData URL:", sODataUrl);
                    
                    if (sODataUrl) {
                        console.error("🚀 OPENING BROWSER TAB");
                        window.open(sODataUrl, '_blank');
                        MessageToast.show("Opening selector sheet for " + aSelectedContexts.length + " items");
                    } else {
                        console.error("❌ No URL in response");
                        MessageBox.error("No URL returned from backend");
                    }
                },
                error: function(oError) {
                    console.error("❌ BACKEND ERROR!");
                    console.error("Error object:", oError);
                    console.error("Response text:", oError.responseText);
                    
                    sap.ui.core.BusyIndicator.hide();
                    
                    var sErrorMsg = "Error generating selector sheet";
                    try {
                        if (oError.responseText) {
                            var oErrorResponse = JSON.parse(oError.responseText);
                            if (oErrorResponse.error && oErrorResponse.error.message) {
                                sErrorMsg = oErrorResponse.error.message.value;
                            }
                        }
                    } catch(e) {}
                    
                    MessageBox.error(sErrorMsg);
                }
            });
        }
    };
});