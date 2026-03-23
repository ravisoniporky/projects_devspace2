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

              var that = this;
              this.getModel().attachRequestCompleted(function(oEvent){


                if(oEvent.mParameters.url.includes("ZCSD_CUSTSODASHAGGR")  )
                that.extractRequest();
            

              });

  
  
  
                
              },

              extractRequest: function () {


                var that = this;
                // var filter = decodeURI(oEvent.mParameters.url.split("$filter=")[1]);
                //     if(filter.includes("CompanyCode") && filter.includes("SalesOrganization") && filter.includes("Customer") && oEvent.mParameters.url.includes("ZBSD_CUSTSODASH")){
                        
                //     }else{
                //       return;
                //     }
    
                //     var filters = decodeURI(oEvent.mParameters.url.split("$filter=")[1]);
                //     if(filters.includes("&"))
                //         {
                //           filters = filters.split("&")[0];
                //         }

                var filterData = this.getView().getParent().getComponentData().mainComponent.getGlobalFilter().getFilterData();
                var CompanyCode = filterData.CompanyCode;
                var SalesOrganization = filterData.SalesOrganization;
                var Customer = filterData.Customer;
  
               var filters = "Customer eq '"+Customer+"' and ";
                filters = filters+"CompanyCode eq '"+CompanyCode+"' and ";
                filters = filters+"SalesOrganization eq '"+SalesOrganization+"' ";


                    var oSmartTable = that.getView().byId("LineItemsSmartTable2");
                     oSmartTable.setModel(that.getOwnerComponent().getModel("ZODATA_ORDERDASHFI_SRV"));
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

                    if(typeof p_bukrs === 'undefined' || p_bukrs === 'undefined'){
                        return;
                    }

                    oSmartTable.setTableBindingPath("" + ("/ZCFI_ARPROFIT_SHIPTO1(p_Wknd=datetime'"
                    + encodeURIComponent(pwkenddate) + "',p_bukrs='" + p_bukrs + "',p_Vkorg='" + p_Vkorg + "',p_ship='" + p_ship + "',p_weeks=13)/Results"));
                    oSmartTable.rebindTable();
                    that.extractSoldTo(p_ship,p_Vkorg);

 


              },
           
            onBeforeRebindTable(oEvent) {

             
                if(typeof p_bukrs === 'undefined' || p_bukrs === 'undefined'){
                    return;
                }

                oEvent.getSource().setTableBindingPath("" + ("/ZCFI_ARPROFIT_SHIPTO1(p_Wknd=datetime'"
                    + encodeURIComponent(this.pwkenddate) + "',p_bukrs='" + this.p_bukrs + "',p_Vkorg='" + this.p_Vkorg + "',p_ship='" + this.p_ship + "',p_weeks=13)/Results"));

          
                    
            },

            onSelectSoldTo: function(oEvent){


               
                var weekending = oEvent.getSource().getParent().getParent().getTable().getBinding("rows").getContexts()[0].getObject().currWK;
                var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({

                    pattern: "MMddyyyy"
                });
                var wkend_new =   oDateFormat.format(new Date(this.pwkenddate));
                var weekending = oEvent.getSource().getParent().getParent().getTable().getRows()[1].getBindingContext().getObject().Weekending
                ;


                var wkendingfinalDate = new Date();
                wkendingfinalDate.setDate(weekending.getUTCDate());
                wkendingfinalDate.setMonth(weekending.getUTCMonth());
                wkendingfinalDate.setFullYear(weekending.getUTCFullYear());
                wkendingfinalDate.setHours(0);
                wkendingfinalDate.setMinutes(0);
                var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({

                    pattern: "MMddyyyy"
                });
              var runDate = oDateFormat.format(wkendingfinalDate);

                var mParams = {
                
                    "P_VKORG" : this.p_Vkorg,
                    "P_KUN": this.p_ship,
                    "P_WEEK": runDate,
                    "P_HIST": '13',
                    "p_balof":''
                   
                };

                sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then(function (oService) {
                    oService.hrefForExternalAsync({
                        target: {
                            semanticObject: "Launch_Tcodes",
                            action: "tcode_zarprofit"
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
            extractSoldTo: function (p_ship,p_Vkorg) {
                let defaultModel = this.getOwnerComponent().getModel("ZODATA_ORDERDASHFI_SRV");
                var that = this;
                defaultModel.read("/ZCFI_shipto_soldto(p_vkorg='" + p_Vkorg + "',p_shipto='" + p_ship + "')/Set", {
                    success: function (oData, oResponse) {
                        // var plant = oData.results.find(element => element.parid === "WRK");
                        var oDataResults = oData;
                        that.getView().setModel(new sap.ui.model.json.JSONModel(oDataResults
                        ), "soldtoModel");

                    },

                    error: function (oError) {
                    }
                });
            },
    
          //  onAfterRendering: function () {},

            onExit: function () {}
        }
    });
})();