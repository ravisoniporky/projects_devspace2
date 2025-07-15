(function () {
    "use strict";

    /* controller for custom card  */
    // Controller : https://ui5.sap.com/#/topic/121b8e6337d147af9819129e428f1f75
    // controller class name can be like app.ovp.ext.customList.CustomList where app.ovp can be replaced with your application namespace
    sap.ui.define([], function() {
        return {
            onInit: function () {
                this.GloabalEventBus = sap.ui.getCore().getEventBus();
this.GloabalEventBus.subscribe("OVPGlobalfilter", "OVPGlobalFilterSeacrhfired", this.onGlobalfilterApply.bind(this));
            },
            onGlobalfilterApply: function(oEvent){

                this.extractRequest();
            },
    
            onAfterRendering: function () {
                this.extractRequest();

                // var that = this;
                // this.getModel().attachRequestCompleted(function(oEvent){
  
  
                //   if(!oEvent.mParameters.url.includes("ZCMM_VENDORDASHBOARD"))
                //   that.extractRequest();
              
  
                // });
  
            },

            onExit: function () {},


            extractRequest: function () {


                var that = this;
     

                var filterData = this.getView().getParent().getComponentData().mainComponent.getGlobalFilter().getFilterData();
                var Vendor = filterData.Vendor;
                var CompanyCode = filterData.CompanyCode;
                var PurchasingOrganization = filterData.PurchasingOrganization;
  
               var filters = "Vendor eq '"+Vendor+"' and ";
                filters = filters+"CompanyCode eq '"+CompanyCode+"' and ";
                filters = filters+"PurchasingOrganization eq '"+PurchasingOrganization+"' ";
                let defaultModel1 = that.getOwnerComponent().getModel();


                defaultModel1.read("/ZCMM_VENDORDASHBOARD", {
                    urlParameters: {
                      "$filter" : filters,
                      "$top" :29,
                      "$skip" :0
                      
          
                    },
                    success: function (oData, oResponse) {
                 
                      that.getView().setModel(new sap.ui.model.json.JSONModel(oData.results[0]), "vendorData");
          
            
          
                    },
          
                    error: function (oError) {
          
                      that.getView().setModel(new sap.ui.model.json.JSONModel({}, "vendorData"));
                    }
                  });

 


              },
        }
    });
})();