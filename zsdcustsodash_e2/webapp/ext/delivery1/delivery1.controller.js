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
            onClickShipment: function(oEvent){

              var tknum = oEvent.getSource().getTitle().trim();
              var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); // get a handle on the global XAppNav service
  var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
  target: {
  semanticObject: "Launch_Tcodes",
  action: "ZSHIP"
  },
  params: {
  "Tknum": tknum
  }
  })) || ""; // generate the Hash to display a Supplier
  oCrossAppNavigator.toExternal({
  target: {
  shellHash: hash
  }
  }); // navigate to Supplier application
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


                  let defaultModel1 = that.getOwnerComponent().getModel();


                defaultModel1.read("/ZCSD_CUSTSODASHDELIVERY", {
                  urlParameters: {
                    "$filter" : decodeURI(filters),
                    "$top" :5,
                    "$orderby" : "SalesDocument DESC"
                    
        
                  },
                  success: function (oData, oResponse) {
               
                    that.getView().setModel(new sap.ui.model.json.JSONModel(oData), "deliveryModel");
        
          
        
                  },
        
                  error: function (oError) {
        
                    that.getView().setModel(new sap.ui.model.json.JSONModel({}, "deliveryModel"));
                  }
                });
            },

            onExit: function () {}
        }
    });
})();