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


                
 var oModel = new sap.ui.model.json.JSONModel({
    "PmntTerms" : "None",
    "SalesLead": "None"
 }); 

            // Set the model to the view (optionally with a name, e.g., "myModel")
            this.getView().setModel(oModel, "valueStateModel"); // Setting
                

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
    
            onAfterRendering: function (oEvent) {
            //    debugger;
            },

            onExit: function () {},
            setRelevantFilters: function (oFilters) {
                debugger;
                var oView = this.getView().byId("cardView");
                if (oFilters[0] && oFilters[0].aFilters && oFilters[0].aFilters.length > 0) {
                    // Apply filters to the card
                    oView.getBinding("items").filter(oFilters);
                } else {
                    oView.getBinding("items").filter([]);
                }
            },

            onClickHeader: function(oEvent){

                var mParams = {
                
                    "P_BUK" : this.getView().getModel("customerData").getData().CompanyCode,
                    "S_VKO": this.getView().getModel("customerData").getData().SalesOrg,
                    "S_SDTO": this.getView().getModel("customerData").getData().Customer
                 
                   
                };

                sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then(function (oService) {
                    oService.hrefForExternalAsync({
                        target: {
                            semanticObject: "Launch_Tcodes",
                            action: "tcode_zcustomern"
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

            // ==================== NEW VALUE HELP METHODS ====================

            // Sales Lead Value Help
            onSalesLeadValueHelp: function(oEvent) {
                var that = this;
                this.salesLeadInput = oEvent.getSource();
                var oInput = oEvent.getSource();
                
                if (!this._oSalesLeadDialog) {
                    this._createSalesLeadDialog();
                }
                
                this._oSourceInput = oInput;
                this._openSalesLeadDialog();
            },

            _createSalesLeadDialog: function() {
                var that = this;
                
                this._oSalesLeadDialog = new sap.m.SelectDialog({
                    title: "Select Sales Lead",
                    items: {
                        path: "/ZI_CUSTOMERSMVH",
                        template: new sap.m.StandardListItem({
                            title: "{Customer}",
                            description: "{CustomerName}",
                            type: "Active"
                        })
                    },
                    confirm: this.onSalesLeadConfirm.bind(this),
                    search: this.onSalesLeadSearch.bind(this),
                    cancel: this.onValueHelpCancel.bind(this)
                });
                
                this.getView().addDependent(this._oSalesLeadDialog);
            },

            _openSalesLeadDialog: function() {
                var oCustomerData = this.getView().getModel("customerData").getData();
                var oBinding = this._oSalesLeadDialog.getBinding("items");
                
                // Filter by Sales Organization
                if (oCustomerData.SalesOrg && oBinding) {
                    var oFilter = new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, "'"+oCustomerData.SalesOrg+"'");
                    oBinding.filter([oFilter]);
                }
                
                this._oSalesLeadDialog.open();
            },

            onSalesLeadSearch: function(oEvent) {
                var sValue = oEvent.getParameter("value");
                var aFilters = [];
                var oCustomerData = this.getView().getModel("customerData").getData();
                
                // Always include Sales Org filter
                if (oCustomerData.SalesOrg) {
                    aFilters.push(new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, "'"+oCustomerData.SalesOrg+"'"));
                }
                
                // Add search filter if value exists
                if (sValue) {
                    aFilters.push(new sap.ui.model.Filter("CustomerName", sap.ui.model.FilterOperator.Contains, sValue));
                }
                
                oEvent.getSource().getBinding("items").filter(aFilters);
            },

            onSalesLeadConfirm: function(oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                if (oSelectedItem && this._oSourceInput) {
                    var sCustomer = oSelectedItem.getBindingContext().getProperty("Customer");
                    this.sCustomer = sCustomer;
                    var sCustomerName = oSelectedItem.getBindingContext().getProperty("CustomerName");
                    
                    this._oSourceInput.setValue(sCustomer + " - " + sCustomerName);
                    
                    // Update the model
                    var oCustomerData = this.getView().getModel("customerData");
                    oCustomerData.setProperty("/SalesLead", sCustomer);
                    
              //      this._updateCustomerData("SalesLead", sCustomer);
                }
                this._resetSalesLeadDialog();
                            this.getView().getModel("valueStateModel").setProperty("/SalesLead","Success"); // Setting
this.salesLeadInput.addStyleClass("customColor");
            },

            // Payment Terms Value Help
            onPaymentTermsValueHelp: function(oEvent) {
                var that = this;
                this.oPaymentInput = oEvent.getSource();
                var oInput = oEvent.getSource();
                
                if (!this._oPaymentTermsDialog) {
                    this._createPaymentTermsDialog();
                }
                
                this._oSourceInput = oInput;
                this._oPaymentTermsDialog.open();
            },

            _createPaymentTermsDialog: function() {
                var that = this;
                
                this._oPaymentTermsDialog = new sap.m.SelectDialog({
                    title: "Select Payment Terms",
                    items: {
                        path: "/I_CustomerPaymentTerms",
                        template: new sap.m.StandardListItem({
                            title: "{CustomerPaymentTerms}",
                            description: "{CustomerPaymentTerms_Text}",
                            type: "Active"
                        })
                    },
                    confirm: this.onPaymentTermsConfirm.bind(this),
                    search: this.onPaymentTermsSearch.bind(this),
                    cancel: this.onValueHelpCancel.bind(this)
                });
                
                this.getView().addDependent(this._oPaymentTermsDialog);
            },

            onPaymentTermsSearch: function(oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new sap.ui.model.Filter("CustomerPaymentTerms_Text", sap.ui.model.FilterOperator.Contains, sValue);
                var aFilters = sValue ? [oFilter] : [];
                oEvent.getSource().getBinding("items").filter(aFilters);
            },

            onPaymentTermsConfirm: function(oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                if (oSelectedItem && this._oSourceInput) {
                    var sPaymentTerms = oSelectedItem.getBindingContext().getProperty("CustomerPaymentTerms");
                    this.sPaymentTerms = sPaymentTerms;
                    var sDescription = oSelectedItem.getBindingContext().getProperty("CustomerPaymentTerms_Text");
                    
                    this._oSourceInput.setValue(sPaymentTerms + " - " + sDescription);
                    
                    // Update the model
                    var oCustomerData = this.getView().getModel("customerData");
                    oCustomerData.setProperty("/PmntTerms", sPaymentTerms);
                    
                //    this._updateCustomerData("PmntTerms", sPaymentTerms);
                }
                this._resetPaymentTermsDialog();


            // Set the model to the view (optionally with a name, e.g., "myModel")
            this.getView().getModel("valueStateModel").setProperty("/PmntTerms","Success"); // Setting
            this.oPaymentInput.addStyleClass("customColor");
            },
            onSaveUpdate: function(){


                if(this.sPaymentTerms){
    // this._updateCustomerData("PmntTerms", this.sPaymentTerms);
                }

                if(this.sCustomer){
   //   this._updateCustomerData("SalesLead", this.sCustomer);
                }

                if(this.sPaymentTerms && this.sCustomer){
                      this._updateCustomerData_payload({
                    "PmntTerms":this.sPaymentTerms ? this.sPaymentTerms : "" ,
                    "SalesLead": this.sCustomer ? this.sCustomer : ""
                })
                }else if (this.sPaymentTerms && !this.sCustomer){
                    this._updateCustomerData_payload({
                    "PmntTerms":this.sPaymentTerms ? this.sPaymentTerms : "" 
                })
                }else if (!this.sPaymentTerms && this.sCustomer){
                    this._updateCustomerData_payload({
                    "SalesLead": this.sCustomer ? this.sCustomer : ""
                })
                }




            },

            onValueHelpCancel: function() {
                this._resetSalesLeadDialog();
                this._resetPaymentTermsDialog();
            },

            _resetSalesLeadDialog: function() {
                if (this._oSalesLeadDialog) {
                    this._oSalesLeadDialog.getBinding("items").filter([]);
                }
            },

            _resetPaymentTermsDialog: function() {
                if (this._oPaymentTermsDialog) {
                    this._oPaymentTermsDialog.getBinding("items").filter([]);
                }
            },

            _updateCustomerData: function(sField, sValue) {
                try {
        var oCustomerData = this.getView().getModel("customerData").getData();
        
        var sUrl = "/sap/opu/odata/sap/ZODATA_CUSTOMER_BLOCKS_SRV/ZRFI_CUSTARDASH(CompanyCode='" + 
                  oCustomerData.CompanyCode + "',SalesOrg='" + oCustomerData.SalesOrg + 
                  "',Customer='" + oCustomerData.Customer + "')";
        
        var oPayload = {};
        oPayload[sField] = sValue;
        
        $.ajax({
            url: sUrl,
            type: "PUT",
            data: JSON.stringify(oPayload),
            contentType: "application/json",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-Token": this._getCSRFToken()
            },
            success: function(oData) {
                sap.m.MessageToast.show("Updated successfully");
            },
            error: function(oError) {
                var sErrorMessage = "Error updating data";
                if (oError && oError.responseJSON && oError.responseJSON.error) {
                    sErrorMessage += ": " + oError.responseJSON.error.message.value;
                }
                sap.m.MessageBox.error(sErrorMessage);
            }
        });
    } catch (e) {
        console.error("Error in _updateCustomerData:", e);
        sap.m.MessageBox.error("Error updating data");
    }
            },

            _updateCustomerData_payload: function(oPayload) {
                try {
        var oCustomerData = this.getView().getModel("customerData").getData();
        
        var sUrl = "/sap/opu/odata/sap/ZODATA_CUSTOMER_BLOCKS_SRV/ZRFI_CUSTARDASH(CompanyCode='" + 
                  oCustomerData.CompanyCode + "',SalesOrg='" + oCustomerData.SalesOrg + 
                  "',Customer='" + oCustomerData.Customer + "')";
        
                    var that = this;
        
        $.ajax({
            url: sUrl,
            type: "PUT",
            data: JSON.stringify(oPayload),
            contentType: "application/json",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-Token": this._getCSRFToken()
            },
            success: function(oData) {
                sap.m.MessageToast.show("Updated successfully");

                          that.getView().getModel("valueStateModel").setProperty("/SalesLead","None"); // Setting
    
       
                        that.getView().getModel("valueStateModel").setProperty("/PmntTerms","None"); // Setting
                        if(that.oPaymentInput)
                        that.oPaymentInput.removeStyleClass("customColor")
                     if(that.salesLeadInput)
                        that.salesLeadInput.removeStyleClass("customColor")
            },
            error: function(oError) {
                var sErrorMessage = "Error updating data";
                if (oError && oError.responseJSON && oError.responseJSON.error) {
                    sErrorMessage += ": " + oError.responseJSON.error.message.value;
                }
                sap.m.MessageBox.error(sErrorMessage);
            }
        });
    } catch (e) {
        console.error("Error in _updateCustomerData:", e);
        sap.m.MessageBox.error("Error updating data");
    }
            },
            _getCSRFToken: function() {
    var oModel = this.getOwnerComponent().getModel("ZODATA_CUSTOMER_BLOCKS_SRV");
    return oModel.getSecurityToken();
},

 onChangeSalesLead: function(oEvent){


            // Set the model to the view (optionally with a name, e.g., "myModel")
            this.getView().getModel("valueStateModel").setProperty("/SalesLead","Success"); // Setting
    this.salesLeadInput.addStyleClass("customColor")
        },
        onChangePaymentTerms: function(oEvent){
                        this.getView().getModel("valueStateModel").setProperty("/PmntTerms","Success"); // Setting
                        this.oPaymentInput.addStyleClass("customColor")

        }
            
        }
    });
})();