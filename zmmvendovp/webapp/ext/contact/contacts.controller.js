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

                this.getView().byId("smartContacts").rebindTable();
            },
    
            onAfterRendering: function () {},

            onExit: function () {},

            onBeforeRebindTable: function(oEvent){


                var binding = oEvent.getParameter("bindingParams");


              
                var filterData = this.getView().getParent().getComponentData().mainComponent.getGlobalFilter().getFilterData();
                // var CompanyCode = filterData.CompanyCode;
                // var SalesOrganization = filterData.SalesOrganization;
                var Customer = filterData.Vendor;
  
                if(typeof Customer === 'undefined'){
                  return;
                }
              //  var filters = "Customer eq '"+Customer+"' and ";
                // filters = filters+"CompanyCode eq '"+CompanyCode+"' and ";
                // filters = filters+"SalesOrganization eq '"+SalesOrganization+"' ";
  
  
                var oFilter = new sap.ui.model.Filter("Vendor", sap.ui.model.FilterOperator.EQ,Customer);
                binding.filters.push(oFilter);
            }
        }
    });
})();