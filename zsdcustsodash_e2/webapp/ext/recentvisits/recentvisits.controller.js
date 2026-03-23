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

   setURL1: function(oFilterData) {
    try {
        if (!oFilterData) {
            return;
        }
        
        var sCurrentHash = window.location.hash;
        var sBaseHash = sCurrentHash.split('?')[0]; // Get hash before any existing parameters
        var sHashParams = sCurrentHash.split('?')[1] || ''; // Get existing hash parameters
        
        // Parse existing hash parameters
        var oExistingParams = new URLSearchParams(sHashParams);
        
        // Check if the required parameters already exist with the same values
        var bCompanyCodeExists = oFilterData.CompanyCode ? 
            oExistingParams.get('CompanyCode') === oFilterData.CompanyCode : 
            !oExistingParams.has('CompanyCode');
            
        var bSalesOrgExists = oFilterData.SalesOrganization ? 
            (oExistingParams.get('SalesOrganization') === oFilterData.SalesOrganization && 
             oExistingParams.get('vkorg') === oFilterData.SalesOrganization) : 
            (!oExistingParams.has('SalesOrganization') && !oExistingParams.has('vkorg'));
            
        var bCustomerExists = oFilterData.Customer ? 
            (oExistingParams.get('Customer') === oFilterData.Customer && 
             oExistingParams.get('kunwe') === oFilterData.Customer) : 
            (!oExistingParams.has('Customer') && !oExistingParams.has('kunwe'));
        
        // If all parameters already exist with the same values, don't update
        if (bCompanyCodeExists && bSalesOrgExists && bCustomerExists) {
            console.log("URL parameters already up to date, skipping reload");
            return;
        }
        
        // Create new URLSearchParams object for modifications
        var oHashParams = new URLSearchParams(sHashParams);
        
        // Add/update filter parameters in the hash
        if (oFilterData.CompanyCode) {
            oHashParams.set('CompanyCode', oFilterData.CompanyCode);
        }
        if (oFilterData.SalesOrganization) {
            oHashParams.set('SalesOrganization', oFilterData.SalesOrganization);
            oHashParams.set('vkorg', oFilterData.SalesOrganization);
        }
        if (oFilterData.Customer) {
            oHashParams.set('Customer', oFilterData.Customer);
            oHashParams.set('kunwe', oFilterData.Customer);
        }
        
        // Construct new hash with parameters
        var sNewHashParams = oHashParams.toString();
        var sNewHash = sBaseHash + (sNewHashParams ? '?' + sNewHashParams : '');
        
        // Update URL without page reload
        var sNewUrl = window.location.origin + window.location.pathname + window.location.search + sNewHash;
        window.history.replaceState(null, null, sNewUrl);
        
        console.log("URL hash updated with filters:", sNewHash);
        location.reload(); // This will only execute if parameters changed
        
    } catch (e) {
        console.error("Error updating URL hash with filters:", e);
    }
},

            extractRequest: function(){

                var that = this;
                that.getView().setModel(new sap.ui.model.json.JSONModel({}, "visitCustomerData"));
                that.getView().setModel(new sap.ui.model.json.JSONModel({}, "visitData"));

               // let defaultModel1 = that.getOwnerComponent().getModel("ZRMM_FRVISITV2_CDS");
                let defaultModel1 =   new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZRMM_FRVISITV2_CDS");
  
                if(sap.ui.getCore().byId("application-Launch_TX-ZSDCUSTDASH_OVP-component---mainView--ovpGlobalFilter")){

                
  
                var filterData = sap.ui.getCore().byId("application-Launch_TX-ZSDCUSTDASH_OVP-component---mainView--ovpGlobalFilter").getFilterData();
                }else{
                  return null;
                }
             //   this.setURL(filterData);
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