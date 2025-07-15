(function () {
    "use strict";

    /* controller for custom card  */
    // Controller : https://ui5.sap.com/#/topic/121b8e6337d147af9819129e428f1f75
    // controller class name can be like app.ovp.ext.customList.CustomList where app.ovp can be replaced with your application namespace
    sap.ui.define([], function() {
        return {
            onInit: function () {


                
                // this.getModel().attachRequestCompleted(function(oEvent){


                //   var filter = decodeURI(oEvent.mParameters.url.split("$filter=")[1]);
                //   if(filter.includes("CompanyCode") && filter.includes("SalesOrganization") && filter.includes("Customer") && oEvent.mParameters.url.includes("ZBSD_CUSTSODASH") ){
                      
                //   }else{
                //     return;
                //   }
    
                //     var filters = decodeURI(oEvent.mParameters.url.split("$filter=")[1]);
                //     if(filters.includes("&"))
                //       {
                //         filters = filters.split("&")[0];
                //       }

                //       filters = "Customer eq '"+this.getOwnerComponent().getModel("filterModel").getProperty("/Customer")+"' ";
                //       filters = filters+"CompanyCode eq '"+this.getOwnerComponent().getModel("filterModel").getProperty("/CompanyCode")+"' ";
                //       filters = filters+"SalesOrganization eq '"+this.getOwnerComponent().getModel("filterModel").getProperty("/SalesOrganization")+"' ";

                //     let defaultModel1 = that.getOwnerComponent().getModel();

 
                //     defaultModel1.read("/ZCSD_CUSTSODASHADPRICE", {
                //       urlParameters: {
                //         "$filter" : filters,
                //         "$top" :5
                        
            
                //       },
                //       success: function (oData, oResponse) {
                   
                //         that.getView().setModel(new sap.ui.model.json.JSONModel(oData), "adPriceModel");
            
              
            
                //       },
            
                //       error: function (oError) {
            
                //         that.getView().setModel(new sap.ui.model.json.JSONModel({}, "adPriceModel"));
                //       }
                //     });

                // });

            },
            onAfterRendering: function () {


              this.extractRequest();

              var that = this;
              this.getModel().attachRequestCompleted(function(oEvent){


                if(oEvent.mParameters.url.includes("ZCSD_CUSTSODASHAGGR"))
                that.extractRequest();
            

              });



              
            },
    
            extractRequest: function () {
              var that = this;

              var filterData = this.getView().getParent().getComponentData().mainComponent.getGlobalFilter().getFilterData();
              var CompanyCode = filterData.CompanyCode;
              var SalesOrganization = filterData.SalesOrganization;
              var Customer = filterData.Customer;

             var filters = "Customer eq '"+Customer+"' and ";
              filters = filters+"CompanyCode eq '"+CompanyCode+"' and ";
              filters = filters+"SalesOrganization eq '"+SalesOrganization+"' ";

            let defaultModel1 = that.getOwnerComponent().getModel();


            defaultModel1.read("/ZCSD_CUSTSODASHADPRICE", {
              urlParameters: {
                "$filter" : filters,
                "$top" :5
                
    
              },
              success: function (oData, oResponse) {
           
                that.getView().setModel(new sap.ui.model.json.JSONModel(oData), "adPriceModel");
    
      
    
              },
    
              error: function (oError) {
    
                that.getView().setModel(new sap.ui.model.json.JSONModel({}, "adPriceModel"));
              }
            });
            },

            onExit: function () {}
        }
    });
})();