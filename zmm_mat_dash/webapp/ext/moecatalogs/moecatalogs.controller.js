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

                this.getView().byId("ZCMM_MATDASH_MOBCAT").rebindTable();
            },
            onAfterRendering: function () {
                this.getView().byId("ZCMM_MATDASH_MOBCAT").rebindTable();
                        },

            onExit: function () {},


            onBeforeRebindTable: function(oEvent){


                var binding = oEvent.getParameter("bindingParams");


              
                var filterData = this.getView().getParent().getComponentData().mainComponent.getGlobalFilter().getFilterData();
                var Material = filterData.Material;
                var SalesOrganization = filterData.SalesOrganization;
               
  
                if(typeof Material === 'undefined'){
                  return;
                }
             
  
  
                var oFilter = new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.EQ,Material);
                binding.filters.push(oFilter);
                if( SalesOrganization && SalesOrganization !== null && SalesOrganization !== 'null'){
                var oFilter = new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ,SalesOrganization);
                binding.filters.push(oFilter);
                }
             
            },
        }
    });
})();