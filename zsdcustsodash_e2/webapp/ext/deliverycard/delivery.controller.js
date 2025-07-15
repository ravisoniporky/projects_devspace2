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


                  var filter = decodeURI(oEvent.mParameters.url.split("$filter=")[1]);
                  if(filter.includes("CompanyCode") && filter.includes("SalesOrganization") && filter.includes("Customer")){
                      
                  }else{
                    return;
                  }
    
                    var filters = decodeURI(oEvent.mParameters.url.split("$filter=")[1]);
                    if(filters.includes("&"))
                      {
                        filters = filters.split("&")[0];
                      }
                    let defaultModel1 = that.getOwnerComponent().getModel();

 
                    defaultModel1.read("/ZCSD_CUSTSODASHDELIVERY", {
                      urlParameters: {
                        "$filter" : filters
                        
            
                      },
                      success: function (oData, oResponse) {
                   
                        that.getView().setModel(new sap.ui.model.json.JSONModel(oData), "deliveryModel");
            
              
            
                      },
            
                      error: function (oError) {
            
                        that.getView().setModel(new sap.ui.model.json.JSONModel({}, "deliveryModel"));
                      }
                    });

                });

            },
    
            onAfterRendering: function () {},

            onExit: function () {}
        }
    });
})();