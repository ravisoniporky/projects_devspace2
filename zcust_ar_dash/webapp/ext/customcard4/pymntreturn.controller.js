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

                    if(oEvent.mParameters.url.includes("ZCFI_CUSTARDASH_CONTACTS")){
                        return;
                    } 
                    if(oEvent.mParameters.url.includes("ZCFI_CUSTARDASH_ARBAL")){
                        return;
                    }
                    if(!oEvent.mParameters.url.includes("ZCFI_CUSTARDASH")){
                        return;
                    }
                    var response = JSON.parse(oEvent.getParameter("response").responseText).d.results[0];
                    if(typeof response === 'undefined')
                        {
                            that.getView().setModel(new sap.ui.model.json.JSONModel({}), "customerData");

                            return;
                        }
                        if(response.LastSaleDt && response.LastSaleDt !== null)
                            response.LastSaleDt = new Date(Number(response.LastSaleDt.split("Date(")[1].split(")/")[0]));
        
                            if(response.LastPmntDt && response.LastPmntDt !== null)
                            response.LastPmntDt = new Date(Number(response.LastPmntDt.split("Date(")[1].split(")/")[0]));
        
                            if(response.LastRetChkDt && response.LastRetChkDt !== null)
                            response.LastRetChkDt = new Date(Number(response.LastRetChkDt.split("Date(")[1].split(")/")[0]));
                   
                   
                    that.getView().setModel(new sap.ui.model.json.JSONModel(response), "customerData");
                });

                this.GloabalEventBus = sap.ui.getCore().getEventBus();
                this.GloabalEventBus.subscribe("OVPGlobalfilter", "OVPGlobalFilterSeacrhfired", this.onGlobalfilterApply.bind(this));

            },

            onGlobalfilterApply: function(oEvent){
                var that = this;
                this.getModel().attachRequestCompleted(function(oEvent){

                    if(oEvent.mParameters.url.includes("ZCFI_CUSTARDASH_CONTACTS")){
                        return;
                    } 
                    if(oEvent.mParameters.url.includes("ZCFI_CUSTARDASH_ARBAL")){
                        return;
                    }
                    if(!oEvent.mParameters.url.includes("ZCFI_CUSTARDASH")){
                        return;
                    }
                    var response = JSON.parse(oEvent.getParameter("response").responseText).d.results[0];
                    if(typeof response === 'undefined')
                        {
                            that.getView().setModel(new sap.ui.model.json.JSONModel({}), "customerData");

                            return;
                        }
                        if(response.LastSaleDt && response.LastSaleDt !== null)
                            response.LastSaleDt = new Date(Number(response.LastSaleDt.split("Date(")[1].split(")/")[0]));
        
                            if(response.LastPmntDt && response.LastPmntDt !== null)
                            response.LastPmntDt = new Date(Number(response.LastPmntDt.split("Date(")[1].split(")/")[0]));
        
                            if(response.LastRetChkDt && response.LastRetChkDt !== null)
                            response.LastRetChkDt = new Date(Number(response.LastRetChkDt.split("Date(")[1].split(")/")[0]));
                   
                   
                    that.getView().setModel(new sap.ui.model.json.JSONModel(response), "customerData");
                });

            },
    
            onAfterRendering: function () {},

            onExit: function () {}
        }
    });
})();