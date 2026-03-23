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

            onPressMaterial: function(oEvent){

             // debugger;
              var material = oEvent.getSource().getTitle();

              var mParams = {
                
                "Material" : material,
                "plant": oEvent.getSource().getBindingContext("recentOrdersModel").getObject().Plant                ,
                "salesOrg": oEvent.getSource().getBindingContext("recentOrdersModel").getObject().SalesOrganization
                
               
            };

            sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then(function (oService) {
                oService.hrefForExternalAsync({
                    target: {
                        semanticObject: "InventoryReport",
                        action: "ZGETINV"
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
            },
            onOpenZSales: function(oEvent){

                debugger;
              var salesdoc = oEvent.getSource().getTitle();


              var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({

                pattern: "MMddyyyy"
            });

            var pwkenddate = oDateFormat.format(oEvent.getSource().getBindingContext("recentOrdersModel").getObject().WeekEnding        );



              var mParams = {
                
                "salesOrg": oEvent.getSource().getBindingContext("recentOrdersModel").getObject().SalesOrganization,
                "S_VBELN": salesdoc,
                "WeekEnding": pwkenddate,
                "S_VKORG":this.p_Vkorg,
                
               
            };

            sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then(function (oService) {
                oService.hrefForExternalAsync({
                    target: {
                        semanticObject: "Launch_Tcodes",
                        action: "ZTcode_ZSALES2"
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
         
                
                var p_bukrs = CompanyCode;
                var p_Vkorg = SalesOrganization;
                var p_ship = Customer;
                var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({

                    pattern: "yyyy-MM-ddTHH:mm:ss"
                });



                var pwkenddate = oDateFormat.format(new Date());
                that.p_bukrs = p_bukrs;
                that.p_Vkorg = p_Vkorg;
                that.p_ship = p_ship;
                that.pwkenddate = pwkenddate;
                that.getView().setModel(new sap.ui.model.json.JSONModel({}), "recentOrdersModel");

                that.getView().setBusy(true);
                let defaultModel1 = that.getOwnerComponent().getModel();

                defaultModel1.read("/ZCSD_CUSTSODASH", {
                  urlParameters: {
                    "$filter" : filters+" and SalesDocumentType eq 'ZRMA'",
                    "$top" :5,
                    "$expand" : "to_Item",
                    "$orderby" : "Delivery DESC"
                    
        
                  },
                  success: function (oData, oResponse) {
               
                    that.getView().setBusy(false);


                    for(var count = 0 ; count< oData.results.length ; count++){

                        var itemsArray = oData.results[count].to_Item.results;
                        for (var count1 = 0 ; count1< itemsArray.length ; count1++){

                            itemsArray[count1].SalesDocumentItem = Number(itemsArray[count1].SalesDocumentItem);
                        }
                    }

                    that.getView().setModel(new sap.ui.model.json.JSONModel(oData), "recentOrdersModel");
        
          
        
                  },
        
                  error: function (oError) {
                    that.getView().setBusy(false);

                    that.getView().setModel(new sap.ui.model.json.JSONModel({}), "recentOrdersModel");
                }
                });



            },

            onExit: function () {},

            onSearchReturnOrders: function(oEvent){
                // add filter for search
                debugger;
        var aFilters = [];
        var sQuery = oEvent.mParameters.query;
        // if (sQuery && sQuery.length > 0) {
            var filter = new sap.ui.model.Filter("SalesDocumentItem", sap.ui.model.FilterOperator.EQ, sQuery);
            aFilters.push(filter);

            var filter = new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.Contains, sQuery);
            aFilters.push(filter);

            var filter = new sap.ui.model.Filter("OldMaterialId", sap.ui.model.FilterOperator.Contains, sQuery);
            aFilters.push(filter);

            var filter = new sap.ui.model.Filter("MaterialDescription", sap.ui.model.FilterOperator.Contains, sQuery);
            aFilters.push(filter);

            var filters = new sap.ui.model.Filter({
                filters: aFilters,
                and: false,
              });

          
        // }

        // update list binding
        var list = this.getView().byId("stock_table");
        var binding = oEvent.getSource().getParent().getParent().getBinding("items");
        binding.filter(filters, "Application");
            }
        }
    });
})();