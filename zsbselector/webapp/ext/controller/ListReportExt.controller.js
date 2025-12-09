sap.ui.define([
   "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/BusyDialog",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/m/VBox",
    "sap/m/Text"
], function (MessageBox, MessageToast, BusyDialog, Dialog, Button, List, StandardListItem, VBox, Text) {
    "use strict";

    return {


           onInit: function() {
            var that = this;
            
            // Hook into the SmartTable's action button press
            this.getView().attachEventOnce("afterViewInit", function() {
                that._attachToActionDialog();
            });

                        this._observePrintDialog();

        },

         
        /**
         * Observe DOM for Print dialog and set default printer
         * @private
         */
        _observePrintDialog: function() {
            var that = this;
            var sDefaultPrinter = "LOCL"; // Set your default printer here
            
            // Create a MutationObserver to watch for dialog creation
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                            // Check if it's a dialog
                            var sId = node.id;
                            if (sId && sId.indexOf("dialog") > -1) {
                                // Multiple attempts with increasing delays to ensure dialog is rendered
                                that._fetchAndSetDefaultPrinter();
                            }
                        }
                    });
                });
            });
            
            // Start observing the body for added dialogs
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            // Store observer for cleanup
            this._dialogObserver = observer;
        },



        /**
         * Fetch default printer from user settings and set it
         * @private
         */
        _fetchAndSetDefaultPrinter: function() {
            var that = this;
            var oModel = this.getView().getModel();
            
            // Get current user
            var sCurrentUser = this._getCurrentUser();
            
            if (!sCurrentUser) {
                console.log("Could not determine current user, using fallback printer");
                this._setDefaultPrinterInDialog("LOCL");
                return;
            }
            
            console.log("Fetching default printer for user:", sCurrentUser);
            
            // Read user's default printer from zi_userprinter_vh
            var sPath = "/zi_userprinter_vh(UserName='" + sCurrentUser + "',Printer='')";
            
            // Alternative: Use filters if the entity set supports it
            oModel.read("/zi_userprinter_vh", {
                filters: [
                    new sap.ui.model.Filter("UserName", sap.ui.model.FilterOperator.EQ, sCurrentUser)
                ],
                success: function(oData) {
                    var sDefaultPrinter = "LOCL"; // Fallback
                    
                    if (oData && oData.results && oData.results.length > 0) {
                        // Get printer from first result
                        sDefaultPrinter = oData.results[0].Printer;
                        console.log("Found user's default printer:", sDefaultPrinter);
                    } else {
                        console.log("No default printer found for user, using fallback:", sDefaultPrinter);
                    }
                    
                    // Set the default printer value with multiple retries
                    setTimeout(function() {
                        that._setDefaultPrinterInDialog(sDefaultPrinter);
                    }, 50);
                    setTimeout(function() {
                        that._setDefaultPrinterInDialog(sDefaultPrinter);
                    }, 200);
                    setTimeout(function() {
                        that._setDefaultPrinterInDialog(sDefaultPrinter);
                    }, 500);
                },
                error: function(oError) {
                    console.error("Error fetching user's default printer:", oError);
                    
                    // Fallback to printer from selected row
                    var sDefaultPrinter = that._getDefaultPrinterFromSelection();
                    
                    setTimeout(function() {
                        that._setDefaultPrinterInDialog(sDefaultPrinter);
                    }, 50);
                    setTimeout(function() {
                        that._setDefaultPrinterInDialog(sDefaultPrinter);
                    }, 200);
                    setTimeout(function() {
                        that._setDefaultPrinterInDialog(sDefaultPrinter);
                    }, 500);
                }
            });
        },



         /**
         * Get current logged-in user
         * @private
         */
        _getCurrentUser: function() {
            var sUser = null;
            
            try {
                // Method 1: Try to get from shell service (Fiori Launchpad)
                if (sap.ushell && sap.ushell.Container) {
                    var oUser = sap.ushell.Container.getService("UserInfo");
                    if (oUser && oUser.getId) {
                        sUser = oUser.getId();
                        console.log("User from Shell Service:", sUser);
                        return sUser;
                    }
                }
            } catch (e) {
                console.log("Could not get user from Shell Service:", e);
            }
            
            try {
                // Method 2: Try to get from OData model user context
                var oModel = this.getView().getModel();
                if (oModel && oModel.getHttpHeaders) {
                    var oHeaders = oModel.getHttpHeaders();
                    if (oHeaders && oHeaders["sap-client"]) {
                        // User might be in headers
                        console.log("Checking model headers for user");
                    }
                }
                
                // Try getting user from security context
                if (oModel && oModel.oMetadata && oModel.oMetadata.mHeaders) {
                    console.log("Model metadata headers:", oModel.oMetadata.mHeaders);
                }
            } catch (e) {
                console.log("Could not get user from Model:", e);
            }
            
            try {
                // Method 3: Get from component user API (if available)
                var oComponent = this.getOwnerComponent();
                if (oComponent && oComponent.getModel && oComponent.getModel("userapi")) {
                    var oUserModel = oComponent.getModel("userapi");
                    var oUserData = oUserModel.getData();
                    if (oUserData && oUserData.name) {
                        sUser = oUserData.name;
                        console.log("User from User API Model:", sUser);
                        return sUser;
                    }
                }
            } catch (e) {
                console.log("Could not get user from Component:", e);
            }
            
            // Method 4: Make a call to read user info from backend
            // This is a fallback - you might need to adjust based on your backend
            if (!sUser) {
                console.log("Using synchronous call to get user - this is a fallback");
                var oModel = this.getView().getModel();
                
                // Read the first entry to get the current user context
                // Note: This approach assumes your backend returns current user
                try {
                    jQuery.ajax({
                        url: oModel.sServiceUrl + "/zi_userprinter_vh?$top=1",
                        method: "GET",
                        async: false,
                        headers: {
                            "Accept": "application/json"
                        },
                        success: function(oData) {
                            if (oData && oData.d && oData.d.results && oData.d.results.length > 0) {
                                sUser = oData.d.results[0].UserName;
                                console.log("User from backend call:", sUser);
                            }
                        },
                        error: function(oError) {
                            console.error("Could not fetch user from backend:", oError);
                        }
                    });
                } catch (e) {
                    console.error("Error in sync user fetch:", e);
                }
            }
            
            return sUser;
        },


       
        /**
         * Get default printer from first selected row
         * @private
         */
        _getDefaultPrinterFromSelection: function() {
            var sDefaultPrinter = "LOCL"; // Fallback default
            
            try {
                // Get selected contexts from extension API
                if (this.extensionAPI) {
                    var aSelectedContexts = this.extensionAPI.getSelectedContexts();
                    
                    if (aSelectedContexts && aSelectedContexts.length > 0) {
                        // Get data from first selected row
                        var oFirstRow = aSelectedContexts[0].getObject();
                        
                        if (oFirstRow && oFirstRow.Printer) {
                            sDefaultPrinter = oFirstRow.Printer;
                            console.log("Default printer from first selected row:", sDefaultPrinter);
                        } else {
                            console.log("No Printer property found in first selected row, using fallback:", sDefaultPrinter);
                        }
                    } else {
                        console.log("No rows selected, using fallback printer:", sDefaultPrinter);
                    }
                }
            } catch (e) {
                console.error("Error getting default printer from selection:", e);
            }
            
            return sDefaultPrinter;
        },

        /**
         * Find and set default printer value in the Print dialog
         * @private
         */
        _setDefaultPrinterInDialog: function(sDefaultPrinter) {
            console.log("Attempting to set default printer:", sDefaultPrinter);
            
            // Method 1: Find all inputs in open dialogs using Core
            var bFound = this._setDefaultByCore(sDefaultPrinter);
            
            if (!bFound) {
                // Method 2: Find by DOM and then get UI5 control
                bFound = this._setDefaultByDOM(sDefaultPrinter);
            }
            
            if (bFound) {
                console.log("Default printer value set successfully to:", sDefaultPrinter);
            } else {
                console.log("Could not find printer input field");
            }
        },

        /**
         * Method 1: Find printer input using UI5 Core
         * @private
         */
        _setDefaultByCore: function(sDefaultPrinter) {
            // Get all input controls
            var aInputs = [];
            
            // Get all controls from Core
            if (sap.ui.getCore().mElements) {
                Object.keys(sap.ui.getCore().mElements).forEach(function(sKey) {
                    var oControl = sap.ui.getCore().mElements[sKey];
                    if (oControl && oControl.isA && oControl.isA("sap.m.Input")) {
                        aInputs.push(oControl);
                    }
                });
            }
            
            console.log("Found " + aInputs.length + " input controls");
            
            // Check each input
            for (var i = 0; i < aInputs.length; i++) {
                var oInput = aInputs[i];
                
                // Check if this is the Printer input
                var sBindingPath = oInput.getBindingPath("value");
                var bIsInDialog = this._isControlInDialog(oInput, "Print");
                
                console.log("Checking input:", {
                    id: oInput.getId(),
                    bindingPath: sBindingPath,
                    inDialog: bIsInDialog,
                    visible: oInput.getVisible(),
                    enabled: oInput.getEnabled()
                });
                
                if (bIsInDialog && sBindingPath === "Printer") {
                    console.log("Found printer input, setting value to:", sDefaultPrinter);
                    oInput.setValue(sDefaultPrinter);
                    return true;
                }
            }
            
            return false;
        },

        /**
         * Method 2: Find printer input using DOM
         * @private
         */
        _setDefaultByDOM: function(sDefaultPrinter) {
            // Find all dialogs in DOM
            var aDomDialogs = document.querySelectorAll('[role="dialog"]');
            
            console.log("Found " + aDomDialogs.length + " dialogs in DOM");
            
            for (var i = 0; i < aDomDialogs.length; i++) {
                var oDomDialog = aDomDialogs[i];
                
                // Check if this is the Print dialog
                var sDialogTitle = oDomDialog.querySelector('.sapMDialogTitle');
                if (sDialogTitle && sDialogTitle.textContent.trim() === "Print") {
                    console.log("Found Print dialog");
                    
                    // Find all inputs in this dialog
                    var aInputElements = oDomDialog.querySelectorAll('input[type="text"]');
                    console.log("Found " + aInputElements.length + " input elements");
                    
                    for (var j = 0; j < aInputElements.length; j++) {
                        var oInputElement = aInputElements[j];
                        
                        // Find the UI5 control for this input element
                        var sControlId = oInputElement.id;
                        if (sControlId) {
                            // Get the parent control ID (UI5 wraps native inputs)
                            var oParent = oInputElement.closest('[data-sap-ui]');
                            if (oParent) {
                                sControlId = oParent.getAttribute('data-sap-ui');
                            }
                            
                            // Try different ID patterns
                            var aPossibleIds = [
                                sControlId,
                                sControlId.replace('-inner', ''),
                                oInputElement.id.replace('-inner', '')
                            ];
                            
                            for (var k = 0; k < aPossibleIds.length; k++) {
                                var oControl = sap.ui.getCore().byId(aPossibleIds[k]);
                                if (oControl && oControl.isA && oControl.isA("sap.m.Input")) {
                                    var sBindingPath = oControl.getBindingPath("value");
                                    console.log("Found input control:", {
                                        id: oControl.getId(),
                                        bindingPath: sBindingPath
                                    });
                                    
                                    if (sBindingPath === "Printer") {
                                        console.log("Setting value via DOM method to:", sDefaultPrinter);
                                        oControl.setValue(sDefaultPrinter);
                                        oInputElement.value = sDefaultPrinter;
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            
            return false;
        },

        /**
         * Check if a control is inside a specific dialog
         * @private
         */
        _isControlInDialog: function(oControl, sDialogTitle) {
            var oParent = oControl.getParent();
            
            while (oParent) {
                if (oParent.isA && oParent.isA("sap.m.Dialog")) {
                    var sTitle = oParent.getTitle ? oParent.getTitle() : "";
                    return sTitle === sDialogTitle;
                }
                oParent = oParent.getParent ? oParent.getParent() : null;
            }
            
            return false;
        },

        /**
         * Cleanup when controller is destroyed
         */
        onExit: function() {
            if (this._dialogObserver) {
                this._dialogObserver.disconnect();
            }
        },

        


        /**
         * Preview button handler - supports batch operations
         * @param {sap.ui.base.Event} oEvent - The event object
         */
        onPreviewPress: function (oEvent) {
            var oExtensionAPI = this.extensionAPI;
            var oModel = this.getView().getModel();
            var aSelectedContexts = oExtensionAPI.getSelectedContexts();

            // Check if any rows are selected
            if (!aSelectedContexts || aSelectedContexts.length === 0) {
                MessageBox.warning("Please select at least one entry to preview.");
                return;
            }

            // Single selection - direct preview
            if (aSelectedContexts.length === 1) {
                this._previewSingleDocument(oModel, aSelectedContexts[0]);
            } else {
                // Multiple selection - batch preview
                this._previewMultipleDocuments(oModel, aSelectedContexts);
            }
        },


             /**
         * Called when the action dialog is opened
         * Set default printer value
         */
        onBeforeActionDialogOpen: function(oEvent) {
            var oDialog = oEvent.getSource();
            var sActionName = oEvent.getParameter("action");
            
            // Check if this is the printList action
            if (sActionName === "printList") {
                // Wait for dialog content to be rendered
                setTimeout(function() {
                    // Find the printer input field
                    var aContent = oDialog.getContent();
                    if (aContent && aContent.length > 0) {
                        var oSimpleForm = aContent[0];
                        var aFormContent = oSimpleForm.getContent ? oSimpleForm.getContent() : [];
                        
                        // Look for the Printer input field
                        aFormContent.forEach(function(oControl) {
                            if (oControl.getMetadata().getName() === "sap.m.Input" && 
                                oControl.getName && oControl.getName() === "Printer") {
                                // Set default printer value
                                oControl.setValue("LOCL"); // Set your default printer here
                            }
                        });
                    }
                }, 100);
            }
        },

        /**
         * Preview a single document
         * @private
         */
        _previewSingleDocument: function (oModel, oContext) {
            var oData = oContext.getObject();
            var sSalesOrg = oData.SalesOrganization;
            var sPartner = oData.Partner;

            var oBusyDialog = new BusyDialog({
                title: "Loading Preview",
                text: "Generating PDF preview..."
            });
            oBusyDialog.open();

            var sPath = "/printForm";
            var mUrlParams = {
                SalesOrganization: "" + sSalesOrg + "",
                Partner: "" + sPartner + ""
            };

            oModel.callFunction(sPath, {
                method: "POST",
                urlParameters: mUrlParams,
                success: function (oData, response) {
                    oBusyDialog.close();
                    
                    if (oData &&  oData.printForm && oData.printForm.odata_url) {
                        // var sBaseUrl = oModel.sServiceUrl.replace(/\/$/, "");
                        // var sPdfUrl = sBaseUrl.replace("/ZSB_SELECTOR_V2/", "") + oData.odata_url;
                        
                        // Open PDF in a new window/tab
                        window.open(oData.printForm.odata_url, "_blank");
                    } else {
                        MessageBox.error("Unable to retrieve PDF URL from response.");
                    }
                },
                error: function (oError) {
                    oBusyDialog.close();
                    this._handleError(oError, "Failed to generate preview");
                }.bind(this)
            });
        },

        /**
         * Preview multiple documents in batch
         * @private
         */
        _previewMultipleDocuments: function (oModel, aSelectedContexts) {
            var that = this;
            var oBusyDialog = new BusyDialog({
                title: "Loading Previews",
                text: "Generating previews for " + aSelectedContexts.length + " documents..."
            });
            oBusyDialog.open();

            var aPromises = [];

            // Create promises for each selected item
            aSelectedContexts.forEach(function (oContext) {
                var oData = oContext.getObject();
                var sSalesOrg = oData.SalesOrganization;
                var sPartner = oData.Partner;
                var sPartnerName = oData.PartnerName;

                var oPromise = new Promise(function (resolve) {
                    var sPath = "/printForm";
                    var mUrlParams = {
                        SalesOrganization: "" + sSalesOrg + "",
                        Partner: "" + sPartner + ""
                    };

                    oModel.callFunction(sPath, {
                        method: "POST",
                        urlParameters: mUrlParams,
                        success: function (oResponseData) {
                            // var sBaseUrl = oModel.sServiceUrl.replace(/\/$/, "");
                            var sPdfUrl = "";
                            
                            if (oResponseData && oResponseData.printForm &&  oResponseData.printForm.odata_url) {
                                sPdfUrl = oResponseData.printForm.odata_url;
                            }
                            
                            resolve({
                                salesOrg: sSalesOrg,
                                partner: sPartner,
                                partnerName: sPartnerName,
                                url: sPdfUrl,
                                success: !!sPdfUrl
                            });
                        },
                        error: function (oError) {
                            resolve({
                                salesOrg: sSalesOrg,
                                partner: sPartner,
                                partnerName: sPartnerName,
                                url: "",
                                success: false,
                                error: that._getErrorMessage(oError)
                            });
                        }
                    });
                });

                aPromises.push(oPromise);
            });

            // Wait for all promises to complete
            Promise.all(aPromises).then(function (aResults) {
                oBusyDialog.close();
                
                // Filter successful results
                var aSuccessful = aResults.filter(function (oResult) {
                    return oResult.success && oResult.url;
                });

                var aFailed = aResults.filter(function (oResult) {
                    return !oResult.success;
                });

                // Show results summary
                that._showBatchPreviewResults(aSuccessful, aFailed);

                // Open PDFs for successful results (with delay to prevent popup blocker)
                aSuccessful.forEach(function (oResult, index) {
                    setTimeout(function () {
                        window.open(oResult.url, "_blank");
                    }, index * 300);
                });

            }).catch(function () {
                oBusyDialog.close();
                MessageBox.error("An error occurred during batch preview generation.");
            });
        },

        /**
         * Show batch preview results
         * @private
         */
        _showBatchPreviewResults: function (aSuccessful, aFailed) {
            var sMessage = "";
            
            if (aSuccessful.length > 0) {
                sMessage += aSuccessful.length + " document(s) opened successfully.";
            }
            
            if (aFailed.length > 0) {
                if (sMessage) sMessage += "\n";
                sMessage += aFailed.length + " document(s) failed to generate.\n\nFailed entries:\n";
                aFailed.forEach(function (oResult) {
                    sMessage += "- " + oResult.partnerName + " (" + oResult.partner + ")\n";
                });
            }

            if (aFailed.length > 0) {
                // MessageBox.warning(sMessage, {
                //     title: "Batch Preview Results",
                //     details: this._getFailedDetailsText(aFailed)
                // });
            } else {
                MessageToast.show(sMessage);
            }
        },

        /**
         * Get failed details text
         * @private
         */
        _getFailedDetailsText: function (aFailed) {
            var sDetails = "";
            aFailed.forEach(function (oResult) {
                sDetails += oResult.partnerName + " (" + oResult.partner + "): " + 
                           (oResult.error || "Unknown error") + "\n";
            });
            return sDetails;
        },

        /**
         * Handle error responses
         * @private
         */
        _handleError: function (oError, sDefaultMessage) {
            var sErrorMessage = sDefaultMessage || "An error occurred.";
            try {
                var oErrorResponse = JSON.parse(oError.responseText);
                if (oErrorResponse.error && oErrorResponse.error.message) {
                    sErrorMessage = oErrorResponse.error.message.value;
                }
            } catch (e) {
                // Use default error message
            }
            // MessageBox.error(sErrorMessage);
        },

        /**
         * Get error message from error object
         * @private
         */
        _getErrorMessage: function (oError) {
            try {
                var oErrorResponse = JSON.parse(oError.responseText);
                if (oErrorResponse.error && oErrorResponse.error.message) {
                    return oErrorResponse.error.message.value;
                }
            } catch (e) {
                // Return default
            }
            return "Unknown error occurred";
        },

        /**
         * Print button handler - supports batch operations
         * @param {sap.ui.base.Event} oEvent - The event object
         */
        onPrintPress: function (oEvent) {
            var oExtensionAPI = this.extensionAPI;
            var oModel = this.getView().getModel();
            var aSelectedContexts = oExtensionAPI.getSelectedContexts();

            if (!aSelectedContexts || aSelectedContexts.length === 0) {
                MessageBox.warning("Please select at least one entry to print.");
                return;
            }

            // Show printer selection dialog
            this._showPrinterDialog(oModel, aSelectedContexts);
        },
           /**
         * Show printer selection dialog
         * @private
         */
        _showPrinterDialog: function (oModel, aSelectedContexts) {
            var that = this;
            this.selectedContextForPrint = aSelectedContexts;

            if (!this._printerDialog) {
                // Create printer list
                var oPrinterList = new List({
                    id: "printerList",
                    mode: "SingleSelectMaster",
                    items: {
                        path: "/Zi_Printername_Vh",
                        template: new StandardListItem({
                            title: "{PrinterName}",
                            description: "{Printer}",
                            type: "Active"
                        })
                    }
                });

                this._printerDialog = new Dialog({
                    title: "Select Printer",
                    contentWidth: "400px",
                    content: [
                        new VBox({
                            items: [
                                new Text({
                                    text: aSelectedContexts.length + " document(s) will be printed."
                                }).addStyleClass("sapUiSmallMarginBottom"),
                                oPrinterList
                            ]
                        })
                    ],
                    beginButton: new Button({
                        text: "Print",
                        type: "Emphasized",
                        press: function () {
                            var aSelectedItems = oPrinterList.getSelectedItems();
                            if (aSelectedItems.length === 0) {
                                MessageBox.warning("Please select a printer.");
                                return;
                            }

                            var oSelectedPrinter = aSelectedItems[0].getBindingContext().getObject();
                            that._printerDialog.close();
                            that._executePrint(oModel,  that.selectedContextForPrint, oSelectedPrinter.Printer);
                        }
                    }),
                    endButton: new Button({
                        text: "Cancel",
                        press: function () {
                            that._printerDialog.close();
                        }
                    })
                });

                this.getView().addDependent(this._printerDialog);
            }

            // Load printers
            this._printerDialog.open();
        },

        /**
         * Execute print for selected documents
         * @private
         */
        _executePrint: function (oModel, aSelectedContexts, sPrinter) {
            var that = this;
            var oBusyDialog = new BusyDialog({
                title: "Printing",
                text: "Sending " + aSelectedContexts.length + " document(s) to printer..."
            });
            oBusyDialog.open();

            var aPromises = [];
            var aResults = [];

            aSelectedContexts.forEach(function (oContext) {
                var oData = oContext.getObject();
                var sSalesOrg = oData.SalesOrganization;
                var sPartner = oData.Partner;

                var oPromise = new Promise(function (resolve) {
                    var sPath = "/printList";
                    var mUrlParams = {
                        SalesOrganization: sSalesOrg ,
                        Partner: sPartner ,
                        Printer:  sPrinter
                    };

                    oModel.callFunction(sPath, {
                        method: "POST",
                        urlParameters: mUrlParams,
                        success: function () {
                            resolve({
                                partner: sPartner,
                                partnerName: oData.PartnerName,
                                success: true
                            });
                        },
                        error: function (oError) {
                            resolve({
                                partner: sPartner,
                                partnerName: oData.PartnerName,
                                success: false,
                                error: that._getErrorMessage(oError)
                            });
                        }
                    });
                });

                aPromises.push(oPromise);
            });

            Promise.all(aPromises).then(function (aResults) {
                oBusyDialog.close();

                var aSuccessful = aResults.filter(function (r) { return r.success; });
                var aFailed = aResults.filter(function (r) { return !r.success; });

                var sMessage = aSuccessful.length + " document(s) sent to printer successfully.";
                
                if (aFailed.length > 0) {
                    sMessage += "\n" + aFailed.length + " document(s) failed.";
                    MessageBox.warning(sMessage, {
                        details: that._getFailedDetailsText(aFailed)
                    });
                } else {
                    MessageToast.show(sMessage);
                }
            });
        },

    };
});