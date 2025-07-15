(function () {
    "use strict";

    /* controller for custom card  */
    // Controller : https://ui5.sap.com/#/topic/121b8e6337d147af9819129e428f1f75
    // controller class name can be like app.ovp.ext.customList.CustomList where app.ovp can be replaced with your application namespace
    sap.ui.define([], function() {
        return {
            onInit: function () {

                var that = this;
                this.getModel().attachRequestCompleted(function(oEvent){

                //     if(!oEvent.mParameters.url.includes("ZCFI_CUSTARDASH_ARBAL")){
                //         return;
                //     }
                //     var response = JSON.parse(oEvent.getParameter("response").responseText).d.results[0];
                //     if(typeof response === 'undefined')
                //         {
                //             that.getView().setModel(new sap.ui.model.json.JSONModel({}), "customerData");

                //             return;
                //         }
                //    if(response.Customer)
                //     that.getView().setModel(new sap.ui.model.json.JSONModel(response), "customerData1");


                if(oEvent.mParameters.url.includes("ZCFI_CUSTARDASH_CONTACTS")){
                    return;
                } 

               if(oEvent.mParameters.url.includes("ZCFI_CUSTARDASH") &&  !oEvent.mParameters.url.includes("ZCFI_CUSTARDASH_ARBAL")){
                var filters = decodeURI(oEvent.mParameters.url.split("$filter=")[1]);

                filters =  decodeURI(oEvent.mParameters.url.split("$filter=")[1]).split("and")[0] +"and"+decodeURI(oEvent.mParameters.url.split("$filter=")[1]).split("and")[2];
                let defaultModel1 = that.getOwnerComponent().getModel();


                defaultModel1.read("/ZCFI_CUSTARDASH_ARBAL", {
                  urlParameters: {
                    "$filter" : filters
                    
        
                  },
                  success: function (oData, oResponse) {
               
                    that.getView().setModel(new sap.ui.model.json.JSONModel(oData.results[0]                    ), "customerData1");
        
          
        
                  },
        
                  error: function (oError) {
        
                    that.getView().setModel(new sap.ui.model.json.JSONModel({}, "customerData1"));
                  }
                });
                }
            
                    
                });

            },
    
            onAfterRendering: function (oEvent) {
            //    debugger;
            },

            onExit: function () {},
            setRelevantFilters: function (oFilters) {
                debugger;
                var oView = this.getView().byId("cardView");
                if (oFilters[0] && oFilters[0].aFilters && oFilters[0].aFilters.length > 0) {
                    // Apply filters to the card
                    oView.getBinding("items").filter(oFilters);
                } else {
                    oView.getBinding("items").filter([]);
                }
            },
            onClickHeader: function(){
                var mParams = {
                
                    "DD_KUNNR" : this.getView().getModel("customerData1").getData().Customer,
                    "DD_BUKRS": this.getView().getModel("customerData1").getData().CompanyCode
                   
                   
                };

                sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then(function (oService) {
                    oService.hrefForExternalAsync({
                        target: {
                            semanticObject: "Launch_Tcodes",
                            action: "tcode_fbl5n"
                        },
                        params: mParams
                    }).then(function (sHref) {
                        oService.toExternal({
                            target: {
                                shellHash: sHref
                            }
                        });
                    });

                });
            }
        }
    });
})();