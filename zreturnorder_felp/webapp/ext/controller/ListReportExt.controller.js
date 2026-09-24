sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/core/BusyIndicator"
], function (MessageToast, MessageBox, JSONModel, Fragment, BusyIndicator) {
    "use strict";

    return {
        onInit: function () {
            if (window.location.href.indexOf("EvaluationId=") > -1) {
                this._stripEvaluationIdFromHash();
            }
        },

        _stripEvaluationIdFromHash: function () {
            var sHref = window.location.href;
            var iHashIndex = sHref.indexOf("#");

            if (iHashIndex < 0) {
                return;
            }

            var iQueryIndex = sHref.indexOf("?", iHashIndex);
            var sNewHref = iQueryIndex < 0 ? sHref : sHref.substring(0, iQueryIndex);

            if (sNewHref === sHref) {
                return;
            }

            window.history.replaceState(null, "", sNewHref);
            window.location.reload();
        },

        GetAttachments: function (oEvent) {
            var oExtensionAPI = this.extensionAPI;
            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            var aContexts = oExtensionAPI.getSelectedContexts();

            if (!aContexts || aContexts.length === 0) {
                MessageToast.show(oResourceBundle.getText("attachmentsNoSelection"));
                return;
            }

            var sDelivery = aContexts[0].getProperty("ReturnsDelivery");
            var sReferenceSalesorder = aContexts[0].getProperty("ReferenceSalesDocument");

            if (!sDelivery) {
                MessageToast.show(oResourceBundle.getText("attachmentsNoDelivery"));
                return;
            }

            this._openAttachmentsDialog(sDelivery, sReferenceSalesorder);
        },

        onAttachmentPress: function (oEvent) {
            var oAttachment = oEvent.getSource().getBindingContext("attachments").getObject();
            var sMediaSrc = oAttachment.__metadata && oAttachment.__metadata.media_src;

            if (sMediaSrc) {
                window.open(sMediaSrc, "_blank");
            }
        },

        onCloseAttachmentsDialog: function () {
            if (this._oAttachmentsDialogPromise) {
                this._oAttachmentsDialogPromise.then(function (oDialog) {
                    oDialog.close();
                });
            }
        },

        _openAttachmentsDialog: function (sDelivery, sReferenceSalesorder) {
            var oView = this.getView();
            var oResourceBundle = oView.getModel("i18n").getResourceBundle();
            var oAttachmentsModel = new JSONModel({ busy: true, results: [] });

            if (!this._oAttachmentsDialogPromise) {
                this._oAttachmentsDialogPromise = Fragment.load({
                    id: oView.getId(),
                    name: "customer.porky.zreturnorderfelp.ext.fragment.AttachmentsDialog",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }
var that = this;
            this._oAttachmentsDialogPromise.then(function (oDialog) {
                oDialog.setModel(oAttachmentsModel, "attachments");
                oDialog.open();
                
                this.getView().getModel("attachmentModel").callFunction("/GetArchiveLinkAttachments", {
                    method: "GET",
                    urlParameters: {
                        ArchiveObjectID: "0" + sDelivery,
                        ArchiveObjectType: "LIKP",
                        SemanticObjectType: "",
                        IsDraft: false
                    },
                    success: function (oData) {
                        oAttachmentsModel.setData({
                            busy: false,
                            results: (oData && oData.results) || []
                        });

                        that.getView().getModel("attachmentModel").callFunction("/GetArchiveLinkAttachments", {
                            method: "GET",
                            urlParameters: {
                                ArchiveObjectID: "0" + sReferenceSalesorder,
                                ArchiveObjectType: "BUS2032",
                                SemanticObjectType: "",
                                IsDraft: false
                            },
                            success: function (oData) {
                                var aExistingResults = oAttachmentsModel.getProperty("/results") || [];
                                var aNewResults = (oData && oData.results) || [];
                                var aCombinedResults = aExistingResults.concat(aNewResults);

                                oAttachmentsModel.setData({
                                    busy: false,
                                    results: aCombinedResults
                                });
                            }.bind(that),
                            error: function () {
                                oAttachmentsModel.setProperty("/busy", false);
                               // MessageBox.error(oResourceBundle.getText("attachmentsReadError"));
                            }
                        });
                    },
                    error: function () {
                        oAttachmentsModel.setProperty("/busy", false);
                        oDialog.close();
                      //  MessageBox.error(oResourceBundle.getText("attachmentsReadError"));
                    }
                });
            }.bind(this));
        },

        _downloadInvoice: function (sReturnOrder, SalesOrganization, sReturnOrderItem,Time) {
            var oView = this.getView();
            var oResourceBundle = oView.getModel("i18n").getResourceBundle();

            BusyIndicator.show(0);

            this.getView().getModel().callFunction("/download", {
                method: "POST",
                urlParameters: {
                    Rundt: new Date(new Date().toDateString()), // Run Date (date only, no time component)
                    Time: Time,
                    SalesOrganization: SalesOrganization,
                    CustomerReturn: sReturnOrder,
                    CustomerReturnItem:sReturnOrderItem
                },
                success: function (oData) {
                    var oDownload = (oData && oData.download) || {};

                    BusyIndicator.hide();

                    if (!oDownload.PDFStream) {
                        MessageBox.error(oResourceBundle.getText("invoiceNoData"));
                        return;
                    }

                    var sBinary = window.atob(oDownload.PDFStream);
                    var aBytes = new Uint8Array(sBinary.length);
                    for (var i = 0; i < sBinary.length; i++) {
                        aBytes[i] = sBinary.charCodeAt(i);
                    }
                    var oBlob = new Blob([aBytes], { type: oDownload.PdfMimeType || "application/pdf" });

                    if (this._sInvoicePdfObjectUrl) {
                        URL.revokeObjectURL(this._sInvoicePdfObjectUrl);
                    }
                    this._sInvoicePdfObjectUrl = URL.createObjectURL(oBlob);
                    window.open(
                        this._sInvoicePdfObjectUrl,
                        "invoicePreview",
                        "width=900,height=1000,resizable=yes,scrollbars=yes"
                    );
                }.bind(this),
                error: function () {
                    BusyIndicator.hide();
                    MessageBox.error(oResourceBundle.getText("invoiceNoData"));
                }
            });
        },
        previewInvoice: function(oEvent) {
             var oExtensionAPI = this.extensionAPI;
            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            var aContexts = oExtensionAPI.getSelectedContexts();

            if (!aContexts || aContexts.length === 0) {
                MessageToast.show(oResourceBundle.getText("invoiceNoSelection"));
                return;
            }

            var sReturnOrder = aContexts[0].getProperty("CustomerReturn");
            var sSalesOrganization = aContexts[0].getProperty("SalesOrganization");
            var sReturnOrderItem = aContexts[0].getProperty("CustomerReturnItem");
            var sTime = aContexts[0].getProperty("Time");

            if (!sReturnOrder) {
                MessageToast.show(oResourceBundle.getText("invoiceNoDelivery"));
                return;
            }

            this._downloadInvoice(sReturnOrder, sSalesOrganization, sReturnOrderItem, sTime);
        }
    };
});
