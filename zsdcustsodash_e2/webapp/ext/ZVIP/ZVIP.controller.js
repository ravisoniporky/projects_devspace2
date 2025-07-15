(function () {
    "use strict";

    /* controller for custom card  */
    // Controller : https://ui5.sap.com/#/topic/121b8e6337d147af9819129e428f1f75
    // controller class name can be like app.ovp.ext.customList.CustomList where app.ovp can be replaced with your application namespace
    sap.ui.define([], function() {
        return {
            onInit: function () {

                var filterData = this.getView().getParent().getComponentData().mainComponent.getGlobalFilter().getFilterData();
                var CompanyCode = filterData.CompanyCode;
                var SalesOrganization = filterData.SalesOrganization;
                var Customer = filterData.Customer;
                var data = {"SalesOrganization":SalesOrganization, "Customer" : Customer,"URL" :"https://pkynj-de2app.porky.com:44300/sap/bc/ui2/flp?sap-client=100&amp;sap-language=EN#Launch_Tcodes-ZVIP?SalesOrganization="+SalesOrganization+"&amp;Customer="+Customer+""}
                this.getView().setModel(new sap.ui.model.json.JSONModel(data), "ZVIPMODEL");
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


                  var oSmartTable = that.getView().byId("LineItemsSmartTable3");
                   oSmartTable.setModel(that.getOwnerComponent().getModel());
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

                  oSmartTable.setTableBindingPath("" + ("/ZCSD_E_ItemProposal(p_vkorg='" + that.p_Vkorg + "',p_kunwe='" + that.p_ship + "')/Set"));
                  that.oSmartTable = oSmartTable;
                  setTimeout(() => {
                    that.oSmartTable.rebindTable();

                  }, 1000);
                  oSmartTable.rebindTable();
                  that.extractSoldTo(p_ship,p_Vkorg);




            },
         
          onBeforeRebindTable: function(oEvent) {

           
            //   if(typeof p_bukrs === 'undefined' || p_bukrs === 'undefined'){
            //       return;
            //   }

              oEvent.getSource().setTableBindingPath("" + ("/ZCSD_E_ItemProposal(p_vkorg='" + this.p_Vkorg + "',p_kunwe='" + this.p_ship + "')/Set"));

        
                  
          },

          onSelectSoldTo: function(oEvent){


             
    
              var mParams = {
              
                  "SalesOrganization" : this.p_Vkorg,
                  "Customer": oEvent.mParameters.selectedItem.getBindingContext("soldtoModel").getObject().kunnr,
                  
                 
              };

              sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then(function (oService) {
                  oService.hrefForExternalAsync({
                      target: {
                          semanticObject: "Launch_Tcodes",
                          action: "ZVIP"
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
              let defaultModel = this.getOwnerComponent().getModel();
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

            

            onExit: function () {}
        }
    });
})();