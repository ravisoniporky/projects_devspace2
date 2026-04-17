sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/LightBox",
    "sap/m/LightBoxItem",
    "sap/m/MessageBox",
    "sap/ndc/BarcodeScanner",
    "sap/ui/model/json/JSONModel"
], function(MessageToast, LightBox, LightBoxItem, MessageBox, BarcodeScanner, JSONModel) {
    'use strict';

    var sServiceUrl = "/sap/opu/odata/sap/ZODATA_MATVERIFY_SRV/";
    var sUploadUrl  = sServiceUrl + "VerifyImagesSet";

    function uploadFile(oFile, sSlug) {
        // Step 1: fetch CSRF token
        var oXhrToken = new XMLHttpRequest();
        oXhrToken.open("GET", sServiceUrl, true);
        oXhrToken.setRequestHeader("x-csrf-token", "Fetch");
        oXhrToken.onload = function() {
            var sToken = oXhrToken.getResponseHeader("x-csrf-token");

            // Step 2: read file and POST
            var oReader = new FileReader();
            oReader.onload = function(oEvent) {
                var oXhr = new XMLHttpRequest();
                oXhr.open("POST", sUploadUrl, true);
                oXhr.setRequestHeader("x-csrf-token", sToken);
                oXhr.setRequestHeader("Slug", sSlug);
                oXhr.setRequestHeader("Content-Type", oFile.type || "application/octet-stream");
                oXhr.onload = function() {
                    if (oXhr.status >= 200 && oXhr.status < 300) {
                        MessageToast.show("Photo uploaded successfully");
                    } else {
                        MessageToast.show("Upload failed: " + oXhr.status);
                    }
                };
                oXhr.onerror = function() {
                    MessageToast.show("Upload error");
                };
                oXhr.send(oEvent.target.result);
            };
            oReader.readAsArrayBuffer(oFile);
        };
        oXhrToken.send();
    }

    return {
        onVerifyScan: function() {
            var oContext = this.getView().getBindingContext();
            var oObject = oContext.getObject();
            this._sVerifyProduct = oObject.Product;
            this._sVerifyPlant = oObject.Plant;
            this._sVerifyBaseUnit = oObject.BaseUnit;

            BarcodeScanner.scan(
                function(mResult) {
                    if (mResult.cancelled) {
                        MessageToast.show("Scan cancelled", { duration: 1000 });
                        return;
                    }
                    var sBarcode = mResult.text;
                    if (!sBarcode) {
                        MessageToast.show("No barcode text received", { duration: 1000 });
                        return;
                    }
                    this._openVerifyDialog(sBarcode);
                }.bind(this),
                function(sError) {
                    MessageToast.show("Scan failed: " + sError, { duration: 1000 });
                },
                function() { /* live update */ }
            );
        },

        _openVerifyDialog: function(sBarcode) {
            if (!this._oVerifyDialog) {
                this._oVerifyDialog = sap.ui.xmlfragment(
                    this.getView().getId(),
                    "customer.porky.zmmmatverify2.ext.fragment.VerifyDialog",
                    this
                );
                this.getView().addDependent(this._oVerifyDialog);
            }
            this._oVerifyDialog.setModel(new JSONModel({
                unitOfMeasure: this._sVerifyBaseUnit,
                barcode: sBarcode
            }), "verifyModel");
            this._oVerifyDialog.open();
        },

        onVerifyDialogConfirm: function() {
            var oData = this._oVerifyDialog.getModel("verifyModel").getData();
            var oModel = this.getView().getModel();
            oModel.callFunction("/CSEAN", {
                method: "POST",
                headers: {
                    "Prefer": "handling=strict",
                    "Content-ID": "1"
                },
                urlParameters: {
                    Product: this._sVerifyProduct,
                    Plant: this._sVerifyPlant,
                    UnitofMeasure: oData.unitOfMeasure,
                    EAN: oData.barcode
                },
                success: function(oResult) {
                    
                    var bIsInvalid = oResult.CSEAN && oResult.CSEAN.IsInvalid;
                    this._oVerifyDialog.close();
                    if (bIsInvalid) {
                        MessageBox.error("Barcode is invalid for this product.");
                    } else {
                        MessageToast.show("Barcode verified successfully");
                        oModel.refresh();
                    }
                }.bind(this),
                error: function(oError) {
                    var sMsg = "Verify failed";
                    try {
                        var oBody = JSON.parse(oError.responseText);
                        sMsg = oBody.error.message.value || sMsg;
                    } catch (e) { /* use default */ }
                    MessageBox.error(sMsg);
                }
            });
        },

        onVerifyDialogCancel: function() {
            this._oVerifyDialog.close();
        },

        onUoMValueHelpRequest: function() {
            if (!this._oUoMSelectDialog) {
                this._oUoMSelectDialog = new sap.m.SelectDialog({
                    id: this.getView().getId() + "--uomSelectDialog",
                    title: "Select Unit of Measure",
                    confirm: function(oEvent) {
                        var oSelectedItem = oEvent.getParameter("selectedItem");
                        if (oSelectedItem) {
                            this._oVerifyDialog.getModel("verifyModel")
                                .setProperty("/unitOfMeasure", oSelectedItem.getTitle());
                        }
                    }.bind(this),
                    search: function(oEvent) {
                        var sValue = oEvent.getParameter("value");
                        var oFilter = new sap.ui.model.Filter({
                            filters: [
                                new sap.ui.model.Filter("UnitOfMeasure", sap.ui.model.FilterOperator.Contains, sValue),
                                new sap.ui.model.Filter("UnitOfMeasure_Text", sap.ui.model.FilterOperator.Contains, sValue)
                            ],
                            and: false
                        });
                        oEvent.getSource().getBinding("items").filter([oFilter]);
                    }
                });

                this._oUoMSelectDialog.bindAggregation("items", {
                    path: "/ZI_MaterialVerifyUoM_VH",
                    template: new sap.m.StandardListItem({
                        title: "{UnitOfMeasure}",
                        description: "{UnitOfMeasure_Text}"
                    })
                });

                this.getView().addDependent(this._oUoMSelectDialog);
            }

            this._oUoMSelectDialog.setModel(this.getView().getModel());
            this._oUoMSelectDialog.open(
                this._oVerifyDialog.getModel("verifyModel").getProperty("/unitOfMeasure")
            );
        },

        _UploadPhoto: function(oEvent) {
            var oContext = this.getView().getBindingContext();
            var oObject = oContext.getObject();
            var sProduct = oObject.Product.padStart(18, "0");
            var sBaseUnit = oObject.BaseUnit;
            var sPlant    = oObject.Plant;
            var sSlug     = sProduct + ";" + sBaseUnit + ";" + sPlant;

            var oInput = document.createElement("input");
            oInput.type = "file";
            oInput.accept = "image/*";
            oInput.onchange = function(oEvt) {
                var oFile = oEvt.target.files[0];
                if (oFile) {
                    uploadFile(oFile, sSlug);
                }
            };
            oInput.click();
        },
        _UploadPhoto1: function(oEvent) {
            MessageToast.show("Custom handler invoked.");
        },

        _onDeleteImage: function(oEvent) {
            var oContext = oEvent.getSource().getBindingContext();
            var oModel = oContext.getModel();
            var sImageName = oContext.getProperty("ImageName");

            MessageBox.confirm("Delete image \"" + sImageName + "\"?", {
                onClose: function(sAction) {
                    if (sAction === MessageBox.Action.OK) {
                        oModel.remove(oContext.getPath(), {
                            success: function() {
                                MessageToast.show("Image deleted");
                            },
                            error: function() {
                                MessageToast.show("Error deleting image");
                            }
                        });
                    }
                }
            });
        },

        _onImagePreviewPress: function(oEvent) {
            var oCtx = oEvent.getSource().getBindingContext();
            var sFullUrl = oCtx.getProperty("GetUrl");
            var sImageName = oCtx.getProperty("ImageName");

            if (!this._oLightBox) {
                this._oLightBox = new LightBox();
            }

            this._oLightBox.destroyImageContent();
            this._oLightBox.addImageContent(new LightBoxItem({
                imageSrc: sFullUrl,
                alt: sImageName,
                title: sImageName
            }));

            this._oLightBox.open();
        }
    };
});
