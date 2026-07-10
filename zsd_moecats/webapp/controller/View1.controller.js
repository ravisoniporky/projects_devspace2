sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel"
],
function (Controller, Filter, FilterOperator, JSONModel) {
    "use strict";

    return Controller.extend("customer.porky.zsdmoecats.controller.View1", {
        onInit: function () {

            // if(this.getOwnerComponent().getComponentData().startupParameters.kunwe){
            //     var filter = this.getView().byId("smartFilter_custF4_map");
            //     setTimeout(() => {
            //         filter.setFilterData({'$Parameter.p_kunwe':4000});
                   
            //     }, 500);
            // }

            // if(this.getOwnerComponent().getComponentData().startupParameters.vkorg){
            //     var filter = this.getView().byId("smartFilter_custF4_map");
            //     setTimeout(() => {
            //         filter.setFilterData({'$Parameter.p_vkorg':4000});
                   
            //     }, 500);
            // }


            // if(this.getOwnerComponent().getComponentData().startupParameters.catalog){
            //     var filter = this.getView().byId("smartFilter_custF4_map");
            //     setTimeout(() => {
            //         filter.setFilterData({'$Parameter.p_catalog':'asg'});
                   
            //     }, 500);
            // }

            // if(this.getOwnerComponent().getComponentData().startupParameters.ats){
            //     var filter = this.getView().byId("smartFilter_custF4_map");
            //     setTimeout(() => {
            //         filter.setFilterData({'$Parameter.p_ats':'Y'});
                   
            //     }, 500);
            // }
            var that = this;

            var oViewModel = new JSONModel({ showImageButton: false });
            this.getView().setModel(oViewModel, "viewModel");

            var defaultModel = this.getOwnerComponent().getModel("ZCXA_USERDEFAULT_CDS");
            defaultModel.read("/ZCXA_USERDEFAULT", {
                filters: [new Filter("parid", FilterOperator.EQ, "ZCATALOGIMAGE")],
                success: function(oData) {
                    var bVisible = false;
                    if (oData.results && oData.results.length > 0) {
                        var sValue = oData.results[0].parva;
                        bVisible = (sValue === "H" || sValue === "V");
                    }
                    that.getView().getModel("viewModel").setProperty("/showImageButton", bVisible);
                },
                error: function() {
                    that.getView().getModel("viewModel").setProperty("/showImageButton", false);
                }
            });

            if(this.getOwnerComponent().getComponentData().startupParameters.itemproposal && this.getOwnerComponent().getComponentData().startupParameters.ats
            && this.getOwnerComponent().getComponentData().startupParameters.catalog && this.getOwnerComponent().getComponentData().startupParameters.vkorg
            && this.getOwnerComponent().getComponentData().startupParameters.kunwe){
                var filter = this.getView().byId("smartFilter_custF4_map");
                setTimeout(() => {
                    // if(that.getView().byId("smartFilter_custF4_map")._bIsInitialized                ){
                    filter.setFilterData({'$Parameter.p_itemproposal':that.getOwnerComponent().getComponentData().startupParameters.itemproposal[0]});
                    filter.setFilterData({'$Parameter.p_ats':that.getOwnerComponent().getComponentData().startupParameters.ats[0]});
                    filter.setFilterData({'zcatalog':that.getOwnerComponent().getComponentData().startupParameters.catalog[0]});
                    filter.setFilterData({'$Parameter.p_vkorg':that.getOwnerComponent().getComponentData().startupParameters.vkorg[0]});
                    filter.setFilterData({'$Parameter.p_kunwe':that.getOwnerComponent().getComponentData().startupParameters.kunwe[0]});
                    that.getView().byId("smartTable_custF4_map").rebindTable();
                    
                   
                }, 1000);
            }

        },
        onBeforeRebindTable: function(oEvent){




            var filterData = this.getView().byId("smartFilter_custF4_map").getFilterData()            ;
            var p_kunwe = filterData['$Parameter.p_kunwe'];
            var p_vkorg = filterData['$Parameter.p_vkorg'];
            var p_catalog = filterData['zcatalog'];
            var p_ats = filterData['$Parameter.p_ats'];
            var p_itemproposal = filterData['$Parameter.p_itemproposal'];





            
            var stringPath = "/ZCSD_E_MobileItemList(p_vkorg='" + p_vkorg +"',p_kunwe='"+p_kunwe+"',p_ats='"+p_ats+"',p_itemproposal='"+p_itemproposal+"')/Set";

            stringPath= (stringPath);
            oEvent.getSource().setTableBindingPath(stringPath);


        },




        onUploadImage: function(oEvent) {
    var oButton = oEvent.getSource();
    this.currentUploadButton = oButton;
    var oContext = oButton.getBindingContext();
    var oldMaterial = oContext.getObject().BISMT;
    
    if (!oldMaterial) {
        sap.m.MessageBox.error("Old Material number is not available");
        return;
    }
    
    this.currentOldMaterial = oldMaterial;
    
    // Create file uploader dialog
    if (!this.imageUploadDialog) {
        this.imageUploadDialog = new sap.m.Dialog({
            title: "Upload Image for Material: " + oldMaterial,
            contentWidth: "500px",
            contentHeight: "400px",
            resizable: true,
            content: [
                new sap.m.VBox({
                    items: [
                        new sap.m.Label({
                            text: "Select an image file (JPG, PNG)",
                            design: "Bold"
                        }).addStyleClass("sapUiTinyMargin"),
                        new sap.ui.unified.FileUploader({
                            id: "fileUploader",
                            name: "imageFile",
                            uploadUrl: "upload",
                            fileType: ["jpg", "jpeg", "png"],
                            maximumFileSize: 5,
                            change: this.onFileChange.bind(this),
                            uploadComplete: function() {},
                            width: "100%"
                        }).addStyleClass("sapUiTinyMargin"),
                        new sap.m.Image({
                            id: "imagePreview",
                            visible: false,
                            width: "100%",
                            height: "250px",
                            mode: "Image"
                        }).addStyleClass("sapUiTinyMarginTop"),
                        new sap.m.CheckBox({
                            id: "forceCheckbox",
                            text: "Force upload (override validation)",
                            visible: false
                        }).addStyleClass("sapUiTinyMargin")
                    ]
                }).addStyleClass("sapUiTinyMarginBegin")
            ],
            beginButton: new sap.m.Button({
                text: "Upload",
                type: "Emphasized",
                enabled: false,
                press: this.onConfirmUpload.bind(this)
            }),
            endButton: new sap.m.Button({
                text: "Cancel",
                press: function() {
                    this.imageUploadDialog.close();
                    this.resetUploadDialog();
                }.bind(this)
            }),
            afterClose: function() {
                this.resetUploadDialog();
            }.bind(this)
        });
        this.getView().addDependent(this.imageUploadDialog);
    } else {
        this.imageUploadDialog.setTitle("Upload Image for Material: " + oldMaterial);
    }
    
    this.imageUploadDialog.open();
},



onConfirmUpload: function() {
    if (!this.currentImageData || !this.currentOldMaterial) {
        sap.m.MessageBox.error("Missing image data or material number");
        return;
    }
    
    var forceCheckbox = sap.ui.getCore().byId("forceCheckbox");
    var forceUpload = forceCheckbox.getVisible() && forceCheckbox.getSelected();
    
    var payload = {
        matnum: this.currentOldMaterial,
        imageData: this.currentImageData,
        force: forceUpload
    };
    
    this.imageUploadDialog.setBusy(true);
    
    // Make API call
    jQuery.ajax({
        url: "https://api.porky.com/mb/image_upload",
        type: "POST",
        headers: {
        'X-PORKY-SYSID': 'PRD',
        'X-PORKY-APPID': 'Catalog Maint',
        'Authorization': 'Basic YmF0Y2h1c2VyOnBvcmt5c2Fw',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-PORKY-APIKEY':'6bb0b04a-0466-490e-a8a5-53278b3df025',
        'X-PORKY-AUTH':'YmF0Y2h1c2VyOnBvcmt5c2Fw'
    },
        contentType: "application/json",
        
        data: JSON.stringify(payload),
        success: function(response) {
            this.imageUploadDialog.setBusy(false);
            this.imageUploadDialog.close();
            sap.m.MessageBox.success("Image uploaded successfully for material: " + this.currentOldMaterial);

            // Force-refresh image in the row by appending cache-busting timestamp
            var sCacheBustUrl = "https://api.porky.com/images/" + this.currentOldMaterial + ".png?t=" + Date.now();
            try {
                var oHBox = this.currentUploadButton.getParent();
                var oImage = oHBox.getItems()[0];
                oImage.setSrc(sCacheBustUrl);
                oImage.getDetailBox().getImageContent()[0].setImageSrc(sCacheBustUrl);
            } catch (e) {}

            this.resetUploadDialog();
        }.bind(this),
        error: function(xhr) {
            this.imageUploadDialog.setBusy(false);
            
            try {
                var errorResponse = JSON.parse(xhr.responseText);
                
                if (errorResponse.optional && !forceCheckbox.getVisible()) {
                    // Show force option for optional validation errors
                    forceCheckbox.setVisible(true);
                    sap.m.MessageBox.warning(
                        errorResponse.message + "\n\nYou can check 'Force upload' to override this validation.",
                        {
                            title: "Validation Error"
                        }
                    );
                } else {
                    // Hard error or already tried forcing
                    sap.m.MessageBox.error(
                        errorResponse.message || "Failed to upload image",
                        {
                            title: "Upload Error"
                        }
                    );
                }
            } catch (e) {
                sap.m.MessageBox.error("Failed to upload image. Please try again.");
            }
        }.bind(this)
    });
},

resetUploadDialog: function() {

    var fileUploader = sap.ui.getCore().byId("fileUploader");
    var imagePreview = sap.ui.getCore().byId("imagePreview");
    var forceCheckbox = sap.ui.getCore().byId("forceCheckbox");
    
    if (fileUploader) {
        fileUploader.clear();
    }
    if (imagePreview) {
        imagePreview.setSrc("");
        imagePreview.setVisible(false);
    }
    if (forceCheckbox) {
        forceCheckbox.setSelected(false);
        forceCheckbox.setVisible(false);
    }
    
    this.imageUploadDialog.getBeginButton().setEnabled(false);
    this.currentImageData = null;
    this.currentOldMaterial = null;
    this.currentUploadButton = null;
},

onFileChange: function(oEvent) {
    var oFileUploader = sap.ui.getCore().byId("fileUploader");
    var file = oEvent.getParameter("files")[0];
    
    if (!file) {
        this.resetUploadDialog();
        return;
    }
    
    // Validate file type
    var validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
        sap.m.MessageBox.error("Please select a valid image file (JPG or PNG)");
        this.resetUploadDialog();
        return;
    }
    
    // Validate file size (5MB)
    // if (file.size > 5242880) {
    //     sap.m.MessageBox.error("File size should not exceed 5MB");
    //     this.resetUploadDialog();
    //     return;
    // }
    
    // Read file and convert to base64
    var reader = new FileReader();
    reader.onload = function(e) {
        var base64String = e.target.result;
        this.currentImageData = base64String.split(',')[1]; // Remove data:image/jpeg;base64, prefix
        
        // Show preview
        var imagePreview = sap.ui.getCore().byId("imagePreview");
        imagePreview.setSrc(base64String);
        imagePreview.setVisible(true);
        
        // Enable upload button
        this.imageUploadDialog.getBeginButton().setEnabled(true);
    }.bind(this);
    
    reader.readAsDataURL(file);
},
    });
});
