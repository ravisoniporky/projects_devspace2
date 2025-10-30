const delay = ms => new Promise(res => setTimeout(res, ms));

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/Dialog",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
  ],
  function (Controller, Dialog, JSONModel, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("customer.porky.zmmcatalogmnt.controller.View1", {
      onInit: function () {

        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.getRoute("RouteView1").attachMatched(this._onRouteMatched, this);

        var that = this;
        
        setTimeout(() => {
           that.fetchURLParameters();
        }, 500);

       
         


        


      },



          fetchURLParameters: function (oEvent) {

            this.isSalesOrgParam = "";
            this.isOrgDivParam = "";
            this.isDistChannelParam = "";
            var that = this;

                if(this.getOwnerComponent().getComponentData().startupParameters && this.getOwnerComponent().getComponentData().startupParameters.SalesOrganization 
                && this.getOwnerComponent().getComponentData().startupParameters.SalesOrganization[0]  )
                {


                that.getView().byId("smartFilter_custF4_map").setFilterData({
                  "SalesOrganization": this.getOwnerComponent().getComponentData().startupParameters.SalesOrganization[0]

                });

              

                }
        
          
                if(this.getOwnerComponent().getComponentData().startupParameters && this.getOwnerComponent().getComponentData().startupParameters.OrganizationDivision 
                && this.getOwnerComponent().getComponentData().startupParameters.OrganizationDivision[0]  )
                {


                that.getView().byId("smartFilter_custF4_map").setFilterData({
                  "OrganizationDivision": this.getOwnerComponent().getComponentData().startupParameters.OrganizationDivision[0]

                });

              

                }





                                if(this.getOwnerComponent().getComponentData().startupParameters && this.getOwnerComponent().getComponentData().startupParameters.DistributionChannel 
                && this.getOwnerComponent().getComponentData().startupParameters.DistributionChannel[0]  )
                {


                that.getView().byId("smartFilter_custF4_map").setFilterData({
                  "DistributionChannel": this.getOwnerComponent().getComponentData().startupParameters.DistributionChannel[0]

                });

              

                }


                                                if(this.getOwnerComponent().getComponentData().startupParameters && this.getOwnerComponent().getComponentData().startupParameters.CatalogId 
                && this.getOwnerComponent().getComponentData().startupParameters.CatalogId[0]  )
                {


                that.getView().byId("smartFilter_custF4_map").setFilterData({
                  "CatalogId": this.getOwnerComponent().getComponentData().startupParameters.CatalogId[0]

                });

              

                }




        let defaultModel = this.getOwnerComponent().getModel("ZCXA_USERDEFAULT_CDS");
        var that = this;
        defaultModel.read("/ZCXA_USERDEFAULT", {
          success: function (oData, oResponse) {


            var salesorg = oData.results.find(element => element.parid === "VKO"); // Sales Org
            var division = oData.results.find(element => element.parid === "SPA"); // Division
            var kna1Para = oData.results.find(element => element.parid === "VTW"); // Distribution Channel



            setTimeout(() => {


              if(!that.isSalesOrgParam ){
              if (typeof salesorg !== "undefined") {

                that.getView().byId("smartFilter_custF4_map").setFilterData({
                  "SalesOrganization": salesorg.parva

                });

              }
            }


              if(!that.isOrgDivParam ){

              if (typeof division !== "undefined") {

                that.getView().byId("smartFilter_custF4_map").setFilterData({
                  "OrganizationDivision": division.parva

                });

              } else {
                that.getView().byId("smartFilter_custF4_map").setFilterData({
                  "OrganizationDivision": "01"

                });
              }
            }

                          if(!that.isDistChannelParam ){


              if (typeof kna1Para !== "undefined") {

                that.getView().byId("smartFilter_custF4_map").setFilterData({
                  "DistributionChannel": kna1Para.parva

                });

              } else {
                that.getView().byId("smartFilter_custF4_map").setFilterData({
                  "DistributionChannel": "01"

                });

              }
            }

              that.getView().byId("smartFilter_custF4_map").validateMandatoryFields();
              that.getView().byId("smartTable_custF4_map").rebindTable();


            }, 500);






          },

          error: function (oError) {}
        });
      },


      onCreateCatalog: function(oEvent){

        var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); // get a handle on the global XAppNav service

   
        var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
        target: {
        semanticObject: "CatalogMaintenance",
        action: "ZRAP&/ZRSD_MobileCatalogMaint(-)"
        },
        params: {
        "myActionName":"GetDefaultsForCreate",
         "preferredMode":"Create",
        "ResultIsActiveEntity":"true",
        "myActionName":"GetDefaultsForCreate",
  
        }
        })) || ""; // generate the Hash to display a Supplier
        oCrossAppNavigator.toExternal({
        target: {
        shellHash: hash
        }
        }); // navigate to Supplier application
      },
      onPressExcludeCOMMODITY: function (oEvent) {
        var table = this.getView().byId("smartTable_custF4_map");
        var that = this;

        if (table.getTable().getSelectedIndices().length > 1) {

          sap.m.MessageBox.error("Please select one commodity");
          return;
        }

        var index = table.getTable().getSelectedIndices()[0];

        var object = table.getTable().getBinding("rows").getContextByIndex(index).getObject()

        // that.exitDialog = new Dialog({
        //   type: sap.m.DialogType.Message,
        //   title: "Confirm",
        //   content: new sap.m.Text({ text: "Are you sure you want to exclude commodity " +object.COMMODITY+" ?" }),
        //   buttons: [new sap.m.Button({
        //     width:"100px",

        //     type: sap.m.ButtonType.Emphasized,
        //     text: "Yes",
        //     press: function () {


        //       that.exitDialog.close();
        //       that.createExclusinBrandRecord(object,"COMMODITY",object.COMMODITY)

        //     }.bind(that)
        //   }),new sap.m.Button({
        //     width:"100px",
        //     type: 'Negative',
        //     text: "No",
        //     press: function () {
        //       that.exitDialog.close();
        //     }.bind(that)
        //   })
        // ]
        // });
        // this.exitDialog.open();







        var that = this;
        this.exitDialog = new Dialog({
          type: sap.m.DialogType.Message,
          title: "Confirm",
          content: new sap.m.Text({
            text: "Do you want to take this action for all materials under commodity - '" + object.MaterialCommodity + "' or select materials ?"
          }),
          buttons: [new sap.m.Button({
            width: "100px",

            type: sap.m.ButtonType.Emphasized,
            text: "Commodity",
            press: function () {


              that.exitDialog.close();
              // selectedIndices.forEach(element => {
              //   that.onRemoveExclusionListByObject( table.getTable().getBinding("rows").getContextByIndex(element).getPath())
              //   });

              that.createExclusinBrandRecord(object, "COMMODITY", object.MaterialCommodity)

            }.bind(that)
          }), new sap.m.Button({
            width: "200px",

            type: sap.m.ButtonType.Emphasized,
            text: "Select Materials",
            press: function () {


              that.exitDialog.close();
              this.getView().byId("smartFilter_custF4_map").setFilterData({
                "COMMODITY": object.COMMODITY

              });
              // debugger;
              this.getView().byId("smartFilter_custF4_map").getControlByKey("COMMODITY").setVisible(true);
              this.getView().byId("smartTable_custF4_map").rebindTable();
              setTimeout(() => {
                that.getView().byId("smartTable_custF4_map").getTable().selectAll();

              }, 1000);
              // selectedIndices.forEach(element => {
              //   that.onRemoveExclusionListByObject( table.getTable().getBinding("rows").getContextByIndex(element).getPath())
              //   });

            }.bind(that)
          }), new sap.m.Button({
            width: "100px",
            type: 'Negative',
            text: "No",
            press: function () {
              that.exitDialog.close();
            }.bind(that)
          })]
        });
        this.exitDialog.open();



      },
      onPressExcludeMat: function (oEvent) {

        var table = this.getView().byId("smartTable_custF4_map");
        // var selectedIndex =table.getTable().getSelectedIndices()[0];
        var that = this;

        var index = table.getTable().getSelectedIndices()[0];

        var object = table.getTable().getBinding("rows").getContextByIndex(index).getObject()

        that.exitDialog = new Dialog({
          type: sap.m.DialogType.Message,
          title: "Confirm",
          // content: new sap.m.Text({ text: "Are you sure you want to exclude material " +object.MATNR+" ?" }),
          content: new sap.m.Text({
            text: "Are you sure you want to exclude material(s)  ?"
          }),

          buttons: [new sap.m.Button({
            width: "100px",

            type: sap.m.ButtonType.Emphasized,
            text: "Yes",
            press: function () {


              that.exitDialog.close();
              // that.createExclusinBrandRecord(object,"MATNR",object.MATNR)
              that.onMassExclude("MATNR");

            }.bind(that)
          }), new sap.m.Button({
            width: "100px",
            type: 'Negative',
            text: "No",
            press: function () {
              that.exitDialog.close();
            }.bind(that)
          })]
        });
        this.exitDialog.open();

      },
      onPressExcludeOldMat: function (oEvent) {


        // Old Materials

        var table = this.getView().byId("smartTable_custF4_map");
        // var selectedIndex =table.getTable().getSelectedIndices()[0];
        var that = this;

        var index = table.getTable().getSelectedIndices()[0];

        var object = table.getTable().getBinding("rows").getContextByIndex(index).getObject()
        that.exitDialog = new Dialog({
          type: sap.m.DialogType.Message,
          title: "Confirm",
          // content: new sap.m.Text({ text: "Are you sure you want to exclude old material(s) " +object.BISMT+" ?" }),
          content: new sap.m.Text({
            text: "Are you sure you want to exclude old material(s)  ?"
          }),

          buttons: [new sap.m.Button({
            width: "100px",

            type: sap.m.ButtonType.Emphasized,
            text: "Yes",
            press: function () {


              that.exitDialog.close();
              // that.createExclusinBrandRecord(object,"BISMT",object.BISMT)
              that.onMassExclude("BISMT");

            }.bind(that)
          }), new sap.m.Button({
            width: "100px",
            type: 'Negative',
            text: "No",
            press: function () {
              that.exitDialog.close();
            }.bind(that)
          })]
        });
        this.exitDialog.open();

      },
      OnExcludeBrand: function (oEvent) {
        //   debugger;

        var table = this.getView().byId("smartTable_custF4_map");
        // var selectedIndex =table.getTable()/.getSelectedIndices()[0];
        var that = this;
        if (table.getTable().getSelectedIndices().length > 1) {

          sap.m.MessageBox.error("Please select one brand");
          return;
        }

        var index = table.getTable().getSelectedIndices()[0];

        var object = table.getTable().getBinding("rows").getContextByIndex(index).getObject()
        // that.exitDialog = new Dialog({
        //   type: sap.m.DialogType.Message,
        //   title: "Confirm",
        //   content: new sap.m.Text({ text: "Are you sure you want to exclude brand " +object.BRAND+" ?" }),
        //   buttons: [new sap.m.Button({
        //     width:"100px",

        //     type: sap.m.ButtonType.Emphasized,
        //     text: "Yes",
        //     press: function () {


        //       that.exitDialog.close();
        //       that.createExclusinBrandRecord(object,"BRAND",object.BRAND)

        //     }.bind(that)
        //   }),new sap.m.Button({
        //     width:"100px",
        //     type: 'Negative',
        //     text: "No",
        //     press: function () {
        //       that.exitDialog.close();
        //     }.bind(that)
        //   })
        // ]
        // });

        // this.exitDialog.open();












        var that = this;
        this.exitDialog = new Dialog({
          type: sap.m.DialogType.Message,
          title: "Confirm",
          content: new sap.m.Text({
            text: "Do you want to take this action for all materials under brand - '" + object.Brand + "' or select materials ?"
          }),
          buttons: [new sap.m.Button({
            width: "100px",

            type: sap.m.ButtonType.Emphasized,
            text: "Brand",
            press: function () {


              that.exitDialog.close();
              // selectedIndices.forEach(element => {
              //   that.onRemoveExclusionListByObject( table.getTable().getBinding("rows").getContextByIndex(element).getPath())
              //   });

              that.createExclusinBrandRecord(object, "BRAND", object.Brand)

            }.bind(that)
          }), new sap.m.Button({
            width: "140px",

            type: sap.m.ButtonType.Emphasized,
            text: "Select Materials",
            press: function () {


              that.exitDialog.close();
              this.getView().byId("smartFilter_custF4_map").setFilterData({
                "Brand": object.Brand

              });
              //    debugger;
              this.getView().byId("smartFilter_custF4_map").getControlByKey("Brand").setVisible(true);
              this.getView().byId("smartTable_custF4_map").rebindTable();
              setTimeout(() => {
                that.getView().byId("smartTable_custF4_map").getTable().selectAll();

              }, 1000);
              // selectedIndices.forEach(element => {
              //   that.onRemoveExclusionListByObject( table.getTable().getBinding("rows").getContextByIndex(element).getPath())
              //   });

            }.bind(that)
          }), new sap.m.Button({
            width: "100px",
            type: 'Negative',
            text: "No",
            press: function () {
              that.exitDialog.close();
            }.bind(that)
          })]
        });
        this.exitDialog.open();




      },
      onApplyBrandExclusion: function (oEvent) {

        var table = this.getView().byId("st_brandtable");
        var selectedIndices = table.getTable().getSelectedIndices();

        //     table.getTable().getBinding("rows").getContextByIndex(table.getTable().getSelectedIndices()[0])


        selectedIndices.forEach(element => {

          this.createExclusinBrandRecord(table.getTable().getBinding("rows").getContextByIndex(element).getObject());
        });
      },
      createExclusinBrandRecord: function (object, field, fieldvalue) {

        var newObj = {};

        newObj.CatalogField = field;
        newObj.SalesOrganization = object.SalesOrganization;
        newObj.CatalogFieldValue = fieldvalue;
        newObj.CatalogId = object.CatalogId;
        newObj.Department = object.Department;
     newObj.DistributionChannel = object.DistributionChannel;     if(newObj.CatalogId === "" || !newObj.CatalogId){

          newObj.CatalogId = "";
        }


        var that = this;

        let prodSet = this.getOwnerComponent().getModel();

        prodSet.create("/ZCSD_MOBILECATALOGExclusion", newObj, {
            success: function (result) {
              // everything is OK 
              that.getView().setBusy(false);
              sap.m.MessageBox.success("The exclusion by " + field + " - " + fieldvalue + " is successfully completed");

              that.getView().byId("smartTable_custF4_map").rebindTable();

            },
            error: function (err) {
              // some error occuerd 
              that.getView().setBusy(false);


              if (JSON.parse(err.responseText).error.message.value) {
                sap.m.MessageToast.show(JSON.parse(err.responseText).error.message.value);

              } else {
                // sap.m.MessageBox.error("There is an issue in creating new visit. Please check data and try again." );
              }



            }
          }

        );

      },


      onExcludeRecordByMatnr: function (object, field, fieldvalue) {

        var newObj = {};

        newObj.CatalogField = "MATNR";
        newObj.SalesOrganization = object.SalesOrganization;
        newObj.CatalogFieldValue = object.Material;
        newObj.CatalogId = object.CatalogId;
        newObj.Department = object.Department;
        newObj.Material = object.Material;
        // newObj.OldMaterialNumber = object.OldMaterialNumber;
        // newObj.Brand = object.BRAND;

        var that = this;

        let prodSet = this.getOwnerComponent().getModel();

        prodSet.create("/ZCSD_MOBILECATALOGExclusion", newObj, {
            success: function (result) {
              // everything is OK 
              that.getView().setBusy(false);
              // sap.m.MessageBox.success("The exclusion by "+field+" - "+fieldvalue+" is successfully completed" );

              that.getView().byId("smartTable_custF4_map").rebindTable();

            },
            error: function (err) {
              // some error occuerd 
              that.getView().setBusy(false);


              if (JSON.parse(err.responseText).error.message.value) {
                sap.m.MessageToast.show(JSON.parse(err.responseText).error.message.value);

              } else {
                //    sap.m.MessageBox.error("There is an issue in creating new visit. Please check data and try again." );
              }



            }
          }

        );

      },


      _onRouteMatched: async function (oEvent) {

        var obj = this.getOwnerComponent().getModel("shiptoUserModel").getData();

        await delay(500);
        this.getView().byId("smartFilter_custF4_map").setFilterData({
          "$Parameter.p_kunwe": obj.Shipto,
          "$Parameter.p_vkorg": obj.SalesOrganization,
          "CatalogId": obj.CatalogId,
          "$Parameter.p_ats": obj.ATS,
          "$Parameter.p_itemproposal": "Y"

        });
        this.getView().byId("smartTable_custF4_map").rebindTable();
        this.getView().byId("smartFilter_custF4_map").validateMandatoryFields();



        var that = this;
        setTimeout(() => {
           that.fetchURLParameters(oEvent);
        }, 500);


      },
      onBeforeRebindTable: function (oEvent) {




        var filterData = this.getView().byId("smartFilter_custF4_map").getFilterData();
        var p_vkorg = filterData['SalesOrganization'];
        var ZCATALOG = filterData['CatalogId'];
       

        this.setEorIFlag(p_vkorg, ZCATALOG);
        var oBindingParams = oEvent.getParameter("bindingParams");

        // var oFilter = new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, this.salesorg);
        // oBindingParams.filters.push(oFilter);
        if (ZCATALOG) {
          // var oFilter = new sap.ui.model.Filter("CatalogId", sap.ui.model.FilterOperator.EQ, ZCATALOG);
          // oBindingParams.filters.push(oFilter);
        } else {
          var oFilter = new sap.ui.model.Filter("CatalogId", sap.ui.model.FilterOperator.EQ, "");
          oBindingParams.filters.push(oFilter);
        }






        // var stringPath = "/ZCSD_E_MobileItemList(p_vkorg='" + p_vkorg +"',p_kunwe='"+p_kunwe+"',p_ats='"+p_ats+"',p_itemproposal='"+p_itemproposal+"')/Set";

        // stringPath= (stringPath);
        // oEvent.getSource().setTableBindingPath(stringPath);


      },





      setEorIFlag: function (vkorg, zcatalog) {

        //   /sap/opu/odata/sap/ZSB_C_MOBILECATALOG/ZI_MobileCatalogVH(SalesOrganization='3000',CatalogName='')


        let prodSet = this.getOwnerComponent().getModel();
        var that = this;

        if (typeof zcatalog === 'undefined') {
          zcatalog = "";
        }

        prodSet.read("/ZI_MobileCatalogVH(SalesOrganization='" + vkorg + "',CatalogName='" + encodeURI(zcatalog) + "')", {
          success: function (oData, oResponse) {
            //   debugger;

            var cataflag = oData.IeFlag;


            var model = that.getOwnerComponent().getModel("GlobalModel");
            model.setProperty("/CatalogType", cataflag);










          },

          error: function (oError) {

          }
        });
      },


      onRemoveExclusionList: function (oEvent) {

        //   debugger;
        let prodSet = this.getOwnerComponent().getModel();
        let path = oEvent.getSource().getBindingContext().getPath();
        var that = this;

        if (oEvent.getSource().getBindingContext().getObject().CatalogField === "BRAND") {

          this.onExcludeRemoveBrand(oEvent.getSource().getBindingContext().getObject().CatalogFieldValue, oEvent.getSource().getBindingContext().getPath());
          return;
        }

        var questionText = "";

        if (oEvent.getSource().getBindingContext().getObject().CatalogField === "COMMODITY") {
          questionText = "Commodity";
        } else if (oEvent.getSource().getBindingContext().getObject().CatalogField === "BISMT") {
          questionText = "Old Material";
        } else if (oEvent.getSource().getBindingContext().getObject().CatalogField === "MATNR") {
          questionText = "Material";
        }



        var that = this;
        this.exitDialog = new Dialog({
          type: sap.m.DialogType.Message,
          title: "Confirm",
          content: new sap.m.Text({
            text: "Do you want to take this action for " + questionText + " " + oEvent.getSource().getBindingContext().getObject().CatalogFieldValue + " ?"
          }),
          buttons: [new sap.m.Button({
            width: "100px",

            type: sap.m.ButtonType.Emphasized,
            text: "Yes",
            press: function () {


              that.exitDialog.close();
              // selectedIndices.forEach(element => {
              //   that.onRemoveExclusionListByObject( table.getTable().getBinding("rows").getContextByIndex(element).getPath())
              //   });

              // that.createExclusinBrandRecord(object,"BRAND",object.BRAND)
              prodSet.remove(path, {
                  success: function (result) {
                    // everything is OK 
                    that.getView().setBusy(false);
                    sap.m.MessageBox.success("The exclusion is successfully removed");
                    that.getView().byId("sfTableExclude").rebindTable();


                  },
                  error: function (err) {
                    // some error occuerd 
                    that.getView().setBusy(false);


                    if (JSON.parse(err.responseText).error.message.value) {
                      sap.m.MessageBox.error(JSON.parse(err.responseText).error.message.value);

                    } else {
                      sap.m.MessageBox.error("There is an issue in creating new visit. Please check data and try again.");
                    }



                  }
                }

              );

            }.bind(that)
          }), new sap.m.Button({
            width: "100px",
            type: 'Negative',
            text: "No",
            press: function () {
              that.exitDialog.close();
            }.bind(that)
          })]
        });
        this.exitDialog.open();








      },


      onRemoveExclusionListByObject: function (path) {

        //   debugger;



        let prodSet = this.getOwnerComponent().getModel();
        var that = this;


        prodSet.remove(path, {
            success: function (result) {
              // everything is OK 
              that.getView().setBusy(false);
              //  sap.m.MessageBox.success("The exclusion is successfully removed" );
              that.getView().byId("sfTableExclude").rebindTable();


            },
            error: function (err) {
              // some error occuerd 
              that.getView().setBusy(false);


              if (JSON.parse(err.responseText).error.message.value) {
                sap.m.MessageBox.error(JSON.parse(err.responseText).error.message.value);

              } else {
                sap.m.MessageBox.error("There is an issue in creating new visit. Please check data and try again.");
              }



            }
          }

        );
      },

      onShowExcludingList: function (oEvent) {
        var filterData = this.getView().byId("smartFilter_custF4_map").getFilterData();
        // var p_kunwe = filterData['$Parameter.p_kunwe'];
        var p_vkorg = filterData.SalesOrganization;
        var p_catalog = filterData['CatalogId'];
        // var p_ats = filterData['$Parameter.p_ats'];
        // var p_itemproposal = filterData['$Parameter.p_itemproposal'];

        if (p_vkorg) {

          this.salesorg = p_vkorg;
          this.catalog = p_catalog;
          this.onOpenExlusionList();

        } else {

          sap.m.MessageBox.error("Please select Catalog and Sales Organization");
        }

      },

      onOpenExlusionList: function () {
        // create dialog lazily
        this.getOwnerComponent().getModel("GlobalModel").setProperty("/isSelectMaterialsSelected", false);

        if (!this.pDialogUser) {
          this.pDialogUser = this.loadFragment({
            name: "customer.porky.zmmcatalogmnt.view.exclusionF4"
          });
        } else {

          if (this.pDialogUser1) {
            this.pDialogUser1.destroy();
            this.pDialogUser = undefined;
            this.pDialogUser1 = undefined;
            this.pDialogUser = this.loadFragment({
              name: "customer.porky.zmmcatalogmnt.view.exclusionF4"
            });
          }
        }
        var that = this;
        this.pDialogUser.then(function (oDialog) {

          that.pDialogUser1 = oDialog;

          oDialog.open();
          var oFilter = [];
          oFilter.push(new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, that.salesorg));
          if (that.catalog) {
            oFilter.push(new sap.ui.model.Filter("CatalogId", sap.ui.model.FilterOperator.EQ, that.catalog));
          } else {
            oFilter.push(new sap.ui.model.Filter("CatalogId", sap.ui.model.FilterOperator.EQ, " "));

          }

          oDialog.getBinding("items").filter(oFilter);


        });
        var that = this;
        this.getView().addDependent(this.pDialogUser);
      },



      onOpenInlusionList: function (oEvent) {
        // create dialog lazily

        if (this.getView().byId("smartTable_custF4_map").getTable().getSelectedItems().length !== 1) {
          sap.m.MessageBox.error("Please select only one item")
          return;
        } else {
          this.selectedBrand = this.getView().byId("smartTable_custF4_map").getTable().getSelectedContexts()[0].getObject().Brand;

        }
        if (!this.pDialogUser_2) {
          this.pDialogUser_2 = this.loadFragment({
            name: "customer.porky.zmmcatalogmnt.view.inclusionF4"
          });
        } else {

          if (this.pDialogUser2) {
            this.pDialogUser2.destroy();
            this.pDialogUser_2 = undefined;
            this.pDialogUser2 = undefined;
            this.pDialogUser_2 = this.loadFragment({
              name: "customer.porky.zmmcatalogmnt.view.inclusionF4"
            });
          }
        }
        var that = this;
        this.pDialogUser_2.then(function (oDialog) {

          that.pDialogUser2 = oDialog;

          oDialog.open();
          // var oFilter = [];
          // oFilter.push(new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, that.salesorg));
          // oFilter.push(new sap.ui.model.Filter("CatalogId", sap.ui.model.FilterOperator.EQ, that.catalog));

          // oDialog.getBinding("items").filter(oFilter);


        });
        var that = this;
        this.getView().addDependent(this.pDialogUser_2);
      },

      onBeforeRebindExclusion: function (oEvent) {


        var oBindingParams = oEvent.getParameter("bindingParams");






        var oFilter = new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, this.salesorg);
        oBindingParams.filters.push(oFilter);
        if (this.catalog) {
          var oFilter = new sap.ui.model.Filter("CatalogId", sap.ui.model.FilterOperator.EQ, this.catalog);
          oBindingParams.filters.push(oFilter);
        } else {
          var oFilter = new sap.ui.model.Filter("CatalogId", sap.ui.model.FilterOperator.EQ, "");
          oBindingParams.filters.push(oFilter);
        }
        if (!this.getView().byId("exclusionSF").getFilterData().CatalogFieldValue || this.getView().byId("exclusionSF").getFilterData().CatalogFieldValue === "") {
          this.getOwnerComponent().getModel("GlobalModel").setProperty("/isSelectMaterialsSelected", false);
        }



      },



      onBeforeRebindInclusion: function (oEvent) {


        var oBindingParams = oEvent.getParameter("bindingParams");

        // var oFilter = new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, this.salesorg);
        // oBindingParams.filters.push(oFilter);    



        var filterData = this.getView().byId("smartFilter_custF4_map").getFilterData();
        var p_kunwe = filterData['$Parameter.p_kunwe'];
        var p_vkorg = filterData['$Parameter.p_vkorg'];
        var p_catalog = filterData['CatalogId'];
        var p_ats = filterData['$Parameter.p_ats'];
        var p_itemproposal = filterData['$Parameter.p_itemproposal'];







        var stringPath = "/ZCSD_E_MobileItemList(p_vkorg='" + p_vkorg + "',p_kunwe='" + p_kunwe + "',p_ats='" + p_ats + "',p_itemproposal='" + p_itemproposal + "')/Set";

        stringPath = (stringPath);
        oEvent.getSource().setTableBindingPath(stringPath);


        if (p_catalog) {
          var oFilter = new sap.ui.model.Filter("CatalogId", sap.ui.model.FilterOperator.EQ, p_catalog);
          oBindingParams.filters.push(oFilter);


          this.selectedBrand = this.getView().byId("smartTable_custF4_map").getTable().getSelectedContexts()[0].getObject().Brand;


        }


        if (this.selectedBrand) {
          var oFilter = new sap.ui.model.Filter("Brand", sap.ui.model.FilterOperator.EQ, this.selectedBrand);
          oBindingParams.filters.push(oFilter);




        }



      },

      onExcludeRemoveBrand: function (brand, path) {


        var that = this;
        this.exitDialog = new Dialog({
          type: sap.m.DialogType.Message,
          title: "Confirm",
          content: new sap.m.Text({
            text: "Do you want to take this action for all materials under brand or select materials ?"
          }),
          buttons: [new sap.m.Button({
            width: "100px",

            type: sap.m.ButtonType.Emphasized,
            text: "Brand",
            press: function () {


              that.exitDialog.close();
              // selectedIndices.forEach(element => {
              //   that.onRemoveExclusionListByObject( table.getTable().getBinding("rows").getContextByIndex(element).getPath())
              //   });

              that.onRemoveExclusionListByObject(path);
              that.getOwnerComponent().getModel("GlobalModel").setProperty("/isSelectMaterialsSelected", false);


            }.bind(that)
          }), new sap.m.Button({
            width: "200px",

            type: sap.m.ButtonType.Emphasized,
            text: "Select Materials",
            press: function () {


              that.exitDialog.close();
              this.getView().byId("exclusionSF").setFilterData({
                "CatalogFieldValue": brand

              });

              that.getOwnerComponent().getModel("GlobalModel").setProperty("/isSelectMaterialsSelected", true);
              this.getView().byId("sfTableExclude").rebindTable();
              setTimeout(() => {
                that.getView().byId("sfTableExclude").getTable().selectAll();

              }, 1000);
              // selectedIndices.forEach(element => {
              //   that.onRemoveExclusionListByObject( table.getTable().getBinding("rows").getContextByIndex(element).getPath())
              //   });

            }.bind(that)
          }), new sap.m.Button({
            width: "100px",
            type: 'Negative',
            text: "No",
            press: function () {
              that.exitDialog.close();
              that.getOwnerComponent().getModel("GlobalModel").setProperty("/isSelectMaterialsSelected", false);

            }.bind(that)
          })]
        });
        this.exitDialog.open();



      },

      createUnselectedRecords: function (unSelectedContexts) {


        unSelectedContexts.forEach(object => {
          this.onExcludeRecordByMatnr(object.getObject(), "MATNR", object.Material)

        });



      },

      applyMassRemoval: function (oEvent) {

        //  debugger;

        //table.getTable().getBinding("rows").getAllCurrentContexts() // table.getTable().getSelectedIndices()

        var table = this.getView().byId("sfTableExclude")

        var contexts = table.getTable().getBinding("rows").getAllCurrentContexts();

        var unSelectedContexts = [];
        var selectedContexts = [];

        var selectedIndices = table.getTable().getSelectedIndices();
        var count = 0;

        contexts.forEach(element => {

          var find = selectedIndices.filter(element1 => element1 === count);
          if (find.length === 0) {
            unSelectedContexts.push(contexts[count])

          } else {
            selectedContexts.push(contexts[count])
          }
          count++;



        });






        var table = this.getView().byId("sfTableExclude");
        var selectedIndices = table.getTable().getSelectedIndices();
        var that = this;

        that.exitDialog = new Dialog({
          type: sap.m.DialogType.Message,
          title: "Confirm",
          content: new sap.m.Text({
            text: "Are you sure you want to remove selected items from exclusion list ?"
          }),
          buttons: [new sap.m.Button({
            width: "100px",

            type: sap.m.ButtonType.Emphasized,
            text: "Yes",
            press: function () {


              that.exitDialog.close();

              if (that.getOwnerComponent().getModel("GlobalModel").getProperty("/CatalogType") === "E") {


                // unSelectedContexts.forEach(element => {
                //   that.onRemoveExclusionListByObject( element.getPath())
                // });



                selectedIndices.forEach(element => {
                  that.onRemoveExclusionListByObject(table.getTable().getBinding("rows").getContextByIndex(element).getPath())
                });


                if (that.getView().byId("exclusionSF").getFilterData().CatalogFieldValue) {
                  that.createUnselectedRecords(unSelectedContexts);
                }
              } else {
                // selectedIndices.forEach(element => {
                //   that.onRemoveExclusionListByObject( table.getTable().getBinding("rows").getContextByIndex(element).getPath())

                //   that.createUnselectedRecords(unSelectedContexts);
                //   });

                if (that.getView().byId("exclusionSF").getFilterData().CatalogFieldValue) {

                  unSelectedContexts.forEach(element => {
                    that.onRemoveExclusionListByObject(element.getPath())
                  });


                  if (that.getView().byId("exclusionSF").getFilterData().CatalogFieldValue) {

                    that.createUnselectedRecords(selectedContexts);
                  }

                } else {
                  selectedIndices.forEach(element => {
                    that.onRemoveExclusionListByObject(table.getTable().getBinding("rows").getContextByIndex(element).getPath())
                  });
                }


              }


            }.bind(that)
          }), new sap.m.Button({
            width: "100px",
            type: 'Negative',
            text: "No",
            press: function () {
              that.exitDialog.close();
            }.bind(that)
          })]
        });
        this.exitDialog.open();




      },
      onOpenOldMaterialsList: function (oEvent) {

        // create dialog lazily

        this.isOldMaterial = true;
        if (!this.pDialogUser) {
          this.pDialogUser = this.loadFragment({
            name: "customer.porky.zmmcatalogmnt.view.MaterialsF4"
          });
        } else {

          if (this.pDialogUser1) {
            this.pDialogUser1.destroy();
            this.pDialogUser = undefined;
            this.pDialogUser1 = undefined;
            this.pDialogUser = this.loadFragment({
              name: "customer.porky.zmmcatalogmnt.view.MaterialsF4"
            });
          }
        }
        var that = this;
        this.pDialogUser.then(function (oDialog) {

          that.pDialogUser1 = oDialog;

          oDialog.open();
          var oFilter = [];
          oFilter.push(new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, that.salesorg));

          oDialog.getBinding("items").filter(oFilter);


        });
        var that = this;
        this.getView().addDependent(this.pDialogUser);
      },



      onCloseDialogBox: function (oEvent) {
        this.pDialogUser1.close();
      },

      onMassExclude: function (catalogfield) {


        var table = this.getView().byId("smartTable_custF4_map");
        var that = this;

        var objects = table.getTable().getSelectedIndices();

        objects.forEach(element => {

          if (catalogfield === "BISMT") {

            that.createExclusinBrandRecord(table.getTable().getBinding("rows").getContextByIndex(element).getObject(), catalogfield, table.getTable().getBinding("rows").getContextByIndex(element).getObject().OldMaterial);
          } else if (catalogfield === "MATNR") {

            that.createExclusinBrandRecord(table.getTable().getBinding("rows").getContextByIndex(element).getObject(), catalogfield, table.getTable().getBinding("rows").getContextByIndex(element).getObject().Material);
          } else if (catalogfield === "BRAND") {

            that.createExclusinBrandRecord(table.getTable().getBinding("rows").getContextByIndex(element).getObject(), catalogfield, table.getTable().getBinding("rows").getContextByIndex(element).getObject().Brand);
          } else if (catalogfield === "COMMODITY") {

            that.createExclusinBrandRecord(table.getTable().getBinding("rows").getContextByIndex(element).getObject(), catalogfield, table.getTable().getBinding("rows").getContextByIndex(element).getObject().MaterialCommodity);
          }
        });

      },


      fetchDefaultParameters: function () {


        let defaultModel = this.getOwnerComponent().getModel("ZCXA_USERDEFAULT_CDS");
        var that = this;
        defaultModel.read("/ZCXA_USERDEFAULT", {
          success: function (oData, oResponse) {


            var salesorg = oData.results.find(element => element.parid === "VKO"); // Sales Org
            var division = oData.results.find(element => element.parid === "SPA"); // Division
            var kna1Para = oData.results.find(element => element.parid === "VTW"); // Distribution Channel



            setTimeout(() => {


              if (typeof salesorg !== "undefined") {

                that.getView().byId("smartFilter_custF4_map").setFilterData({
                  "SalesOrganization": salesorg.parva

                });

              }



              if (typeof division !== "undefined") {

                that.getView().byId("smartFilter_custF4_map").setFilterData({
                  "OrganizationDivision": division.parva

                });

              } else {
                that.getView().byId("smartFilter_custF4_map").setFilterData({
                  "OrganizationDivision": "01"

                });
              }


              if (typeof kna1Para !== "undefined") {

                that.getView().byId("smartFilter_custF4_map").setFilterData({
                  "DistributionChannel": kna1Para.parva

                });

              } else {
                that.getView().byId("smartFilter_custF4_map").setFilterData({
                  "DistributionChannel": "01"

                });

              }

              that.getView().byId("smartFilter_custF4_map").validateMandatoryFields();
              that.getView().byId("smartTable_custF4_map").rebindTable();


            }, 500);






          },

          error: function (oError) {}
        });
      },


      onOpenBrandList: function () {
        // create dialog lazily
        if (!this.pDialogUser) {
          this.pDialogUser = this.loadFragment({
            name: "customer.porky.zmmcatalogmnt.view.BrandF4"
          });
        } else {

          if (this.pDialogUser1) {
            this.pDialogUser1.destroy();
            this.pDialogUser = undefined;
            this.pDialogUser1 = undefined;
            this.pDialogUser = this.loadFragment({
              name: "customer.porky.zmmcatalogmnt.view.BrandF4"
            });
          }
        }
        var that = this;
        this.pDialogUser.then(function (oDialog) {

          that.pDialogUser1 = oDialog;

          oDialog.open();
          var oFilter = [];
          oFilter.push(new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, that.salesorg));

          oDialog.getBinding("items").filter(oFilter);


        });
        var that = this;
        this.getView().addDependent(this.pDialogUser);
      },

      handleBrandSelection: function (oEvent) {


        this.pDialogUser1.close();
        var brand = oEvent.mParameters.listItem.getBindingContext().getObject().Brand;
        var department = this.getView().byId("brandDepartment").getSelectedKey();
        var departmentName;
        if (this.getView().byId("brandDepartment").getSelectedKey() === "") {
          departmentName = "out"
        } else {
          departmentName = " " + this.getView().byId("brandDepartment").getSelectedItem().getText();

        }

        var that = this;
        that.exitDialog = new Dialog({
          type: sap.m.DialogType.Message,
          title: "Confirm",
          content: new sap.m.Text({
            text: "Are you sure you want to add Brand " + brand + " with" + departmentName + " department  ?"
          }),
          buttons: [new sap.m.Button({
            width: "100px",

            type: sap.m.ButtonType.Emphasized,
            text: "Yes",
            press: function () {


              that.createBrandIntoInclusion(brand, department);
              that.exitDialog.close();
            }.bind(that)
          }), new sap.m.Button({
            width: "100px",
            type: 'Negative',
            text: "No",
            press: function () {
              that.exitDialog.close();
            }.bind(that)
          })]
        });
        this.exitDialog.open();
      },

      createBrandIntoInclusion: function (brand, department) {


        var newObj = {};

        //  newObj.CatalogField = field;
        newObj.CatalogFieldValue = brand;
        newObj.CatalogField = 'BRAND';
        newObj.Department = department;
        var filterData = this.getView().byId("smartFilter_custF4_map").getFilterData();

        newObj.CatalogId = filterData.CatalogId;
        newObj.SalesOrganization = filterData.SalesOrganization;;
        newObj.DistributionChannel = filterData.DistributionChannel;


        var that = this;

        let prodSet = this.getOwnerComponent().getModel();

        prodSet.create("/ZCSD_MOBILECATALOGExclusion", newObj, {
            success: function (result) {
              // everything is OK 
              that.getView().setBusy(false);
              sap.m.MessageBox.success("The inclusion by brand " + brand + " is successfully completed");

              that.getView().byId("smartTable_custF4_map").rebindTable();

            },
            error: function (err) {
              // some error occuerd 
              that.getView().setBusy(false);


              if (JSON.parse(err.responseText).error.message.value) {
                sap.m.MessageBox.error(JSON.parse(err.responseText).error.message.value);

              } else {
                sap.m.MessageBox.error("There is an issue in creating new visit. Please check data and try again.");
              }



            }
          }

        );


      },




      //// Commodity
      onOpenCommodityList: function () {
        // create dialog lazily
        if (!this.pDialogUser) {
          this.pDialogUser = this.loadFragment({
            name: "customer.porky.zmmcatalogmnt.view.CommodityF4"
          });
        } else {

          if (this.pDialogUser1) {
            this.pDialogUser1.destroy();
            this.pDialogUser = undefined;
            this.pDialogUser1 = undefined;
            this.pDialogUser = this.loadFragment({
              name: "customer.porky.zmmcatalogmnt.view.CommodityF4"
            });
          }
        }
        var that = this;
        this.pDialogUser.then(function (oDialog) {

          that.pDialogUser1 = oDialog;

          oDialog.open();
          var oFilter = [];
          oFilter.push(new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, that.salesorg));

          oDialog.getBinding("items").filter(oFilter);


        });
        var that = this;
        this.getView().addDependent(this.pDialogUser);
      },

      handleCommoditySelection: function (oEvent) {


        this.pDialogUser1.close();
        var Commodity = oEvent.mParameters.listItem.getBindingContext().getObject().Commodity;
        var department = this.getView().byId("commodityDepartment").getSelectedKey();
        var departmentName;
        if (this.getView().byId("commodityDepartment").getSelectedKey() === "") {
          departmentName = "out"
        } else {
          departmentName = " " + this.getView().byId("commodityDepartment").getSelectedItem().getText();

        }
        var that = this;
        that.exitDialog = new Dialog({
          type: sap.m.DialogType.Message,
          title: "Confirm",
          content: new sap.m.Text({
            text: "Are you sure you want to add Commodity " + Commodity + " with" + departmentName + " department  ?"
          }),
          buttons: [new sap.m.Button({
            width: "100px",

            type: sap.m.ButtonType.Emphasized,
            text: "Yes",
            press: function () {


              that.createCommodityIntoInclusion(Commodity, department);
              that.exitDialog.close();
            }.bind(that)
          }), new sap.m.Button({
            width: "100px",
            type: 'Negative',
            text: "No",
            press: function () {
              that.exitDialog.close();
            }.bind(that)
          })]
        });
        this.exitDialog.open();
      },

      createCommodityIntoInclusion: function (Commodity, department) {


        var newObj = {};

        //  newObj.CatalogField = field;
        newObj.CatalogFieldValue = Commodity;
        newObj.CatalogField = 'COMMODITY';
        newObj.Department = department;
        var filterData = this.getView().byId("smartFilter_custF4_map").getFilterData();

        newObj.CatalogId = filterData.CatalogId;
        newObj.SalesOrganization = filterData.SalesOrganization;;
                newObj.DistributionChannel = filterData.DistributionChannel;



        var that = this;

        let prodSet = this.getOwnerComponent().getModel();

        prodSet.create("/ZCSD_MOBILECATALOGExclusion", newObj, {
            success: function (result) {
              // everything is OK 
              that.getView().setBusy(false);
              sap.m.MessageBox.success("The inclusion by Commodity " + Commodity + " is successfully completed");

              that.getView().byId("smartTable_custF4_map").rebindTable();

            },
            error: function (err) {
              // some error occuerd 
              that.getView().setBusy(false);


              if (JSON.parse(err.responseText).error.message.value) {
                sap.m.MessageBox.error(JSON.parse(err.responseText).error.message.value);

              } else {
                sap.m.MessageBox.error("There is an issue in creating new visit. Please check data and try again.");
              }



            }
          }

        );


      },







      //// Materials
      onOpenMaterialsList: function () {
        // create dialog lazily
        this.isOldMaterial = false;
        if (!this.pDialogUser) {
          this.pDialogUser = this.loadFragment({
            name: "customer.porky.zmmcatalogmnt.view.MaterialsF4"
          });
        } else {

          if (this.pDialogUser1) {
            this.pDialogUser1.destroy();
            this.pDialogUser = undefined;
            this.pDialogUser1 = undefined;
            this.pDialogUser = this.loadFragment({
              name: "customer.porky.zmmcatalogmnt.view.MaterialsF4"
            });
          }
        }
        var that = this;
        this.pDialogUser.then(function (oDialog) {

          that.pDialogUser1 = oDialog;

          oDialog.open();
          var oFilter = [];
          oFilter.push(new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, that.salesorg));

          oDialog.getBinding("items").filter(oFilter);


        });
        var that = this;
        this.getView().addDependent(this.pDialogUser);
      },

      handleMaterialSelection: function (oEvent) {


        
        var department = this.getView().byId("matDepartment").getSelectedKey();
        var departmentName;
        if (this.getView().byId("matDepartment").getSelectedKey() === "") {
          departmentName = "out"
        } else {
          departmentName = " " + this.getView().byId("matDepartment").getSelectedItem().getText();

        }
        // debugger;

        if (this.isOldMaterial) {
          var Material = oEvent.mParameters.listItem.getBindingContext().getObject().OldMaterial;

        } else {
          var Material = oEvent.mParameters.listItem.getBindingContext().getObject().Material;
        }

        var that = this;
        that.exitDialog = new Dialog({
          type: sap.m.DialogType.Message,
          title: "Confirm",
          content: new sap.m.Text({
            text: "Are you sure you want to add Material " + Material + " with" + departmentName + " department  ?"
          }),
          buttons: [new sap.m.Button({
            width: "100px",

            type: sap.m.ButtonType.Emphasized,
            text: "Yes",
            press: function () {

            that.pDialogUser1.close();
              that.createMaterialIntoInclusion(Material, department);
              that.exitDialog.close();
            }.bind(that)
          }), new sap.m.Button({
            width: "100px",
            type: 'Negative',
            text: "No",
            press: function () {
              that.exitDialog.close();
            }.bind(that)
          })]
        });
        this.exitDialog.open();
      },

      createMaterialIntoInclusion: function (Material, department) {


        var newObj = {};

        //  newObj.CatalogField = field;

        if (this.isOldMaterial) {
          newObj.CatalogFieldValue = Material;
          newObj.CatalogField = 'BISMT';

        } else {
          newObj.CatalogFieldValue = Material;
          newObj.CatalogField = 'MATNR';
        }

     //    newObj.CatalogId = object.CatalogId;
        newObj.Department = department;
        var filterData = this.getView().byId("smartFilter_custF4_map").getFilterData();

        newObj.CatalogId = filterData.CatalogId;
        newObj.SalesOrganization = filterData.SalesOrganization;;
                newObj.DistributionChannel = filterData.DistributionChannel;



        var that = this;

        let prodSet = this.getOwnerComponent().getModel();

        prodSet.create("/ZCSD_MOBILECATALOGExclusion", newObj, {
            success: function (result) {
              // everything is OK 
              that.getView().setBusy(false);
              sap.m.MessageBox.success("The inclusion by Material " + Material + " is successfully completed");

              that.getView().byId("smartTable_custF4_map").rebindTable();

            },
            error: function (err) {
              // some error occuerd 
              that.getView().setBusy(false);


              if (JSON.parse(err.responseText).error.message.value) {
                sap.m.MessageBox.error(JSON.parse(err.responseText).error.message.value);

              } else {
                sap.m.MessageBox.error("There is an issue in creating new visit. Please check data and try again.");
              }



            }
          }

        );


      },

      onBeforeRebindBrandF4: function (oEvent) {


        var oBindingParams = oEvent.getParameter("bindingParams");


        var oFilter = new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, this.getView().byId("smartFilter_custF4_map").getFilterData().SalesOrganization);
        oBindingParams.filters.push(oFilter);
      },
      onBeforeRebindCommodityF4: function (oEvent) {

        var oBindingParams = oEvent.getParameter("bindingParams");


        var oFilter = new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, this.getView().byId("smartFilter_custF4_map").getFilterData().SalesOrganization);
        oBindingParams.filters.push(oFilter);
      },
      onBeforeRebindMaterialF4: function (oEvent) {

        var oBindingParams = oEvent.getParameter("bindingParams");

        var oFilter = new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, this.getView().byId("smartFilter_custF4_map").getFilterData().SalesOrganization);
        oBindingParams.filters.push(oFilter);


      },
      onClickMaintenanceApp: function(oEvent){
     //   debugger;

        var obj = oEvent.mParameters.row.getBindingContext().getObject()
        // #CatalogMaintenance-ZRAP&/ZRSD_MobileCatalogMaint(Material='11559',SalesOrganization='3000',DistributionChannel='01',OrganizationDivision='01',Department='',CatalogId='ALL')

        // history.pushState(null, null, "#CatalogMaintenance-ZRAP&/ZRSD_MobileCatalogMaint(Material='11559',SalesOrganization='3000',DistributionChannel='01',OrganizationDivision='01',Department='',CatalogId='ALL')");

        // window.location.hash = "#CatalogMaintenance-ZRAP&/ZRSD_MobileCatalogMaint(Material='11559',SalesOrganization='3000',DistributionChannel='01',OrganizationDivision='01',Department='',CatalogId='ALL')";



        var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
// debugger;
oCrossAppNavigator.toExternal({
    target: {
        semanticObject: "CatalogMaintenance",
        action: "ZRAP"
    },
    params: {
        "Material": obj.Material,
        "SalesOrganization": obj.SalesOrganization,
        "DistributionChannel": obj.DistributionChannel,
        "OrganizationDivision": obj.OrganizationDivision,
        "Department": obj.Department,
        "CatalogId": decodeURIComponent(obj.CatalogId)
    }
});

   
    
      }
    });
  });