sap.ui.define([
    "sap/ui/core/mvc/ControllerExtension",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
     "sap/m/LightBox",           // ← add
    "sap/m/LightBoxItem"
], function(ControllerExtension, MessageToast, MessageBox, Fragment, JSONModel,LightBox,LightBoxItem) {
    'use strict';

    return ControllerExtension.extend("customer.porky.zmmparisxref2.ext.controller.ObjectPageExt", {
        
        override: {

            onInit: function() {
                // Initialize view model
                this._initializeViewModel();
                
                // Subscribe to state change events
                var oObjectPage = this.base.getView().getContent()[0];
                if (oObjectPage && oObjectPage.attachStateChange) {
                    oObjectPage.attachStateChange(this._onStateChange.bind(this));
                }
                
                // Also listen to route matched
                var oRouter = this.base.getAppComponent().getRouter();
                oRouter.getRoute("ZC_ParisMaterialCrossRefObjectPage").attachPatternMatched(this._onRouteMatched, this);
            }
        },

        _onRouteMatched: function(oEvent) {
            // Small delay to ensure binding is ready
            console.log("Route Matched....");
          
             setTimeout(function() {
                 this._refreshImageList();
                this._loadImagesForCurrentContext()
            }.bind(this), 1000);
           
        },

        _onStateChange: function(oEvent) {
            var sLayout = oEvent.getParameter("layout");
            // Load images when page becomes visible
            if (sLayout) {
                this._loadImagesForCurrentContext();
            }
        },

        _initializeViewModel: function() {
            var oView = this.base.getView();
            var oViewModel = oView.getModel("viewModel");
            
            if (!oViewModel) {
                oViewModel = new JSONModel({
                    busy: false,
                    hasImages: false,
                    images: [],
                    preview: {
                        visible: false,
                        src: "",
                        fileName: ""
                    },
                    currentObject: null,
                    selectedFile: null
                });
                oView.setModel(oViewModel, "viewModel");
            }
        },

        _loadImagesForCurrentContext: function() {
            var oView = this.base.getView();
            var oContext = oView.getBindingContext();
            
            if (!oContext) {
                return;
            }

            // Wait for data to be loaded
            oContext.requestObject().then(function(oObject) {
                if (!oObject || !oObject.Pariscode) {
                    return;
                }

                var oViewModel = oView.getModel("viewModel");
                if (!oViewModel) {
                    this._initializeViewModel();
                    oViewModel = oView.getModel("viewModel");
                }
                
                oViewModel.setProperty("/currentObject", oObject);
                
                // Load images
                this._refreshImageList();
            }.bind(this));
        },
            
            
         

        UploadImageEA: function(oEvent){
             this._directUpload("EA");
                return;
   var oView = this.base.getView();
            var oContext = oView.getBindingContext();
            
            if (!oContext) {
                MessageBox.error("Please select or create an entry first to upload an image");
                return;
            }

            var oObject = oContext.getObject();
            
            if (!oObject || !oObject.Pariscode) {
                MessageBox.error("Invalid Paris Code. Please save the entry first.");
                return;
            }

            // Initialize view model if not exists
            var oViewModel = oView.getModel("viewModel");
            if (!oViewModel) {
                oViewModel = new JSONModel({
                    busy: false,
                    hasImages: false,
                    images: [],
                    preview: {
                        visible: false,
                        src: "",
                        fileName: ""
                    },
                    currentObject: null,
                    selectedFile: null
                });
                oView.setModel(oViewModel, "viewModel");
            }

            oViewModel.setProperty("/currentObject", oObject);
            oViewModel.setProperty("/preview", {
                visible: false,
                src: "",
                fileName: ""
            });
            oViewModel.setProperty("/selectedFile", null);

            // Open upload dialog
            var that = this;
            if (!this._pUploadDialog) {
                this._pUploadDialog = Fragment.load({
                    id: oView.getId(),
                    name: "customer.porky.zmmparisxref2.ext.fragment.UploadImageDialog",
                    controller: this
                }).then(function(oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this._pUploadDialog.then(function(oDialog) {
                oDialog.open();
                 that.getView().byId("unitSelect").setSelectedKey("EA");
                that.getView().byId("unitSelect").setEnabled(false);
            });
        },
        UploadImageCS: function(oEvent){

             this._directUpload("CS");
             return;
               var oView = this.base.getView();
            var oContext = oView.getBindingContext();
            
            if (!oContext) {
                MessageBox.error("Please select or create an entry first to upload an image");
                return;
            }

            var oObject = oContext.getObject();
            
            if (!oObject || !oObject.Pariscode) {
                MessageBox.error("Invalid Paris Code. Please save the entry first.");
                return;
            }

            // Initialize view model if not exists
            var oViewModel = oView.getModel("viewModel");
            if (!oViewModel) {
                oViewModel = new JSONModel({
                    busy: false,
                    hasImages: false,
                    images: [],
                    preview: {
                        visible: false,
                        src: "",
                        fileName: ""
                    },
                    currentObject: null,
                    selectedFile: null
                });
                oView.setModel(oViewModel, "viewModel");
            }

            oViewModel.setProperty("/currentObject", oObject);
            oViewModel.setProperty("/preview", {
                visible: false,
                src: "",
                fileName: ""
            });
            oViewModel.setProperty("/selectedFile", null);

            // Open upload dialog
            var that = this;
            if (!this._pUploadDialog) {
                this._pUploadDialog = Fragment.load({
                    id: oView.getId(),
                    name: "customer.porky.zmmparisxref2.ext.fragment.UploadImageDialog",
                    controller: this
                }).then(function(oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this._pUploadDialog.then(function(oDialog) {
                oDialog.open();
                that.getView().byId("unitSelect").setSelectedKey("CS");
                that.getView().byId("unitSelect").setEnabled(false);

            });
        },

        _directUpload: function(sUnit) {
 var oView = this.base.getView();
    var oContext = oView.getBindingContext();

    if (!oContext) {
        MessageBox.error("Please select or create an entry first to upload an image");
        return;
    }

    var oObject = oContext.getObject();

    if (!oObject || !oObject.Pariscode) {
        MessageBox.error("Invalid Paris Code. Please save the entry first.");
        return;
    }

    var that = this;
    var sPariscode = oObject.Pariscode;

    // Remove any previous hidden input
    var oOldInput = document.getElementById("__parisHiddenFileInput");
    if (oOldInput) {
        oOldInput.parentNode.removeChild(oOldInput);
    }

    // Create file input and attach to DOM (required for iPad/Safari)
    var oFileInput = document.createElement("input");
    oFileInput.type = "file";
    oFileInput.id = "__parisHiddenFileInput";
    oFileInput.accept = "image/*";  // "image/*" allows camera capture on iOS
 //   oFileInput.capture = "environment"; // Hints camera on mobile devices
    oFileInput.style.position = "fixed";
    oFileInput.style.top = "-9999px";
    oFileInput.style.left = "-9999px";
    oFileInput.style.opacity = "0";
    document.body.appendChild(oFileInput);

    oFileInput.addEventListener("change", function(evt) {
        var oFile = evt.target.files[0];

        // Cleanup: remove from DOM
        if (oFileInput.parentNode) {
            oFileInput.parentNode.removeChild(oFileInput);
        }

        if (!oFile) {
            return;
        }

        // Validate file type
        var aValidTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/bmp", "image/heic", "image/heif"];
        if (aValidTypes.indexOf(oFile.type) === -1) {
            MessageBox.error("Invalid file type. Please select an image file (JPG, PNG, GIF, BMP)");
            return;
        }

        // Validate file size (5MB)
        // if (oFile.size > 5 * 1024 * 1024) {
        //     MessageBox.error("File size exceeds 5MB. Please select a smaller file.");
        //     return;
        // }

        // Upload directly
        var sSlug = sPariscode + ";" + sUnit;
        sap.ui.core.BusyIndicator.show(0);

        var sToken = that._getCSRFToken();
        if (!sToken) {
            sap.ui.core.BusyIndicator.hide();
            MessageBox.error("Failed to retrieve CSRF token. Please refresh the page and try again.");
            return;
        }

        var sUploadUrl = "/sap/opu/odata/sap/ZODATA_PARISXREF_SRV/PARIS_IMAGESSet";

        var oReader = new FileReader();
        oReader.onload = function(e) {
            jQuery.ajax({
                url: sUploadUrl,
                type: "POST",
                processData: false,
                contentType: oFile.type || "application/octet-stream",
                data: e.target.result,
                headers: {
                    "X-CSRF-Token": sToken,
                    "slug": sSlug,
                    "Accept": "application/json"
                },
                success: function() {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("Image uploaded successfully for unit: " + sUnit);
                    that._refreshImageList();
                    var oBindingContext = oView.getBindingContext();
                    if (oBindingContext) {
                        oBindingContext.refresh();
                        oBindingContext.requestObject().then(function(oUpdatedObject) {
                            var oViewModel = oView.getModel("viewModel");
                            if (oViewModel) {
                                oViewModel.setProperty("/currentObject", oUpdatedObject);
                            }
                        });
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    sap.ui.core.BusyIndicator.hide();
                    var sErrorMsg = "Upload failed";
                    try {
                        var oError = JSON.parse(jqXHR.responseText);
                        if (oError.error && oError.error.message) {
                            sErrorMsg = oError.error.message.value || oError.error.message;
                        }
                    } catch (ex) {
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

        oReader.readAsArrayBuffer(oFile);
    });

    // Small delay for iPad Safari to register the DOM element
    setTimeout(function() {
        oFileInput.click();
    }, 100);
},
        UploadImage: function() {
            var oView = this.base.getView();
            var oContext = oView.getBindingContext();
            
            if (!oContext) {
                MessageBox.error("Please select or create an entry first to upload an image");
                return;
            }

            var oObject = oContext.getObject();
            
            if (!oObject || !oObject.Pariscode) {
                MessageBox.error("Invalid Paris Code. Please save the entry first.");
                return;
            }

            // Initialize view model if not exists
            var oViewModel = oView.getModel("viewModel");
            if (!oViewModel) {
                oViewModel = new JSONModel({
                    busy: false,
                    hasImages: false,
                    images: [],
                    preview: {
                        visible: false,
                        src: "",
                        fileName: ""
                    },
                    currentObject: null,
                    selectedFile: null
                });
                oView.setModel(oViewModel, "viewModel");
            }

            oViewModel.setProperty("/currentObject", oObject);
            oViewModel.setProperty("/preview", {
                visible: false,
                src: "",
                fileName: ""
            });
            oViewModel.setProperty("/selectedFile", null);

            // Open upload dialog
            var that = this;
            if (!this._pUploadDialog) {
                this._pUploadDialog = Fragment.load({
                    id: oView.getId(),
                    name: "customer.porky.zmmparisxref2.ext.fragment.UploadImageDialog",
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

        showImage: function() {
            var oView = this.base.getView();
            var oContext = oView.getBindingContext();
            
            if (!oContext) {
                MessageBox.error("Please select an entry first to view images");
                return;
            }

            var oObject = oContext.getObject();
            
            if (!oObject || !oObject.Pariscode) {
                MessageBox.error("Invalid Paris Code.");
                return;
            }

            var oViewModel = oView.getModel("viewModel");
            if (!oViewModel) {
                oViewModel = new JSONModel({
                    busy: false,
                    hasImages: false,
                    images: [],
                    preview: {
                        visible: false,
                        src: "",
                        fileName: ""
                    },
                    currentObject: null,
                    selectedFile: null
                });
                oView.setModel(oViewModel, "viewModel");
            }

            oViewModel.setProperty("/currentObject", oObject);

            var that = this;
            if (!this._pImageDialog) {
                this._pImageDialog = Fragment.load({
                    id: oView.getId(),
                    name: "customer.porky.zmmparisxref2.ext.fragment.ShowImageDialog",
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
            var oView = this.base.getView();
            var oImageModel = oView.getModel("imageService");
            
            if (!oImageModel) {
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
            var oView = this.base.getView();
            var oViewModel = oView.getModel("viewModel");
            
            if (!oViewModel) {
                return;
            }
            
            var oCurrentObject = oViewModel.getProperty("/currentObject");
            if (!oCurrentObject || !oCurrentObject.Pariscode) {
                return;
            }
            
            var sPariscode = oCurrentObject.Pariscode;
            var oImageModel = this._getImageModel();
            
            oViewModel.setProperty("/busy", true);
 console.log("Image Started....")
            var sPath = "/PARIS_IMAGESSet";
            var aFilters = [
                new sap.ui.model.Filter("Pariscode", sap.ui.model.FilterOperator.EQ, sPariscode)
            ];

            oImageModel.read(sPath, {
                filters: aFilters,
                success: function(oData) {

                    
``
                    var aImages = oData.results.map(function(oImage) {
                        var sImageUrl = "/sap/opu/odata/sap/ZODATA_PARISXREF_SRV/PARIS_IMAGESSet(" +
                                      "Pariscode='" + oImage.Pariscode + "'," +
                                      "Uom='" + oImage.Uom + "'," +
                                      "Imageitem=" + oImage.Imageitem + ")/$value";
                          var sImageUrlThumb = "/sap/opu/odata/sap/ZODATA_PARISXREF_SRV/PARIS_IMAGESThumpSet(" +
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
                            ThumbnailUrl: sImageUrlThumb
                        };
                    });
                    
                    oViewModel.setProperty("/images", aImages);
                    oViewModel.setProperty("/hasImages", aImages.length > 0);
                    oViewModel.setProperty("/busy", false);

                     console.log("Image Success...."+oData.results.length)
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

        // ... rest of your methods (onFileChange, onUploadPress, etc.) ...

        _getFileFromUploader: function(oFileUploader) {
            var oFile = null;
            
            try {
                var oDomRef = oFileUploader.oFileUpload;
                
                if (!oDomRef) {
                    oDomRef = document.getElementById(oFileUploader.getId() + "-fu");
                }
                
                if (!oDomRef) {
                    oDomRef = jQuery.sap.domById(oFileUploader.getId() + "-fu");
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
            var oViewModel = this.base.getView().getModel("viewModel");
            
            if (sFileName) {
                var oFile = this._getFileFromUploader(oFileUploader);

                if (oFile) {
                    var sFileType = oFile.type;
                    var aValidTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/bmp"];
                    
                    if (aValidTypes.indexOf(sFileType) === -1) {
                        MessageBox.error("Invalid file type. Please select an image file (JPG, PNG, GIF, BMP)");
                        oFileUploader.clear();
                        oViewModel.setProperty("/preview/visible", false);
                        oViewModel.setProperty("/selectedFile", null);
                        return;
                    }

                    var nMaxSize = 5 * 1024 * 1024;
                    if (oFile.size > nMaxSize) {
                        MessageBox.error("File size exceeds 5MB. Please select a smaller file.");
                        oFileUploader.clear();
                        oViewModel.setProperty("/preview/visible", false);
                        oViewModel.setProperty("/selectedFile", null);
                        return;
                    }

                    oViewModel.setProperty("/selectedFile", oFile);

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
                    oViewModel.setProperty("/selectedFile", null);
                }
            } else {
                oViewModel.setProperty("/preview/visible", false);
                oViewModel.setProperty("/selectedFile", null);
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
            var oView = this.base.getView();
            var oViewModel = oView.getModel("viewModel");
            var oUnitSelect = oView.byId("unitSelect");
            
            var oSelectedFile = oViewModel.getProperty("/selectedFile");
            if (!oSelectedFile) {
                MessageBox.error("Please select an image file first");
                return;
            }

            var sUnit = oUnitSelect.getSelectedKey();
            if (!sUnit) {
                MessageBox.error("Please select a unit");
                return;
            }

            var oCurrentObject = oViewModel.getProperty("/currentObject");
            var sPariscode = oCurrentObject.Pariscode;
            var sSlug = sPariscode + ";" + sUnit;

            var that = this;

            sap.ui.core.BusyIndicator.show(0);

            var sToken = this._getCSRFToken();
            
            if (!sToken) {
                sap.ui.core.BusyIndicator.hide();
                MessageBox.error("Failed to retrieve CSRF token. Please refresh the page and try again.");
                return;
            }

            var sServiceUrl = "/sap/opu/odata/sap/ZODATA_PARISXREF_SRV/";
            var sUploadUrl = sServiceUrl + "PARIS_IMAGESSet";

            var oReader = new FileReader();
            
            oReader.onload = function(e) {
                var arrayBuffer = e.target.result;

                jQuery.ajax({
                    url: sUploadUrl,
                    type: "POST",
                    processData: false,
                    contentType: oSelectedFile.type || "application/octet-stream",
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
                        // Refresh the image list after successful upload
                        that._refreshImageList();
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

            oReader.readAsArrayBuffer(oSelectedFile);
        },

        onCancelUpload: function() {
            var oView = this.base.getView();
            var oFileUploader = oView.byId("fileUploader");
            var oViewModel = oView.getModel("viewModel");
            
            if (oFileUploader) {
                oFileUploader.clear();
            }

            oViewModel.setProperty("/selectedFile", null);
            oViewModel.setProperty("/preview", {
                visible: false,
                src: "",
                fileName: ""
            });

            this._pUploadDialog.then(function(oDialog) {
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
        },

        onCloseImageDialog: function() {
            this._pImageDialog.then(function(oDialog) {
                oDialog.close();
            });
        },
        // ─────────────────────────────────────────────────────────────────────
// ADD THESE METHODS to your existing ObjectPageExt.controller.js
// ─────────────────────────────────────────────────────────────────────
//
// Also add these two requires at the top of your sap.ui.define([...]):
//   "sap/ui/core/Fragment",
//   "sap/ui/model/json/JSONModel"
// And add Fragment, JSONModel to the function parameters accordingly.
// ─────────────────────────────────────────────────────────────────────

        /**
         * Called when user clicks the thumbnail image in the Images table row.
         *
         * Wire this in your existing UploadImageCS / UploadImageEA handlers,
         * OR directly hook it to the table's selectionChange / press event.
         *
         * The simplest hook: in your table's LineItem, the GetThumpUrl cell
         * (annotated IsImageURL) renders as sap.m.Image. Its press bubbles up
         * to the table's itemPress. Use the handler below.
         *
         * @param {sap.ui.base.Event} oEvent  - itemPress from the ResponsiveTable
         *                                      OR press from the Image control
         */
        onImageRowPress: function (oEvent) {
            // Works for both table itemPress and direct Image press
            var oCtx = oEvent.getParameter("listItem")
                ? oEvent.getParameter("listItem").getBindingContext()
                : oEvent.getSource().getBindingContext();

            if (!oCtx) { return; }

            var oData = oCtx.getObject();

            // Use full-size GetUrl for display; fall back to thumbnail
            var sImageUrl  = oData.GetUrl  || oData.GetThumpUrl || "";
            var sImageName = oData.ImageName || ("Image " + oData.Imageitem);

            this._openImagePreview(sImageUrl, sImageName);
        },

        _openImagePreview: function (sImageUrl, sImageName) {
            var oView = this.base.getView();

            // Set a tiny JSONModel so the Dialog binds title + src
            var oModel = oView.getModel("previewModel");
            if (!oModel) {
                oModel = new sap.ui.model.json.JSONModel();
                oView.setModel(oModel, "previewModel");
            }
            oModel.setData({ imageUrl: sImageUrl, imageName: sImageName });

            if (!this._oImagePreviewDialog) {
                sap.ui.core.Fragment.load({
                    id: oView.getId() + "--imgpreview",
                    name: "customer.porky.zmmparisxref2.ext.fragment.ImagePreview",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    this._oImagePreviewDialog = oDialog;
                    oDialog.open();
                }.bind(this));
            } else {
                this._oImagePreviewDialog.open();
            }
        },

        onImagePreviewClose: function () {
            if (this._oImagePreviewDialog) {
                this._oImagePreviewDialog.close();
            }
        }


    });
});