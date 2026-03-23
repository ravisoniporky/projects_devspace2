sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    return {
        
        onInit: function(oEvent){

            var that = this;
            // setTimeout(() => {
                
            //     console.log(that.getView())
                that.getView().byId("zprospectdb2.zprospectdb2::sap.suite.ui.generic.template.ListReport.view.ListReport::ZCSD_PROSPECT_MANAGEMENT--addEntry").setVisible(false);
            // }, 500);


            // Hook into the model to intercept function import calls
            var that = this;
            setTimeout(() => {
                 that._interceptProspectAction();
            }, 1000);
           
        },
        hideCreateAction: function(oEvent) {
            MessageToast.show("Custom handler invoked.");
        },

               _interceptProspectAction: function(oEvent) {
            var that = this;
            var oModel = this.getView().getModel();
            
            if (oModel && oModel.callFunction) {
                var originalCallFunction = oModel.callFunction.bind(oModel);
                
                oModel.callFunction = function(sFunctionName, mParameters) {
                    if (sFunctionName === "/prospect") {
                        // Set default values in parameters
                    //     that._watchForDialog();
                        setTimeout(() => {
                        mParameters = that._addDefaultParameters(mParameters);
                            
                        }, 200);
                    }
                    return originalCallFunction(sFunctionName, mParameters);
                };
            }
        },

        _addDefaultParameters: function(mParameters) {
        


             var that = this;
             var salesorg = this.getView().getContent()[0].getContent().getTable().getSelectedItem().getBindingContext().getObject().SalesOrganization;
    
    this.fetchDefaults(salesorg)
        .then(function(oDefaults) {
            if (oDefaults) {
                // Use the defaults data
                console.log("Reference Customer:", oDefaults.ReferenceCustomer);
                console.log("Payment Terms:", oDefaults.CustomerPaymentTerms);
                console.log("Department:", oDefaults.Department);

                  // sap.ui.getCore().byId("ActionUtil-cds_zsd_prospect_db.cds_zsd_prospect_db_Entities-prospect-SalesOrg").setValue("3700");
              sap.ui.getCore().byId("ActionUtil-cds_zsd_prospect_db.cds_zsd_prospect_db_Entities-prospect-CustomerPaymentTerms").setValue(oDefaults.CustomerPaymentTerms);
            sap.ui.getCore().byId("ActionUtil-cds_zsd_prospect_db.cds_zsd_prospect_db_Entities-prospect-Department").setValue(oDefaults.Department);
            sap.ui.getCore().byId("ActionUtil-cds_zsd_prospect_db.cds_zsd_prospect_db_Entities-prospect-RiskCategory").setValue(oDefaults.RiskCategory);
            sap.ui.getCore().byId("ActionUtil-cds_zsd_prospect_db.cds_zsd_prospect_db_Entities-prospect-CustomerConditionZone").setValue(oDefaults.CustomerConditionZone);
            sap.ui.getCore().byId("ActionUtil-cds_zsd_prospect_db.cds_zsd_prospect_db_Entities-prospect-CreditLimit").setValue(oDefaults.CreditLimit);
            sap.ui.getCore().byId("ActionUtil-cds_zsd_prospect_db.cds_zsd_prospect_db_Entities-prospect-CreditGroup").setValue(oDefaults.CreditGroup);
                        sap.ui.getCore().byId("ActionUtil-cds_zsd_prospect_db.cds_zsd_prospect_db_Entities-prospect-CreditCheckRule").setValue(oDefaults.CreditCheckRule);

                                                sap.ui.getCore().byId("ActionUtil-cds_zsd_prospect_db.cds_zsd_prospect_db_Entities-prospect-ReferenceCustomer").setValue(oDefaults.ReferenceCustomer);


                                                                        sap.ui.getCore().byId("ActionUtil-cds_zsd_prospect_db.cds_zsd_prospect_db_Entities-prospect-CustomerHierarchyL3").setValue(oDefaults.CustomerHierarchyL3);
                                                                        sap.ui.getCore().byId("ActionUtil-cds_zsd_prospect_db.cds_zsd_prospect_db_Entities-prospect-RefCustomerName").setValue(oDefaults.RefCustomerName);

                // Continue with your logic here
            } else {
                console.log("No defaults found");
            }
        })
        .catch(function(error) {
            console.error("Error fetching defaults:", error);
        });
          

            
          
        },

     fetchDefaults: function(salesorg) {
    var that = this;
    var oModel = this.getView().getModel();
    
    return new Promise(function(resolve, reject) {
        // Create filter for sales organization
        var aFilters = [
            new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, salesorg)
        ];
        
        console.log("Fetching defaults for Sales Organization:", salesorg);
        
        oModel.read("/ZCSD_PROSPECT_BPDEFAULTS", {
            filters: aFilters,
            success: function(oData) {
                console.log("Defaults fetched successfully:", oData);
                if (oData.results && oData.results.length > 0) {
                    resolve(oData.results[0]);
                } else {
                    resolve(null);
                }
            },
            error: function(oError) {
                console.error("Error fetching defaults:", oError);
                reject(oError);
            }
        });
    });
},


//         _watchForDialog: function() {
//     var that = this;
    
//     // Method 1: Watch for new DOM elements
//     var observer = new MutationObserver(function(mutations) {
//         mutations.forEach(function(mutation) {
//             if (mutation.addedNodes.length > 0) {
//                 mutation.addedNodes.forEach(function(node) {
//                     if (node.nodeType === 1) { // Element node
//                         var $node = $(node);
                        
//                         // Look for dialog containers
//                         if ($node.hasClass('sapMDialog') || $node.find('.sapMDialog').length > 0) {
//                             var oDialog = sap.ui.getCore().byId($node.attr('id'));
//                             if (oDialog) {
//                                 console.log("Dialog ID found:", oDialog.getId());
//                                 that._handleDialogFound(oDialog);
//                                 observer.disconnect(); // Stop watching
//                             }
//                         }
                        
//                         // Look for action parameter dialog specifically
//                         if ($node.find("input[id*='StoreNo-input']").length > 0) {
//                             console.log("Action Parameter Dialog detected");
//                             that._handleActionDialog($node);
//                             observer.disconnect();
//                         }
//                     }
//                 });
//             }
//         });
//     });
    
//     // Start observing
//     observer.observe(document.body, {
//         childList: true,
//         subtree: true
//     });
    
//     // Stop observing after 5 seconds to prevent memory leaks
//     setTimeout(function() {
//         observer.disconnect();
//     }, 5000);
// }
    }
});
