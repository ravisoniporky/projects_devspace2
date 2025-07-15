(function () {
    "use strict";

    /* controller for custom card  */
    // Controller : https://ui5.sap.com/#/topic/121b8e6337d147af9819129e428f1f75
    // controller class name can be like app.ovp.ext.customList.CustomList where app.ovp can be replaced with your application namespace
    sap.ui.define([], function() {
        return {
            onInit: function () {

          

            },

            onAfterRendering: function () {


              this.extractRequest();

              var that = this;
              this.getModel().attachRequestCompleted(function(oEvent){


                if(oEvent.mParameters.url.includes("ZBSD_CUSTSODASH") && !oEvent.mParameters.url.includes("top=29"))
                that.extractRequest();
            

              });



              
            },
    
            extractRequest: function () {

              var that = this;
              let defaultModel1 = that.getOwnerComponent().getModel();

              var filterData = this.getView().getParent().getComponentData().mainComponent.getGlobalFilter().getFilterData();
              var CompanyCode = filterData.CompanyCode;
              var SalesOrganization = filterData.SalesOrganization;
              var Customer = filterData.Customer;

             var filters = "Customer eq '"+Customer+"' and ";
              filters = filters+"CompanyCode eq '"+CompanyCode+"' and ";
              filters = filters+"SalesOrganization eq '"+SalesOrganization+"' ";
          defaultModel1.read("/ZBSD_CUSTSODASH", {
            urlParameters: {
              "$filter" : filters,
              "$top" :29,
              "$skip" :0
              
  
            },
            success: function (oData, oResponse) {
         
              that.getView().setModel(new sap.ui.model.json.JSONModel(oData.results[0]), "customerData");
  
    
  
            },
  
            error: function (oError) {
  
              that.getView().setModel(new sap.ui.model.json.JSONModel({}, "customerData"));
            }
          });
            },

            onExit: function () {}
        }
    });
})();