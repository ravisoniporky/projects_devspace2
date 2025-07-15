(function () {
    "use strict";

    /* controller for custom card  */
    // Controller : https://ui5.sap.com/#/topic/121b8e6337d147af9819129e428f1f75
    // controller class name can be like app.ovp.ext.customList.CustomList where app.ovp can be replaced with your application namespace
    sap.ui.define([], function() {
        return {
            onInit: function () {},
    
            onAfterRendering: function () {},

            onExit: function () {},

            onAfterRendering: function () {


                this.extractRequest();

                var that = this;
                this.getModel().attachRequestCompleted(function(oEvent){
  
  
                  if(oEvent.mParameters.url.includes("ZCSD_CUSTSODASHAGGR"))
                    that.getView().byId("smartContacts").rebindTable();

              
  
                });
  
  
  
                
              },

              extractRequest: function () {




              },
           
            onBeforeRebindTable(oEvent) {

                var binding = oEvent.getParameter("bindingParams");


              
                var filterData = this.getView().getParent().getComponentData().mainComponent.getGlobalFilter().getFilterData();
                var CompanyCode = filterData.CompanyCode;
                var SalesOrganization = filterData.SalesOrganization;
                var Customer = filterData.Customer;
  
                if(typeof Customer === 'undefined'){
                  return;
                }
              //  var filters = "Customer eq '"+Customer+"' and ";
                // filters = filters+"CompanyCode eq '"+CompanyCode+"' and ";
                // filters = filters+"SalesOrganization eq '"+SalesOrganization+"' ";
  
  
                var oFilter = new sap.ui.model.Filter("Customer", sap.ui.model.FilterOperator.EQ,Customer);
                binding.filters.push(oFilter);
               
                // var oFilter = new sap.ui.model.Filter("CompanyCode", sap.ui.model.FilterOperator.EQ,CompanyCode);
                // binding.filters.push(oFilter);
  
                // var oFilter = new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ,SalesOrganization);
                // binding.filters.push(oFilter);
          
                    
            },

            onSearchContacts: function(oEvent){
               // add filter for search
               debugger;
               var aFilters = [];
               var sQuery = oEvent.mParameters.query;
               // if (sQuery && sQuery.length > 0) {
                   var filter = new sap.ui.model.Filter("ContactPersonName", sap.ui.model.FilterOperator.Contains, sQuery);
                   aFilters.push(filter);
       
                   var filter = new sap.ui.model.Filter("ContactPhone", sap.ui.model.FilterOperator.Contains, sQuery);
                   aFilters.push(filter);
       
                   var filter = new sap.ui.model.Filter("ContactEmail", sap.ui.model.FilterOperator.Contains, sQuery);
                   aFilters.push(filter);
       
                   var filter = new sap.ui.model.Filter("ContactPersonFunctionName", sap.ui.model.FilterOperator.Contains, sQuery);
                   aFilters.push(filter);

                   var filter = new sap.ui.model.Filter("ContactPersonDepartmentName", sap.ui.model.FilterOperator.Contains, sQuery);
                   aFilters.push(filter);

                   var filterData = this.getView().getParent().getComponentData().mainComponent.getGlobalFilter().getFilterData();


                   var oFilter1 = new sap.ui.model.Filter("Customer", sap.ui.model.FilterOperator.EQ,filterData.Customer);
                 //  aFilters.push(oFilter);
       
                   var filters1 = new sap.ui.model.Filter({
                       filters: aFilters,
                       and: false,
                     });


                     var filters = new sap.ui.model.Filter({
                      filters: [filters1,oFilter1],
                      and: true,
                    });
       
                 
               // }
       
               // update list binding
            //   var list = this.getView().byId("stock_table");
               var binding = oEvent.getSource().getParent().getParent().getTable().getBinding();
               binding.filter(filters, "Application");
            }
        }
    });
})();