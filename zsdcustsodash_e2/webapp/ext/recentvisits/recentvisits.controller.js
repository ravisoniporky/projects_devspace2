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
  
  
                  if(oEvent.mParameters.url.includes("ZCSD_CUSTSODASHAGGR"))
                  that.extractRequest();
              
  
                });
  
            },

            extractRequest: function(){

                var that = this;
                that.getView().setModel(new sap.ui.model.json.JSONModel({}, "visitCustomerData"));
                that.getView().setModel(new sap.ui.model.json.JSONModel({}, "visitData"));

               // let defaultModel1 = that.getOwnerComponent().getModel("ZRMM_FRVISITV2_CDS");
                let defaultModel1 =   new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZRMM_FRVISITV2_CDS");
  
  
                var filterData = this.getView().getParent().getComponentData().mainComponent.getGlobalFilter().getFilterData();
                var CompanyCode = filterData.CompanyCode;
                var SalesOrganization = filterData.SalesOrganization;
                var Customer = filterData.Customer;
  
               var filters = "Customer eq '"+Customer+"' and ";
                filters = filters+"Vkorg eq '"+SalesOrganization+"' ";

            defaultModel1.read("/ZRMM_FRVISITV2", {
              urlParameters: {
                "$filter" : filters,
                "$orderby" : "Visitid desc",
                "$top" :5,
                "$skip" :0
                
    
              },
              success: function (oData, oResponse) {
           
                that.getView().setModel(new sap.ui.model.json.JSONModel(oData), "visitData");
    
      
    
              },
    
              error: function (oError) {
    
                that.getView().setModel(new sap.ui.model.json.JSONModel({}, "visitData"));
              }
            });

            defaultModel1 =   new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZODATA_FR_SRV");


            defaultModel1.read("/ZBMMCUSTOMERVISIT(Customer='"+Customer+"',SalesOrganization='"+SalesOrganization+"')", {
             
              success: function (oData, oResponse) {
           
                that.getView().setModel(new sap.ui.model.json.JSONModel(oData), "visitCustomerData");
    
      
    
              },
    
              error: function (oError) {
    
                that.getView().setModel(new sap.ui.model.json.JSONModel({}, "visitCustomerData"));
              }
            });



              },

            onExit: function () {},
            onClickVisit: function(oEvent){

              var visitid= this.pad(oEvent.getSource().getTitle(),10);

              window.open("/sap/bc/ui2/flp?#Sales-ZFIELDREPVISIT&/newvisit/"+visitid+"/", '_blank')



            },
            pad : function(num, size) {
              num = num.toString();
              while (num.length < size) num = "0" + num;
              return num;
          }

        }
    });
})();