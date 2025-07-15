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

                // var that = this;
                // this.getModel().attachRequestCompleted(function(oEvent){
  
  
                //   if(!oEvent.mParameters.url.includes("ZCFI_VENDOR_OEPNBAL") )
                //   that.extractRequest();
              
  
                // });
  
            },

            onExit: function () {},


            extractRequest: function () {


                var that = this;
     

                var filterData = this.getView().getParent().getComponentData().mainComponent.getGlobalFilter().getFilterData();
                var Vendor = filterData.Vendor;
                var CompanyCode = filterData.CompanyCode;
                var PurchasingOrganization = filterData.PurchasingOrganization;
                var HouseBank = filterData.HouseBank;
 
               var filters = "Vendor eq '"+Vendor+"' and ";
                filters = filters+"CompanyCode eq '"+CompanyCode+"' and ";
           //     filters = filters+"PurchasingOrganization eq '"+PurchasingOrganization+"' ";
                filters = filters+"HouseBank eq '"+HouseBank+"' ";

                let defaultModel1 = that.getOwnerComponent().getModel();


                defaultModel1.read("/ZCFI_VENDORDASH_YTDPMNTS", {
                    urlParameters: {
                      "$filter" : filters
                     
                      
          
                    },
                    success: function (oData, oResponse) {
                 
                    //   if(oData.results.length === 0 ){
                    //     that.getView().setModel(new sap.ui.model.json.JSONModel({Vendor:Vendor,OpenBalance: '$ 0'}), "vendorData");
                    //   }else
                      that.getView().setModel(new sap.ui.model.json.JSONModel(oData.results[0]), "vendorData");
          
            
          
                    },
          
                    error: function (oError) {
          
                      that.getView().setModel(new sap.ui.model.json.JSONModel({}, "vendorData"));
                    }
                  });
              },
              onClickHeader: function(oEvent){

             //  debugger;

                var dateFrom = this.getView().getModel("vendorData").getData().YearToDateFrom;
                var dateTo = this.getView().getModel("vendorData").getData().YearToDateTo

                if(dateFrom === null || typeof dateFrom === 'undefined' || dateTo === null || typeof dateTo === 'undefined'){

                    sap.m.MessageBox.error("No Year To Date postings to display");
                    return;
                }
                
                var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                    pattern: "MMddyyyy",
                    UTC: true
                });;

               var  dateFrom1 = oDateFormat.format(dateFrom);
               var  dateFrom2 = oDateFormat.format(dateTo);
            
                var filterData = this.getView().getParent().getComponentData().mainComponent.getGlobalFilter().getFilterData();

                var mParams = {
                
                    "SO_AUGDT-HIGH" : dateFrom2,
                    "SO_AUGDT-LOW": dateFrom1,
                    "X_CLSEL": 'X',
                    "X_OPSEL": '',
                    "KD_LIFNR": filterData.Vendor,
                    "KD_BUKRS": filterData.CompanyCode
                   
                };

                sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then(function (oService) {
                    oService.hrefForExternalAsync({
                        target: {
                            semanticObject: "Launch_Tcodes",
                            action: "tcode_fbl1n"
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