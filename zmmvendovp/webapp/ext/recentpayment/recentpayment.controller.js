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

                this.getView().byId("recentpayment").rebindTable();
            },
    
            onAfterRendering: function () {},

            onExit: function () {},

            onBeforeRebindTable: function(oEvent){


                var binding = oEvent.getParameter("bindingParams");


              
                var filterData = this.getView().getParent().getComponentData().mainComponent.getGlobalFilter().getFilterData();
                // var CompanyCode = filterData.CompanyCode;
                // var SalesOrganization = filterData.SalesOrganization;
                var Customer = filterData.Vendor;
                var CompanyCode = filterData.CompanyCode;
                var PurchasingOrganization = filterData.PurchasingOrganization;
                var HouseBank = filterData.HouseBank;
  
                if(typeof Customer === 'undefined'){
                  return;
                }
              //  var filters = "Customer eq '"+Customer+"' and ";
                // filters = filters+"CompanyCode eq '"+CompanyCode+"' and ";
                // filters = filters+"SalesOrganization eq '"+SalesOrganization+"' ";
  
  
                var oFilter = new sap.ui.model.Filter("Vendor", sap.ui.model.FilterOperator.EQ,Customer);
                binding.filters.push(oFilter);

                var oFilter = new sap.ui.model.Filter("CompanyCode", sap.ui.model.FilterOperator.EQ,CompanyCode);
                binding.filters.push(oFilter);

                var oFilter = new sap.ui.model.Filter("HouseBank", sap.ui.model.FilterOperator.EQ,HouseBank);
                binding.filters.push(oFilter);

            },

            onClickPO: function(oEvent){
                debugger;
                var data = oEvent.getSource().getBindingContext().getObject();

                var dateFrom = data.PaymentDate;
                var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                    pattern: "yyyyMMdd",
                    UTC: true
                });;

               var  dateFrom1 = oDateFormat.format(dateFrom);
                //var dateTo = data.EncashmentDate
                var docno = data.DocumentNumber

                var mParams = {};
                // var rows = oEvent.getSource().getParent().getParent().getTable().getRows();

                // rows.forEach(element => {
                //     element["S_WERKS-LOW"] = 
                // });
              //  var obj = oEvent.getSource().getParent().getParent().getTable().getRows()[0].getBindingContext().getObject()

                var mParams = {
                
                    "ZPFIORIVBLNR" : docno,
                   "ZPFIORISELDTLOW" : dateFrom1
                   
                };

                sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then(function (oService) {
                    oService.hrefForExternalAsync({
                        target: {
                            semanticObject: "Launch_Tcodes",
                            action: "tcode_zfchnw"
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