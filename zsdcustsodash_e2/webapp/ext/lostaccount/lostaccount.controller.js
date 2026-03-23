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

    that.getView().byId("LineItemsSmartTable_lostaccount").rebindTable();
  

                        },
    
            onAfterRendering: function () {},

            onExit: function () {},

            onAfterRendering: function () {


                this.extractRequest();

                var that = this;
                that.getView().byId("comboBox").setModel(that.getView().getModel("mainModel"),"mainModel")

              },

              extractRequest: function () {


 this.getView().byId("LineItemsSmartTable_lostaccount").rebindTable();

              },

              _forceEnableGrouping: function() {
    var oSmartTable = this.getView().byId("LineItemsSmartTable_lostaccount");
    var oTable = oSmartTable.getTable();
    
    if (oTable) {
        // Force enable grouping
        if (typeof oTable.setEnableGrouping === "function") {
            oTable.setEnableGrouping(true);
        }
        
        // Try different approaches based on table type
        if (oTable.getMetadata().getName() === "sap.ui.table.Table") {
            // For sap.ui.table.Table
            oTable.setEnableGrouping(true);
            
            // Make columns groupable
            var aColumns = oTable.getColumns();
            aColumns.forEach(function(oColumn, index) {
                if (index < 3) { // Make first 3 columns groupable
                    oColumn.setGrouped(false); // Reset grouping
                    oColumn.setSortProperty(oColumn.getProperty("sortProperty") || oColumn.getId());
                }
            });
        }
        
        console.log("Forced grouping enabled");
    } else {
        console.log("Table not found");
    }
},

              onSelectTimeRollup: function(oEvent){

                this.timerollup = oEvent.mParameters.selectedItem.getBindingContext().getObject().timerollup
;this.getView().byId("LineItemsSmartTable_lostaccount").rebindTable();

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
               
                var oFilter = new sap.ui.model.Filter("CompanyCode", sap.ui.model.FilterOperator.EQ,CompanyCode);
                binding.filters.push(oFilter);
  
                var oFilter = new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ,SalesOrganization);
                binding.filters.push(oFilter);

                if(this.timerollup ){
                   var oFilter = new sap.ui.model.Filter("TimeRollup", sap.ui.model.FilterOperator.EQ,this.timerollup);
                binding.filters.push(oFilter);
                }else{
                  var oFilter = new sap.ui.model.Filter("TimeRollup", sap.ui.model.FilterOperator.EQ,"CWK");
                binding.filters.push(oFilter);
                }
          // For AnalyticalTable - ensure proper binding parameters
    binding.parameters = binding.parameters || {};
    

    // Remove $top=0 issue by ensuring proper binding
    binding.length = binding.length || 100;
    binding.startIndex = binding.startIndex || 0;
                    
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