(function () {
    "use strict";

    /* controller for custom card  */
    // Controller : https://ui5.sap.com/#/topic/121b8e6337d147af9819129e428f1f75
    // controller class name can be like app.ovp.ext.customList.CustomList where app.ovp can be replaced with your application namespace
    sap.ui.define([], function () {
        return {
            onInit: function () {
                this.GloabalEventBus = sap.ui.getCore().getEventBus();
                this.GloabalEventBus.subscribe("OVPGlobalfilter", "OVPGlobalFilterSeacrhfired", this.onGlobalfilterApply.bind(this));

                var obj = {};
                obj.CentralBlock = false;
                obj.CrossPlantBlock = false;
                obj.CrossPlantStatusValidityDate = null;
                obj.Material = "";
                obj.Companydivision = "";
                obj.CrossSalesorgBlock = false;
                obj.CrossSorgStatusValidityDate = null;
                obj.Blocktype = "";
                obj.CrossPlantStatusValidityDate = null;
                obj.Purchstatusvaldt = null;
                obj.Salesstatusvaldt = null;

                this.getView().setModel(new sap.ui.model.json.JSONModel(obj), "mainModel");
            },
            fetchInitialValue : function(material){

                var that = this;
                  var mainService = this.getOwnerComponent().getModel("ZODATA_MATERIAL_BLOCKS_SRV_01");

                  mainService.read("/matblockheadSet('0000000000000"+material+"')",  {
                    success: function (result) {
                      // everything is OK 
                      that.getView().setBusy(false);
                     
                        // that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(path +
                        // "/Statusmessage", result);
                        that.getView().setModel(new sap.ui.model.json.JSONModel(result), "mainModel");
                    
                     
                      
          
          
                    },
                    error: function (err) {
                      // some error occuerd 
                      that.getView().setBusy(false);
          
          
          
                      if(JSON.parse(err.responseText).error.message.value){
                        sap.m.MessageBox.error(JSON.parse(err.responseText).error.message.value );
          
                      }else{
                        sap.m.MessageBox.error("There is an issue in creating new visit. Please check data and try again." );
                      }
          
                      
          
                    }
                  }
          
                  );
            },
            pressBlockButtonC: function(oEvent){

                if(oEvent.getSource().getText()  === 'Unblocked'){
                this.getView().getModel("mainModel").setProperty("/CentralBlock", true)
                }else{
                    this.getView().getModel("mainModel").setProperty("/CentralBlock", false)

                }

           //     debugger;
            },
            pressBlockButtonXP: function(oEvent){

                if(oEvent.getSource().getText()  === 'Unblocked'){
                this.getView().getModel("mainModel").setProperty("/CrossPlantBlock", true)
                }else{
                    this.getView().getModel("mainModel").setProperty("/CrossPlantBlock", false)

                }

           //     debugger;


            },       pressBlockButtonXS: function(oEvent){





                if(oEvent.getSource().getText()  === 'Unblocked'){
                this.getView().getModel("mainModel").setProperty("/CrossSalesorgBlock", true)
                }else{
                    this.getView().getModel("mainModel").setProperty("/CrossSalesorgBlock", false)

                }

           //     debugger;
            },
            pressBlockButtonP: function(oEvent){

                if(oEvent.getSource().getBindingContext().getObject().PlantBlock === true){
                this.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(oEvent.getSource().getBindingContext().getPath() +
                            "/PlantBlock", false)
                }else{
                    this.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(oEvent.getSource().getBindingContext().getPath() +
                    "/PlantBlock", true)
                }
           //     debugger;
            },
            pressBlockButtonS: function(oEvent){

                if(oEvent.getSource().getBindingContext().getObject().SalesOrgBlock === true){
                this.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(oEvent.getSource().getBindingContext().getPath() +
                            "/SalesOrgBlock", false)
                }else{
                    this.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(oEvent.getSource().getBindingContext().getPath() +
                    "/SalesOrgBlock", true)
                }
           //     debugger;
            },
            onGlobalfilterApply: function (oEvent) {

                //   this.getView().byId("ZCMM_MATDASH_BLOCKSType").rebindTable();
                var filterData = this.getView().getParent().getComponentData().mainComponent.getGlobalFilter().getFilterData();
                var Material = filterData.Material;
                var oFilter = new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.EQ, Material);
                this.getView().byId("ZCMM_MATDASH_BLOCKSTable").getBinding("rows").filter([oFilter]);

                this.fetchInitialValue(Material);
            },
            onAfterRendering: function () {
                //   this.getView().byId("ZCMM_MATDASH_BLOCKSType").rebindTable();

                var filterData = this.getView().getParent().getComponentData().mainComponent.getGlobalFilter().getFilterData();
                var Material = filterData.Material;
                var oFilter = new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.EQ, Material);
                this.getView().byId("ZCMM_MATDASH_BLOCKSTable").getBinding("rows").filter([oFilter]);

                this.fetchInitialValue(Material);
            },

            onExit: function () {},


            onBeforeRebindTable: function (oEvent) {


                var binding = oEvent.getParameter("bindingParams");



                var filterData = this.getView().getParent().getComponentData().mainComponent.getGlobalFilter().getFilterData();
                var Material = filterData.Material;


                if (typeof Material === 'undefined') {
                    return;
                }

                this.fetchInitialValue(Material);



                var oFilter = new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.EQ, Material);
                binding.filters.push(oFilter);

            },

            onPurchStatusSelection: function (oEvent) {
                var purchStatus = oEvent.mParameters.selectedItem.getBindingContext().getObject().PurchasingMaterialStatus;

                var table = this.getView().byId("ZCMM_MATDASH_BLOCKSTable").getRows();


                table.forEach(element => {
                    if (element.getBindingContext())
                        this.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getBindingContext().getPath() + "/PurchasingStatus", purchStatus)

                    //   this.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty( element.getBindingContext().getPath()
                    //  +"/SalesStatus",salesStatus)
                });
            //    debugger;
            },
            onSalesStatusSelection: function (oEvent) {

                var salesStatus = oEvent.mParameters.selectedItem.getBindingContext().getObject().SalesMaterialStatus;

                var table = this.getView().byId("ZCMM_MATDASH_BLOCKSTable").getRows();

                table.forEach(element => {
                    if (element.getBindingContext())

                        this.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getBindingContext().getPath() +
                            "/SalesStatus", salesStatus)
                });



            //    debugger;
            },

            onCheckBoxSelected: function (oEvent) {
            //    debugger;

                var table = this.getView().byId("ZCMM_MATDASH_BLOCKSTable").getRows();
                var selected = oEvent.mParameters.selected;
                table.forEach(element => {
                    if (element.getBindingContext())

                        this.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getBindingContext().getPath() +
                            "/CentralBlock", selected)
                    this.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getBindingContext().getPath() +
                        "/SalesOrgBlock", selected)
                    this.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getBindingContext().getPath() +
                        "/PlantBlock", selected)

                });
            },
            onValidPurchaseDate: function (oEvent) {

            //    debugger;
                var table = this.getView().byId("ZCMM_MATDASH_BLOCKSTable").getRows();
                var selected = oEvent.getSource().getDateValue()
                table.forEach(element => {
                    if (element.getBindingContext())

                        this.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getBindingContext().getPath() +
                            "/AllPurchStatusDate", selected)


                });
            },
            onValidSalesDate: function (oEvent) {

            //    debugger;
                var table = this.getView().byId("ZCMM_MATDASH_BLOCKSTable").getRows();
                var selected = oEvent.getSource().getDateValue()
                table.forEach(element => {
                    if (element.getBindingContext())

                        this.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getBindingContext().getPath() +
                            "/AllSalesStatusDate", selected)


                });
            },
            onSubmitBlockMaterials: async function (oEvent) {



            //    debugger;

                var rows = this.getView().byId("ZCMM_MATDASH_BLOCKSTable").getBinding("rows").getContexts();

                var that = this;
                var filterData = this.getView().getParent().getComponentData().mainComponent.getGlobalFilter().getFilterData();
                var Material = filterData.Material;

                var headerObject = {};
                headerObject.Material = Material;
                headerObject.Companydivision = this.getView().getModel("mainModel").getProperty("/division");
                headerObject.Allblock = this.getView().getModel("mainModel").getProperty("/allBlock");
                headerObject.Purchstatus = this.getView().getModel("mainModel").getProperty("/purchStatus");
                headerObject.Purchstatusvaldt = this.getView().getModel("mainModel").getProperty("/validPurchaseDate");
                headerObject.Salesstatus = this.getView().getModel("mainModel").getProperty("/salesStatus");
                headerObject.Salesstatusvaldt = this.getView().getModel("mainModel").getProperty("/salesDate");
               headerObject.HeadtoItem = [];


                var mainService = this.getOwnerComponent().getModel("ZODATA_MATERIAL_BLOCKS_SRV_01");

                rows.forEach(async element => {

    //                headerObject.HeadtoItem.push(element.getObject())
    //                 headerObject.HeadtoItem.push({

    //                     "Material": Material,
    //   "Plant": element.getObject().Plant,
    //   "SalesOrganization": element.getObject().SalesOrganization,
    //   "MaterialDescription": element.getObject().MaterialDescription,
    //   "CentralBlock": element.getObject().CentralBlock,
    //   "PlantBlock": element.getObject().PlantBlock,
    //   "SalesOrgBlock": element.getObject().SalesOrgBlock,
    //   "AllPurchStatus":element.getObject().AllPurchStatus,
    //   "AllPurchStatusDate": element.getObject().AllPurchStatusDate,
    //   "AllSalesStatus": element.getObject().AllSalesStatus,
    //   "AllSalesStatusDate": element.getObject().AllSalesStatusDate,
    //   "PurchasingStatus": element.getObject().PurchasingStatus,
    //   "PurchStatusValidityDate": element.getObject().PurchStatusValidityDate,
    //   "SalesStatus": element.getObject().SalesStatus,
    //   "SalesStatusValidityDate": element.getObject().SalesStatusValidityDate,
    //   "OpenPo": element.getObject().OpenPo,
    //   "Inventory": element.getObject().Inventory,
    //   "FollowupMaterial": element.getObject().FollowupMaterial,
    //   "EffectiveDate": element.getObject().EffectiveDate

    //                 })

                  
    // await this.awaitFunction(element.getObject(),element.sPath);
   await that.submitMatChanges(element.getObject(),element.sPath);
                   
                });







                




               


                that.getView().setBusy(true);
     







            },

       
            submitMatChanges: async function(obj1,path){





                var that = this;

                return new Promise(async function(resolve, reject) {
               
                    var mainService = that.getOwnerComponent().getModel("ZODATA_MATERIAL_BLOCKS_SRV_01");

                    var obj = {

                        "Material": obj1.Material,
      "Plant": obj1.Plant,
      "SalesOrganization": obj1.SalesOrganization,
      "MaterialDescription": obj1.MaterialDescription,
      "CentralBlock": obj1.CentralBlock,
      "PlantBlock": obj1.PlantBlock,
      "SalesOrgBlock": obj1.SalesOrgBlock,
      "AllPurchStatus":obj1.AllPurchStatus,
      "AllPurchStatusDate": obj1.AllPurchStatusDate,
      "AllSalesStatus": obj1.AllSalesStatus,
      "AllSalesStatusDate": obj1.AllSalesStatusDate,
      "PurchasingStatus": obj1.PurchasingStatus,
      "PurchStatusValidityDate": obj1.PurchStatusValidityDate,
      "SalesStatus": obj1.SalesStatus,
      "SalesStatusValidityDate": obj1.SalesStatusValidityDate,
      "OpenPo": obj1.OpenPo,
      "Inventory": obj1.Inventory,
      "FollowupMaterial": obj1.FollowupMaterial,
      "EffectiveDate": obj1.EffectiveDate
    
                    };
    
                
                 await   mainService.create("/matblockitemSet", obj, {
                        success: function (result) {
                          // everything is OK 
                          that.getView().setBusy(false);
                         
                            that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(path +
                            "/Statusmessage", result.Statusmessage)
                        
                            resolve();
                         
                          
              
              
                        },
                        error: function (err) {
                          // some error occuerd 
                          that.getView().setBusy(false);
                          resolve();
              
              
              
                          if(JSON.parse(err.responseText).error.message.value){
                            sap.m.MessageBox.error(JSON.parse(err.responseText).error.message.value );
              
                          }else{
                            sap.m.MessageBox.error("There is an issue in creating new visit. Please check data and try again." );
                          }
              
                          
              
                        }
                      }
              
                      );
      
      
      
            
              });


              
               
            },


            onValidateBlockMaterials: function (oEvent) {
                //    debugger;
    
                    var rows = this.getView().byId("ZCMM_MATDASH_BLOCKSTable").getBinding("rows").getContexts();
    
                    var that = this;
                    var filterData = this.getView().getParent().getComponentData().mainComponent.getGlobalFilter().getFilterData();
                    var Material = filterData.Material;
    
                    var headerObject = {};
                    headerObject = this.getView().getModel("mainModel").getData();
                    headerObject.Material = Material;
                    // headerObject.Companydivision = this.getView().getModel("mainModel").getProperty("/division");
                    // // headerObject.Allblock = this.getView().getModel("mainModel").getProperty("/allBlock");
                    // // headerObject.Purchstatus = this.getView().getModel("mainModel").getProperty("/purchStatus");
                    // headerObject.Purchstatusvaldt = this.getView().getModel("mainModel").getProperty("/validPurchaseDate");
                    // // headerObject.Salesstatus = this.getView().getModel("mainModel").getProperty("/salesStatus");
                    // headerObject.Salesstatusvaldt = this.getView().getModel("mainModel").getProperty("/salesDate");
                    // headerObject.Blocktype = this.getView().getModel("mainModel").getProperty("/Blocktype");
                    // headerObject.Action = '';
                  headerObject.HeadtoItem = [];
    
    
                    var mainService = this.getOwnerComponent().getModel("ZODATA_MATERIAL_BLOCKS_SRV_01");
    
    
                //    oEvent.getSource().getCustomData()[0].getKey()
    
                    if(oEvent.getSource().getCustomData()[0].getKey() === 'Validate'){
    
                        headerObject.Action = 'APPLY';
                    }else{
    
                        headerObject.Action = 'SUBMIT';
                    }
    
                    rows.forEach(element => {
    
                    //    headerObject.HeadtoItem.push(element.getObject())
                        headerObject.HeadtoItem.push({
    
                            "Material": Material,
          "Plant": element.getObject().Plant,
          "SalesOrganization": element.getObject().SalesOrganization,
          "MaterialDescription": element.getObject().MaterialDescription,
          "CentralBlock": element.getObject().CentralBlock,
          "PlantBlock": element.getObject().PlantBlock,
          "SalesOrgBlock": element.getObject().SalesOrgBlock,
          "AllPurchStatus":element.getObject().AllPurchStatus,
          "AllPurchStatusDate": element.getObject().AllPurchStatusDate,
          "AllSalesStatus": element.getObject().AllSalesStatus,
          "AllSalesStatusDate": element.getObject().AllSalesStatusDate,
          "PurchasingStatus": element.getObject().PurchasingStatus,
          "PurchStatusValidityDate": element.getObject().PurchStatusValidityDate,
          "SalesStatus": element.getObject().SalesStatus,
          "SalesStatusValidityDate": element.getObject().SalesStatusValidityDate,
          "OpenPo": element.getObject().OpenPo,
          "Inventory": element.getObject().Inventory,
          "FollowupMaterial": element.getObject().FollowupMaterial,
          "EffectiveDate": element.getObject().EffectiveDate
    
                        })
                    });
                   
    
    
                    that.getView().setBusy(true);
                    mainService.create("/matblockheadSet", headerObject, {
                success: function (result) {
                  // everything is OK 
                  that.getView().setBusy(false);
    
    
                  var table = that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getBinding("rows").getContexts();
                //   that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getBinding("rows").filter([]);
    
                  var filterData = that.getView().getParent().getComponentData().mainComponent.getGlobalFilter().getFilterData();
                  var Material = filterData.Material;
                  var oFilter = new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.EQ, Material);
                  that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getBinding("rows").filter([oFilter]);
    
    
                  var count = 0;
                  table.forEach(element => {
    
                    {
                        that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                              "/Material", result.HeadtoItem.results[count].Material                       );
                         that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                              "/Plant", result.HeadtoItem.results[count].Plant);
                     that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                              "/SalesOrganization", result.HeadtoItem.results[count].SalesOrganization);
                         that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                              "/MaterialDescription", result.HeadtoItem.results[count].MaterialDescription);
    
                               that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                              "/CentralBlock", result.HeadtoItem.results[count].CentralBlock);
    
                              that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                              "/PlantBlock", result.HeadtoItem.results[count].PlantBlock);
    
                              that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                              "/SalesOrgBlock", result.HeadtoItem.results[count].SalesOrgBlock);
    
                              that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                              "/AllPurchStatus", result.HeadtoItem.results[count].AllPurchStatus);
    
                              that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                              "/AllPurchStatusDate", result.HeadtoItem.results[count].AllPurchStatusDate);
    
                              that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                              "/AllSalesStatus", result.HeadtoItem.results[count].AllSalesStatus);
    
                              that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                              "/AllSalesStatusDate", result.HeadtoItem.results[count].AllSalesStatusDate);
                              
    
    
    
                              that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                              "/PurchasingStatus", result.HeadtoItem.results[count].PurchasingStatus);
    
                              that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                              "/PurchStatusValidityDate", result.HeadtoItem.results[count].PurchStatusValidityDate);
    
                              that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                              "/SalesStatus", result.HeadtoItem.results[count].SalesStatus);
    
                              that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                              "/SalesStatusValidityDate", result.HeadtoItem.results[count].SalesStatusValidityDate);
    
    
    
    
    
     
                              that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                              "/OpenPo", result.HeadtoItem.results[count].OpenPo);
    
                              that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                              "/Inventory", result.HeadtoItem.results[count].Inventory);
    
                              that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                              "/FollowupMaterial", result.HeadtoItem.results[count].FollowupMaterial);
    
                              that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                              "/EffectiveDate", result.HeadtoItem.results[count].EffectiveDate);
    
                              that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                                "/Statusmessage", result.HeadtoItem.results[count].Statusmessage)
      
      
      
      
                            count ++;
                            }
    
    
                  });
                  
      
      
                },
                error: function (err) {
                  // some error occuerd 
                  that.getView().setBusy(false);           
                  var filterData = that.getView().getParent().getComponentData().mainComponent.getGlobalFilter().getFilterData();
                  var Material = filterData.Material;
                  var oFilter = new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.EQ, Material);
                  that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getBinding("rows").filter([oFilter]);

    
                 
      
      
      
                  if(JSON.parse(err.responseText).error.message.value){
                    sap.m.MessageBox.error(JSON.parse(err.responseText).error.message.value );
      
                  }else{
                    sap.m.MessageBox.error("There is an issue in creating new visit. Please check data and try again." );
                  }
      
                  
      
                }
              }
      
              );
    
    
                },


            onSubmitBlockMaterials1: function (oEvent) {
            //    debugger;

                var rows = this.getView().byId("ZCMM_MATDASH_BLOCKSTable").getBinding("rows").getContexts();

                var that = this;
                var filterData = this.getView().getParent().getComponentData().mainComponent.getGlobalFilter().getFilterData();
                var Material = filterData.Material;

                var headerObject = {};
                headerObject = this.getView().getModel("mainModel").getData();
                headerObject.Material = Material;
                // headerObject.Companydivision = this.getView().getModel("mainModel").getProperty("/division");
                // // headerObject.Allblock = this.getView().getModel("mainModel").getProperty("/allBlock");
                // // headerObject.Purchstatus = this.getView().getModel("mainModel").getProperty("/purchStatus");
                // headerObject.Purchstatusvaldt = this.getView().getModel("mainModel").getProperty("/validPurchaseDate");
                // // headerObject.Salesstatus = this.getView().getModel("mainModel").getProperty("/salesStatus");
                // headerObject.Salesstatusvaldt = this.getView().getModel("mainModel").getProperty("/salesDate");
                // headerObject.Blocktype = this.getView().getModel("mainModel").getProperty("/Blocktype");
                // headerObject.Action = '';
               headerObject.HeadtoItem = [];


                var mainService = this.getOwnerComponent().getModel("ZODATA_MATERIAL_BLOCKS_SRV_01");


            //    oEvent.getSource().getCustomData()[0].getKey()

                if(oEvent.getSource().getCustomData()[0].getKey() === 'Validate'){

                    headerObject.Action = 'APPLY';
                }else{

                    headerObject.Action = 'SUBMIT';
                }

                rows.forEach(element => {

                   // headerObject.HeadtoItem.push(element.getObject())
                    headerObject.HeadtoItem.push({

                        "Material": Material,
      "Plant": element.getObject().Plant,
      "SalesOrganization": element.getObject().SalesOrganization,
      "MaterialDescription": element.getObject().MaterialDescription,
      "CentralBlock": element.getObject().CentralBlock,
      "PlantBlock": element.getObject().PlantBlock,
      "SalesOrgBlock": element.getObject().SalesOrgBlock,
      "AllPurchStatus":element.getObject().AllPurchStatus,
      "AllPurchStatusDate": element.getObject().AllPurchStatusDate,
      "AllSalesStatus": element.getObject().AllSalesStatus,
      "AllSalesStatusDate": element.getObject().AllSalesStatusDate,
      "PurchasingStatus": element.getObject().PurchasingStatus,
      "PurchStatusValidityDate": element.getObject().PurchStatusValidityDate,
      "SalesStatus": element.getObject().SalesStatus,
      "SalesStatusValidityDate": element.getObject().SalesStatusValidityDate,
      "OpenPo": element.getObject().OpenPo,
      "Inventory": element.getObject().Inventory,
      "FollowupMaterial": element.getObject().FollowupMaterial,
      "EffectiveDate": element.getObject().EffectiveDate

                    })
                });
               


                that.getView().setBusy(true);
                mainService.create("/matblockheadSet", headerObject, {
            success: function (result,obj1) {
              // everything is OK 
              that.getView().setBusy(false);


              var table = that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getBinding("rows").getContexts();
            //   that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getBinding("rows").filter([]);

              var filterData = that.getView().getParent().getComponentData().mainComponent.getGlobalFilter().getFilterData();
              var Material = filterData.Material;
              var oFilter = new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.EQ, Material);
              that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getBinding("rows").filter([oFilter]);

                sap.m.MessageBox.success(JSON.parse(obj1.headers["sap-message"]).message              )
              var count = 0;
              table.forEach(element => {

                {
                    that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                          "/Material", result.HeadtoItem.results[count].Material                       );
                     that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                          "/Plant", result.HeadtoItem.results[count].Plant);
                 that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                          "/SalesOrganization", result.HeadtoItem.results[count].SalesOrganization);
                     that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                          "/MaterialDescription", result.HeadtoItem.results[count].MaterialDescription);

                           that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                          "/CentralBlock", result.HeadtoItem.results[count].CentralBlock);

                          that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                          "/PlantBlock", result.HeadtoItem.results[count].PlantBlock);

                          that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                          "/SalesOrgBlock", result.HeadtoItem.results[count].SalesOrgBlock);

                          that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                          "/AllPurchStatus", result.HeadtoItem.results[count].AllPurchStatus);

                          that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                          "/AllPurchStatusDate", result.HeadtoItem.results[count].AllPurchStatusDate);

                          that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                          "/AllSalesStatus", result.HeadtoItem.results[count].AllSalesStatus);

                          that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                          "/AllSalesStatusDate", result.HeadtoItem.results[count].AllSalesStatusDate);
                          



                          that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                          "/PurchasingStatus", result.HeadtoItem.results[count].PurchasingStatus);

                          that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                          "/PurchStatusValidityDate", result.HeadtoItem.results[count].PurchStatusValidityDate);

                          that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                          "/SalesStatus", result.HeadtoItem.results[count].SalesStatus);

                          that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                          "/SalesStatusValidityDate", result.HeadtoItem.results[count].SalesStatusValidityDate);





 
                          that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                          "/OpenPo", result.HeadtoItem.results[count].OpenPo);

                          that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                          "/Inventory", result.HeadtoItem.results[count].Inventory);

                          that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                          "/FollowupMaterial", result.HeadtoItem.results[count].FollowupMaterial);

                          that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                          "/EffectiveDate", result.HeadtoItem.results[count].EffectiveDate);

                          that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getModel().setProperty(element.getPath() +
                            "/Statusmessage", result.HeadtoItem.results[count].Statusmessage)
  
  
  
  
                        count ++;
                        }


              });
              
  
  
            },
            error: function (err) {
              // some error occuerd 
              that.getView().setBusy(false);              
              // that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getBinding("rows").filter([])

              var filterData = that.getView().getParent().getComponentData().mainComponent.getGlobalFilter().getFilterData();
              var Material = filterData.Material;
              var oFilter = new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.EQ, Material);
              that.getView().byId("ZCMM_MATDASH_BLOCKSTable").getBinding("rows").filter([oFilter]);
             
  
  
  
              if(JSON.parse(err.responseText).error.message.value){
                sap.m.MessageBox.error(JSON.parse(err.responseText).error.message.value );
  
              }else{
                sap.m.MessageBox.error("There is an issue in creating new visit. Please check data and try again." );
              }
  
              
  
            }
          }
  
          );


            }
        }
    });
})();