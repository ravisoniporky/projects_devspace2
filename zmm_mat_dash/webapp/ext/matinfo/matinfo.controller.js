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
            },

            onExit: function () {},


            extractRequest: function () {


                var that = this;
     

                var filterData = this.getView().getParent().getComponentData().mainComponent.getGlobalFilter().getFilterData();
                var Material = filterData.Material;
               
               var filters = "Material eq '"+Material+"'";
                
                let defaultModel1 = that.getOwnerComponent().getModel();


                defaultModel1.read("/ZCMM_MATDASH_HEADER", {
                    urlParameters: {
                      "$filter" : filters
                     
                      
          
                    },
                    success: function (oData, oResponse) {
                 
                    //   if(oData.results.length === 0 ){
                    //     that.getView().setModel(new sap.ui.model.json.JSONModel({Vendor:Vendor,OpenBalance: '$ 0'}), "vendorData");
                    //   }else
                      that.getView().setModel(new sap.ui.model.json.JSONModel(oData.results[0]), "materialData");
          
            
          
                    },
          
                    error: function (oError) {
          
                      that.getView().setModel(new sap.ui.model.json.JSONModel({}, "materialData"));
                    }
                  });
              },
        }
    });
})();