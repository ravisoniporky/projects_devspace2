(function () {
    "use strict";

    /* controller for custom card  */
    // Controller : https://ui5.sap.com/#/topic/121b8e6337d147af9819129e428f1f75
    // controller class name can be like app.ovp.ext.customList.CustomList where app.ovp can be replaced with your application namespace
    sap.ui.define([], function() {
        return {
            onInit: function () {
                var that = this;

                this._handleRequestCompleted = function(oEvent) {
                    if(oEvent.mParameters.url.includes("ZCFI_CUSTARDASH_CONTACTS")) return;
                    if(oEvent.mParameters.url.includes("ZCFI_CUSTARDASH_ARBAL")) return;
                    if(!oEvent.mParameters.url.includes("ZCFI_CUSTARDASH")) return;

                    var response = JSON.parse(oEvent.getParameter("response").responseText).d.results[0];
                    if(typeof response === 'undefined') {
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
                };

                this.GloabalEventBus = sap.ui.getCore().getEventBus();
                this.GloabalEventBus.subscribe("OVPGlobalfilter", "OVPGlobalFilterSeacrhfired", this.onGlobalfilterApply.bind(this));
            },
            onGlobalfilterApply: function(){
                // Handler is attached once in onAfterRendering; nothing extra needed here.
            },


            onAfterRendering: function () {
                if(!this._handlerAttached && this.getModel()) {
                    this.getModel().attachRequestCompleted(this._handleRequestCompleted);
                    this._handlerAttached = true;
                }
            },

            onExit: function () {},

            onLastPaymentClick: function(oEvent){


                var P_BUKRS,P_KUNNR;

                var mParams = {
                
                    "P_BUKRS" : this.getView().getModel("customerData").getData().CompanyCode                    ,
                    "P_KUNNR": this.getView().getModel("customerData").getData().Customer
                   
                   
                };

                sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then(function (oService) {
                    oService.hrefForExternalAsync({
                        target: {
                            semanticObject: "Launch_Tcodes",
                            action: "tcode_zars"
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