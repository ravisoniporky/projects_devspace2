sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
], function(MessageToast, MessageBox, Fragment, JSONModel) {
    'use strict';

    return {
        onInit: function() {
            // Initialize view model for managing dialog state
            var oViewModel = new JSONModel({
                busy: false,
                hasImages: false,
                images: [],
                preview: {
                    visible: false,
                    src: "",
                    fileName: ""
                }
            });
            this.getView().setModel(oViewModel, "viewModel");
            
            // Store selected file
            this._selectedFile = null;
        },

        UploadImage: function(oEvent) {
            var oContext = this.getView().getBindingContext();
            
            if (!oContext) {
                MessageBox.error("Please select or create an entry first to upload an image");
                return;
            }

            var oObject = oContext.getObject();
            
            if (!oObject || !oObject.Pariscode) {
                MessageBox.error("Invalid Paris Code. Please save the entry first.");
                return;
            }

            // Store the current object for later use
            this._currentObject = oObject;

            // Reset preview and selected file
            var oViewModel = this.getView().getModel("viewModel");
            oViewModel.setProperty("/preview", {
                visible: false,
                src: "",
                fileName: ""
            });
            this._selectedFile = null;

            // Load and open the upload dialog
            this._openUploadDialog();
        },

        showImage: function(oEvent) {
            var oContext = this.getView().getBindingContext();
            
            if (!oContext) {
                MessageBox.error("Please select an entry first to view images");
                return;
            }

            var oObject = oContext.getObject();
            
            if (!oObject || !oObject.Pariscode) {
                MessageBox.error("Invalid Paris Code.");
                return;
            }

            // Store the current object
            this._currentObject = oObject;

            // Load images and open display dialog
            this._loadAndShowImages();
        },

        _openUploadDialog: function() {
            var oView = this.getView();

            if (!this._pUploadDialog) {
                this._pUploadDialog = Fragment.load({
                    id: oView.getId(),
                    name: "customer.porky.zmmparisxref.ext.fragment.UploadImageDialog",
                    controller: this
                }).then(function(oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this._pUploadDialog.then(function(oDialog) {
                oDialog.open();
            });
        },

        _loadAndShowImages: function() {
            var oView = this.getView();
            var that = this;

            if (!this._pImageDialog) {
                this._pImageDialog = Fragment.load({
                    id: oView.getId(),
                    name: "customer.porky.zmmparisxref.ext.fragment.ShowImageDialog",
                    controller: this
                }).then(function(oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this._pImageDialog.then(function(oDialog) {
                that._refreshImageList();
                oDialog.open();
            });
        },

        _getImageModel: function() {
            // Get the image service model - create if doesn't exist
            var oView = this.getView();
            var oImageModel = oView.getModel("imageService");
            
            if (!oImageModel) {
                // Create model for the image service
                var sServiceUrl = "/sap/opu/odata/sap/ZODATA_PARISXREF_SRV/";
                oImageModel = new sap.ui.model.odata.v2.ODataModel(sServiceUrl, {
                    defaultBindingMode: "TwoWay",
                    useBatch: false
                });
                oView.setModel(oImageModel, "imageService");
            }
            
            return oImageModel;
        },

        _refreshImageList: function() {
            var oImageModel = this._getImageModel();
            var sPariscode = this._currentObject.Pariscode;
            var oViewModel = this.getView().getModel("viewModel");
            
            oViewModel.setProperty("/busy", true);

            // Read images for the current Paris Code
            var sPath = "/PARIS_IMAGESSet";
            var aFilters = [
                new sap.ui.model.Filter("Pariscode", sap.ui.model.FilterOperator.EQ, sPariscode)
            ];

            oImageModel.read(sPath, {
                filters: aFilters,
                success: function(oData) {
                    var aImages = oData.results.map(function(oImage) {
                        // Construct proper URL with all key fields
                        var sImageUrl = "/sap/opu/odata/sap/ZODATA_PARISXREF_SRV/PARIS_IMAGESSet(" +
                                      "Pariscode='" + oImage.Pariscode + "'," +
                                      "Uom='" + oImage.Uom + "'," +
                                      "Imageitem=" + oImage.Imageitem + ")/$value";
                        
                        return {
                            Pariscode: oImage.Pariscode,
                            Uom: oImage.Uom,
                            Imageitem: oImage.Imageitem,
                            ImageName: oImage.ImageName || "",
                            Mimetype: oImage.Mimetype || "",
                            FileSize: oImage.FileSize || 0,
                            ImageUrl: sImageUrl,
                            ThumbnailUrl: oImage.ThumbnailUrl || sImageUrl
                        };
                    });
                    
                    oViewModel.setProperty("/images", aImages);
                    oViewModel.setProperty("/hasImages", aImages.length > 0);
                    oViewModel.setProperty("/busy", false);
                },
                error: function(oError) {
                    var sErrorMsg = "Failed to load images";
                    try {
                        var oErrorResponse = JSON.parse(oError.responseText);
                        if (oErrorResponse.error && oErrorResponse.error.message) {
                            sErrorMsg = oErrorResponse.error.message.value || oErrorResponse.error.message;
                        }
                    } catch (e) {
                        sErrorMsg = oError.message || sErrorMsg;
                    }
                    MessageBox.error(sErrorMsg);
                    oViewModel.setProperty("/busy", false);
                    oViewModel.setProperty("/hasImages", false);
                }
            });
        },

        _getFileFromUploader: function(oFileUploader) {
            var oFile = null;
            
            try {
                // Get the file input element - multiple ways to handle different UI5 versions
                var oDomRef = oFileUploader.oFileUpload;
                
                if (!oDomRef) {
                    // Alternative method
                    oDomRef = document.getElementById(oFileUploader.getId() + "-fu");
                }
                
                if (!oDomRef) {
                    // Another alternative
                    var sId = oFileUploader.getId();
                    oDomRef = jQuery.sap.domById(sId + "-fu");
                }

                if (oDomRef && oDomRef.files && oDomRef.files.length > 0) {
                    oFile = oDomRef.files[0];
                }
            } catch (e) {
                console.error("Error getting file:", e);
            }
            
            return oFile;
        },

        onFileChange: function(oEvent) {
            var oFileUploader = oEvent.getSource();
            var sFileName = oEvent.getParameter("newValue");
            var oViewModel = this.getView().getModel("viewModel");
            
            if (sFileName) {
                // Get the file
                var oFile = this._getFileFromUploader(oFileUploader);

                if (oFile) {
                    // Store the file for later upload
                    this._selectedFile = oFile;

                    // Validate file type
                    var sFileType = oFile.type;
                    var aValidTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/bmp"];
                    
                    if (aValidTypes.indexOf(sFileType) === -1) {
                        MessageBox.error("Invalid file type. Please select an image file (JPG, PNG, GIF, BMP)");
                        oFileUploader.clear();
                        oViewModel.setProperty("/preview/visible", false);
                        this._selectedFile = null;
                        return;
                    }

                    // Validate file size (e.g., max 5MB)
                    var nMaxSize = 5 * 1024 * 1024; // 5MB
                    if (oFile.size > nMaxSize) {
                        MessageBox.error("File size exceeds 5MB. Please select a smaller file.");
                        oFileUploader.clear();
                        oViewModel.setProperty("/preview/visible", false);
                        this._selectedFile = null;
                        return;
                    }

                    // Preview the image
                    var oReader = new FileReader();
                    oReader.onload = function(e) {
                        oViewModel.setProperty("/preview", {
                            visible: true,
                            src: e.target.result,
                            fileName: sFileName
                        });
                    };
                    oReader.readAsDataURL(oFile);

                    MessageToast.show("File selected: " + sFileName);
                } else {
                    MessageBox.warning("Could not read file. Please try again.");
                    oViewModel.setProperty("/preview/visible", false);
                    this._selectedFile = null;
                }
            } else {
                oViewModel.setProperty("/preview/visible", false);
                this._selectedFile = null;
            }
        },

        _getCSRFToken: function() {
            var sToken = null;
            var sServiceUrl = "/sap/opu/odata/sap/ZODATA_PARISXREF_SRV/";
            
            jQuery.ajax({
                url: sServiceUrl,
                method: "HEAD",
                async: false,
                headers: {
                    "X-CSRF-Token": "Fetch"
                },
                success: function(data, textStatus, xhr) {
                    sToken = xhr.getResponseHeader("X-CSRF-Token");
                },
                error: function(xhr, status, error) {
                    console.error("Failed to fetch CSRF token:", error);
                }
            });
            
            return sToken;
        },

        onUploadPress: function() {
            var oView = this.getView();
            var oUnitSelect = oView.byId("unitSelect");
            
            if (!this._selectedFile) {
                MessageBox.error("Please select an image file first");
                return;
            }

            var sUnit = oUnitSelect.getSelectedKey();
            if (!sUnit) {
                MessageBox.error("Please select a unit");
                return;
            }

            var sPariscode = this._currentObject.Pariscode;
            var sSlug = sPariscode + ";" + sUnit;

            var that = this;

            // Show busy indicator
            sap.ui.core.BusyIndicator.show(0);

            // Get CSRF token
            var sToken = this._getCSRFToken();
            
            if (!sToken) {
                sap.ui.core.BusyIndicator.hide();
                MessageBox.error("Failed to retrieve CSRF token. Please refresh the page and try again.");
                return;
            }

            var sServiceUrl = "/sap/opu/odata/sap/ZODATA_PARISXREF_SRV/";
            var sUploadUrl = sServiceUrl + "PARIS_IMAGESSet";

            // Read file as binary
            var oReader = new FileReader();
            
            oReader.onload = function(e) {
                var arrayBuffer = e.target.result;

                // Upload using jQuery AJAX
                jQuery.ajax({
                    url: sUploadUrl,
                    type: "POST",
                    processData: false,
                    contentType: that._selectedFile.type || "application/octet-stream",
                    data: arrayBuffer,
                    headers: {
                        "X-CSRF-Token": sToken,
                        "slug": sSlug,
                        "Accept": "application/json"
                    },
                    success: function(data, textStatus, jqXHR) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Image uploaded successfully");
                        that.onCancelUpload();
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        sap.ui.core.BusyIndicator.hide();
                        var sErrorMsg = "Upload failed";
                        
                        try {
                            var oError = JSON.parse(jqXHR.responseText);
                            if (oError.error && oError.error.message) {
                                sErrorMsg = oError.error.message.value || oError.error.message;
                            }
                        } catch (e) {
                            sErrorMsg = jqXHR.responseText || errorThrown || "Unknown error occurred";
                        }
                        
                        MessageBox.error(sErrorMsg);
                    }
                });
            };

            oReader.onerror = function() {
                sap.ui.core.BusyIndicator.hide();
                MessageBox.error("Failed to read file");
            };

            oReader.readAsArrayBuffer(that._selectedFile);
        },

        onCancelUpload: function() {
            var oView = this.getView();
            var oFileUploader = oView.byId("fileUploader");
            var oViewModel = this.getView().getModel("viewModel");
            
            if (oFileUploader) {
                oFileUploader.clear();
            }

            // Clear selected file
            this._selectedFile = null;

            // Clear preview
            oViewModel.setProperty("/preview", {
                visible: false,
                src: "",
                fileName: ""
            });

            this._pUploadDialog.then(function(oDialog) {
                oDialog.close();
            });
        },

        onDeleteImage: function(oEvent) {
            var oButton = oEvent.getSource();
            var oContext = oButton.getBindingContext("viewModel");
            var oImage = oContext.getObject();
            
            var that = this;
            MessageBox.confirm("Are you sure you want to delete this image?", {
                onClose: function(sAction) {
                    if (sAction === MessageBox.Action.OK) {
                        that._deleteImage(oImage);
                    }
                }
            });
        },

        _deleteImage: function(oImage) {
            var oImageModel = this._getImageModel();
            var sPath = "/PARIS_IMAGESSet(Pariscode='" + oImage.Pariscode + 
                        "',Uom='" + oImage.Uom + 
                        "',Imageitem=" + oImage.Imageitem + ")";
            
            var that = this;
            oImageModel.remove(sPath, {
                success: function() {
                    MessageToast.show("Image deleted successfully");
                    that._refreshImageList();
                },
                error: function(oError) {
                    var sErrorMsg = "Failed to delete image";
                    try {
                        var oErrorResponse = JSON.parse(oError.responseText);
                        if (oErrorResponse.error && oErrorResponse.error.message) {
                            sErrorMsg = oErrorResponse.error.message.value || oErrorResponse.error.message;
                        }
                    } catch (e) {
                        sErrorMsg = oError.message || sErrorMsg;
                    }
                    MessageBox.error(sErrorMsg);
                }
            });
        },

        onCloseImageDialog: function() {
            this._pImageDialog.then(function(oDialog) {
                oDialog.close();
            });
        },
        onDeleteImageButton: function(oEvent) {
    var oButton = oEvent.getSource();
    var oContext = oButton.getBindingContext("viewModel");
    var oImage = oContext.getObject();
    
    var that = this;
    MessageBox.confirm("Are you sure you want to delete this image '" + oImage.ImageName + "'?", {
        title: "Confirm Deletion",
        onClose: function(sAction) {
            if (sAction === MessageBox.Action.OK) {
                that._deleteImage(oImage);
            }
        }
    });
},

onDeleteImage: function(oEvent) {
    var oTable = oEvent.getSource();
    var oItem = oEvent.getParameter("listItem");
    var oContext = oItem.getBindingContext("viewModel");
    var oImage = oContext.getObject();
    
    var that = this;
    MessageBox.confirm("Are you sure you want to delete this image?", {
        title: "Confirm Deletion",
        onClose: function(sAction) {
            if (sAction === MessageBox.Action.OK) {
                that._deleteImage(oImage);
            }
        }
    });
},

_deleteImage: function(oImage) {
    var oImageModel = this._getImageModel();
    
    // Construct the delete path
    var sPath = "/PARIS_IMAGESSet(Pariscode='" + oImage.Pariscode + 
                "',Uom='" + oImage.Uom + 
                "',Imageitem=" + oImage.Imageitem + ")";
    
    sap.ui.core.BusyIndicator.show(0);
    
    var that = this;
    oImageModel.remove(sPath, {
        success: function(oData) {
            sap.ui.core.BusyIndicator.hide();
            MessageToast.show("Image deleted successfully");
            that._refreshImageList();
        },
        error: function(oError) {
            sap.ui.core.BusyIndicator.hide();
            var sErrorMsg = "Failed to delete image";
            
            try {
                var oErrorResponse = JSON.parse(oError.responseText);
                if (oErrorResponse.error && oErrorResponse.error.message) {
                    sErrorMsg = oErrorResponse.error.message.value || oErrorResponse.error.message;
                }
            } catch (e) {
                sErrorMsg = oError.message || sErrorMsg;
            }
            
            MessageBox.error(sErrorMsg);
        }
    });
},

onRefreshImages: function() {
    this._refreshImageList();
    MessageToast.show("Images refreshed");
}
    };
});