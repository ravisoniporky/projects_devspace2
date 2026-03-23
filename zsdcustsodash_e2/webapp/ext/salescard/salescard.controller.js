(function () {
    "use strict";

    /* controller for custom card  */
    // Controller : https://ui5.sap.com/#/topic/121b8e6337d147af9819129e428f1f75
    // controller class name can be like app.ovp.ext.customList.CustomList where app.ovp can be replaced with your application namespace
    sap.ui.define([], function() {
        return {
            onInit: function () {

                var that = this;
                this.getModel().attachRequestCompleted(function(oEvent){


              

                });
                this.customer = "";
 this.GloabalEventBus = sap.ui.getCore().getEventBus();
                this.GloabalEventBus.subscribe("OVPGlobalfilter", "OVPGlobalFilterSeacrhfired", this.onGlobalfilterApply.bind(this));

            },
          

             onGlobalfilterApply: function(oEvent){
 this.extractRequest();
             },
            onAfterRendering: function () {


              this.extractRequest();

              var that = this;
              var filterData = this.getView().getParent().getComponentData().mainComponent.getGlobalFilter().getFilterData();
              var CompanyCode = filterData.CompanyCode;
              var SalesOrganization = filterData.SalesOrganization;
              var Customer = filterData.Customer;
              
              this.getModel().attachRequestCompleted(function(oEvent){


                // if(oEvent.mParameters.url.includes("ZBSD_CUSTSODASH") &&  oEvent.mParameters.url.includes("top=5"))
            //    that.extractRequest();
                if(that.customer !== that.getView().getParent().getComponentData().mainComponent.getGlobalFilter().getFilterData().Customer){

                  that.getView().byId("salesSmartTable").rebindTable();
                  that.customer = that.getView().getParent().getComponentData().mainComponent.getGlobalFilter().getFilterData().Customer;

                }
            

              });



              
            },
    
            extractRequest: function () {



              

              var that =  this;

              var filterData = this.getView().getParent().getComponentData().mainComponent.getGlobalFilter().getFilterData();
              var CompanyCode = filterData.CompanyCode;
              var SalesOrganization = filterData.SalesOrganization;
              var Customer = filterData.Customer;

             var filters = "Customer eq '"+Customer+"' and ";
              filters = filters+"CompanyCode eq '"+CompanyCode+"' and ";
              filters = filters+"SalesOrganization eq '"+SalesOrganization+"' ";

            //   var filter = decodeURI(oEvent.mParameters.url.split("$filter=")[1]);
            //   if(filter.includes("CompanyCode") && filter.includes("SalesOrganization") && filter.includes("Customer") &&  oEvent.mParameters.url.includes("ZBSD_CUSTSODASH")){
                  
            //   }else{
            //     return;
            //   }

              // var filters = decodeURI(oEvent.mParameters.url.split("$filter=")[1]);
              // if(filters.includes("&"))
              //   {
              //     filters = filters.split("&")[0];
              //   }

                let defaultModel1 = that.getOwnerComponent().getModel();


              defaultModel1.read("/ZCSD_CUSTSODASHAGGR", {
                urlParameters: {
                  "$filter" : decodeURI(filters),
                  "$orderby" : "LineSequence ASC"
                  
      
                },
                success: function (oData, oResponse) {
             
                  that.getView().setModel(new sap.ui.model.json.JSONModel(oData), "salesModel");
      
        
      
                },
      
                error: function (oError) {
      
                  that.getView().setModel(new sap.ui.model.json.JSONModel({}, "salesModel"));
                }
              });
            },

            onExit: function () {},
            onPressTimerollup: function(oEvent){

              var rollup = oEvent.getSource().getTitle();
              var kunwe = this.getView().getModel("salesModel").getData().results[0].Customer;
              var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); // get a handle on the global XAppNav service
  var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
  target: {
  semanticObject: "Sales",
  action: "ZSALESLEAD_DSB"
  },
  params: {
  "timeperiod": rollup,
  "kunwe":kunwe
  }
  })) || ""; // generate the Hash to display a Supplier
  oCrossAppNavigator.toExternal({
  target: {
  shellHash: hash
  }
  }); // navigate to Supplier application
            },


            onBeforeRebindTable: function(oEvent) {


              var binding = oEvent.getParameter("bindingParams");


              
              var filterData = this.getView().getParent().getComponentData().mainComponent.getGlobalFilter().getFilterData();
              var CompanyCode = filterData.CompanyCode;
              var SalesOrganization = filterData.SalesOrganization;
              var Customer = filterData.Customer;

              if(typeof Customer === 'undefined'){
                return;
              }
             var filters = "Customer eq '"+Customer+"' and ";
              filters = filters+"CompanyCode eq '"+CompanyCode+"' and ";
              filters = filters+"SalesOrganization eq '"+SalesOrganization+"' ";


              var oFilter = new sap.ui.model.Filter("Customer", sap.ui.model.FilterOperator.EQ,Customer);
              binding.filters.push(oFilter);
             
              var oFilter = new sap.ui.model.Filter("CompanyCode", sap.ui.model.FilterOperator.EQ,CompanyCode);
              binding.filters.push(oFilter);

              var oFilter = new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ,SalesOrganization);
              binding.filters.push(oFilter);

        
                  
          }
        }
    });
})();