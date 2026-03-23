sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/Dialog",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox"
  ],
  function (BaseController, Dialog, Device, JSONModel, Filter, FilterOperator, MessageBox) {
    "use strict";

    return BaseController.extend("customer.porky.zfieldrepvisit.controller.newvisit", {


      onInit: function () {



        var oDeviceModel = new JSONModel(Device);
        oDeviceModel.setDefaultBindingMode("OneWay");
        this.getView().setModel(oDeviceModel, "device");


        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.getRoute("newvisit").attachMatched(this._onRouteMatched, this);
        this.getView().setModel(new sap.ui.model.json.JSONModel({
          "mobileNumberValidated": false
        }), "flagValueModel");

        this.getView().setModel(new sap.ui.model.json.JSONModel({
          "salesorg": "",
          "moe": false,
          "milesSet": 3

        }), "userValues");

        this.getView().setModel(new sap.ui.model.json.JSONModel({
          "selectedType": ""

        }), "googlePlacesModel");

        this.getView().setModel(new sap.ui.model.json.JSONModel({
          "authCustomer": true

        }), "authCustomerModel");


        var that = this;

        this.getOwnerComponent().getService("ShellUIService").then(function (oShellService) {
          oShellService.setBackNavigation(function () {
            //either do nothing to disable it, or add your own nav back logic for having the navigation

            if (that.getView().getModel("chageModeModel").getProperty("/changeMode")) {
              if (!that.exitDialog) {
                that.exitDialog = new Dialog({
                  type: sap.m.DialogType.Message,
                  title: "Confirm",
                  content: new sap.m.Text({
                    text: "Are you sure you want to exit making changes to this Visit?"
                  }),
                  buttons: [new sap.m.Button({
                    width: "100px",
                    visible: that.getView().getModel("visitModel").getProperty("/Visitid") === 'NEW' || that.getView().getModel("visitModel").getProperty("/status") === '2',

                    type: sap.m.ButtonType.Emphasized,
                    text: "Yes",
                    press: function () {
                      // var oRouter = that.getOwnerComponent().getRouter();
                      // oRouter.navTo("RouteView1");

                      this.exitDialog.close();
                      history.go(-1);

                    }.bind(that)
                  }), new sap.m.Button({
                    width: "100px",
                    visible: that.getView().getModel("visitModel").getProperty("/Visitid") !== 'NEW' && that.getView().getModel("visitModel").getProperty("/status") === '1',
                    type: sap.m.ButtonType.Emphasized,
                    text: "Create Visit",
                    press: function () {
                      // var oRouter = that.getOwnerComponent().getRouter();
                      // oRouter.navTo("RouteView1");
                      that.setLock = false;
                      that.onCreateVisit();
                      this.exitDialog.close();

                    }.bind(that)
                  }), new sap.m.Button({
                    type: sap.m.ButtonType.Emphasized,
                    visible: that.getView().getModel("visitModel").getProperty("/Visitid") !== 'NEW' && that.getView().getModel("visitModel").getProperty("/status") === '1',

                    width: "100px",
                    text: "Save Draft",
                    press: function () {
                      // var oRouter = that.getOwnerComponent().getRouter();
                      // oRouter.navTo("RouteView1");
                      that.onCreateDraftVisit_Exit();
                      this.exitDialog.close();

                    }.bind(that)
                  }), new sap.m.Button({
                    width: "100px",
                    type: 'Negative',
                    text: "No",
                    press: function () {
                      this.exitDialog.close();
                    }.bind(that)
                  })]
                });
              } else {

                that.exitDialog.close()
                that.exitDialog.destroy();
                that.exitDialog = null;


                that.exitDialog = new Dialog({
                  type: sap.m.DialogType.Message,
                  title: "Confirm",
                  content: new sap.m.Text({
                    text: "Are you sure you want to exit making changes to this Visit?"
                  }),
                  buttons: [new sap.m.Button({
                    width: "100px",
                    visible: that.getView().getModel("visitModel").getProperty("/Visitid") === 'NEW' || that.getView().getModel("visitModel").getProperty("/status") === '2',

                    type: sap.m.ButtonType.Emphasized,
                    text: "Yes",
                    press: function () {
                      // var oRouter = that.getOwnerComponent().getRouter();
                      // oRouter.navTo("RouteView1");

                      this.exitDialog.close();
                      history.go(-1);

                    }.bind(that)
                  }), new sap.m.Button({
                    width: "100px",
                    visible: that.getView().getModel("visitModel").getProperty("/Visitid") !== 'NEW' && that.getView().getModel("visitModel").getProperty("/status") === '1',
                    type: sap.m.ButtonType.Emphasized,
                    text: "Create Visit",
                    press: function () {
                      // var oRouter = that.getOwnerComponent().getRouter();
                      // oRouter.navTo("RouteView1");
                      that.setLock = false;
                      that.onCreateVisit();
                      this.exitDialog.close();

                    }.bind(that)
                  }), new sap.m.Button({
                    type: sap.m.ButtonType.Emphasized,
                    visible: that.getView().getModel("visitModel").getProperty("/Visitid") !== 'NEW' && that.getView().getModel("visitModel").getProperty("/status") === '1',

                    width: "100px",
                    text: "Save Draft",
                    press: function () {
                      // var oRouter = that.getOwnerComponent().getRouter();
                      // oRouter.navTo("RouteView1");
                      that.onCreateDraftVisit_Exit();
                      this.exitDialog.close();

                    }.bind(that)
                  }), new sap.m.Button({
                    width: "100px",
                    type: 'Negative',
                    text: "No",
                    press: function () {
                      this.exitDialog.close();
                    }.bind(that)
                  })]
                });


              }

              that.exitDialog.open();

            } else {
              var oRouter = that.getOwnerComponent().getRouter();
              oRouter.navTo("RouteView1");
            }

          });
        });





        this._view = this.getView();

        this.getView().setModel(new sap.ui.model.json.JSONModel({
          changeMode: false
        }), "chageModeModel");
        // this.selectSuppliers();


        this.mGroupFunctions = {
          DepartmentName: function (oContext) {
            var name = oContext.getProperty("DepartmentName");
            return {
              key: name,
              text: name
            };
          }
        };
        let defaultModel1 = that.getOwnerComponent().getModel("ZODATA_FIELDREP_IMAGES_V2_SRV");
        defaultModel1.refreshSecurityToken();

        this.getView().setModel(new sap.ui.model.json.JSONModel({
          deleted: false,
          creditBlock: false
        }), "searchModel");
        this.getLocation();



        // Initialize online/offline detection
        this._initializeOnlineOfflineHandlers();

        // Store initial online status
        this._isOnline = navigator.onLine;




        this.getOwnerComponent().getModel().attachRequestCompleted(function (oEvent) {

          if (oEvent.mParameters.url.includes("ZBMM_FieldRepNearbyCustomer") && !oEvent.mParameters.url.includes("$count")) {

            //  debugger;
            try {
              that.getView().byId("idSpots").removeAllItems()
            } catch (e) {

            }

            var jsArray = [];
            var jObjArray = JSON.parse(oEvent.mParameters.response.responseText).d.results;

            that.getView().getModel("userValues").setProperty("/countShipTo", jObjArray.length)

            for (var count = 0; count < jObjArray.length; count++) {
              var dist = that.getDistanceFromLatLonInKm(jObjArray[count].zzlatitude, jObjArray[count].zzlongitude, that.uLat, that.uLon);
              dist = Math.round((dist + Number.EPSILON) * 100) / 100;
              if (dist === null) {
                sap.m.MessageToast.show("Fetching location...");
                return;
              }
              jsArray.push({
                "pos": jObjArray[count].zzlongitude + ";" + jObjArray[count].zzlatitude + ";0",
                "lat": jObjArray[count].zzlatitude,
                "long": jObjArray[count].zzlongitude,
                "tooltip": jObjArray[count].name1 + " " + jObjArray[count].DistanceInMiles + "miles",
                "type": "Error",
                "text": jObjArray[count].kunnr,
                "distance": Number(jObjArray[count].DistanceInMiles),
                "Shipto": jObjArray[count].kunnr,
                "ShiptoName": jObjArray[count].name1,
                "stras": jObjArray[count].stras,
                "Salesman": jObjArray[count].sm,
                "Scale": "1;1;1",
                "selected": true,
                "city": jObjArray[count].ort01,
                "level": jObjArray[count].hier1_name,
                "altkn": jObjArray[count].altkn,
                "sorg": jObjArray[count].vkorg,
                "CreditBLock": jObjArray[count].CreditBLock,
                "Deleted": jObjArray[count].Deleted,
                "CompanyCode": jObjArray[count].bukrs




              })

            }

            jsArray = that.insertAtIndex(jsArray, 0, {
              "pos": that.uLon + ";" + that.uLat + ";0",
              "tooltip": that.getView().getModel("customerModel").getProperty("/CustomerFullName"),
              "type": "Success",
              "text": that.getView().getModel("customerModel").getProperty("/CustomerFullName").length > 15 ? that.getView().getModel("customerModel").getProperty("/CustomerFullName").substring(0, 15) + "..." : that.getView().getModel("customerModel").getProperty("/CustomerFullName"),
              "Shipto": that.getView().getModel("customerModel").getProperty("/Customer"),
              "ShiptoName": that.getView().getModel("customerModel").getProperty("/CustomerFullName"),
              "stras": that.getView().getModel("customerModel").getProperty("/StreetName"),
              "Salesman": "",
              "distance": 0,
              "scale": "3;3;3",
              "selected": false,
              "city": that.getView().getModel("customerModel").getProperty("/CityName"),
              "level": "",
              "altkn": "",
              "sorg": that.getView().getModel("customerModel").getProperty("/SalesOrganization"),
              "CreditBLock": false,
              "Deleted": false,
              "CompanyCode": that.getView().getModel("customerModel").getProperty("/CompanyCode")



            });


            var jsObj = {
              "Spots": {
                "items": jsArray


              }
            };

            that.getView().setModel(new sap.ui.model.json.JSONModel(
              JSON.parse(JSON.stringify(jsObj))
            ), "latlongModel");
            that.getView().getModel("latlongModel").setSizeLimit("9999");
            that.getView().getModel("latlongModel").setData(jsObj);




            that.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(
              JSON.parse(JSON.stringify(jsObj))
            ), "latlongModel");
            that.getOwnerComponent().getModel("latlongModel").setSizeLimit("9999");
            that.getOwnerComponent().getModel("latlongModel").setData(jsObj);

          }
        });

        // Initialize prospect pipeline edit mode model
        this.getView().setModel(new sap.ui.model.json.JSONModel({
          editMode: false,
          originalData: {}
        }), "prospectPipelineModel");

      },

      onNavBack: function (oEvent) {
        history.go(-1);
      },



      onToggleProspectEdit: function () {
        var oProspectPipelineModel = this.getView().getModel("prospectPipelineModel");
        var oCustomerModel = this.getView().getModel("customerModel");
        var bCurrentEditMode = oProspectPipelineModel.getProperty("/editMode");

        if (!bCurrentEditMode) {
          // Entering edit mode - store original values
          oProspectPipelineModel.setProperty("/originalData", {
            PriceExists: oCustomerModel.getProperty("/PriceExists"),
            ProjectedSales: oCustomerModel.getProperty("/ProjectedSales"),
            ProjectedDelivery: oCustomerModel.getProperty("/ProjectedDelivery")
          });
          oProspectPipelineModel.setProperty("/editMode", true);
        } else {
          // Exiting edit mode - restore original values
          this.onCancelProspectEdit();
        }
      },
      onCancelProspectEdit: function () {
        var oProspectPipelineModel = this.getView().getModel("prospectPipelineModel");
        var oCustomerModel = this.getView().getModel("customerModel");
        var oOriginalData = oProspectPipelineModel.getProperty("/originalData");

        // Restore original values
        oCustomerModel.setProperty("/PriceExists", oOriginalData.PriceExists);
        oCustomerModel.setProperty("/ProjectedSales", oOriginalData.ProjectedSales);
        oCustomerModel.setProperty("/ProjectedDelivery", oOriginalData.ProjectedDelivery);

        oProspectPipelineModel.setProperty("/editMode", false);
      },

      onSaveProspectPipeline: function () {
        var that = this;
        var oView = this.getView();
        var oCustomerModel = oView.getModel("customerModel");
        var oProspectPipelineModel = oView.getModel("prospectPipelineModel");

        // Get values from the model
        var sKunnr = oCustomerModel.getProperty("/Customer");
        var fProjectedSales = oCustomerModel.getProperty("/ProjectedSales");
        var dProjectedDelivery = oCustomerModel.getProperty("/ProjectedDelivery");
        var bPriceExists = oCustomerModel.getProperty("/PriceExists");

        // Validation
        if (!sKunnr) {
          sap.m.MessageBox.error("Customer number is required");
          return;
        }

        // Convert date to SAP format /Date(timestamp)/
        var sDateString = "";
        if (dProjectedDelivery) {
          var timestamp = new Date(dProjectedDelivery).getTime();
          sDateString = "/Date(" + timestamp + ")/";
        }

        // Prepare payload
        var oPayload = {
          "Prospect": {
            "Kunnr": sKunnr,
            "Zzprojectedsales": fProjectedSales ? fProjectedSales.toString() : "0",
            "Zzprojecteddelv": sDateString === "" ? null : sDateString,
            "Zzpriceexists": bPriceExists ? "X" : ""
          },
          "Testrun": "N"
        };

        // Get OData model
        var oDataModel = this.getOwnerComponent().getModel("ZODATA_FR_SRV");

        // Show busy indicator
        oView.setBusy(true);

        // Call OData service
        oDataModel.update("/ProspectUpdateSet('N')", oPayload, {
          success: function (oData, response) {
            oView.setBusy(false);
            oProspectPipelineModel.setProperty("/editMode", false);

            sap.m.MessageToast.show("Prospect pipeline data updated successfully");

            // Refresh customer data
            that.fetchCustomer(sKunnr, that.vkorg);
          },
          error: function (oError) {
            oView.setBusy(false);

            var sErrorMessage = "Error updating prospect pipeline data";
            try {
              var oErrorResponse = JSON.parse(oError.responseText);
              sErrorMessage = oErrorResponse.error.message.value || sErrorMessage;
            } catch (e) {
              // Use default error message
            }

            sap.m.MessageBox.error(sErrorMessage);
          }
        });
      },




      _initializeOnlineOfflineHandlers: function () {
        var that = this;

        // Listen for online event
        window.addEventListener('online', function () {
          that._handleOnlineEvent();
        });

        // Listen for offline event
        window.addEventListener('offline', function () {
          that._handleOfflineEvent();
        });
      },

      _handleOnlineEvent: function () {
        var that = this;
        this._isOnline = true;

        console.log("Connection restored - checking for pending notes to save");

        // Small delay to ensure connection is stable
        setTimeout(function () {
          that._checkAndSavePendingNotes();
        }, 1000);
      },

      _handleOfflineEvent: function () {
        this._isOnline = false;
        console.log("Connection lost - notes will be saved to cookies only");

        // Optional: Show a subtle message to user
        sap.m.MessageToast.show("Working offline - your notes are saved locally");
      },


      _checkAndSavePendingNotes: function () {
        var that = this;
        var cookieKey = this.getCookieKey();
        var savedNotes = this.getCookie(cookieKey);

        if (!savedNotes) {
          console.log("No pending notes to save or notes too short");
          return;
        }

        var visitId = this.getView().getModel("visitModel").getProperty("/Visitid");
        var customer = this.getView().getModel("customerModel").getProperty("/Customer");

        if (!customer) {
          console.log("No customer selected - cannot save notes");
          return;
        }

        console.log("Found pending notes - attempting to save to server");

        // If visit is still NEW, create draft visit
        if (visitId === 'NEW' || visitId === '' || typeof visitId === 'undefined') {
          console.log("Visit is NEW - creating draft visit with notes from cookie");

          this.getView().getModel("visitModel").setProperty("/status", "1");
          this.onCreateVisit_Periodic(that);

          setTimeout(function () {
            if (that.getView().byId("CreateProductWizard")) {
              that.getView().byId("CreateProductWizard").getSteps()[5].setValidated(true);
            }
          }, 1000);

          // Show success message after a delay
          setTimeout(function () {
            if (that.visitid && that.visitid !== 'NEW') {
              sap.m.MessageToast.show("Notes saved successfully - Draft Visit #" + that.visitid + " created");
            }
          }, 2000);

        } else {
          // Visit already exists, just update notes
          console.log("Updating existing visit notes from cookie");
          that.onUpdateNotes_periodic();

          setTimeout(function () {
            sap.m.MessageToast.show("Notes saved successfully");
          }, 1000);
        }
      },
      onFinishStep: function () {
        var that = this;

        if (that.getView().getModel("chageModeModel").getProperty("/changeMode")) {
          if (!that.exitDialog) {
            that.exitDialog = new Dialog({
              type: sap.m.DialogType.Message,
              title: "Confirm",
              content: new sap.m.Text({
                text: "Are you sure you want to exit making changes to this Visit?"
              }),
              buttons: [new sap.m.Button({
                width: "100px",
                visible: that.getView().getModel("visitModel").getProperty("/Visitid") === 'NEW' || that.getView().getModel("visitModel").getProperty("/status") === '2',

                type: sap.m.ButtonType.Emphasized,
                text: "Yes",
                press: function () {
                  // var oRouter = that.getOwnerComponent().getRouter();
                  // oRouter.navTo("RouteView1");

                  this.exitDialog.close();
                  history.go(-1);

                }.bind(that)
              }), new sap.m.Button({
                width: "100px",
                visible: that.getView().getModel("visitModel").getProperty("/Visitid") !== 'NEW' && that.getView().getModel("visitModel").getProperty("/status") === '1',
                type: sap.m.ButtonType.Emphasized,
                text: "Create Visit",
                press: function () {
                  // var oRouter = that.getOwnerComponent().getRouter();
                  // oRouter.navTo("RouteView1");
                  that.setLock = false;
                  that.onCreateVisit();
                  this.exitDialog.close();

                }.bind(that)
              }), new sap.m.Button({
                type: sap.m.ButtonType.Emphasized,
                visible: that.getView().getModel("visitModel").getProperty("/Visitid") !== 'NEW' && that.getView().getModel("visitModel").getProperty("/status") === '1',

                width: "100px",
                text: "Save Draft",
                press: function () {
                  // var oRouter = that.getOwnerComponent().getRouter();
                  // oRouter.navTo("RouteView1");
                  that.onCreateDraftVisit_Exit();
                  this.exitDialog.close();

                }.bind(that)
              }), new sap.m.Button({
                width: "100px",
                type: 'Negative',
                text: "No",
                press: function () {
                  this.exitDialog.close();
                }.bind(that)
              })]
            });
          } else {

            that.exitDialog.close()
            that.exitDialog.destroy();
            that.exitDialog = null;


            that.exitDialog = new Dialog({
              type: sap.m.DialogType.Message,
              title: "Confirm",
              content: new sap.m.Text({
                text: "Are you sure you want to exit making changes to this Visit?"
              }),
              buttons: [new sap.m.Button({
                width: "100px",
                visible: that.getView().getModel("visitModel").getProperty("/Visitid") === 'NEW' || that.getView().getModel("visitModel").getProperty("/status") === '2',

                type: sap.m.ButtonType.Emphasized,
                text: "Yes",
                press: function () {
                  // var oRouter = that.getOwnerComponent().getRouter();
                  // oRouter.navTo("RouteView1");

                  this.exitDialog.close();
                  history.go(-1);

                }.bind(that)
              }), new sap.m.Button({
                width: "100px",
                visible: that.getView().getModel("visitModel").getProperty("/Visitid") !== 'NEW' && that.getView().getModel("visitModel").getProperty("/status") === '1',
                type: sap.m.ButtonType.Emphasized,
                text: "Create Visit",
                press: function () {
                  // var oRouter = that.getOwnerComponent().getRouter();
                  // oRouter.navTo("RouteView1");
                  that.setLock = false;
                  that.onCreateVisit();
                  this.exitDialog.close();

                }.bind(that)
              }), new sap.m.Button({
                type: sap.m.ButtonType.Emphasized,
                visible: that.getView().getModel("visitModel").getProperty("/Visitid") !== 'NEW' && that.getView().getModel("visitModel").getProperty("/status") === '1',

                width: "100px",
                text: "Save Draft",
                press: function () {
                  // var oRouter = that.getOwnerComponent().getRouter();
                  // oRouter.navTo("RouteView1");
                  that.onCreateDraftVisit_Exit();
                  this.exitDialog.close();

                }.bind(that)
              }), new sap.m.Button({
                width: "100px",
                type: 'Negative',
                text: "No",
                press: function () {
                  this.exitDialog.close();
                }.bind(that)
              })]
            });


          }

          that.exitDialog.open();

        } else {
          var oRouter = that.getOwnerComponent().getRouter();
          oRouter.navTo("RouteView1");
        }



        // if(  that.getView().getModel("chageModeModel").getProperty("/changeMode")){
        //   if (!that.exitDialog) {
        //     that.exitDialog = new Dialog({
        //       type: sap.m.DialogType.Message,
        //       title: "Confirm",
        //       content: new sap.m.Text({ text: "Are you sure you want to exit making changes to this Visit?" }),
        //       buttons: [new sap.m.Button({
        //         width:"100px",
        //         type: sap.m.ButtonType.Emphasized,
        //         text: "Create Visit",
        //         press: function () {
        //           // var oRouter = that.getOwnerComponent().getRouter();
        //           // oRouter.navTo("RouteView1");
        //           that.onCreateVisit();
        //           this.exitDialog.close();

        //         }.bind(that)
        //       }),new sap.m.Button({
        //         type: sap.m.ButtonType.Emphasized,
        //         width:"100px",
        //         text: "Save Draft",
        //         press: function () {
        //           // var oRouter = that.getOwnerComponent().getRouter();
        //           // oRouter.navTo("RouteView1");
        //           that.onCreateDraftVisit_Exit();
        //           this.exitDialog.close();

        //         }.bind(that)
        //       }),new sap.m.Button({
        //         width:"100px",
        //         type: 'Negative',
        //         text: "No",
        //         press: function () {
        //           this.exitDialog.close();
        //         }.bind(that)
        //       })
        //     ]
        //     });
        //   }

        //   that.exitDialog.open();

        // }else{
        //   history.go(-1);
        // }
      },
      readSuppliers: function () {

        let defaultModel = this.getOwnerComponent().getModel("ZBMM_FRVISITDEFSUPP_CDS");
        var that = this;
        var userauthFilters1 = new sap.ui.model.Filter([
          //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
          new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, that.vkorg),
          new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, '')


        ], false);
        defaultModel.read("/ZBMM_FRVISITDEFSUPP", {
          urlParameters: {


          },
          filters: [userauthFilters1],
          success: function (oData, oResponse) {
            // var plant = oData.results.find(element => element.parid === "WRK");
            var oDataResults = oData;

            var arr = oDataResults.results;

            var clean = arr.filter((arr, index, self) =>
              index === self.findIndex((t) => (t.save === arr.save && t.Name1 === arr.Name1)))



            clean.forEach(element => {
              element.Selected = false;

            });
            that.getView().setModel(new sap.ui.model.json.JSONModel({
              results: clean
            }), "supplierModel");
            that.selectSuppliers();

          },

          error: function (oError) {}
        });

      },

      readSRVisitDefaultParam: function (oEvent) {

        let defaultModel = this.getOwnerComponent().getModel("ZCXA_USERDEFAULT_CDS");
        var that = this;
        defaultModel.read("/ZCXA_USERDEFAULT", {
          success: function (oData, oResponse) {

            var visittype = oData.results.find(element => element.parid === "ZFMT_VISITTYPE");

            if (visittype) {

              that.visittype = visittype.parva;
            }


          },

          error: function (oError) {}
        });
      },




      checkAuthorization: function (user) {

        // to check

        var that = this;
        if (user === sap.ushell.Container.getService("UserInfo").getId()) {
          that.getView().setModel(new sap.ui.model.json.JSONModel({
            changeMode: true
          }), "chageModeModel");
          return;
        }
        if (sap.ushell.Container.getService("UserInfo").getId() === 'DEFAULT_USER') {
          that.getView().setModel(new sap.ui.model.json.JSONModel({
            changeMode: true
          }), "chageModeModel");
          return;
        }
        let defaultModel = this.getOwnerComponent().getModel("ZCXA_USERAUTH_CDS");
        var that = this;
        var userauthFilters = new sap.ui.model.Filter([
          //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
          new sap.ui.model.Filter("authvalfrom", sap.ui.model.FilterOperator.EQ, '*'),

          new sap.ui.model.Filter("bname", sap.ui.model.FilterOperator.EQ, sap.ushell.Container.getService("UserInfo").getId()),
          new sap.ui.model.Filter("authfield", sap.ui.model.FilterOperator.EQ, 'USER'),
          new sap.ui.model.Filter("authobject", sap.ui.model.FilterOperator.EQ, 'ZFMTSUPER')

        ], true);
        var userauthFilters1 = new sap.ui.model.Filter([
          //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
          new sap.ui.model.Filter("authvalfrom", sap.ui.model.FilterOperator.EQ, user),

          userauthFilters

        ], false);
        defaultModel.read("/ZCXA_USERAUTH", {
          filters: [userauthFilters1],
          success: function (oData, oResponse) {
            // var plant = oData.results.find(element => element.parid === "WRK");
            var arrayUsers = oData.results;
            var visittype = oData.results.find(element => element.parid === "ZFMT_VISITTYPE");

            if (visittype) {

              that.visittype = visittype.parva;
            }
            var flagValue = false;
            arrayUsers.forEach(element => {

              if (element.authvalfrom === "*") {
                that.getView().setModel(new sap.ui.model.json.JSONModel({
                  changeMode: true
                }), "chageModeModel");
                flagValue = true;
                return;

              }


            });
            if (!flagValue) {
              sap.m.MessageBox.error("You are not authorized to perform this action");

            }

          },

          error: function (oError) {

            sap.m.MessageBox.error("There in issue with this action.");

          }
        });

      },

      checkDeleteComment: function (obj) {

        // var that = this;
        // if (user === sap.ushell.Container.getService("UserInfo").getId()) {
        //   that.getView().setModel(new sap.ui.model.json.JSONModel({ changeMode: true })
        //     , "chageModeModel");
        //   return;
        // }
        // if (sap.ushell.Container.getService("UserInfo").getId() === 'DEFAULT_USER') {
        //   that.getView().setModel(new sap.ui.model.json.JSONModel({ changeMode: true })
        //     , "chageModeModel");
        //   return;
        // }
        let defaultModel = this.getOwnerComponent().getModel("ZCXA_USERAUTH_CDS");
        var that = this;
        var userauthFilters = new sap.ui.model.Filter([
          //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);

          new sap.ui.model.Filter("authvalfrom", sap.ui.model.FilterOperator.EQ, '*'),

          new sap.ui.model.Filter("bname", sap.ui.model.FilterOperator.EQ, sap.ushell.Container.getService("UserInfo").getId()),
          new sap.ui.model.Filter("authfield", sap.ui.model.FilterOperator.EQ, 'USER'),
          new sap.ui.model.Filter("authobject", sap.ui.model.FilterOperator.EQ, 'ZFMTSUPER')

        ], true);


        var userauthFilters1 = new sap.ui.model.Filter([
          //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
          new sap.ui.model.Filter("authvalfrom", sap.ui.model.FilterOperator.EQ, obj.Ernam),

          userauthFilters

        ], false);
        defaultModel.read("/ZCXA_USERAUTH", {
          filters: [userauthFilters1],
          success: function (oData, oResponse) {
            // var plant = oData.results.find(element => element.parid === "WRK");
            var arrayUsers = oData.results;
            var visittype = oData.results.find(element => element.parid === "ZFMT_VISITTYPE");

            if (visittype) {

              that.visittype = visittype.parva;
            }

            var flagValue = false;
            arrayUsers.forEach(element => {

              if (element.authvalfrom === "*" || obj.Ernam === sap.ushell.Container.getService("UserInfo").getId()) {
                that.onDeleteComment_last(obj);
                flagValue = true;
                return;

              }


            });
            if (!flagValue) {
              sap.m.MessageBox.error("You are not authorized to perform this action");

            }

          },

          error: function (oError) {

            sap.m.MessageBox.error("There in issue with this action.");

          }
        });

      },
      updateVisit: function (visitid, Customer, vkorg) {

        var obj = {
          status: 'X'
        }
        let defaultModel1 = this.getOwnerComponent().getModel("ZRMM_FRVISITV2_CDS");
        // defaultModel1.setHeaders({"If-Match":"*",
        //   "Content-Type" : "application/json",
        //   "Prefer": "handling=strict",
        //   "sap-message-scope": "BusinessObject",
        //   "sap-contextid-accept" :"header",
        //   "Accept-Language": "en"});
        var that = this;

        defaultModel1.update("/ZRMM_FRVISITV2('" + visitid + "')", obj, {
          success: function (oData, oResponse) {
            that.getView().setBusy(false);
            // that.getView().byId("smartTable_visitF4_draft").rebindTable();

            // that.getView().byId("smartTable_visitF4_prospect_draft").rebindTable();


            that.fetchCustomer(Customer, vkorg);
          },

          error: function (oError) {
            //      sap.m.MessageBox.error("There in issue with this action.");
          }
        });
      },
      updateVisit_Type: function (visitid, Customer, vkorg) {

        debugger;

        var visittype = this.getView().getModel("visitModel").getData().Visittype;
        var visitid = this.getView().getModel("visitModel").getData().Visitid;

        var obj = {
          Visittype: visittype
        }
        let defaultModel1 = this.getOwnerComponent().getModel("ZRMM_FRVISITV2_CDS");
        // defaultModel1.setHeaders({"If-Match":"*",
        //   "Content-Type" : "application/json",
        //   "Prefer": "handling=strict",
        //   "sap-message-scope": "BusinessObject",
        //   "sap-contextid-accept" :"header",
        //   "Accept-Language": "en"});
        var that = this;

        defaultModel1.update("/ZRMM_FRVISITV2('" + visitid + "')", obj, {
          success: function (oData, oResponse) {
            that.getView().setBusy(false);
            // that.getView().byId("smartTable_visitF4_draft").rebindTable();

            // that.getView().byId("smartTable_visitF4_prospect_draft").rebindTable();


            that.fetchCustomer(Customer, vkorg);
          },

          error: function (oError) {
            //      sap.m.MessageBox.error("There in issue with this action.");
          }
        });
      },
      covertDraftToVisit_ask: function (oEvent) {


        var that = this;

        that.exitDialog = new Dialog({
          type: sap.m.DialogType.Message,
          title: "Confirm",
          content: new sap.m.Text({
            text: "Are you sure you want to convert these draft Visit(s)?"
          }),
          buttons: [new sap.m.Button({
            width: "100px",

            type: sap.m.ButtonType.Emphasized,
            text: "Yes",
            press: function () {
              that.covertDraftToVisit();
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




      covertDraftToVisit: function (visitid) {


        var that = this;
        var selectContexts = this.getView().getModel("existingDraftModel").getData().items;

        selectContexts.forEach(element => {

          var visitid = element.Visitid;

          var obj = {
            status: '2'
          }
          let defaultModel1 = that.getOwnerComponent().getModel("ZRMM_FRVISITV2_CDS");
          // defaultModel1.setHeaders({"If-Match":"*",
          //   "Content-Type" : "application/json",
          //   "Prefer": "handling=strict",
          //   "sap-message-scope": "BusinessObject",
          //   "sap-contextid-accept" :"header",
          //   "Accept-Language": "en"});


          defaultModel1.update("/ZRMM_FRVISITV2('" + visitid + "')", obj, {
            success: function (oData, oResponse) {
              that.getView().setBusy(false);
              that.exitDialog.close();
              sap.m.MessageBox.success("Draft Visit " + visitid + " successfully converted to regular visit");

              that.fetchCustomer(that.getView().getModel("userValues").getProperty("/Customer"), that.getView().getModel("userValues").getProperty("/salesorg"));

              // var isProspect =   this.getView().getModel("prospectModel").getProperty("/prospect");

              that.checkIfDraftExist(that.getView().getModel("userValues").getProperty("/Customer"))

              //   if(isProspect){
              //   var oRouter = this.getOwnerComponent().getRouter();
              //   oRouter.navTo("newvisit", {
              //       shipto: this.getView().getModel("visitModel").getProperty("/Customer"),
              //       vkorg:  this.getView().getModel("visitModel").getProperty("/Vkorg"),
              //       prospect:  true 
              //   });

              //   this.fetchCustomer(this.getView().getModel("visitModel").getProperty("/Customer"), this.getView().getModel("visitModel").getProperty("/Vkorg"));
              // }else{
              //   var oRouter = this.getOwnerComponent().getRouter();
              //   oRouter.navTo("newvisit", {
              //       shipto: this.getView().getModel("visitModel").getProperty("/Customer"),
              //       vkorg:  this.getView().getModel("visitModel").getProperty("/Vkorg")
              //   });
              //   this.fetchCustomer(this.getView().getModel("visitModel").getProperty("/Customer"), this.getView().getModel("visitModel").getProperty("/Vkorg"));

              // }

              // that.getView().byId("smartTable_visitF4_draft").rebindTable();

              // that.getView().byId("smartTable_visitF4_prospect_draft").rebindTable();
            },

            error: function (oError) {
              //      sap.m.MessageBox.error("There in issue with this action.");
            }
          });

        });
        that.pDialog_extdraftDialog.close();





      },

      onCloseCurrentDialog: function (oEvent) {
        oEvent.getSource().getParent().close();

      },



      groupData: function () {
        var oBinding = this.getView().byId("keyTablezfieldrep").getBinding("items");

        var aGroups = [];
        aGroups.push(new sap.ui.model.Sorter("DepartmentName", true, this.mGroupFunctions["DepartmentName"]));
        // apply the selected group settings
        oBinding.sort(aGroups);


      },

      selectSuppliers: function () {

        var that = this;

        var othSupplierData = that.getView().getModel("customerModel").getData().to_Supp.results;
        //that.getView().getModel("customerModel").getData().to_Supp.results[0].Name1
        var originalSupplierData = this.getView().getModel("supplierModel").getData();

        this.filterSupplier = new sap.ui.model.Filter([
          //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
          new sap.ui.model.Filter("Others", sap.ui.model.FilterOperator.NE, 'X')

        ], false);
        var that = this;

        // setTimeout(() => {
        that.getView().byId("idOthSuppliers").getBinding("items").filter(that.filterSupplier);

        // }, 2000);

        originalSupplierData.results.forEach(element1 => {
          othSupplierData.forEach(element => {
            if (element1.Name1 === element.Name1) {

              element1.Selected = true;
              element1.Others = '';

              // element1.getCells()[1].setSelected(true);
            }

          });
        });

        that.getView().setModel(new sap.ui.model.json.JSONModel(originalSupplierData), "supplierModel");





        this.filterSupplier = new sap.ui.model.Filter([
          //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
          new sap.ui.model.Filter("Others", sap.ui.model.FilterOperator.NE, 'X')

        ], false);

        this.getView().byId("idOthSuppliers").getBinding("items").filter(that.filterSupplier);



      },
      fetchCustomer: function (shipto, vkorg) {




        // this.getView().setModel(new sap.ui.model.json.JSONModel(
        //   {
        //     "salesorg": vkorg


        //   }
        // ), "userValues");
        this.getView().getModel("userValues").setProperty("/salesorg", vkorg);

        //   this.getView().setBusy(true);
        this.getMOEData(shipto, vkorg);


        var that = this;

        // After customer data is loaded, check for cookie
        setTimeout(function () {
          var cookieKey = that.getCookieKey();
          var savedNotes = that.getCookie(cookieKey);

          if (savedNotes) {
            var notesModel = that.getView().getModel("notesModel");
            if (notesModel && notesModel.getData().results && notesModel.getData().results[0]) {
              notesModel.getData().results[0].Notes = savedNotes;
              notesModel.refresh();
            }
          }
        }, 500);

      },

      getMOEData: function (shipto, vkorg) {

        var that = this;

        let defaultModel1 = this.getOwnerComponent().getModel("ZODATA_FR_SRV");
        defaultModel1.read("/ZBSD_MOE_VH(p_kunnr='" + shipto + "',p_vkorg='" + vkorg + "')/Set", {

          success: function (oData, oResponse) {
            // var plant = oData.results.find(element => element.parid === "WRK");
            var oDataResults = oData;
            //       debugger;


            that.getView().setModel(new sap.ui.model.json.JSONModel(oDataResults), "moeModel");



            let defaultModel = that.getOwnerComponent().getModel("ZODATA_FR_SRV");
            defaultModel.read("/ZBMMCUSTOMERVISIT(Customer='" + shipto + "',SalesOrganization='" + that.vkorg + "')", {
              urlParameters: {
                "$expand": "to_SM,to_SS,to_Supp,to_Dep",

              },
              success: function (oData, oResponse) {
                //     debugger;
                // var plant = oData.results.find(element => element.parid === "WRK");
                that.getView().setBusy(false);
                var oDataResults = oData;
                that.getView().setModel(new sap.ui.model.json.JSONModel(oDataResults), "customerModel");

                if (oDataResults.CustomerAccountGroup === "ZPR") {
                  that.getView().setModel(new sap.ui.model.json.JSONModel({
                    "prospect": true
                  }), "prospectModel");
                } else {
                  that.getView().setModel(new sap.ui.model.json.JSONModel({
                    "prospect": false
                  }), "prospectModel");
                }
                that.customer = shipto;
                that.readSuppliers();
                that.groupData();
                if (that.getView().getModel("userValues").getProperty("/moe")) {
                  var tblBinding = that.getView().byId("moetable").getBinding("items");

                  var oFilter = new sap.ui.model.Filter("account_inactive", sap.ui.model.FilterOperator.NE, 'X');
                  tblBinding.filter(oFilter, sap.ui.model.FilterType.Application);;
                  // that.getView().setModel(new sap.ui.model.json.JSONModel({Notes : '',editable:true}
                  // ), "notesModel");
                }

                if ((that.visitid === "" || that.visitid === "NEW" || typeof that.visitid === 'undefined') && (!that.visitType || that.visitType === '')) {
                  if (that.visittype && that.visittype === 'SR') {

                    that.getView().getModel("visitModel").setProperty("/Visittype", "SR"); // New Visit Type SR
                  }

                  if (that.visittype && that.visittype === 'F') {

                    that.getView().getModel("visitModel").setProperty("/Visittype", "F"); // New Visit Type SR
                  }

                  if (that.visittype && that.visittype === 'N') {

                    that.getView().getModel("visitModel").setProperty("/Visittype", "N"); // New Visit Type SR
                  }

                  if (that.visittype && that.visittype === 'R') {

                    that.getView().getModel("visitModel").setProperty("/Visittype", "R"); // New Visit Type SR
                  }

                  if (that.visittype && that.visittype === 'S') {

                    that.getView().getModel("visitModel").setProperty("/Visittype", "S"); // New Visit Type SR
                  }

                  if (that.visittype && that.visittype === 'RV') {

                    that.getView().getModel("visitModel").setProperty("/Visittype", "RV"); // New Visit Type SR
                  }
                }
                // }

                //   that.getView().setModel(new sap.ui.model.json.JSONModel({"authCustomer":true}
                // ), "authCustomerModel");
                that.onEnterNotes();

                if (that.visitType === 'RV') {
                  that.onEnterNotes1();
                  that.getView().getModel("visitModel").setProperty("/Visittype", "RV"); // New Visit Type SR
                }





                var oTable = that.getView().byId("keyTablezfieldrep");
                var oBinding = oTable.getBinding("items");


                var oFilter = new sap.ui.model.Filter("Department", sap.ui.model.FilterOperator.BT, "A", "Z");
                oBinding.filter(oFilter, sap.ui.model.FilterType.Application);

              },

              error: function (oError) {
                that.getView().setModel(new sap.ui.model.json.JSONModel({
                  "Customer": ""
                }), "customerModel");

                // that.getView().setModel(new sap.ui.model.json.JSONModel({"authCustomer":false}
                // ), "authCustomerModel");
                that.getView().setBusy(false);

              }
            });

            let defaultModel1 = that.getOwnerComponent().getModel("ZRMM_FRVISITV2_CDS");
            defaultModel1.read("/ZRMM_FRVISITV2NOTES", {
              urlParameters: {
                "$filter": "Kunnr eq '" + shipto + "' and Type eq 'N'",

              },
              success: function (oData, oResponse) {
                // var plant = oData.results.find(element => element.parid === "WRK");
                var oDataResults = oData;
                if (oDataResults.results.length > 0) {
                  oDataResults.results.forEach(element => {
                    if (element.Visitid === that.visitid && that.getView().getModel("visitModel").getProperty("/status") === '1') {
                      element.editable = true;
                    } else
                      element.editable = false;
                    element.originalText = element.Notes;
                  });
                  if (that.visitid === "" || that.visitid === "NEW" || typeof that.visitid === 'undefined') {
                    oDataResults.results.unshift({
                      "Delete_mc": true,
                      "Update_mc": true,
                      "Visitid": "NEW",
                      "Lineid": 0,
                      "Spras": "",
                      "Type": "N",
                      "Createdatetime": new Date(),
                      "Kunnr": "",
                      "Vkorg": "",
                      "Notes": "",

                      "Ernam": "",
                      "originalText": "",
                      "editable": true
                    });
                  }
                } else {
                  oDataResults.results.push({
                    "Delete_mc": true,
                    "Update_mc": true,
                    "Visitid": "NEW",
                    "Lineid": 0,
                    "Spras": "",
                    "Type": "N",
                    "Createdatetime": new Date(),
                    "Kunnr": "",
                    "Vkorg": "",
                    "Notes": "",
                    "originalText": "",

                    "Ernam": "",
                    "editable": true
                  });

                }
                oDataResults.results.forEach(element => {
                  if (element.Visitid === that.visitid) {
                    element.visitid_new = '9999';
                  } else {
                    element.visitid_new = element.Visitid;
                  }

                });
                var notesArray = [];

                if (that.getView().getModel("visitModel").getData().status === '1') {


                  that.getView().setModel(new sap.ui.model.json.JSONModel(oDataResults), "notesModel");
                } else {
                  oDataResults.results.forEach(element => {

                    if (element.status !== '1') {

                      notesArray.push(element);
                    }
                  });

                  that.getView().setModel(new sap.ui.model.json.JSONModel({
                    results: notesArray
                  }), "notesModel");

                }




                // Comment Model



              },

              error: function (oError) {}
            });



          },

          error: function (oError) {}
        });





      },

      onVisitNoteSelected: function (oEvent) {


        this.extractComments(oEvent.getSource().getSelectedKey());
      },

      extractComments: function (visitID) {


        this.getView().setModel(new sap.ui.model.json.JSONModel({
          "Visitid": visitID
        }), "currentVisitNoteModel");
        let defaultModel1 = this.getOwnerComponent().getModel("ZRMM_FRVISITV2_CDS");

        var that = this;


        if (visitID === "" || visitID === "NEW" || typeof visitID === 'undefined') {

          var oDataResults1 = {};
          oDataResults1.results = [];
          // oDataResults.results.push({
          //   "Delete_mc": true,
          //   "Update_mc": true,
          //   "Visitid": "NEW",
          //   "Lineid": 0,
          //   "Spras": "",
          //   "Type": "N",
          //   "Createdatetime": new Date(),
          //   "Kunnr": "",
          //   "Vkorg": "",
          //   "Notes": "",
          //   "originalText":"",
          //   "isFirstComment": true,
          //   "Ernam": "",
          //   "editable": true
          // });
          that.getView().setModel(new sap.ui.model.json.JSONModel(oDataResults1), "commentsModel");
          return;
        }




        defaultModel1.read("/ZRMM_FRVISITV2NOTES", {
          urlParameters: {
            "$filter": "Visitid eq '" + visitID + "' and Type eq 'C'",

          },
          success: function (oData, oResponse) {
            // var plant = oData.results.find(element => element.parid === "WRK");
            var oDataResults = oData;
            if (oDataResults.results.length > 0) {
              oDataResults.results.forEach(element => {
                element.editable = false;
                element.originalText = element.Notes;
              });
              if (that.visitid === "" || that.visitid === "NEW" || typeof that.visitid === 'undefined') {
                oDataResults.results.unshift({
                  "Delete_mc": true,
                  "Update_mc": true,
                  "Visitid": "NEW",
                  "Lineid": 0,
                  "Spras": "",
                  "Type": "N",
                  "Createdatetime": new Date(),
                  "Kunnr": "",
                  "Vkorg": "",
                  "Notes": "",
                  "isFirstComment": true,
                  "Ernam": "",
                  "originalText": "",
                  "editable": true
                });
              }
            } else {
              // oDataResults.results.push({
              //   "Delete_mc": true,
              //   "Update_mc": true,
              //   "Visitid": "NEW",
              //   "Lineid": 0,
              //   "Spras": "",
              //   "Type": "N",
              //   "Createdatetime": new Date(),
              //   "Kunnr": "",
              //   "Vkorg": "",
              //   "Notes": "",
              //   "originalText":"",
              //   "isFirstComment": true,
              //   "Ernam": "",
              //   "editable": true
              // });

            }

            that.getView().setModel(new sap.ui.model.json.JSONModel(oDataResults), "commentsModel");

          },

          error: function (oError) {}
        });
      },

      fetchVisitDetails: function (visitID) {

        var that = this;
        let defaultModel1 = this.getOwnerComponent().getModel("ZRMM_FRVISITV2_CDS");

        defaultModel1.read("/ZRMM_FRVISITV2('" + visitID + "')", {
          urlParameters: {
            "$expand": "to_notes,to_team,to_images",

          },
          success: function (oData, oResponse) {
            // var plant = oData.results.find(element => element.parid === "WRK");
            var oDataResults = oData;
            that.getView().setModel(new sap.ui.model.json.JSONModel(oDataResults), "visitModel");

            //      debugger;
            var oFilter = new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.Contains, 'C');
            that.getView().byId("idFeedComments").getBinding("items").filter(oFilter, sap.ui.model.FilterType.Application);;
            var oBinding = that.getView().byId("idFeedComments").getBinding("items")

            var sSortKey = "Createdatetime";
            var bDescending = true; //switches the boolean back and forth from ascending to descending
            var bGroup = false;
            var aSorter = [];

            aSorter.push(new sap.ui.model.Sorter(sSortKey, bDescending, bGroup));
            oBinding.sort(aSorter);

            that.getView().setModel(new sap.ui.model.json.JSONModel({
              "authCustomer": true
            }), "authCustomerModel");

          },

          error: function (oError) {

            that.getView().setModel(new sap.ui.model.json.JSONModel({
              "authCustomer": false
            }), "authCustomerModel");
          }
        });
      },

      extractVisitNotes: function (shipto) {

        var that = this;

        let defaultModel1 = this.getOwnerComponent().getModel("ZRMM_FRVISITV2_CDS");

        defaultModel1.read("/ZRMM_FRVISITV2NOTES", {
          urlParameters: {
            "$filter": "Kunnr eq '" + shipto + "' and Type eq 'N'",

          },
          success: function (oData, oResponse) {
            // var plant = oData.results.find(element => element.parid === "WRK");
            var oDataResults = oData;
            oDataResults.results.forEach(element => {
              if (element.Visitid === that.visitid) {
                element.visitid_new = '9999';
              } else {
                element.visitid_new = element.Visitid;
              }

            });
            that.getView().setModel(new sap.ui.model.json.JSONModel(oDataResults), "notesModel");

          },

          error: function (oError) {}
        });

      },

      openVisitByNav: function (visitid) {

        let defaultModel1 = this.getOwnerComponent().getModel("ZRMM_FRVISITV2_CDS");
        this.visitid = visitid;
        this.extractComments(visitid);
        var that = this;

        defaultModel1.read("/ZRMM_FRVISITV2('" + visitid + "')", {
          urlParameters: {
            "$expand": "to_notes,to_team,to_images",

          },
          headers: {
            "X-CSRF-Token": "Fetch"
          },
          success: function (oData, oResponse) {
            // var plant = oData.results.find(element => element.parid === "WRK");
            var oDataResults = oData;
            that.getView().setModel(new sap.ui.model.json.JSONModel(oDataResults), "visitModel");
            that.fetchCustomer(oDataResults.Customer, oDataResults.Vkorg);
            that.vkorg = oDataResults.Vkorg;



            that.extractVisitNotes(oDataResults.Customer);


            //      debugger;
            var oFilter = new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.Contains, 'C');
            that.getView().byId("idFeedComments").getBinding("items").filter(oFilter, sap.ui.model.FilterType.Application);;
            var oBinding = that.getView().byId("idFeedComments").getBinding("items")

            var sSortKey = "Createdatetime";
            var bDescending = true; //switches the boolean back and forth from ascending to descending
            var bGroup = false;
            var aSorter = [];

            aSorter.push(new sap.ui.model.Sorter(sSortKey, bDescending, bGroup));
            oBinding.sort(aSorter);
            that.getView().setModel(new sap.ui.model.json.JSONModel({
                "authCustomer": true
              }



            ), "authCustomerModel");

            that.getView().byId("CreateProductWizard").setCurrentStep(that.getView().byId("ProductTypeStep"));


            that.getView().getModel("userValues").setProperty("/salesorg", that.vkorg);
            that.visitid = visitid;
            that.getView().byId("CreateProductWizard").nextStep();
            that.getView().byId("CreateProductWizard").nextStep();
            that.getView().byId("CreateProductWizard").nextStep();
            that.getView().byId("CreateProductWizard").nextStep();
            that.getView().byId("CreateProductWizard").nextStep();
            that.getView().byId("CreateProductWizard").nextStep();

            try {
              that.getView().byId("idIconTabBar").setSelectedKey(that.getView().byId("idIconTabBar").getItems()[0].getKey())
            } catch (e) {

            }


            setTimeout(() => {

              that.getView().byId("idIconTabBar").setSelectedKey(that.getView().byId("idIconTabBar").getItems()[0].getKey())

            }, 500);

          },

          error: function (oError) {
            that.getView().setModel(new sap.ui.model.json.JSONModel({
              "authCustomer": false
            }), "authCustomerModel");
          }
        });

      },
      onEnterNotes: function (oEvent) {
        return;
        // this.getView().byId("CreateProductWizard").nextStep();
        // this.getView().byId("CreateProductWizard").nextStep();
        // this.getView().byId("CreateProductWizard").nextStep();
        // this.getView().byId("CreateProductWizard").nextStep();
        // this.getView().byId("CreateProductWizard").nextStep();
        //         this.getView().byId("CreateProductWizard").validateStep(this.getView().byId("keyteamstep"));

        // this.getView().byId("CreateProductWizard").validateStep(this.getView().byId("OptionalInfoStep"));
        // this.getView().byId("CreateProductWizard").validateStep(this.getView().byId("PricingStep"));
        // this.getView().byId("CreateProductWizard").validateStep(this.getView().byId("notes"));
        // if( this.getView().byId("CreateProductWizard").getSteps()[1].getAct)
        //       this.getView().byId("CreateProductWizard").nextStep();
        // this.getView().byId("CreateProductWizard").nextStep();
        // this.getView().byId("CreateProductWizard").nextStep();
        // this.getView().byId("CreateProductWizard").nextStep();
        //     this.getView().byId("CreateProductWizard").nextStep(); 
        var that = this;
        this.getView().byId("CreateProductWizard").setCurrentStep(this.getView().byId("CreateProductWizard").getSteps()[5]);
        that.getView().byId("CreateProductWizard").goToStep(this.getView().byId("CreateProductWizard").getSteps()[0]);
        // that.getView().byId("CreateProductWizard").goToStep(this.getView().byId("CreateProductWizard").getSteps()[0]);
        // that.getView().byId("CreateProductWizard").goToStep(this.getView().byId("CreateProductWizard").getSteps()[0]);
        // that.getView().byId("CreateProductWizard").goToStep(this.getView().byId("CreateProductWizard").getSteps()[0]);
        // that.getView().byId("CreateProductWizard").goToStep(this.getView().byId("CreateProductWizard").getSteps()[0]);

        // this.getView().byId("page").scrollToElement(0);
        // setTimeout(() => {
        //   that.getView().byId("CreateProductWizard").goToStep(this.getView().byId("CreateProductWizard").getSteps()[0]);

        // }, 50);
        // setTimeout(() => {
        // this.getView().byId("page").scrollToElement(0);
        // that.getView().byId("page").scrollTo(0);
        // }, 100);
        //  this.getView().byId("page").scrollToElement(this.getView().byId("CreateProductWizard"))
        //  this.getView().byId("CreateProductWizard").nextStep();
      },
      onActivateNotes: function (oEvent) {
        this.onCreateVisit_AutoSave("");
        //  debugger;
      },
      onEnterNotes1: function (oEvent) {
        // this.getView().byId("CreateProductWizard").nextStep();
        // this.getView().byId("CreateProductWizard").nextStep();
        // this.getView().byId("CreateProductWizard").nextStep();
        // this.getView().byId("CreateProductWizard").nextStep();
        // this.getView().byId("CreateProductWizard").nextStep();
        //         this.getView().byId("CreateProductWizard").validateStep(this.getView().byId("keyteamstep"));

        // this.getView().byId("CreateProductWizard").validateStep(this.getView().byId("OptionalInfoStep"));
        // this.getView().byId("CreateProductWizard").validateStep(this.getView().byId("PricingStep"));
        // this.getView().byId("CreateProductWizard").validateStep(this.getView().byId("notes"));
        //       this.getView().byId("CreateProductWizard").nextStep();
        // this.getView().byId("CreateProductWizard").nextStep();
        // this.getView().byId("CreateProductWizard").nextStep();
        // this.getView().byId("CreateProductWizard").nextStep();
        //     this.getView().byId("CreateProductWizard").nextStep(); 

        if (this.getView().byId("CreateProductWizard").getProgress() === 7) {
          this.getView().byId("CreateProductWizard").goToStep(this.getView().byId("CreateProductWizard").getSteps()[5]);



        } else {
          this.getView().byId("CreateProductWizard").setCurrentStep(this.getView().byId("CreateProductWizard").getSteps()[5]);
          this.getView().byId("CreateProductWizard").goToStep(this.getView().byId("CreateProductWizard").getSteps()[5]);
        }


        // var that = this;
        // that.getView().byId("CreateProductWizard").goToStep(this.getView().byId("CreateProductWizard").getSteps()[0]);

        // setTimeout(() => {
        //   that.getView().byId("CreateProductWizard").goToStep(this.getView().byId("CreateProductWizard").getSteps()[0]);

        // }, 50);
        // setTimeout(() => {
        // this.getView().byId("page").scrollToElement(0);
        // that.getView().byId("page").scrollTo(0);
        // }, 100);
        //  this.getView().byId("page").scrollToElement(this.getView().byId("CreateProductWizard"))
        //  this.getView().byId("CreateProductWizard").nextStep();

        this.onCreateVisit_AutoSave("");
      },




      onGoTOMOE: function (oEvent) {


        if (this.getView().byId("CreateProductWizard").getProgress() === 7) {
          this.getView().byId("CreateProductWizard").goToStep(this.getView().byId("CreateProductWizard").getSteps()[3]);



        } else {
          this.getView().byId("CreateProductWizard").setCurrentStep(this.getView().byId("CreateProductWizard").getSteps()[3]);
          this.getView().byId("CreateProductWizard").goToStep(this.getView().byId("CreateProductWizard").getSteps()[3]);
        }


        // var that = this;
        // that.getView().byId("CreateProductWizard").goToStep(this.getView().byId("CreateProductWizard").getSteps()[0]);

        // setTimeout(() => {
        //   that.getView().byId("CreateProductWizard").goToStep(this.getView().byId("CreateProductWizard").getSteps()[0]);

        // }, 50);
        // setTimeout(() => {
        // this.getView().byId("page").scrollToElement(0);
        // that.getView().byId("page").scrollTo(0);
        // }, 100);
        //  this.getView().byId("page").scrollToElement(this.getView().byId("CreateProductWizard"))
        //  this.getView().byId("CreateProductWizard").nextStep();

        // this.onCreateVisit_AutoSave("");
      },


      _setSalesOrgsToURL: function () {
        var salesOrgData = this.getOwnerComponent().getModel("salesOrgCentralModel").getData();
        if (salesOrgData && salesOrgData.length > 0) {
          var salesOrgsString = salesOrgData.join(',');
          var currentUrl = new URL(window.location.href);
          currentUrl.searchParams.set('salesOrgs', salesOrgsString);
          window.history.replaceState({}, '', currentUrl.toString());
        }
      },

      _getSalesOrgsFromURL: function () {
        var urlParams = new URLSearchParams(window.location.search);
        var salesOrgsParam = urlParams.get('salesOrgs');
        if (salesOrgsParam) {
          var salesOrgArray = salesOrgsParam.split(',');
          this.getOwnerComponent().getModel("salesOrgCentralModel").setData(salesOrgArray);
          this.getView().getModel("userValues").setProperty("/salesOrgList", salesOrgArray)

        }
      },


      _onRouteMatched: function (oEvent) {


        var that = this;
        var shipto = oEvent.getParameter("arguments").shipto;
        var visitid = oEvent.getParameter("arguments").visitid;
        var vkorg = oEvent.getParameter("arguments").vkorg;
        var isnew = oEvent.getParameter("arguments").isnew;
        var isProspect = oEvent.getParameter("arguments").prospect;
        that.visitType = undefined;


        var currentUrl = window.location.href;
        var url = new URL(currentUrl);

        // Extract specific parameters
        var salesOrganization = url.searchParams.get("vkorg");
        var customer = url.searchParams.get("kunwe");


        if (!shipto && customer && !vkorg && salesOrganization) {
          shipto = customer;
          vkorg = salesOrganization;

          isProspect = false;
          isnew = true;
          visitid = 'NEW';
          that.visitType = 'RV'
        }
        this.currentVisitID = visitid;
        this.currentSalesOrg = vkorg;
        this.currentShipto = shipto;

        this._getSalesOrgsFromURL();

        var salesOrgData = that.getOwnerComponent().getModel("salesOrgCentralModel") ? that.getOwnerComponent().getModel("salesOrgCentralModel").getData() : null;


        if (salesOrgData && salesOrgData.length > 0) {

        } else {

        }

        this.readSRVisitDefaultParam();
        if (!shipto && !vkorg && visitid) {

          this.openVisitByNav(visitid);
          return;
        }

        if (location.href.includes("Visitid=")) {
          var visitid = location.href.split("Visitid=")[1].split("&")[0];
          this.openVisitByNav(visitid);
          return;
        }


        if (isProspect) {
          this.getView().setModel(new sap.ui.model.json.JSONModel({
            "prospect": true
          }), "prospectModel");
        } else {
          this.getView().setModel(new sap.ui.model.json.JSONModel({
            "prospect": false
          }), "prospectModel");
        }
        this.setLock = false
        this.getView().setModel(new sap.ui.model.json.JSONModel({
          "authCustomer": true
        }), "authCustomerModel");
        //    this.getView().setBusy(true);

        //     if (typeof vkorg === 'undefined') 
        {

          let defaultModel = this.getOwnerComponent().getModel("ZCXA_USERDEFAULT_CDS");
          var that = this;
          defaultModel.read("/ZCXA_USERDEFAULT", {
            success: function (oData, oResponse) {
              if (typeof vkorg === 'undefined') {
                var salesorg = oData.results.find(element => element.parid === "VKO");

                if (typeof salesorg !== "undefined") {


                  that.salesorg = salesorg.parva;
                  that.vkorg = salesorg.parva;

                  if (salesOrgData && salesOrgData.length > 0) {

                  } else {


                    if (typeof that.getOwnerComponent().getModel("salesOrgCentralModel").getData().length === 'undefined' || that.getOwnerComponent().getModel("salesOrgCentralModel").getData().length === 0) {
                      that.getOwnerComponent().getModel("salesOrgCentralModel").setData([that.vkorg]);
                    } else {
                      var salesorglist = that.getOwnerComponent().getModel("salesOrgCentralModel").getData();

                      //  [that.vkorg]
                    }

                  }


                  that.getView().getModel("userValues").setProperty("/salesorg", that.vkorg)
                }
                //      that.getView().getModel("visitModel").setProperty("/Vkorg",that.vkorg)
              } else {
                if (typeof that.getOwnerComponent().getModel("salesOrgCentralModel").getData().length === 'undefined' || that.getOwnerComponent().getModel("salesOrgCentralModel").getData().length === 0) {
                  var salesArray = [];
                  salesArray.push(vkorg);
                  that.getOwnerComponent().getModel("salesOrgCentralModel").setData(salesArray);
                } else {
                  var salesorglist = that.getOwnerComponent().getModel("salesOrgCentralModel").getData();

                  //  [that.vkorg]
                }
              }
              var visitid_new;

              if (visitid === 'NEW') {
                visitid_new = visitid;

              } else if (!isNaN(visitid)) {
                visitid_new = Number(visitid);
              } else {
                visitid_new = 'NEW';
              }
              that.getView().byId("CreateProductWizard").mAggregations._progressNavigator.setStepTitles(["Visit Store Info", "Key People", "Other Suppliers", "Porky Mobile Order Entry", "Visit - " + visitid_new, "Notes and Comments", "Attachments"]);

              var moePara = oData.results.find(element => element.parid === "ZMOE_ACTIVE_ONLY");
              if (typeof moePara !== "undefined") {
                if (moePara.parva === 'X') {
                  that.getView().getModel("userValues").setProperty("/moe", true);
                  var tblBinding = that.getView().byId("moetable").getBinding("items");

                  var oFilter = new sap.ui.model.Filter("account_inactive", sap.ui.model.FilterOperator.NE, 'X');
                  if (tblBinding)
                    tblBinding.filter(oFilter, sap.ui.model.FilterType.Application);;

                  if (that.getView().byId("CreateProductWizard").mAggregations._progressNavigator.getStepTitles().length === 0) {
                    // that.getOwnerComponent().getRouter().navTo("newvisit", {
                    //   visitid: visitid,
                    //   shipto: shipto,
                    //   vkorg: vkorg,
                    //   isnew: false
                    // });
                  }

                } else {
                  that.getView().getModel("userValues").setProperty("/moe", false);

                }
              }






            },

            error: function (oError) {}
          });
        }

        this.getView().byId("CreateProductWizard").setCurrentStep(this.getView().byId("ProductTypeStep"));

        this.vkorg = vkorg;
        // this.getView().setModel(new sap.ui.model.json.JSONModel(
        //   {
        //     "salesorg": this.vkorg,
        //     "moe" : false


        //   }
        // ), "userValues");
        this.getView().getModel("userValues").setProperty("/salesorg", this.vkorg);
        this.visitid = visitid;


        if (visitid && visitid !== 'NEW') {





          this.extractComments(this.visitid);
          this.getView().setModel(new sap.ui.model.json.JSONModel({
            changeMode: false
          }), "chageModeModel");

          if (isnew === "true") {
            this.getView().setModel(new sap.ui.model.json.JSONModel({
              changeMode: true
            }), "chageModeModel");
          }

          this.getView().byId("CreateProductWizard").nextStep();
          this.getView().byId("CreateProductWizard").nextStep();
          this.getView().byId("CreateProductWizard").nextStep();
          this.getView().byId("CreateProductWizard").nextStep();
          this.getView().byId("CreateProductWizard").nextStep();
          this.getView().byId("CreateProductWizard").nextStep();

          try {
            this.getView().byId("idIconTabBar").setSelectedKey(this.getView().byId("idIconTabBar").getItems()[0].getKey())
          } catch (e) {

          }


          //    this.getView().byId("page").scrollTo(0);
          if (!isnew)
            //  this.getView().byId("page").scrollToElement(this.getView().byId("ProductTypeStep"))

            if (!vkorg && !shipto) {
              // setTimeout(() => {
              this.getView().byId("CreateProductWizard").setVisible(false);
              setTimeout(() => {
                this.getView().byId("CreateProductWizard").setVisible(true);

                that.getView().byId("CreateProductWizard").goToStep(this.getView().byId("CreateProductWizard").getSteps()[4]);
              }, 1000);

              //   that.getView().byId("CreateProductWizard").scrollToElement(this.getView().byId("ProductTypeStep"))
              //   that.getView().byId("CreateProductWizard").scrollToElement(this.getView().byId("ProductTypeStep"))

              // }, 50);

            }

          // this.getView().byId("CreateProductWizard").nextStep();

          // this.getView().byId("CreateProductWizard").validateStep(this.getView().byId("keyteamstep"));

          // this.getView().byId("CreateProductWizard").validateStep(this.getView().byId("OptionalInfoStep"));
          // this.getView().byId("CreateProductWizard").validateStep(this.getView().byId("PricingStep"));
          // this.getView().byId("CreateProductWizard").validateStep(this.getView().byId("notes"));


          let defaultModel = this.getOwnerComponent().getModel("ZODATA_FR_SRV");
          var that = this;
          // defaultModel.read("/ZBMMCUSTOMERVISIT(Customer='" + shipto + "',SalesOrganization='" + vkorg + "')", {
          //   urlParameters: {
          //     "$expand": "to_SM,to_SS,to_Supp,to_Dep",

          //   },
          //     success: function (oData, oResponse) {
          //         // var plant = oData.results.find(element => element.parid === "WRK");
          //         var oDataResults = oData;
          //         that.getView().setModel(new sap.ui.model.json.JSONModel(oDataResults
          //         ), "customerModel");

          //     },

          //     error: function (oError) {
          //     }
          // });
          let defaultModel1 = this.getOwnerComponent().getModel("ZRMM_FRVISITV2_CDS");

          defaultModel1.read("/ZRMM_FRVISITV2('" + visitid + "')", {
            urlParameters: {
              "$expand": "to_notes,to_team,to_images",

            },
            headers: {
              "X-CSRF-Token": "Fetch"
            },
            success: function (oData, oResponse) {
              // var plant = oData.results.find(element => element.parid === "WRK");
              var oDataResults = oData;
              that.getView().setModel(new sap.ui.model.json.JSONModel(oDataResults), "visitModel");
              that.fetchCustomer(oDataResults.Customer, oDataResults.Vkorg);


              //      debugger;
              var oFilter = new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.Contains, 'C');
              that.getView().byId("idFeedComments").getBinding("items").filter(oFilter, sap.ui.model.FilterType.Application);;
              var oBinding = that.getView().byId("idFeedComments").getBinding("items")

              var sSortKey = "Createdatetime";
              var bDescending = true; //switches the boolean back and forth from ascending to descending
              var bGroup = false;
              var aSorter = [];

              aSorter.push(new sap.ui.model.Sorter(sSortKey, bDescending, bGroup));
              oBinding.sort(aSorter);
              that.getView().setModel(new sap.ui.model.json.JSONModel({
                "authCustomer": true
              }), "authCustomerModel");



              setTimeout(() => {

                that.getView().byId("idIconTabBar").setSelectedKey(that.getView().byId("idIconTabBar").getItems()[0].getKey())

              }, 500);

            },

            error: function (oError) {
              that.getView().setModel(new sap.ui.model.json.JSONModel({
                "authCustomer": false
              }), "authCustomerModel");
            }
          });







          ///To extract all notes


          var that = this;

          defaultModel1.read("/ZRMM_FRVISITV2NOTES", {
            urlParameters: {
              "$filter": "Kunnr eq '" + shipto + "' and Type eq 'N'",

            },
            success: function (oData, oResponse) {
              // var plant = oData.results.find(element => element.parid === "WRK");
              var oDataResults = oData;
              oDataResults.results.forEach(element => {
                if (element.Visitid === that.visitid) {
                  element.visitid_new = '9999';
                } else {
                  element.visitid_new = element.Visitid;
                }

              });
              that.getView().setModel(new sap.ui.model.json.JSONModel(oDataResults), "notesModel");

            },

            error: function (oError) {}
          });








        } else {

          this.getView().setModel(new sap.ui.model.json.JSONModel({
            "Visitid": "NEW"
          }), "currentVisitNoteModel");
          this.getView().setModel(new sap.ui.model.json.JSONModel({
            changeMode: true
          }), "chageModeModel");

          var that = this;
          var oDataResults = {
            "results": [{
              "Delete_mc": true,
              "Update_mc": true,
              "Visitid": "NEW",
              "Lineid": 0,
              "Spras": "",
              "Type": "N",
              "Createdatetime": new Date(),
              "Kunnr": "",
              "Vkorg": "",
              "Notes": "",

              "Ernam": "",
            }]
          };
          oDataResults.results.forEach(element => {
            if (element.Visitid === that.visitid) {
              element.visitid_new = '9999';
            } else {
              element.visitid_new = element.Visitid;
            }

          });
          this.getView().setModel(new sap.ui.model.json.JSONModel(oDataResults), "notesModel");
          that.getView().setModel(new sap.ui.model.json.JSONModel({}), "customerModel");
          var itemsOf = that.getView().byId("idOthSuppliers").getItems();

          itemsOf.forEach(element1 => {

            element1.getCells()[1].setSelected(false);

          });

          var customerid = "";
          if (this.getView().getModel("customerModel")) {
            customerid = this.getView().getModel("customerModel").getProperty("/Customer");
          } else {
            customerid = "";
          }
          this.getView().getModel("customerModel").setProperty("/Customer", "")
          var oData = {
            "Delete_mc": true,
            "Update_mc": true,
            "to_notes_oc": true,
            "to_team_oc": true,
            "Visitid": "NEW",
            "Customer": "",
            "Vkorg": this.vkorg,
            "Visittype": "N",

            "Ernam": "",
            "Createdatetime": new Date(),


            "to_notes": {
              "results": [
                // {

                //   "Delete_mc": true,
                //   "Update_mc": true,
                //   "Visitid": "",
                //   "Lineid": 0,
                //   "Spras": "EN",
                //   "Type": "C",
                //   "Createdatetime": new Date(),
                //   "Kunnr": customerid,
                //   "Vkorg": "3000",
                //   "Notes": "Comment 2",
                //   "Bname": "",
                //   "Ernam": ""

                // }
              ]
            },

            "to_team": {
              "results": [

                {

                  "Bname": sap.ushell.Container.getService("UserInfo").getId(),
                  "UserDescription": "Current User"
                }
                // {

                //   "Delete_mc": true,
                //   "Update_mc": true,
                //   "Visitid": "0000000001",
                //   "Lineid": 2,
                //   "Kunnr": customerid,
                //   "Vkorg": "3000",
                //   "Bname": "RSONI",
                //   "UserDescription": "Loveleena Almeida",
                //   "Ernam": "",
                //   "Aenam": "",
                //   "Createdatetime": null,
                //   "Changedatetime": null
                // }
              ]
            }
          };


          if (visitid === 'NEW' && typeof shipto !== 'undefined') {
            this.fetchCustomer(shipto, vkorg);
          }




          var oDataResults = oData;
          that.getView().setModel(new sap.ui.model.json.JSONModel(oDataResults), "visitModel");




        }
        this.isnew = isnew;
        setTimeout(() => {
          if (that.isnew !== "true")
            that.getView().getContent()[0].getContent()[1].goToStep(that.byId("PricingStep"))
          if (!vkorg && !shipto) {
            that.getView().getContent()[0].getContent()[1].goToStep(that.byId("notes"))


          }
        }, 500);




        var that = this;






        // ... existing code ...

        // Start periodic check for pending notes
        this._startPeriodicCheck();

        // At the very end of the method, after all data is loaded:
        var that = this;
        setTimeout(function () {
          // Recover and auto-save notes from cookie after page refresh
          that.recoverAndSaveNotesFromCookie();

          // Also check if we just came back online
          if (that._isOnline && navigator.onLine) {
            that._checkAndSavePendingNotes();
          }


        }, 2000);
        this.getView().byId("stateMOEOnly").setState(true);
        this.getView().byId("stateDeptOnly").setState(true);

      },

      readVisitModel() {

        let defaultModel1 = this.getOwnerComponent().getModel("ZRMM_FRVISITV2_CDS");

        var that = this;
        defaultModel1.read("/ZRMM_FRVISITV2('" + this.visitid + "')", {
          urlParameters: {
            "$expand": "to_notes,to_team,to_images",

          },
          success: function (oData, oResponse) {
            // var plant = oData.results.find(element => element.parid === "WRK");
            var oDataResults = oData;
            that.getView().setModel(new sap.ui.model.json.JSONModel(oDataResults), "visitModel");
            that.fetchCustomer(oDataResults.Customer, oDataResults.Vkorg);


            //      debugger;
            var oFilter = new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.Contains, 'C');
            that.getView().byId("idFeedComments").getBinding("items").filter(oFilter, sap.ui.model.FilterType.Application);;
            var oBinding = that.getView().byId("idFeedComments").getBinding("items")

            var sSortKey = "Createdatetime";
            var bDescending = true; //switches the boolean back and forth from ascending to descending
            var bGroup = false;
            var aSorter = [];

            aSorter.push(new sap.ui.model.Sorter(sSortKey, bDescending, bGroup));
            oBinding.sort(aSorter);
            that.getView().setModel(new sap.ui.model.json.JSONModel({
              "authCustomer": true
            }), "authCustomerModel");
          },

          error: function (oError) {
            that.getView().setModel(new sap.ui.model.json.JSONModel({
              "authCustomer": false
            }), "authCustomerModel");
          }
        });
      },

      openKeyPeople: function (oEvent) {
        if (!this.pDialogKeyPeople) {
          this.pDialogKeyPeople = this.loadFragment({
            name: "customer.porky.zfieldrepvisit.view.manageKeyPeople"
          });
        } else {

        }
        var that = this;
        that.getView().setModel(new sap.ui.model.json.JSONModel({}), "selectedKeyPeople");
        var obj = oEvent.getSource().getBindingContext("customerModel").getObject();
        if (obj.Whatsapp && obj.Whatsapp === '02') {
          obj.Whatsapp = false;
        }
        if (obj.Whatsapp && obj.Whatsapp === '01') {
          obj.Whatsapp = true;
        }
        if (!obj.Whatsapp) {
          obj.Whatsapp = false;
        }


        if (obj.Email && obj.Email === '02') {
          obj.Email = false;
        }
        if (obj.Email && obj.Email === '01') {
          obj.Email = true;
        }
        if (!obj.Email) {
          obj.Email = false;
        }
        that.getView().setModel(new sap.ui.model.json.JSONModel(JSON.parse(JSON.stringify(obj))), "selectedKeyPeople");
        this.pDialogKeyPeople.then(function (oDialog) {

          that.pDialogKeyPeople_d = oDialog;
          oDialog.open();



        });
        this.getView().addDependent(this.pDialogKeyPeople);
      },


      openMOEPeople: function (oEvent) {
        if (!this.pDialogKeyPeople1) {
          this.pDialogKeyPeople1 = this.loadFragment({
            name: "customer.porky.zfieldrepvisit.view.moeDetails"
          });
        } else {

        }
        var that = this;

        var obj = oEvent.getSource().getBindingContext("moeModel").getObject();
        obj.editable = false;
        //  debugger;

        that.getView().setModel(new sap.ui.model.json.JSONModel(obj), "selectedMOEPeople");
        this.pDialogKeyPeople1.then(function (oDialog) {


          oDialog.open();



        });
        this.getView().addDependent(this.pDialogKeyPeople1);
      },



      onDialogCloseKeyPeople: function (oEvent) {
        //ddd

        try {

          this.pDialogOpenProspect_d.close();
          this.pDialogOpenProspect_d.destroy();
          this.pDialogOpenProspect_d = undefined;
          this.pDialogOpenProspect = undefined;
        } catch (e) {
          oEvent.getSource().getParent().close();

          this.pDialogKeyPeople_d.close()
        }

        //     oEvent.getSource().getParent().destroy();
      },

      onUpdateFinishedOthSupplier1: function (oEvent) {

        var that = this;

        setTimeout(() => {
          var othSupplierData = that.getView().getModel("customerModel").getData().to_Supp.results;
          //that.getView().getModel("customerModel").getData().to_Supp.results[0].Name1
          var itemsOf = that.getView().byId("idOthSuppliers").getItems();

          itemsOf.forEach(element1 => {
            othSupplierData.forEach(element => {
              if (element1.getCells()[0].getText() === element.Name1) {

                element1.getCells()[1].setSelected(true);
              } else {
                var columnListItemNewLine = new sap.m.ColumnListItem({
                  cells: [
                    new sap.m.ObjectIdentifier({
                      text: element.Name1
                    }),
                    new sap.m.CheckBox({
                      selected: true
                    })

                  ]
                });
                that.getView().byId("idOthSuppliers").addItem(columnListItemNewLine)

              }
            });
          });
          // that.getView().byId("idOthSuppliers").getItems()[1].getCells()[1].setSelected(true);

        }, 1000);

      },

      addOtherSuppliers(oEvent) {
        var that = this;
        var itemsOf = that.getView().byId("idOthSuppliers").getItems()[0];
        const clone = JSON.parse(JSON.stringify(itemsOf));

        clone.getCells()[0].setText("")
        clone.getCells()[1].setSelected(true);
        that.getView().byId("idOthSuppliers").addItem(clone)
      },
      translateCallES(oEvent) {

        var text = oEvent.getSource().getParent().getParent().getContent()[0].getValue();
        //   this.translateLanguage(text,"es",oEvent.getSource().getParent().getParent().getContent()[0]);
        this.source = oEvent.getSource().getParent().getParent().getContent()[0];
        // var that = this._view;
        var that = this;

        var data = {
          "q": text,
          "target": 'es',
          "source": 'en',

          "key": "AIzaSyARq_VIDUxAl-xrs9bV_921ZzSggNjHAzE"
        };
        $.ajax({
          url: "https://translation.googleapis.com/language/translate/v2",
          headers: {
            Accept: "text/plain; charset=utf-8",
            "Content-Type": "text/plain; charset=utf-8"
          },
          data: data,
          success: function (response) {
            var translatedText = response.data.translations[0].translatedText;
            that.source.getParent().getContent()[0].setValue(translatedText);
            that.source.getParent().getContent()[0].addStyleClass("textAreaTranslateSP");
            that.getView().setModel(new sap.ui.model.json.JSONModel({
              "Orgtext": text,
              "text": translatedText,
              "lang": 'Spanish',
              "valueState": "Error"

            }), "translateModel");
            that.source.getParent().getContent()[0].setValueState(sap.ui.core.ValueState.Error);


            // if (!that._pPopover) {
            //   that._pPopover = sap.ui.core.Fragment.load({
            //     id: that.getView().getId(),
            //     name: "customer.porky.zfieldrepvisit.view.translate",
            //     controller: that
            //   }).then(function (oPopover) {
            //     that.getView().addDependent(oPopover);
            //     that.getView().setModel(new sap.ui.model.json.JSONModel(
            //       {
            //         "Orgtext": text,
            //         "text": translatedText,
            //         "lang": 'Spanish'

            //       }
            //     ), "translateModel");
            //     return oPopover;
            //   });
            // } else {
            //   that.getView().setModel(new sap.ui.model.json.JSONModel(
            //     {
            //       "Orgtext": text,
            //       "text": translatedText,
            //       "lang": 'Spanish'

            //     }
            //   ), "translateModel");
            // }
            // that._pPopover.then(function (oPopover) {
            //   oPopover.openBy(that.source);
            // });
          }
        });
      },

      translateCallEN(oEvent) {

        var text = oEvent.getSource().getParent().getParent().getContent()[0].getValue();

        //   this.translateLanguage(text,"es",oEvent.getSource().getParent().getParent().getContent()[0]);
        this.source = oEvent.getSource().getParent().getParent().getContent()[0];
        // var that = this._view;
        var that = this;

        var data = {
          "q": text,
          "target": 'en',
          "source": 'es',

          "key": "AIzaSyARq_VIDUxAl-xrs9bV_921ZzSggNjHAzE"
        };
        $.ajax({
          url: "https://translation.googleapis.com/language/translate/v2",
          headers: {
            Accept: "text/plain; charset=utf-8",
            "Content-Type": "text/plain; charset=utf-8"
          },
          data: data,
          success: function (response) {
            var translatedText = response.data.translations[0].translatedText;
            that.source.getParent().getContent()[0].setValue(translatedText);
            that.source.getParent().getContent()[0].addStyleClass("textAreaTranslateEN");
            that.getView().setModel(new sap.ui.model.json.JSONModel({
              "Orgtext": text,
              "text": translatedText,
              "lang": 'English',
              "valueState": "Error"

            }), "translateModel");
            that.source.getParent().getContent()[0].setValueState(sap.ui.core.ValueState.Error);
            // var translatedText = response.data.translations[0].translatedText;


            // if (!that._pPopover) {
            //   that._pPopover = sap.ui.core.Fragment.load({
            //     id: that.getView().getId(),
            //     name: "customer.porky.zfieldrepvisit.view.translate",
            //     controller: that
            //   }).then(function (oPopover) {
            //     that.getView().addDependent(oPopover);
            //     that.getView().setModel(new sap.ui.model.json.JSONModel(
            //       {
            //         "Orgtext": text,
            //         "text": translatedText,
            //         "lang": 'English'

            //       }
            //     ), "translateModel");
            //     return oPopover;
            //   });
            // } else {
            //   that.getView().setModel(new sap.ui.model.json.JSONModel(
            //     {
            //       "Orgtext": text,
            //       "text": translatedText,
            //       "lang": 'English'

            //     }
            //   ), "translateModel");
            // }
            // that._pPopover.then(function (oPopover) {
            //   oPopover.openBy(that.source);
            // });
          }
        });
      },

      translateLanguage(text, target, oSource) {

        //    let defaultModel = new sap.ui.model.odata.v2.ODataModel("https://translation.googleapis.com/language/translate/v2");

        this.source = oSource;
        var that = this;
        var data = {
          "q": text,
          "target": target,
          "key": "AIzaSyARq_VIDUxAl-xrs9bV_921ZzSggNjHAzE"
        };
        $.ajax({
          url: "https://translation.googleapis.com/language/translate/v2",
          headers: {
            Accept: "text/plain; charset=utf-8",
            "Content-Type": "text/plain; charset=utf-8"
          },
          data: data,
          success: function (response) {
            var translatedText = response.data.translations[0].translatedText;

            that.source.getParent().getContent()[0].setValue(translatedText);
            that.getView().setModel(new sap.ui.model.json.JSONModel({
              "Orgtext": text,
              "text": translatedText,
              "lang": target

            }), "translateModel");
            //     ), "translateModel");
            // if (!that._pPopover) {
            //   that._pPopover = sap.ui.core.Fragment.load({
            //     id: that.getView().getId(),
            //     name: "customer.porky.zfieldrepvisit.view.translate",
            //     controller: that
            //   }).then(function (oPopover) {
            //     that.getView().addDependent(oPopover);
            //     that.getView().setModel(new sap.ui.model.json.JSONModel(
            //       {
            //         "Orgtext": text,
            //         "text": translatedText,
            //         "lang": target

            //       }
            //     ), "translateModel");
            //     return oPopover;
            //   });
            // }
            // that._pPopover.then(function (oPopover) {
            //   oPopover.openBy(that.source);
            // });
          }
        });


        // defaultModel.read("/", {
        //   urlParameters: {
        //     "q": text,
        //     "target":target,
        //    "key":"AIzaSyARq_VIDUxAl-xrs9bV_921ZzSggNjHAzE"
        //   },
        //     success: function (oData, oResponse) {
        //         // var plant = oData.results.find(element => element.parid === "WRK");
        //         var oDataResults = oData.results;


        //         if (!that._pPopover) {
        //           that._pPopover = Fragment.load({
        //             id: oView.getId(),
        //             name: "customer.porky.zfieldrepvisit.view.translate",
        //             controller: that
        //           }).then(function(oPopover) {
        //             oView.addDependent(oPopover);
        //             that.getView().setModel(new sap.ui.model.json.JSONModel(
        //               {
        //                 "Orgtext":text,
        //                 "text":text,
        //                 "lang":target

        //               }
        //           ), "userValues");
        //             return oPopover;
        //           });
        //         }
        //         that._pPopover.then(function(oPopover) {
        //           oPopover.openBy(oButton);
        //         });

        //     },

        //     error: function (oError) {
        //     }
        // });


      },

      onChangeShipTo: function (oEvent) {

      },
      onSelectCustomer: function (oEvent) {
        var that = this;
        var sorg = oEvent.mParameters.newValue;
        setTimeout(() => {
          that.getView().byId("idCustomer1").setValue(sorg);

        }, 500);
      },

      onBeforeRebindCustomerF4: function (oEvent) {

        var oBindingParams = oEvent.getParameter("bindingParams");




        var salesOrgList = this.getOwnerComponent().getModel("salesOrgCentralModel").getData();


        salesOrgList.forEach(element => {
          var oFilter = new sap.ui.model.Filter("vkorg", sap.ui.model.FilterOperator.EQ, element);
          oBindingParams.filters.push(oFilter);
        });



        oBindingParams.filters.push(new sap.ui.model.Filter("Deleted", sap.ui.model.FilterOperator.NE, true));






        //  oBindingParams.filters.push(new sap.ui.model.Filter("CreditBLock", sap.ui.model.FilterOperator.NE, true));


      },

      onBeforeRebindCustomerF4_prospect: function (oEvent) {

        var oBindingParams = oEvent.getParameter("bindingParams");




        var salesOrgList = this.getOwnerComponent().getModel("salesOrgCentralModel").getData();


        salesOrgList.forEach(element => {
          var oFilter = new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, element);
          oBindingParams.filters.push(oFilter);
        });
        // oBindingParams.filters.push(new sap.ui.model.Filter("Deleted", sap.ui.model.FilterOperator.NE, true));






        //  oBindingParams.filters.push(new sap.ui.model.Filter("CreditBLock", sap.ui.model.FilterOperator.NE, true));



      },


      onOpenCustomerF4_Prospect: function () {
        // create dialog lazily
        if (!this.pDialogUser) {
          this.pDialogUser = this.loadFragment({
            name: "customer.porky.zfieldrepvisit.view.customerF4_Prospect"
          });
        } else {

          if (this.pDialogUser1) {
            this.pDialogUser1.destroy();
            this.pDialogUser = undefined;
            this.pDialogUser1 = undefined;
            this.pDialogUser = this.loadFragment({
              name: "customer.porky.zfieldrepvisit.view.customerF4_Prospect"
            });
          }
        }
        var that = this;
        this.pDialogUser.then(function (oDialog) {

          that.pDialogUser1 = oDialog;

          oDialog.open();
          var oFilter = [];
          oFilter.push(new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, that.vkorg));

          oDialog.getBinding("items").filter(oFilter);
          //  that.getView().byId("mapSlider").setValue(3);

          //   var oMap = that.getView().byId("vbi");
          // that.getLocation();

        });
        var that = this;

        // setTimeout(() => {
        //   var oFilter = [];
        //   oFilter.push(new sap.ui.model.Filter("vkorg", sap.ui.model.FilterOperator.EQ, that.vkorg));

        //   that.pDialogUser.getBinding("items").filter(oFilter);
        // }, 1000);
        this.getView().addDependent(this.pDialogUser);


      },

      onUpdateFinishedSearchTable: function (oEvent) {
        //debugger;
        var tableCount = oEvent.mParameters.total;
        this.getView().setModel(new sap.ui.model.json.JSONModel({
          tableCount: tableCount
        }), "tableCountModel");

      },

      onOpenCustomerF4: function () {
        // create dialog lazily
        this.getView().setModel(new sap.ui.model.json.JSONModel({
          tableCount: ''
        }), "tableCountModel");
        this.getView().setModel(new sap.ui.model.json.JSONModel({
          deleted: false,
          creditBlock: false
        }), "searchModel");
        if (!this.pDialogUser) {
          this.pDialogUser = this.loadFragment({
            name: "customer.porky.zfieldrepvisit.view.customerF4"
          });
        } else {

          if (this.pDialogUser1) {
            this.pDialogUser1.destroy();
            this.pDialogUser = undefined;
            this.pDialogUser1 = undefined;
            this.pDialogUser = this.loadFragment({
              name: "customer.porky.zfieldrepvisit.view.customerF4"
            });
          }
        }
        var that = this;
        this.pDialogUser.then(function (oDialog) {

          that.pDialogUser1 = oDialog;
          that.getView().addDependent(oDialog);

          oDialog.open();

          setTimeout(() => {
            that.getView().byId("smartFilter_custF4").setModel(that.getOwnerComponent().getModel("ZODATA_FR_SRV"));

          }, 200);

          that.getView().byId("smartTable_custF4").setModel(that.getOwnerComponent().getModel("ZODATA_FR_SRV"));




          // that.getOwnerComponent().getModel("salesOrgCentralModel").setData(that.getView().getModel("userValues").getProperty("/salesOrgList"));

          var salesOrgList = that.getOwnerComponent().getModel("salesOrgCentralModel").getData();
          var oFilter = [];
          if (typeof salesOrgList.length !== 'undefined') {


            salesOrgList.forEach(element => {
              oFilter.push(new sap.ui.model.Filter("vkorg", sap.ui.model.FilterOperator.EQ, element));

            });
          } else {
            oFilter.push(new sap.ui.model.Filter("vkorg", sap.ui.model.FilterOperator.EQ, that.vkorg));
          }



          var oFilterBlocks = []



          oFilterBlocks.push(new sap.ui.model.Filter("Deleted", sap.ui.model.FilterOperator.NE, true));






          oFilterBlocks.push(new sap.ui.model.Filter("CreditBLock", sap.ui.model.FilterOperator.NE, true));




          var filterBlockArray = new sap.ui.model.Filter(oFilterBlocks, true);





          var ofilter_new = new sap.ui.model.Filter([filterBlockArray, new sap.ui.model.Filter("vkorg", sap.ui.model.FilterOperator.EQ, that.vkorg)

          ], true);
          oDialog.getContent()[1].getBinding("items").filter(ofilter_new);
          //  that.getView().byId("mapSlider").setValue(3);

          //   var oMap = that.getView().byId("vbi");
          // that.getLocation();

        });
        var that = this;


        // setTimeout(() => {
        //   var oFilter = [];
        //   oFilter.push(new sap.ui.model.Filter("vkorg", sap.ui.model.FilterOperator.EQ, that.vkorg));

        //   that.pDialogUser.getBinding("items").filter(oFilter);
        // }, 1000);
        this.getView().addDependent(this.pDialogUser);


      },

      onOpenUserF4: function () {
        // create dialog lazily
        if (!this.pDialogTeamUser) {
          this.pDialogTeamUser = this.loadFragment({
            name: "customer.porky.zfieldrepvisit.view.userF4"
          });
        } else {

        }
        var that = this;
        this.pDialogTeamUser.then(function (oDialog) {


          oDialog.open();

          if (that.visittype && that.visittype === 'SR') {

            // oBindingParams.filters.push( new Filter("Visittype", FilterOperator.EQ, 'SR'));

            var oFilter = [];
            var valued = 'Sales';
            var fiterd = new sap.ui.model.Filter({
              path: 'Function',
              operator: 'EQ',
              value1: "'Sales'"
            });

            var ofilter_new = new sap.ui.model.Filter([fiterd], true);


            // oDialog.getBinding("items").filter([fiterd], "Application");

          } else {

            var valued = 'Sales';
            var fiterd = new sap.ui.model.Filter({
              path: 'Function',
              operator: 'EQ',
              value1: "'FMT'"
            });

            var ofilter_new = new sap.ui.model.Filter([fiterd], true);


            // oDialog.getBinding("items").filter([fiterd], "Application");

          }



          //  that.getView().byId("mapSlider").setValue(3);

          //   var oMap = that.getView().byId("vbi");
          // that.getLocation();

        });
        this.getView().addDependent(this.pDialogTeamUser);
      },


      handleSearchCustomer: function (oEvent) {
        var sQuery = oEvent.getParameter("query");
        var that = this;
        var oBinding = oEvent.getSource().getParent().getContent()[1].getBinding("items");

        if (!sQuery) {
          try {
            sQuery = oEvent.getSource().getParent().getParent().getParent().getContent()[0].getValue();
            oBinding = oEvent.getSource().getParent().getParent().getBinding("items");

          } catch (e) {
            sQuery = '';
          }
        }



        // if (sQuery) 
        {
          this._oGlobalFilter = new sap.ui.model.Filter([
            //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
            new sap.ui.model.Filter("kunnr", sap.ui.model.FilterOperator.Contains, sQuery),
            new sap.ui.model.Filter("altkn", sap.ui.model.FilterOperator.Contains, sQuery),
            new sap.ui.model.Filter("stras", sap.ui.model.FilterOperator.Contains, sQuery),
            new sap.ui.model.Filter("ort01", sap.ui.model.FilterOperator.Contains, sQuery),
            new sap.ui.model.Filter("pstlz", sap.ui.model.FilterOperator.Contains, sQuery),
            new sap.ui.model.Filter("name1", sap.ui.model.FilterOperator.Contains, sQuery)



          ], false);


          // this._oGlobalFilter1 = new sap.ui.model.Filter([this._oGlobalFilter, new sap.ui.model.Filter("vkorg", sap.ui.model.FilterOperator.EQ, this.vkorg),
          //   new sap.ui.model.Filter("Deleted", sap.ui.model.FilterOperator.EQ, ''),
          //   new sap.ui.model.Filter("CreditBLock", sap.ui.model.FilterOperator.EQ, false)
          // ], true);



          // this.getView().setModel(new sap.ui.model.json.JSONModel({ deleted: false, creditBlock : false })
          // , "searchModel");

          var oFilterBlocks = [],
            flagDeleted = false,
            flagCreditBloc = false;

          var salesOrgList = that.getOwnerComponent().getModel("salesOrgCentralModel").getData();
          var salesOrgFilters = [];

          salesOrgList.forEach(element => {
            salesOrgFilters.push(new sap.ui.model.Filter("vkorg", sap.ui.model.FilterOperator.EQ, element));

          });
          salesOrgFilters = new sap.ui.model.Filter(salesOrgFilters, false);
          oBinding.filter(null, );
          if (this.getView().getModel("searchModel").getProperty("/deleted") && this.getView().getModel("searchModel").getProperty("/CreditBLock")) {

            // oFilterBlocks.push(new sap.ui.model.Filter("Deleted", sap.ui.model.FilterOperator.EQ, true));
            // oFilterBlocks.push(new sap.ui.model.Filter("CreditBLock", sap.ui.model.FilterOperator.EQ, true));
            // var filterBlockArray =  new sap.ui.model.Filter(oFilterBlocks, true);

            // this._oGlobalFilter = new sap.ui.model.Filter([
            //   //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
            //   this._oGlobalFilter, filterBlockArray



            // ], true);

            // this._oGlobalFilter1 = new sap.ui.model.Filter([this._oGlobalFilter, salesOrgFilters

            // ], true);
            // oBinding.filter([this._oGlobalFilter1]);


            this._oGlobalFilter = new sap.ui.model.Filter([
              //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
              new sap.ui.model.Filter("kunnr", sap.ui.model.FilterOperator.Contains, sQuery),
              new sap.ui.model.Filter("altkn", sap.ui.model.FilterOperator.Contains, sQuery),
              new sap.ui.model.Filter("stras", sap.ui.model.FilterOperator.Contains, sQuery),
              new sap.ui.model.Filter("ort01", sap.ui.model.FilterOperator.Contains, sQuery),
              new sap.ui.model.Filter("pstlz", sap.ui.model.FilterOperator.Contains, sQuery),
              new sap.ui.model.Filter("name1", sap.ui.model.FilterOperator.Contains, sQuery),
              new sap.ui.model.Filter("Deleted", sap.ui.model.FilterOperator.EQ, true),
              new sap.ui.model.Filter("CreditBLock", sap.ui.model.FilterOperator.EQ, true),

              new sap.ui.model.Filter("Deleted", sap.ui.model.FilterOperator.EQ, false),
              new sap.ui.model.Filter("CreditBLock", sap.ui.model.FilterOperator.EQ, false)
            ], false);

            if (sQuery) {

              this._oGlobalFilter = new sap.ui.model.Filter([
                //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
                this._oGlobalFilter,

                new sap.ui.model.Filter("Deleted", sap.ui.model.FilterOperator.EQ, true),
                new sap.ui.model.Filter("CreditBLock", sap.ui.model.FilterOperator.EQ, true)
              ], true);
            }

            this._oGlobalFilter1 = new sap.ui.model.Filter([this._oGlobalFilter, salesOrgFilters

            ], true);





            oBinding.filter(this._oGlobalFilter1, "Application");

          }




          if (!this.getView().getModel("searchModel").getProperty("/deleted") && this.getView().getModel("searchModel").getProperty("/CreditBLock")) {

            // oFilterBlocks.push(new sap.ui.model.Filter("CreditBLock", sap.ui.model.FilterOperator.EQ, true));
            // var filterBlockArray =  new sap.ui.model.Filter(oFilterBlocks, true);

            // this._oGlobalFilter = new sap.ui.model.Filter([
            //   //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
            //   this._oGlobalFilter, filterBlockArray



            // ], true);
            // this._oGlobalFilter1 = new sap.ui.model.Filter([this._oGlobalFilter, salesOrgFilters

            // ], true);
            // oBinding.filter([this._oGlobalFilter1]);

            this._oGlobalFilter = new sap.ui.model.Filter([
              //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
              new sap.ui.model.Filter("kunnr", sap.ui.model.FilterOperator.Contains, sQuery),
              new sap.ui.model.Filter("altkn", sap.ui.model.FilterOperator.Contains, sQuery),
              new sap.ui.model.Filter("stras", sap.ui.model.FilterOperator.Contains, sQuery),
              new sap.ui.model.Filter("ort01", sap.ui.model.FilterOperator.Contains, sQuery),
              new sap.ui.model.Filter("pstlz", sap.ui.model.FilterOperator.Contains, sQuery),
              new sap.ui.model.Filter("name1", sap.ui.model.FilterOperator.Contains, sQuery),
              new sap.ui.model.Filter("CreditBLock", sap.ui.model.FilterOperator.EQ, true),

              new sap.ui.model.Filter("CreditBLock", sap.ui.model.FilterOperator.EQ, false)
            ], false);

            if (sQuery) {


              this._oGlobalFilter = new sap.ui.model.Filter([
                //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
                new sap.ui.model.Filter("kunnr", sap.ui.model.FilterOperator.Contains, sQuery),
                new sap.ui.model.Filter("altkn", sap.ui.model.FilterOperator.Contains, sQuery),
                new sap.ui.model.Filter("stras", sap.ui.model.FilterOperator.Contains, sQuery),
                new sap.ui.model.Filter("ort01", sap.ui.model.FilterOperator.Contains, sQuery),
                new sap.ui.model.Filter("pstlz", sap.ui.model.FilterOperator.Contains, sQuery),
                new sap.ui.model.Filter("name1", sap.ui.model.FilterOperator.Contains, sQuery)

              ], false);

              this._oGlobalFilter = new sap.ui.model.Filter([
                //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
                this._oGlobalFilter,

                new sap.ui.model.Filter("CreditBLock", sap.ui.model.FilterOperator.EQ, true)
              ], true);

            }
            this._oGlobalFilter1 = new sap.ui.model.Filter([this._oGlobalFilter, salesOrgFilters

            ], true);





            oBinding.filter(this._oGlobalFilter1, "Application");




            //   oBinding.filter(this._oGlobalFilter, "Application");
          }




          if (this.getView().getModel("searchModel").getProperty("/deleted") && !this.getView().getModel("searchModel").getProperty("/CreditBLock")) {

            // oFilterBlocks.push(new sap.ui.model.Filter("Deleted", sap.ui.model.FilterOperator.EQ, true));
            // var filterBlockArray =  new sap.ui.model.Filter(oFilterBlocks, true);

            // this._oGlobalFilter = new sap.ui.model.Filter([
            //   //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
            //   this._oGlobalFilter, filterBlockArray




            // ], true);
            // this._oGlobalFilter1 = new sap.ui.model.Filter([this._oGlobalFilter, salesOrgFilters

            // ], true);
            // oBinding.filter([this._oGlobalFilter1]);

            this._oGlobalFilter = new sap.ui.model.Filter([
              //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
              new sap.ui.model.Filter("kunnr", sap.ui.model.FilterOperator.Contains, sQuery),
              new sap.ui.model.Filter("altkn", sap.ui.model.FilterOperator.Contains, sQuery),
              new sap.ui.model.Filter("stras", sap.ui.model.FilterOperator.Contains, sQuery),
              new sap.ui.model.Filter("ort01", sap.ui.model.FilterOperator.Contains, sQuery),
              new sap.ui.model.Filter("pstlz", sap.ui.model.FilterOperator.Contains, sQuery),
              new sap.ui.model.Filter("name1", sap.ui.model.FilterOperator.Contains, sQuery),
              // new sap.ui.model.Filter("Deleted", sap.ui.model.FilterOperator.EQ, true),

              // new sap.ui.model.Filter("Deleted", sap.ui.model.FilterOperator.EQ, false),
            ], false);

            if (sQuery) {


              this._oGlobalFilter = new sap.ui.model.Filter([
                //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
                new sap.ui.model.Filter("kunnr", sap.ui.model.FilterOperator.Contains, sQuery),
                new sap.ui.model.Filter("altkn", sap.ui.model.FilterOperator.Contains, sQuery),
                new sap.ui.model.Filter("stras", sap.ui.model.FilterOperator.Contains, sQuery),
                new sap.ui.model.Filter("ort01", sap.ui.model.FilterOperator.Contains, sQuery),
                new sap.ui.model.Filter("pstlz", sap.ui.model.FilterOperator.Contains, sQuery),
                new sap.ui.model.Filter("name1", sap.ui.model.FilterOperator.Contains, sQuery)

              ], false);



              this._oGlobalFilter = new sap.ui.model.Filter([
                //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
                this._oGlobalFilter,

                new sap.ui.model.Filter("Deleted", sap.ui.model.FilterOperator.EQ, true)
              ], true);
            }



            this._oGlobalFilter1 = new sap.ui.model.Filter([this._oGlobalFilter, salesOrgFilters

            ], true);

            oBinding.filter(this._oGlobalFilter1, "Application");

          }


          if (!this.getView().getModel("searchModel").getProperty("/deleted") && !this.getView().getModel("searchModel").getProperty("/CreditBLock")) {


            // this._oGlobalFilter = new sap.ui.model.Filter([
            //   //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
            //   this._oGlobalFilter, new sap.ui.model.Filter("Deleted", sap.ui.model.FilterOperator.EQ, '')




            // ], false);
            // this._oGlobalFilter1 = new sap.ui.model.Filter([this._oGlobalFilter, salesOrgFilters

            // ], true);
            // oBinding.filter([this._oGlobalFilter1]);


            if (sQuery) {
              this._oGlobalFilter = new sap.ui.model.Filter([
                //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
                new sap.ui.model.Filter("Shipto", sap.ui.model.FilterOperator.Contains, sQuery),
                new sap.ui.model.Filter("ShiptoName", sap.ui.model.FilterOperator.Contains, sQuery),
                new sap.ui.model.Filter("stras", sap.ui.model.FilterOperator.Contains, sQuery),
                new sap.ui.model.Filter("Salesman", sap.ui.model.FilterOperator.Contains, sQuery),
                new sap.ui.model.Filter("city", sap.ui.model.FilterOperator.Contains, sQuery),
                new sap.ui.model.Filter("level", sap.ui.model.FilterOperator.Contains, sQuery)

              ], false);

              this._oGlobalFilter = new sap.ui.model.Filter([
                //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
                this._oGlobalFilter,

                new sap.ui.model.Filter("Deleted", sap.ui.model.FilterOperator.NE, true),
                new sap.ui.model.Filter("CreditBLock", sap.ui.model.FilterOperator.NE, true)

              ], true);


              this._oGlobalFilter1 = new sap.ui.model.Filter([this._oGlobalFilter, salesOrgFilters

              ], true);

              oBinding.filter(this._oGlobalFilter1, "Application");
              this.byId("idProductsTable").getBinding("items").filter(this._oGlobalFilter1, "Application");

            } else {
              this._oGlobalFilter = new sap.ui.model.Filter([
                //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);


                new sap.ui.model.Filter("Deleted", sap.ui.model.FilterOperator.NE, true),
                new sap.ui.model.Filter("CreditBLock", sap.ui.model.FilterOperator.NE, true)

              ], true);
              this._oGlobalFilter1 = new sap.ui.model.Filter([this._oGlobalFilter, salesOrgFilters

              ], true);


              oBinding.filter(this._oGlobalFilter1, "Application");
            }


          }


        }
        // else {
        //   this._oGlobalFilter1 = new sap.ui.model.Filter([ new sap.ui.model.Filter("vkorg", sap.ui.model.FilterOperator.EQ, this.vkorg)
        //   ], true);
        //   oBinding.filter(this._oGlobalFilter1); // Fix issue in clear showing 3000 customer records

        // }

      },

      onCloseDialogBox: function (oEvent) {

        var dialog = oEvent.getSource().getParent().close();
      },


      handleSearchCustomer_Prospect: function (oEvent) {
        var sQuery = oEvent.getParameter("value");
        var oBinding = oEvent.getSource().getBinding("items");
        if (sQuery) {
          this._oGlobalFilter = new sap.ui.model.Filter([
            //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
            new sap.ui.model.Filter("Customer", sap.ui.model.FilterOperator.Contains, sQuery),
            new sap.ui.model.Filter("StreetName", sap.ui.model.FilterOperator.Contains, sQuery),
            new sap.ui.model.Filter("CustomerName", sap.ui.model.FilterOperator.Contains, sQuery),
            new sap.ui.model.Filter("CityName", sap.ui.model.FilterOperator.Contains, sQuery),
            new sap.ui.model.Filter("Region", sap.ui.model.FilterOperator.Contains, sQuery),
            new sap.ui.model.Filter("PhoneNumber", sap.ui.model.FilterOperator.Contains, sQuery),
            new sap.ui.model.Filter("EmailAddress", sap.ui.model.FilterOperator.Contains, sQuery),
            new sap.ui.model.Filter("MobileNumber", sap.ui.model.FilterOperator.Contains, sQuery),

          ], false);


          this._oGlobalFilter1 = new sap.ui.model.Filter([this._oGlobalFilter, new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, this.vkorg)], true);
          oBinding.filter([this._oGlobalFilter1]);
        } else {
          this._oGlobalFilter1 = new sap.ui.model.Filter([new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, this.vkorg)], true);
          oBinding.filter(this._oGlobalFilter1); // Fix issue in clear showing 3000 customer records

        }

      },
      handleSearchTeam: function (oEvent) {
        var sQuery = "'" + oEvent.getParameter("value") + "'";
        var oBinding = oEvent.getSource().getBinding("items");
        if (sQuery) {
          this._oGlobalFilter = [
            //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
            new sap.ui.model.Filter({
              path: 'UserID',
              operator: sap.ui.model.FilterOperator.Contains,
              value1: sQuery
            }),
            new sap.ui.model.Filter({
              path: 'UserDescription',
              operator: sap.ui.model.FilterOperator.Contains,
              value1: sQuery
            }),
            new sap.ui.model.Filter({
              path: 'Function',
              operator: sap.ui.model.FilterOperator.Contains,
              value1: sQuery
            })

          ];

          var farrayobj = new sap.ui.model.Filter({
            filters: this._oGlobalFilter,
            and: false,
          });



          oBinding.filter(farrayobj);
        } else {

          oBinding.filter(null);

        }

      },
      handleSelectCustomer: function (oEvent) {
        var kunnr = oEvent.mParameters.listItem.getBindingContext().getObject().kunnr;
        this.vkorg = oEvent.mParameters.listItem.getBindingContext().getObject().vkorg;
        this.getView().getModel("visitModel").setProperty("/Vkorg", this.vkorg);

        oEvent.getSource().getParent().getParent().close();

        this.checkIfDraftExist(kunnr);
        //   this.fetchCustomer(kunnr, this.vkorg);


      },
      checkIfDraftExist: function (kunnr) {

        var userId = sap.ushell.Container.getService("UserInfo").getId();
        if (userId === 'DEFAULT_USER') {
          userId = 'RSONI';
        }
        var that = this;
        let defaultModel1 = this.getOwnerComponent().getModel("ZRMM_FRVISITV2_CDS");

        var urlparam = '';

        if (this.getView().getModel("prospectModel").getProperty("/prospect")) {
          urlparam = "Customer eq '" + kunnr + "' and Ernam eq '" + userId + "' and status eq '1'"
        } else {
          urlparam = "Customer eq '" + kunnr + "' and Ernam eq '" + userId + "' and status eq '1'"

        }
        this.getView().getModel("userValues").setProperty("/Customer", kunnr)

        defaultModel1.read("/ZRMM_FRVISITV2", {

          urlParameters: {
            "$filter": "Customer eq '" + kunnr + "' and Ernam eq '" + userId + "' and status eq '1'",

          },
          success: function (oData, oResponse) {
            // var plant = oData.results.find(element => element.parid === "WRK");
            var oDataResults = oData;
            //   debugger;

            if (oData.results.length === 0) {

              that.fetchCustomer(kunnr, that.vkorg);
              return;
            }

            that.openExistingDraft(oData.results);
            //  sap.m.MessageBox.error("There is already an existing draft visit "+oData.results[0].Visitid+" for this customer. Please select action below.", {
            //   actions: ['Delete Draft', "Convert Visit", ''],
            //   emphasizedAction: sap.m.MessageBox.Action.OK,
            //   onClose: function (sAction) {
            //     if(sAction === 'Create Visit'){

            //       that.fetchCustomer(result.Prospect.Kunnr, that.vkorg);
            //       that.pDialogOpenProspect_d.close();

            //     }
            //   },
            //   dependentOn: that.getView()
            // });
            //  sap.m.MessageBox.error("There are "+oData.results.length+" draft visits found");

          },

          error: function (oError) {}
        });
      },

      handleSelectCustomer_Prospect: function (oEvent) {
        var kunnr = oEvent.mParameters.listItem.getBindingContext().getObject().Customer;
        this.vkorg = oEvent.mParameters.listItem.getBindingContext().getObject().SalesOrganization;
        this.getView().getModel("visitModel").setProperty("/Vkorg", this.vkorg);
        oEvent.getSource().getParent().getParent().close();

        this.checkIfDraftExist(kunnr);
        //  this.fetchCustomer(kunnr, this.vkorg);


      },
      handleSelectTeam: function (oEvent) {
        var team = oEvent.mParameters.listItem.getBindingContext("ZRMM_FRVISITV2_CDS").getObject().UserID;
        var team_dsc = oEvent.mParameters.listItem.getBindingContext("ZRMM_FRVISITV2_CDS").getObject().UserDescription;


        var visitModel = this.getView().getModel("visitModel");
        var datam = visitModel.getData();
        var customerid = "";
        if (this.getView().getModel("customerModel")) {
          customerid = this.getView().getModel("customerModel").getProperty("Customer");
        } else {
          customerid = "";
        }

        if (this.visitid !== 'NEW' && typeof this.visitid !== 'undefined') {
          // datam.to_team.results.push({
          //   "Delete_mc": true,
          //   "Update_mc": true,
          //   "Visitid": this.visitid,
          //   "Kunnr": customerid,
          //   "Vkorg": this.vkorg,
          //   "Bname": team,
          //   "UserDescription": team_dsc,
          //   "Createdatetime": new Date()
          // });

          // visitModel.setData(datam);
          // this.getView().setModel(new sap.ui.model.json.JSONModel(datam
          // ), "visitModel");
          this.onUpdateVisitTeams(team);


        } else {
          datam.to_team.results.push({
            "Delete_mc": true,
            "Update_mc": true,
            "Visitid": "",
            "Kunnr": customerid,
            "Vkorg": this.vkorg,
            "Bname": team,
            "UserDescription": team_dsc,
            "Createdatetime": new Date()
          });
        }
        visitModel.setData(datam);
        this.getView().setModel(new sap.ui.model.json.JSONModel(datam), "visitModel");

        // this.fetchCustomer(kunnr,this.vkorg);


      },

      onUpdateVisitTeams: function (team) {




        this.getView().setBusy(true);
        var dataPayload = this.getView().getModel("visitModel").getData();

        var customerid = "";
        if (this.getView().getModel("customerModel")) {
          customerid = this.getView().getModel("customerModel").getProperty("/Customer");
        } else {
          customerid = "";
        }
        dataPayload.Customer = customerid;
        if (dataPayload.Customer === "") {

          return;
        }
        let prodSet = this.getOwnerComponent().getModel("ZRMM_FRVISITV2_CDS");
        let notesModelData = this.getView().getModel("notesModel").getData().results[0];
        delete notesModelData.editable;
        delete notesModelData.originalText;
        delete notesModelData.visitid_new;
        var that = this;
        dataPayload.to_notes.results = [notesModelData];

        var obj = {
          Bname: team
        };


        // prodSet.setHeaders({"If-Match":"*",
        //   "Content-Type" : "application/json",
        //   "Prefer": "handling=strict",
        //   "sap-message-scope": "BusinessObject",
        //   "sap-contextid-accept" :"header",
        //   "Accept-Language": "en"});

        prodSet.create("/ZRMM_FRVISITV2('" + this.visitid + "')/to_team", obj, {
            success: function (result) {
              // everything is OK 
              that.getView().setBusy(false);
              that.setLock = false;

              // oEvent.getSource().setBusy(false);

              that.triggerEmail(result.Visitid);

              sap.m.MessageBox.success("Visit " + result.Visitid + " was updated successfully");
              that.readVisitModel();
              // var oRouter = that.getOwnerComponent().getRouter();
              // oRouter.navTo("newvisit", {
              //   visitid: result.Visitid,
              //   shipto: customerid,
              //   vkorg: that.vkorg,
              //   isnew: true
              // });

              // this.getView().setModel(new sap.ui.model.json.JSONModel({changeMode: false})
              // , "chageModeModel");
              // oEvent.getSource().setText("Display");


            },
            error: function (err) {
              // some error occuerd 
              that.getView().setBusy(false);
              that.setLock = false;

              //  oEvent.getSource().setBusy(false);



              if (JSON.parse(err.responseText).error.message.value) {
                sap.m.MessageBox.error(JSON.parse(err.responseText).error.message.value);

              } else {
                sap.m.MessageBox.error("There is an issue in creating new visit. Please check data and try again.");
              }



            }
          }

        );



      },

      onSaveDraft: function () {

        this.getView().getModel("visitModel").setProperty("/status", "1")
        this.onCreateVisit_Step();
      },

      onCreateDraftVisit: function () {

        //    this.getView().getModel("chageModeModel").setProperty("/changeMode",true)
        //    this.onCreateVisit();
        let defaultModel1 = this.getOwnerComponent().getModel("ZRMM_FRVISITV2_CDS");
        var that = this;


        sap.m.MessageBox.warning("Do you want to create this visit?", {
          actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
          emphasizedAction: sap.m.MessageBox.Action.OK,
          onClose: function (sAction) {

            if (sAction === 'OK') {
              //   this.getView().getModel("visitModel").setProperty("/status","2");
              var obj = {
                'status': '2'
              }


              var that = this;
              let notesModelData = that.getView().getModel("notesModel").getData().results[0];
              notesModelData = that.getView().getModel("notesModel").getData().results.find(element => element.Visitid === that.visitid)

              delete notesModelData.editable;
              delete notesModelData.originalText;
              delete notesModelData.visitid_new;

              var dataPayload = that.getView().getModel("visitModel").getData();

              dataPayload.status = "2";

              dataPayload.to_notes.results = [notesModelData];

              // defaultModel1.setHeaders({"If-Match":"*",
              //   "Content-Type" : "application/json",
              //   "Prefer": "handling=strict",
              //   "sap-message-scope": "BusinessObject",
              //   "sap-contextid-accept" :"header",
              //   "Accept-Language": "en"});

              defaultModel1.update("/ZRMM_FRVISITV2('" + that.visitid + "')", obj, {
                success: function (oData, oResponse) {
                  that.getView().setBusy(false);
                  that.triggerEmail(that.visitid);

                  setTimeout(() => {
                    sap.m.MessageBox.success("Visit " + that.visitid + " successfully updated");

                  }, 500);
                  var oRouter = that.getOwnerComponent().getRouter();
                  oRouter.navTo("RouteView1");
                  // var plant = oData.results.find(element => element.parid === "WRK");
                  // that.fetchVisitDetails(that.visitid);
                  //  that.extractComments(visitid)

                  //   defaultModel1.setHeaders({
                  //     "If-Match": "*",
                  //     "Content-Type" : "application/json",
                  //     "Prefer": "handling=strict",
                  //     "sap-message-scope": "BusinessObject",
                  //     "sap-contextid-accept" :"header",
                  //     "Accept-Language": "en"
                  // });
                  defaultModel1.update("/ZRMM_FRVISITV2NOTES(Visitid='" + that.visitid + "',Lineid=" + notesModelData.Lineid + ")", notesModelData, {
                    success: function (oData, oResponse) {
                      that.getView().setBusy(false);
                      //    sap.m.MessageBox.success("Comment successfully deleted");
                      // var plant = oData.results.find(element => element.parid === "WRK");
                      // that.fetchVisitDetails(that.visitid);
                      //   that.extractComments(visitid)

                    },

                    error: function (oError) {
                      sap.m.MessageBox.error("There in issue with this action.");
                    }
                  });


                },

                error: function (oError) {
                  sap.m.MessageBox.error("There in issue with this action.");
                }
              });







            } else {


            }

          }.bind(this),
          dependentOn: this.getView()
        });


      },

      onCreateVisit_AutoSave_old: function (oEvent) {


        // if(this.setLock && this.setLock === true){
        //     return;
        // }
        // this.setLock = true;



        var that = this;
        if (that.getView().getModel("visitModel").getProperty("/Visitid") === 'NEW' || that.getView().getModel("visitModel").getProperty("/Visitid") === '') {

          if (oEvent.getSource().getValue().length === 10) {
            that.getView().getModel("visitModel").setProperty("/status", "1");
            that.onCreateVisit_Periodic(that, oEvent.getSource().getValue());
            setTimeout(() => {

              that.getView().byId("CreateProductWizard").getSteps()[5].setValidated(true)

              //    that.getView().byId("CreateProductWizard").setCurrentStep(that.getView().byId("CreateProductWizard").getSteps()[6]);

            }, 1000);
          }
        } else {

          that.onUpdateNotes_periodic(oEvent.getSource().getValue());
        }






      },
      onCreateVisit_AutoSave: function (oEvent) {
        var that = this;

        if (typeof oEvent !== 'object') {
          var notesValue = oEvent;
        } else
          var notesValue = oEvent.getSource().getValue();

        // ALWAYS store in cookie immediately - this is the source of truth
        var cookieKey = this.getCookieKey();
        this.setCookie(cookieKey, notesValue, 7);

        // Also update the model for UI consistency
        var notesModel = this.getView().getModel("notesModel");
        if (notesModel && notesModel.getData().results && notesModel.getData().results[0]) {
          notesModel.getData().results[0].Notes = notesValue;
        }
        var visitId;
        try {

          visitId = that.getView().getModel("visitModel").getProperty("/Visitid");
        } catch (e) {
          return false;
        }

        // Only attempt server save if online
        if (!this._isOnline || !navigator.onLine) {
          console.log("Offline - notes saved to cookie only");
          return;
        }

        // Debounce server save to avoid too many calls
        if (this._saveTimeout) {
          clearTimeout(this._saveTimeout);
        }

        this._saveTimeout = setTimeout(function () {
          // if(notesValue.length >= 10) {
          if (visitId === 'NEW' || visitId === '') {
            that.getView().getModel("visitModel").setProperty("/status", "1");
            that.onCreateVisit_Periodic(that);

            setTimeout(function () {
              that.getView().byId("CreateProductWizard").getSteps()[5].setValidated(true);
            }, 1000);
          } else {
            that.onUpdateNotes_periodic();
          }
          // }
        }, 1000); // Wait 1 second after user stops typing
      },
      onUpdateNotes_periodic_old: function (text) {

        var that = this;
        let defaultModel1 = this.getOwnerComponent().getModel("ZRMM_FRVISITV2_CDS");
        let notesModelData = JSON.parse(JSON.stringify(this.getView().getModel("notesModel").getData().results.find(element => element.Visitid === that.visitid)));

        notesModelData.Notes = text;
        //  notesModelData = that.getView().getModel("notesModel").getData().results.find(element => element.Visitid === that.visitid)
        // notesModelData.Lineid = '1';
        // notesModelData.Visitid = that.getView().getModel("visitModel").getProperty("/Visitid");
        delete notesModelData.editable;
        delete notesModelData.originalText;
        delete notesModelData.visitid_new;
        //    defaultModel1.setHeaders({
        //     "If-Match": "*",
        //     "Content-Type" : "application/json",
        //     "Prefer": "handling=strict",
        //     "sap-message-scope": "BusinessObject",
        //     "sap-contextid-accept" :"header",
        //     "Accept-Language": "en"
        // });

        defaultModel1.update("/ZRMM_FRVISITV2NOTES(Visitid='" + that.getView().getModel("visitModel").getProperty("/Visitid") + "',Lineid=" + notesModelData.Lineid + ")", notesModelData, {
          success: function (oData, oResponse) {
            //    that.getView().setBusy(false);
            //    sap.m.MessageBox.success("Comment successfully deleted");
            // var plant = oData.results.find(element => element.parid === "WRK");
            // that.fetchVisitDetails(that.visitid);
            //   that.extractComments(visitid)

          },

          error: function (oError) {
            //  sap.m.MessageBox.error("There in issue with this action.");
          }
        });
      },


      onUpdateNotes_periodic: function () {
        var that = this;

        // READ FROM COOKIE - this is the source of truth
        var cookieKey = this.getCookieKey();
        var notesFromCookie = this.getCookie(cookieKey);

        if (!notesFromCookie) {
          return; // No cookie data to save
        }

        let defaultModel1 = this.getOwnerComponent().getModel("ZRMM_FRVISITV2_CDS");
        let notesModelData = JSON.parse(JSON.stringify(
          this.getView().getModel("notesModel").getData().results.find(
            element => element.Visitid === that.visitid
          )
        ));

        // Use cookie data, not model data
        notesModelData.Notes = notesFromCookie;

        delete notesModelData.editable;
        delete notesModelData.originalText;
        delete notesModelData.visitid_new;

        defaultModel1.update(
          "/ZRMM_FRVISITV2NOTES(Visitid='" + that.getView().getModel("visitModel").getProperty("/Visitid") +
          "',Lineid=" + notesModelData.Lineid + ")",
          notesModelData, {
            success: function (oData, oResponse) {
              // Delete cookie after successful update
              that.deleteCookie(cookieKey);
            },
            error: function (oError) {
              // Cookie remains for retry
            }
          }
        );
      },
      onCreateVisit_Periodic_old: function (that, notes) {
        var that = that;

        if (that.getView().getModel("visitModel").getProperty("/Visitid") !== 'NEW' && that.getView().getModel("visitModel").getProperty("/Visitid") !== '') {

          return;

        }
        if (that.visitid === "NEW" || that.visitid === "" || typeof that.visitid === "undefined") {
          // this.getView().setBusy(true);
          var dataPayload = that.getView().getModel("visitModel").getData();

          if (typeof dataPayload.Vkorg === 'undefined') {
            dataPayload.Vkorg = that.getView().getModel("userValues").getData().salesorg;
          }

          var customerid = "";
          if (that.getView().getModel("customerModel")) {
            customerid = that.getView().getModel("customerModel").getProperty("/Customer");
          } else {
            customerid = "";
          }
          dataPayload.Customer = customerid;
          if (dataPayload.Customer === "") {

            return;
          }
          let prodSet = that.getOwnerComponent().getModel("ZRMM_FRVISITV2_CDS");
          let notesModelData = that.getView().getModel("notesModel").getData().results[0];
          notesModelData.Notes = notes;
          delete notesModelData.editable;
          delete notesModelData.originalText;
          delete notesModelData.visitid_new;
          var that = that;
          dataPayload.to_notes.results = [notesModelData];
          dataPayload.status = "1";
          //   prodSet.setHeaders({
          //     "If-Match": "*",
          //     "Content-Type" : "application/json",
          //     "Prefer": "handling=strict",
          //     "sap-message-scope": "BusinessObject",
          //     "sap-contextid-accept" :"header",
          //     "Accept-Language": "en"
          // });
          prodSet.create("/ZRMM_FRVISITV2", dataPayload, {
              success: function (result) {
                that.getView().byId("CreateProductWizard").getSteps()[5].setValidated(true);

                // everything is OK 
                //     that.getView().setBusy(false);
                //that.triggerEmail(result.Visitid);
                that.setLock = false;
                that.getView().getModel("visitModel").setData(result);
                that.visitid = result.Visitid;
                that.getView().setModel(new sap.ui.model.json.JSONModel({}), "commentsModel");
                that.extractComments(that.visitid);
                that.getView().byId("CreateProductWizard").getSteps()[5].setValidated(true)



                prodSet.read("/ZRMM_FRVISITV2NOTES", {
                  urlParameters: {
                    "$filter": "Kunnr eq '" + result.Customer + "' and Type eq 'N'",

                  },
                  success: function (oData, oResponse) {
                    // var plant = oData.results.find(element => element.parid === "WRK");
                    var oDataResults = oData;
                    oDataResults.results.forEach(element => {
                      if (element.Visitid === that.visitid) {
                        element.visitid_new = '9999';
                        element.editable = true;
                      } else {
                        element.visitid_new = element.Visitid;
                        element.editable = false;

                      }

                    });
                    that.getView().setModel(new sap.ui.model.json.JSONModel(oDataResults), "notesModel");
                    that.getView().byId("CreateProductWizard").getSteps()[5].setValidated(true)

                  },

                  error: function (oError) {}
                });

                // oEvent.getSource().setBusy(false);

                //      that.triggerEmail(result.Visitid);

                // if(result.status === '1'){
                //   sap.m.MessageBox.success("New draft Visit " + result.Visitid + " was created successfully");

                // }else
                // sap.m.MessageBox.success("New Visit " + result.Visitid + " was created successfully");

                // var oRouter = that.getOwnerComponent().getRouter();
                // oRouter.navTo("newvisit", {
                //   visitid: result.Visitid,
                //   shipto: customerid,
                //   vkorg: that.vkorg,
                //   isnew: true
                // });

                // this.getView().setModel(new sap.ui.model.json.JSONModel({changeMode: false})
                // , "chageModeModel");
                // oEvent.getSource().setText("Display");


              },
              error: function (err) {
                // some error occuerd 
                that.getView().setBusy(false);
                that.setLock = false;

                //  oEvent.getSource().setBusy(false);



                if (JSON.parse(err.responseText).error.message.value) {
                  sap.m.MessageBox.error("There is an issue in creating new visit. Please check data and try again. " + JSON.parse(err.responseText).error.message.value);

                } else {
                  sap.m.MessageBox.error("There is an issue in creating new visit. Please check data and try again.");
                }



              }
            }

          );

        }
      },




      onCreateVisit_Periodic: function (that) {
        var that = that;

        if (that.getView().getModel("visitModel").getProperty("/Visitid") !== 'NEW' &&
          that.getView().getModel("visitModel").getProperty("/Visitid") !== '') {
          console.log("Visit already exists - skipping creation");
          return;
        }

        if (that.visitid === "NEW" || that.visitid === "" || typeof that.visitid === 'undefined') {
          var dataPayload = that.getView().getModel("visitModel").getData();

          if (typeof dataPayload.Vkorg === 'undefined') {
            dataPayload.Vkorg = that.getView().getModel("userValues").getData().salesorg;
          }

          var customerid = "";
          if (that.getView().getModel("customerModel")) {
            customerid = that.getView().getModel("customerModel").getProperty("/Customer");
          } else {
            customerid = "";
          }

          dataPayload.Customer = customerid;
          if (dataPayload.Customer === "") {
            console.log("No customer selected - cannot create visit");
            return;
          }

          // READ FROM COOKIE - this is the source of truth
          var cookieKey = that.getCookieKey();
          var notesFromCookie = that.getCookie(cookieKey);

          // if(!notesFromCookie ) {
          //     console.log("Notes too short or empty - minimum 10 characters required");
          //     return;
          // }

          console.log("Creating draft visit with notes from cookie");

          let prodSet = that.getOwnerComponent().getModel("ZRMM_FRVISITV2_CDS");
          let notesModelData = that.getView().getModel("notesModel").getData().results[0];

          // Use cookie data, not model data
          notesModelData.Notes = notesFromCookie;

          delete notesModelData.editable;
          delete notesModelData.originalText;
          delete notesModelData.visitid_new;

          dataPayload.to_notes.results = [notesModelData];
          dataPayload.status = "1";
          this.getView().setBusy(true);

          prodSet.create("/ZRMM_FRVISITV2", dataPayload, {
            success: function (result) {
              that.getView().setBusy(false);
              console.log("Draft visit created successfully: " + result.Visitid);

              that.getView().byId("CreateProductWizard").getSteps()[5].setValidated(true);
              that.setLock = false;
              that.getView().getModel("visitModel").setData(result);
              that.visitid = result.Visitid;

              // Delete old cookie (NEW visit)
              that.deleteCookie(cookieKey);

              // Create new cookie key for the new visit ID
              var newCookieKey = "visitNotes_" + customerid + "_" + result.Visitid;
              that.setCookie(newCookieKey, notesFromCookie, 7);

              that.getView().setModel(new sap.ui.model.json.JSONModel({}), "commentsModel");
              that.extractComments(that.visitid);
              that.getView().byId("CreateProductWizard").getSteps()[5].setValidated(true);

              prodSet.read("/ZRMM_FRVISITV2NOTES", {
                urlParameters: {
                  "$filter": "Kunnr eq '" + result.Customer + "' and Type eq 'N'",
                },
                success: function (oData, oResponse) {
                  var oDataResults = oData;
                  oDataResults.results.forEach(element => {
                    if (element.Visitid === that.visitid) {
                      element.visitid_new = '9999';
                      element.editable = true;
                    } else {
                      element.visitid_new = element.Visitid;
                      element.editable = false;
                    }
                  });
                  that.getView().setModel(new sap.ui.model.json.JSONModel(oDataResults), "notesModel");
                  that.getView().byId("CreateProductWizard").getSteps()[5].setValidated(true);
                },
                error: function (oError) {
                  console.error("Error loading notes after visit creation");
                }
              });
            },
            error: function (err) {
              console.error("Error creating draft visit - notes remain in cookie");
              that.getView().setBusy(false);
              that.setLock = false;

              // Mark as offline if network error
              if (err.statusCode === 0 || err.statusCode === 503) {
                that._isOnline = false;
              }

              // Cookie remains for retry
              var errorMessage = "Connection issue - notes saved locally and will be synced when online.";

              try {
                if (JSON.parse(err.responseText).error.message.value) {
                  errorMessage = JSON.parse(err.responseText).error.message.value + " Notes saved locally.";
                }
              } catch (e) {
                // Use default message
              }

              sap.m.MessageToast.show(errorMessage);
            }
          });
        }
      },






      _startPeriodicCheck: function () {
        var that = this;

        // Check every 30 seconds if online and has pending notes
        this._periodicCheckInterval = setInterval(function () {
          if (that._isOnline && navigator.onLine) {
            var cookieKey = that.getCookieKey();
            var savedNotes = that.getCookie(cookieKey);
            var visitId = that.getView().getModel("visitModel") .getProperty("/Visitid");

            if (savedNotes &&
              (visitId === 'NEW' || visitId === '' || typeof visitId === 'undefined')) {
              console.log("Periodic check: found pending notes - attempting to save");
              that._checkAndSavePendingNotes();
            }
          }
        }, 30000); // Check every 30 seconds
      },

      _stopPeriodicCheck: function () {
        if (this._periodicCheckInterval) {
          clearInterval(this._periodicCheckInterval);
          this._periodicCheckInterval = null;
        }
      },










      onCreateVisit_Step: function (oEvent) {


        // if(this.setLock && this.setLock === true){
        //     return;
        // }
        // this.setLock = true;
        var that = this;
        if (this.visitid === "NEW" || this.visitid === "" || typeof this.visitid === "undefined") {

          var dataPayload = this.getView().getModel("visitModel").getData();

          var customerid = "";
          if (this.getView().getModel("customerModel")) {
            customerid = this.getView().getModel("customerModel").getProperty("/Customer");
          } else {
            customerid = "";
          }
          dataPayload.Customer = customerid;
          if (dataPayload.Customer === "") {

            return;
          }
          let prodSet = this.getOwnerComponent().getModel("ZRMM_FRVISITV2_CDS");
          let notesModelData = this.getView().getModel("notesModel").getData().results[0];


          if (notesModelData.Notes.length < 10 && this.getView().getModel("visitModel").getProperty("/status") !== '1') {

            sap.m.MessageToast.show("Please enter atleast 10 characters in note");
            return;
          }
          this.getView().setBusy(true);
          delete notesModelData.editable;
          delete notesModelData.originalText;
          delete notesModelData.visitid_new;
          var that = this;
          dataPayload.to_notes.results = [notesModelData];
          dataPayload.status = "1";
          //   prodSet.setHeaders({
          //     "If-Match": "*",
          //     "Content-Type" : "application/json",
          //     "Prefer": "handling=strict",
          //     "sap-message-scope": "BusinessObject",
          //     "sap-contextid-accept" :"header",
          //     "Accept-Language": "en"
          // });
          prodSet.create("/ZRMM_FRVISITV2", dataPayload, {
              success: function (result) {
                // everything is OK 
                that.getView().setBusy(false);
                that.setLock = false;

                // oEvent.getSource().setBusy(false);

                //     that.triggerEmail(result.Visitid);

                if (result.status === '1') {
                  sap.m.MessageBox.success("New draft Visit " + result.Visitid + " was created successfully");

                } else
                  sap.m.MessageBox.success("New Visit " + result.Visitid + " was created successfully");

                var oRouter = that.getOwnerComponent().getRouter();
                oRouter.navTo("newvisit", {
                  visitid: result.Visitid,
                  shipto: customerid,
                  vkorg: that.vkorg,
                  isnew: true
                });

                // this.getView().setModel(new sap.ui.model.json.JSONModel({changeMode: false})
                // , "chageModeModel");
                // oEvent.getSource().setText("Display");


              },
              error: function (err) {
                // some error occuerd 
                that.getView().setBusy(false);
                that.setLock = false;

                //  oEvent.getSource().setBusy(false);



                if (JSON.parse(err.responseText).error.message.value) {
                  sap.m.MessageBox.error("There is an issue in creating new visit. Please check data and try again. " + JSON.parse(err.responseText).error.message.value);

                } else {
                  sap.m.MessageBox.error("There is an issue in creating new visit. Please check data and try again.");
                }



              }
            }

          );

        }




      },
      onCreateDraftVisit_Exit: function (oEvent) {
        // if(this.getView().getModel("notesModel").getData().results.find(element => element.Visitid === this.getView().getModel("visitModel").getProperty("/Visitid")).Notes.length == 0 ){

        //   sap.m.MessageBox.error("Please enter some notes to create draft visit");
        //   return;
        // }
        // if(this.getView().getModel("notesModel").getData().results.find(element => element.Visitid === this.getView().getModel("visitModel").getProperty("/Visitid")).Notes.length < 10 ){

        //   sap.m.MessageToast.show("Please enter atleast 10 characters in note");
        //   return;
        // }
        this.onSaveDraft();
        // history.go(-1);
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteView1");
      },

      onCreateVisit: function (oEvent) {


        if (this.getView().getModel("notesModel").getData().results.find(element => element.Visitid === this.getView().getModel("visitModel").getProperty("/Visitid")).Notes.length == 0) {

          sap.m.MessageBox.error("Please enter some notes to create this visit");
          return;
        }
        if (this.getView().getModel("notesModel").getData().results.find(element => element.Visitid === this.getView().getModel("visitModel").getProperty("/Visitid")).Notes.length < 10) {

          sap.m.MessageToast.show("Please enter atleast 10 characters in note");
          return;
        }
        if (this.setLock && this.setLock === true) {
          return;
        }
        this.setLock = true;

        this.onCreateDraftVisit();
        return;
        var that = this;
        if (this.visitid === "NEW" || this.visitid === "" || typeof this.visitid === "undefined") {
          this.getView().setBusy(true);
          var dataPayload = this.getView().getModel("visitModel").getData();

          var customerid = "";
          if (this.getView().getModel("customerModel")) {
            customerid = this.getView().getModel("customerModel").getProperty("/Customer");
          } else {
            customerid = "";
          }
          dataPayload.Customer = customerid;
          if (dataPayload.Customer === "") {

            return;
          }
          let prodSet = this.getOwnerComponent().getModel("ZRMM_FRVISITV2_CDS");
          let notesModelData = this.getView().getModel("notesModel").getData().results[0];
          delete notesModelData.editable;
          delete notesModelData.originalText;
          delete notesModelData.visitid_new;
          var that = this;
          dataPayload.to_notes.results = [notesModelData];
          prodSet.create("/ZRMM_FRVISITV2", dataPayload, {
              success: function (result) {
                // everything is OK 
                that.getView().setBusy(false);
                that.setLock = false;

                // oEvent.getSource().setBusy(false);

                that.triggerEmail(result.Visitid);

                sap.m.MessageBox.success("New Visit " + result.Visitid + " was created successfully");

                var oRouter = that.getOwnerComponent().getRouter();
                oRouter.navTo("newvisit", {
                  visitid: result.Visitid,
                  shipto: customerid,
                  vkorg: that.vkorg,
                  isnew: true
                });

                // this.getView().setModel(new sap.ui.model.json.JSONModel({changeMode: false})
                // , "chageModeModel");
                // oEvent.getSource().setText("Display");


              },
              error: function (err) {
                // some error occuerd 
                that.getView().setBusy(false);
                that.setLock = false;

                //  oEvent.getSource().setBusy(false);



                if (JSON.parse(err.responseText).error.message.value) {
                  sap.m.MessageBox.error("There is an issue in creating new visit. Please check data and try again. " + JSON.parse(err.responseText).error.message.value);

                } else {
                  sap.m.MessageBox.error("There is an issue in creating new visit. Please check data and try again.");
                }



              }
            }

          );

        } else {


          //  this.getView().byId("UploadSet").removeAllItems();
          //  this.getView().byId("UploadSet").destroyItems();

          if (that.getView().getModel("chageModeModel").getProperty("/changeMode")) {
            if (!that.exitDialog) {
              that.exitDialog = new Dialog({
                type: sap.m.DialogType.Message,
                title: "Confirm",
                content: new sap.m.Text({
                  text: "Are you sure you want to exit making changes to this Visit?"
                }),
                beginButton: new sap.m.Button({
                  type: sap.m.ButtonType.Emphasized,
                  text: "Yes",
                  press: function () {
                    var oRouter = that.getOwnerComponent().getRouter();
                    oRouter.navTo("RouteView1");
                    this.exitDialog.close();

                  }.bind(that)
                }),
                endButton: new sap.m.Button({
                  text: "No",
                  press: function () {
                    this.exitDialog.close();
                  }.bind(that)
                })
              });
            }

            that.exitDialog.open();

          } else {
            var oData = {
              "Delete_mc": true,
              "Update_mc": true,
              "to_notes_oc": true,
              "to_team_oc": true,
              "Visitid": "NEW",
              "Customer": "",
              "Vkorg": this.vkorg,
              "Visittype": "N",

              "Ernam": "",
              "Createdatetime": new Date(),


              "to_notes": {
                "results": [

                ]
              },

              "to_team": {
                "results": [

                  {

                    "Bname": sap.ushell.Container.getService("UserInfo").getId(),
                    "UserDescription": "Current User"
                  }

                ]
              },
              "to_images": {
                "results": [



                ]
              }
            };







            var oDataResults = oData;
            this.getView().setModel(new sap.ui.model.json.JSONModel(oDataResults), "visitModel");
            //   history.go(-1);
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteView1");
          }

        }
      },

      triggerEmail: function (Visitid) {





        let prodSet = this.getOwnerComponent().getModel("ZODATA_FR_SRV");
        if (this.getView().getModel("prospectModel").getProperty("/prospect")) {

          prodSet.read("/TriggerEmailSet(Visitid='" + Visitid + "',Webex='',Prospect='X',Vkorg='" + this.vkorg + "')", {
              success: function (result) {
                // everything is OK 




              },
              error: function (err) {
                // some error occuerd 
                that.getView().setBusy(false);

                sap.m.MessageBox.error("There is an issue in sending email for new visit " + Visitid + ". Please check data and try again." + JSON.parse(err.error.message.value));

              }
            }

          );
        } else {


          prodSet.read("/TriggerEmailSet(Visitid='" + Visitid + "',Webex='',Prospect='',Vkorg='" + this.vkorg + "')", {
              success: function (result) {
                // everything is OK 




              },
              error: function (err) {
                // some error occuerd 
                that.getView().setBusy(false);

                sap.m.MessageBox.error("There is an issue in sending email for new visit " + Visitid + ". Please check data and try again." + JSON.parse(err.error.message.value));

              }
            }

          );



        }



      },
      triggerWebEx: function (Visitid) {





        let prodSet = this.getOwnerComponent().getModel("ZODATA_FR_SRV");

        if (this.getView().getModel("prospectModel").getProperty("/prospect")) {

          prodSet.read("/TriggerEmailSet(Visitid='" + Visitid + "',Webex='X',Prospect='X',Vkorg='" + this.vkorg + "')", {
              success: function (result) {
                // everything is OK 




              },
              error: function (err) {
                // some error occuerd 
                //  that.getView().setBusy(false);

                //  sap.m.MessageBox.error("There is an issue in sending email for new visit " + Visitid + ". Please check data and try again." + JSON.parse(err.error.message.value));

              }
            }

          );
        } else {
          prodSet.read("/TriggerEmailSet(Visitid='" + Visitid + "',Webex='X',Prospect='',Vkorg='" + this.vkorg + "')", {
              success: function (result) {
                // everything is OK 




              },
              error: function (err) {
                // some error occuerd 
                //  that.getView().setBusy(false);

                //  sap.m.MessageBox.error("There is an issue in sending email for new visit " + Visitid + ". Please check data and try again." + JSON.parse(err.error.message.value));

              }
            }

          );
        }



      },
      onPostComments: function (oEvent) {


        let prodSet = this.getOwnerComponent().getModel("ZRMM_FRVISITV2_CDS");

        var that = this;
        var payloadData = {
          "Type": "C",
          "Notes": oEvent.mParameters.value
        };
        //   prodSet.setHeaders({
        //     "If-Match": "*",
        //     "Content-Type" : "application/json",
        //     "Prefer": "handling=strict",
        //     "sap-message-scope": "BusinessObject",
        //     "sap-contextid-accept" :"header",
        //     "Accept-Language": "en"
        // });
        prodSet.create("/ZRMM_FRVISITV2('" + this.visitid + "')/to_notes", payloadData, {
            success: function (result) {
              // everything is OK 

              // sap.m.MessageBox.success("New Visit " + result.Visitid + " was created successfully");
              that.fetchVisitDetails(that.visitid);
              that.extractComments(that.visitid);
              that.triggerWebEx(that.visitid);

            },
            error: function (err) {
              // some error occuerd 
              sap.m.MessageBox.error("There is an issue in creating new visit. Please check data and try again." + err.error.message.value);

            }
          }

        );

      },

      translateCallOrigin: function (oEvent) {

        var that = this;
        if (that.visitid === "" || that.visitid === "NEW" || typeof that.visitid === 'undefined') {


          oEvent.getSource().getParent().getParent().getContent()[0].setValue(this.getView().getModel("translateModel").getProperty("/Orgtext"));
          that.getView().setModel(new sap.ui.model.json.JSONModel({
            "Orgtext": this.getView().getModel("translateModel").getProperty("/Orgtext"),
            "text": this.getView().getModel("translateModel").getProperty("/Orgtext"),
            "lang": 'Original',
            "valueState": "Error"

          }), "translateModel");
          oEvent.getSource().getParent().getParent().getContent()[0].removeStyleClass("textAreaTranslateSP");
          oEvent.getSource().getParent().getParent().getContent()[0].removeStyleClass("textAreaTranslateEN");
          return;

        }
        //   var text = oEvent.getSource().getParent().getParent().getContent()[0].getBindingContext("notesModel").getObject().originalText;
        var text = this.getView().getModel("translateModel").getProperty("/Orgtext");

        oEvent.getSource().getParent().getParent().getContent()[0].setValue(text);
        oEvent.getSource().getParent().getParent().getContent()[0].removeStyleClass("textAreaTranslateSP");
        oEvent.getSource().getParent().getParent().getContent()[0].removeStyleClass("textAreaTranslateEN");

        that.getView().setModel(new sap.ui.model.json.JSONModel({
          "Orgtext": this.getView().getModel("translateModel").getProperty("/Orgtext"),
          "text": this.getView().getModel("translateModel").getProperty("/Orgtext"),
          "lang": 'Original',
          "valueState": "Error"

        }), "translateModel");;
      },

      onUpdateKeyContact: function (oEvent) {

        var object = oEvent.getSource().getBindingContext("customerModel").getObject();
        var vkorg = object.Vkorg;
        var Customer = object.Customer;
        var dept = object.Department;
        var Property = object.Property;
        var BPConactPerson = object.BPConactPerson;
        var that = this;

        if ((object.Whatsapp && object.Whatsapp === true) || object.Whatsapp === '01') {
          object.Whatsapp = '01';
        } else {
          object.Whatsapp = '02';
        }

        if ((object.Email && object.Email === true) || object.Email === '01') {
          object.Email = '01';
        } else {
          object.Email = '02';
        }



        let prodSet = this.getOwnerComponent().getModel("ZODATA_FR_SRV");

        var that = this;
        var sourceDialog = oEvent.getSource().getParent();
        this.getView().setBusy(true);

        //   defaultModel1.setHeaders({
        //     "If-Match": "*",
        //     "Content-Type" : "application/json",
        //     "Prefer": "handling=strict",
        //     "sap-message-scope": "BusinessObject",
        //     "sap-contextid-accept" :"header",
        //     "Accept-Language": "en"
        // });

        prodSet.update("/ZRMM_DEPARTMENTCONACT(Customer='" + Customer + "',Vkorg='" + vkorg + "',Department='" + dept + "',Property='" + Property + "',BPConactPerson='" + BPConactPerson + "')", object, {
            success: function (result) {
              // everything is OK 
              that.getView().setBusy(false);
              sap.m.MessageBox.success("Data saved successfully for " + BPConactPerson);
              // that.fetchVisitDetails(that.visitid);
              that.fetchCustomer(that.getView().getModel("customerModel").getProperty("/Customer"), that.vkorg);
              sourceDialog.close();
            },
            error: function (err) {
              // some error occuerd 
              that.getView().setBusy(false);
              sap.m.MessageBox.error("There is an issue in saving data. Please check data and try again." + JSON.parse(err.responseText).error.message.value);
              that.fetchCustomer(that.getView().getModel("customerModel").getProperty("/Customer"), that.vkorg);

            }
          }

        );





      },

      onSaveSelectedKeyPeople: function (oEvent) {




        this.getView().setBusy(true);

        var object = this.getView().getModel("selectedKeyPeople").getData();
        if (this.getView().getModel("chageModeModel").getData().valueStateEmail === "Error") {

          sap.m.MessageBox.error("Please enter a valid email");
          return;
        }



        if (object.Whatsapp && object.Whatsapp === true) {
          object.Whatsapp = '01';
        } else {
          object.Whatsapp = '02';
        }

        if (object.Email && object.Email === true) {
          object.Email = '01';
        } else {
          object.Email = '02';
        }
        delete object.__metadata;
        //      delete object.IsStandardRelationship;
        var vkorg = this.vkorg;
        object.Vkorg = this.vkorg;
        var Customer = object.Customer;
        var dept = object.Department;
        var Property = object.Property;
        var BPConactPerson = object.BPConactPerson;

        if (object.Department === 'S' && object.Department === 'D' && object.PropertyIntValue === '') {
          sap.m.MessageBox.error("Please select property value");
          return;
        }

        if ((object.ContactPersonEmail === '' || typeof object.ContactPersonEmail === 'undefined') && (object.ContactPersonMobile === '' || typeof object.ContactPersonMobile === 'undefined')) {

          sap.m.MessageBox.error("Please enter mobile number or email id");
          return;
        }

        if (this.getView().getModel("selectedKeyPeople").getData().BPConactPerson && this.getView().getModel("selectedKeyPeople").getData().BPConactPerson !== '') {

        } else {
          if (object.ContactPersonMobile !== '' && typeof object.ContactPersonMobile !== 'undefined' && !this.getView().getModel("flagValueModel").getProperty("/mobileNumberValidated")) {
            sap.m.MessageBox.error("Please wait for mobile number validation to finish.");
            return;

          }
        }
        if (object.ContactFirstName === "" && object.ContactLastName === "") {
          sap.m.MessageBox.error("Please enter Firstname or Lastname");
          return;
        }
        if (object.Department === "") {
          sap.m.MessageBox.error("Please select department");
          return;

        }
        oEvent.getSource().getParent().close();

        //var url = "/sap/opu/odata/sap/ZODATA_FR_SRV/ZRMM_DEPARTMENTCONACT(Customer='1002024',Vkorg='3000',Department='S',Property='ZSERVICECO')";




        let prodSet = this.getOwnerComponent().getModel("ZODATA_FR_SRV");

        var that = this;
        var sourceDialog = oEvent.getSource().getParent();

        this.getView().setBusy(true);

        //   prodSet.setHeaders({
        //     "If-Match": "*",
        //     "Content-Type" : "application/json",
        //     "Prefer": "handling=strict",
        //     "sap-message-scope": "BusinessObject",
        //     "sap-contextid-accept" :"header",
        //     "Accept-Language": "en"
        // });
        prodSet.create("/ZRMM_DEPARTMENTCONACT", object, {
            success: function (result) {
              // everything is OK 
              that.getView().setBusy(true);

              sap.m.MessageBox.success("New Contact " + result.BPConactPerson + " saved successfully for " + Customer);
              that.fetchCustomer(that.getView().getModel("customerModel").getProperty("/Customer"), that.vkorg);
              sourceDialog.close();

              if (that.oApproveDialog1) {
                that.oApproveDialog1.close();
              }

              if (that.pDialogKeyPeople_mob) {
                that.pDialogKeyPeople_mob.close();
              }

              if (that.pDialogKeyPeople) {
                that.pDialogKeyPeople.close();
              }


            },
            error: function (err) {
              // some error occuerd 
              that.getView().setBusy(false);

              sap.m.MessageBox.error("There is an issue in saving data. Please check data and try again." + JSON.parse(err.responseText).error.message.value);

            }
          }

        );




      },
      onCreateSelectedKeyPeople: function (oEvent) {

        var object = this.getView().getModel("selectedKeyPeople").getData();

        if (object.Whatsapp && object.Whatsapp === true) {
          object.Whatsapp = '01';
        } else {
          object.Whatsapp = '02';
        }

        if (object.Email && object.Email === true) {
          object.Email = '01';
        } else {
          object.Email = '02';
        }

        var vkorg = object.Vkorg;
        var Customer = object.Customer;
        var dept = object.Department;
        var Property = object.Property;
        var BPConactPerson = object.BPConactPerson;
        //  var url = "/sap/opu/odata/sap/ZODATA_FR_SRV/ZRMM_DEPARTMENTCONACT(Customer='1002024',Vkorg='3000',Department='S',Property='ZSERVICECO')";




        let prodSet = this.getOwnerComponent().getModel("ZODATA_FR_SRV");
        var sourceDialog = oEvent.getSource().getParent();
        var that = this;
        //  var payloadData =  {"Type":"C","Notes":oEvent.mParameters.value      };

        //   defaultModel1.setHeaders({
        //     "If-Match": "*",
        //     "Content-Type" : "application/json",
        //     "Prefer": "handling=strict",
        //     "sap-message-scope": "BusinessObject",
        //     "sap-contextid-accept" :"header",
        //     "Accept-Language": "en"
        // });

        prodSet.update("/ZRMM_DEPARTMENTCONACT(Customer='" + Customer + "',Vkorg='" + vkorg + "',Department='" + dept + "',Property='" + Property + "',BPConactPerson='" + BPConactPerson + "')", object, {
            success: function (result) {
              // everything is OK 

              sap.m.MessageBox.success("Data saved successfully for " + Customer);
              // that.fetchVisitDetails(that.visitid);
              that.fetchCustomer(that.getView().getModel("customerModel").getProperty("/Customer"), that.vkorg);
              sourceDialog.close();

            },
            error: function (err) {
              // some error occuerd 
              sap.m.MessageBox.error("There is an issue in saving data. Please check data and try again." + err.error.message.value);

            }
          }

        );



      },
      onAddNewKeyPeople: function (oEvent) {
        if (!this.pDialogKeyPeople) {
          this.pDialogKeyPeople = this.loadFragment({
            name: "customer.porky.zfieldrepvisit.view.manageKeyPeople"
          });
        } else {

        }
        var that = this;

        var obj = {

          "Department": "",
          "Customer": this.getView().getModel("customerModel").getProperty("/Customer"),
          "Vkorg": this.vkorg,
          "Property": "ZSERVICECO",
          "BPConactPerson": "",
          "IsStandardRelationship": false,
          "DepartmentName": "",
          "PropertyIntValue": "",
          "Email": "02",
          "Whatsapp": "02",
          "ContactPersonEmail": "",
          "ContactPersonMobile": "",
          "ContactFirstName": "",
          "ContactLastName": ""


        };

        if (obj.Whatsapp && obj.Whatsapp === '02') {
          obj.Whatsapp = false;
        }
        if (obj.Whatsapp && obj.Whatsapp === '01') {
          obj.Whatsapp = true;
        }
        if (!obj.Whatsapp) {
          obj.Whatsapp = false;
        }


        if (obj.Email && obj.Email === '02') {
          obj.Email = false;
        }
        if (obj.Email && obj.Email === '01') {
          obj.Email = true;
        }
        if (!obj.Email) {
          obj.Email = false;
        }

        that.getView().setModel(new sap.ui.model.json.JSONModel(obj), "selectedKeyPeople");
        this.pDialogKeyPeople.then(function (oDialog) {


          oDialog.open();
          that.addNewKeyPeopleDialog = oDialog;



        });
        this.getView().addDependent(this.pDialogKeyPeople);
      },

      onUploadCompleted: function (oEvent) {

        if (this._isOnline && navigator.onLine) {


          var item = oEvent.mParameters.item;
          var uploadSet = this.getView().byId("UploadSet");
          //   oEvent.mParameters.item.getParent().removeItem(oEvent.mParameters.item);
          this.removeFileItem(item, uploadSet);



          this.fetchVisitDetails(this.visitid);
          this.getView().setBusy(false);

        } else {

          sap.m.MessageToast.show("Working offline - Please come online to perform this action");
          return;
        }

      },

      onSelectionChangeUpload: function (oEvent) {},
      onFinishUploadDocuments: function (oEvent) {
        var items = this.getView().byId("UploadSet").getIncompleteItems();
        var uploadSet = this.getView().byId("UploadSet");
        items.forEach(element => {
          this.updateFile(element, this.visitid);

        });
      },
      removeFileItem: function (item, uploadset) {
        uploadset.removeItem(item);

      },
      onAfterUploadItemAdded: function (oEvent) {


        // online offline 

        if (this._isOnline && navigator.onLine) {


          var fobj = oEvent.mParameters.item.getFileObject();
          var fileItem = oEvent.mParameters.item;
          var that = this;

          that.updateFile(fileItem, that.visitid);

        } else {

          sap.m.MessageToast.show("Working offline - Please come online to perform this action");
          return;
        }


        // var type = fobj.type;
        // var name = fobj.name;

        // debugger;
      },

      updateFile: function (fileItem, visitID) {


        var url = "/sap/opu/odata/sap/ZODATA_FIELDREP_IMAGES_V2_SRV/ZFRVISIT_IMAGESSet";
        fileItem.setUploadUrl(url);
        var oUploadSet = this.byId("UploadSet");
        oUploadSet.setHttpRequestMethod("POST")
        oUploadSet.removeAllHeaderFields();
        //   oUploadSet.removeHeaderField("x-csrf-token");

        oUploadSet.addHeaderField(new sap.ui.core.Item({
          key: 'SLUG',
          text: visitID + ";" + fileItem._oFileObject.name
        }));
        oUploadSet.addHeaderField(new sap.ui.core.Item({
          key: 'x-csrf-token',
          text: this.getView().getModel('ZODATA_FIELDREP_IMAGES_V2_SRV').getHeaders()['x-csrf-token']
        }));

        oUploadSet.uploadItem(fileItem);
        var that = this;
        // this.getView().setBusy(true);
        // setTimeout(() => {
        //   this.getView().setBusy(false);
        //   fileItem.getParent().removeItem(fileItem);

        // }, 2000);


        //    fileItem.setUploadState("Complete");
        //    fileItem.setProgress(100);

        //         debugger;
        //         var payLoad={
        //             Filename:fileName,
        //             Filetype:fileType,
        //             Filecontent:vContent

        //         }
        // var that = this;
        // var serviceurl="/sap/opu/odata/sap/ZODATA_FIELDREP_IMAGES_V2_SRV/";

        // var oModel =  
        // new sap.ui.model.odata.ODataModel(serviceurl); oModel .update("/ZFRVISIT_IMAGESSet", 
        // payLoad,{
        //              method: "POST",
        //              headers: {
        //               slug: oEvent.detail.filename
        //           },
        //              success: function(data) {

        // sap.m.MessageToast.show("FILE UPDATED SUCCESSFULLY");

        //              },
        //              error: function(e) {
        //               alert("error");
        //             }
        //          })
      },
      onSupplierSelected: function (oEvent) {




        if (oEvent.mParameters.selected) {


          var supplier = oEvent.getSource().getBindingContext("supplierModel").getObject().Name1;



          let prodSet = this.getOwnerComponent().getModel("ZODATA_FR_SRV");
          var that = this;

          var object = {

            "Kunnr": this.getView().getModel("customerModel").getProperty("/Customer"),
            "Vkorg": this.vkorg,
            "Name1": supplier
          }
          //   prodSet.setHeaders({
          //     "If-Match": "*",
          //     "Content-Type" : "application/json",
          //     "Prefer": "handling=strict",
          //     "sap-message-scope": "BusinessObject",
          //     "sap-contextid-accept" :"header",
          //     "Accept-Language": "en"
          // });
          prodSet.create("/FRVISITCUSTSUPPSet", object, {
            success: function (result) {
              // everything is OK 

              //  sap.m.MessageBox.success("Supplier added successfully " + supplier);
              // that.fetchVisitDetails(that.visitid);
              that.fetchCustomer(that.getView().getModel("customerModel").getProperty("/Customer"), that.vkorg);

            },
            error: function (err) {
              // some error occuerd 
              sap.m.MessageBox.error("There is an issue in saving data. Please check data and try again." + err.error.message.value);

            }
          });

        } else {


          var supplier = oEvent.getSource().getBindingContext("supplierModel").getObject().Name1;



          let prodSet = this.getOwnerComponent().getModel("ZODATA_FR_SRV");
          var that = this;

          var object = {

            "Kunnr": this.getView().getModel("customerModel").getProperty("/Customer"),
            "Vkorg": this.vkorg,
            "Name1": supplier
          }

          prodSet.remove("/FRVISITCUSTSUPPSet(Kunnr='000" + this.getView().getModel("customerModel").getProperty("/Customer") + "',Vkorg='" + this.vkorg + "',Name1='" + encodeURIComponent(supplier) + "')", {

            success: function (result) {
              // everything is OK 

              sap.m.MessageBox.success("Supplier deleted successfully " + supplier);
              // that.fetchVisitDetails(that.visitid);
              that.getView().byId("idOthSuppliers").getBinding("items").filter([]);
              that.fetchCustomer(that.getView().getModel("customerModel").getProperty("/Customer"), that.vkorg);

            },
            error: function (err) {
              // some error occuerd 
              sap.m.MessageBox.error("There is an issue in saving data. Please check data and try again." + JSON.parse(err.responseText).error.message.value);
              that.getView().byId("idOthSuppliers").getBinding("items").filter([]);
              that.fetchCustomer(that.getView().getModel("customerModel").getProperty("/Customer"), that.vkorg);

            }
          });




        }
      },

      validateEmail_prospect: function (oEvent) {
        oEvent.getSource().setValueState("None");


        var email = oEvent.getSource().getValue();

        this.emailValidate = oEvent.getSource();
        var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;

        if (!mailregex.test(email)) {
          if (email === '') {
            return;
          }

          sap.m.MessageBox.show(email + " is not a valid email address");

          oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
          // oEvent.getSource().setValue('')
          return;
        } else {
          oEvent.getSource().setValueState(sap.ui.core.ValueState.None);

        }







      },

      validateEmail: function (oEvent) {
        oEvent.getSource().setValueState("None");


        var email = oEvent.getSource().getValue();

        this.emailValidate = oEvent.getSource();
        var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;

        if (!mailregex.test(email)) {
          if (email === '') {
            return;
          }

          sap.m.MessageBox.show(email + " is not a valid email address");

          oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
          // oEvent.getSource().setValue('')
          return;
        } else {
          oEvent.getSource().setValueState(sap.ui.core.ValueState.None);

        }


        let defaultModel = this.getOwnerComponent().getModel("ZODATA_FR_SRV");
        var that = this;
        var filterSupplier =
          new sap.ui.model.Filter("ContactPersonEmail", sap.ui.model.FilterOperator.Contains, email);;


        defaultModel.read("/ZBMM_GETCONTACTPERSON", {
          urlParameters: {


          },
          filters: [filterSupplier],
          success: function (oData, oResponse) {
            // var plant = oData.results.find(element => element.parid === "WRK");
            var oDataResults = oData;
            if (oDataResults.results.length > 0) {
              that.getView().setModel(new sap.ui.model.json.JSONModel(oDataResults), "mobileKeyDeptModel");
              that.openMobileValidateView();
              that.emailValidate.setValueState("None");

            } else {
              that.emailValidate.setValueState("Success");
            }
          },

          error: function (oError) {}
        });




      },
      onOtherItemPressed: function (oEvent) {
        var selectedItem = oEvent.mParameters.listItem.getBindingContext("ZBMM_FRVISITDEFSUPP_CDS").getObject().Name1;
        oEvent.getSource().getParent().getParent().close();
        var oView = oEvent.getSource().getParent().getParent().getParent();





        var object = {

          "Kunnr": oView.getModel("customerModel").getProperty("/Customer"),
          "Vkorg": oView.getModel("userValues").getProperty("/salesorg"),
          "Name1": selectedItem
        }

        let prodSet = oView.getModel("ZODATA_FR_SRV");
        var that = this;
        //   prodSet.setHeaders({
        //     "If-Match": "*",
        //     "Content-Type" : "application/json",
        //     "Prefer": "handling=strict",
        //     "sap-message-scope": "BusinessObject",
        //     "sap-contextid-accept" :"header",
        //     "Accept-Language": "en"
        // });
        prodSet.create("/FRVISITCUSTSUPPSet", object, {
          success: function (result) {
            // everything is OK 

            sap.m.MessageBox.success("Supplier added successfully " + selectedItem);
            // that.fetchVisitDetails(that.visitid);
            oView.byId("idOthSuppliers").getBinding("items").filter([]);
            oView.getController().fetchCustomer(oView.getModel("customerModel").getProperty("/Customer"), oView.getModel("userValues").getProperty("/salesorg"));

          },
          error: function (err) {
            // some error occuerd 
            sap.m.MessageBox.error("There is an issue in saving data. Please check data and try again." + err.error.message.value);

          }
        });

      },
      onSearchOthersList: function (oEvent) {
        var sQuery = oEvent.mParameters.value;
        var list = oEvent.getSource().getParent().getItems()[1];
        if (sQuery) {
          this._oGlobalFilter = new sap.ui.model.Filter([
            //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
            new sap.ui.model.Filter("Name1", sap.ui.model.FilterOperator.Contains, sQuery),
            new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, '')
          ], true);

          list.getBinding("items").filter(this._oGlobalFilter, "Application");
        } else {

          this._oGlobalFilter = new sap.ui.model.Filter([
            //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
            new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, '')
          ], true);

          list.getBinding("items").filter(this._oGlobalFilter, "Application");
        }
      },

      addOtherSupplier: function () {
        if (!this.oDefaultDialog) {
          var that = this;
          this.oDefaultDialog = new sap.m.Dialog({
            title: "Enter Other Supplier",
            content: new sap.m.VBox({
              items: [, new sap.m.Input({
                  placeholder: 'Enter New Entry',
                  id: 'idSupplierOthers',
                  liveChange: this.onSearchOthersList
                }),



                new sap.m.List({
                  mode: "SingleSelectMaster",
                  noDataText: "No Existing Supplier Found",
                  select: this.onOtherItemPressed,
                  growing: true,

                  growingThreshold: 20,
                  items: {

                    path: "ZBMM_FRVISITDEFSUPP_CDS>/ZBMM_FRVISITDEFSUPP",
                    template: new sap.m.StandardListItem({
                      title: "{ZBMM_FRVISITDEFSUPP_CDS>Name1}"

                    })
                  }
                })
              ]
            }),
            beginButton: new sap.m.Button({
              type: sap.m.ButtonType.Emphasized,
              text: "Add",
              press: function (oEvent) {
                var input = oEvent.getSource().getParent().getContent()[0].getItems()[0].getValue();



                var object = {

                  "Kunnr": this.getView().getModel("customerModel").getProperty("/Customer"),
                  "Vkorg": this.vkorg,
                  "Name1": input
                }

                let prodSet = this.getOwnerComponent().getModel("ZODATA_FR_SRV");
                var that = this;
                //   prodSet.setHeaders({
                //     "If-Match": "*",
                //     "Content-Type" : "application/json",
                //     "Prefer": "handling=strict",
                //     "sap-message-scope": "BusinessObject",
                //     "sap-contextid-accept" :"header",
                //     "Accept-Language": "en"
                // });
                prodSet.create("/FRVISITCUSTSUPPSet", object, {
                  success: function (result) {
                    // everything is OK 

                    sap.m.MessageBox.success("Supplier added successfully " + input);
                    // that.fetchVisitDetails(that.visitid);
                    that.getView().byId("idOthSuppliers").getBinding("items").filter([]);
                    that.fetchCustomer(that.getView().getModel("customerModel").getProperty("/Customer"), that.vkorg);

                  },
                  error: function (err) {
                    // some error occuerd 
                    sap.m.MessageBox.error("There is an issue in saving data. Please check data and try again." + err.error.message.value);

                  }
                });


                this.oDefaultDialog.close();
              }.bind(this)
            }),
            endButton: new sap.m.Button({
              text: "Close",
              press: function () {
                this.oDefaultDialog.close();
              }.bind(this)
            })
          });

          // to get access to the controller's model
          this.getView().addDependent(this.oDefaultDialog);
        }

        this.oDefaultDialog.open();

        var aFilters = [];


        var filter = new sap.ui.model.Filter([
          //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
          new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, '')


        ], false);


        aFilters.push(filter);





        var farrayobj = new sap.ui.model.Filter({
          filters: aFilters,
          and: false,
        });





        this.oDefaultDialog.getContent()[0].getItems()[1].getBinding("items").filter(farrayobj, "Application");

      },
      onDeleteTeamMember: function (oEvent) {

        var bname = oEvent.oSource.getBindingContext("visitModel").getObject().Bname;
        var that = this;
        if (this.visitid !== 'NEW') {

          var lineid = oEvent.oSource.getBindingContext("visitModel").getObject().Lineid;
          let prodSet = this.getOwnerComponent().getModel("ZRMM_FRVISITV2_CDS");


          prodSet.remove("/ZRMM_FRVISITV2TM(Visitid='" + this.visitid + "',Lineid=" + lineid + ")", {
              success: function (result, response) {
                // everything is OK 
                that.getView().setBusy(false);
                that.setLock = false;

                // oEvent.getSource().setBusy(false);

                //  that.triggerEmail(that.Visitid);

                sap.m.MessageBox.success("Visit " + that.visitid + " was updated successfully");
                that.readVisitModel();



              },
              error: function (err) {
                // some error occuerd 
                that.getView().setBusy(false);
                that.setLock = false;

                //  oEvent.getSource().setBusy(false);



                if (JSON.parse(err.responseText).error.message.value) {
                  sap.m.MessageBox.error(JSON.parse(err.responseText).error.message.value);

                } else {
                  sap.m.MessageBox.error("There is an issue in updating visit. Please check data and try again.");
                }



              }
            }

          );

        } else {


          //ZRMM_FRVISITV2TM(Visitid='0000000149',Lineid=1)

          var teamsData = this.getView().getModel("visitModel").getData();
          var filtered = teamsData.to_team.results.filter(function (item) {
            return item.Bname !== bname;
          });

          teamsData.to_team.results = filtered;
          this.getView().setModel(new sap.ui.model.json.JSONModel(teamsData), "visitModel");

        }

      },
      onBeforeImageRemoved(oEvent) {
        var that = this;
        var imageURL = oEvent.mParameters.item.getBindingContext("visitModel").getObject().GetUrl.split("ZODATA_FIELDREP_IMAGES_V2_SRV")[1];
        let defaultModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZODATA_FIELDREP_IMAGES_V2_SRV/");
        defaultModel.remove(imageURL.split("/$value")[0] + "/$value", {

          success: function (result) {
            // everything is OK 

            sap.m.MessageBox.success("Image deleted successfully ");
            // that.fetchVisitDetails(that.visitid);
            // that.getView().byId("idOthSuppliers").getBinding("items").filter([]);
            // that.fetchCustomer(that.getView().getModel("customerModel").getProperty("/Customer"), that.vkorg);
            that.fetchVisitDetails(that.visitid);
          },
          error: function (err) {
            // some error occuerd 
            sap.m.MessageBox.error("There is an issue in deleting attachment. Please check data and try again." + JSON.parse(err.responseText).error.message.value);
            that.fetchVisitDetails(that.visitid);

          }
        });
      },

      onDeleteDepartmentKey: function (departmentData) {
        // var departmentData = oEvent.getSource().getBindingContext("customerModel").getObject();
        var dept = departmentData.Department,
          cust = departmentData.Customer,
          vkorg = departmentData.Vkorg,
          Property = departmentData.Property,
          BPcontact = departmentData.BPConactPerson,
          customername = departmentData.CustomerName;
        var urldept = "/ZRMM_DEPARTMENTCONACT(Department='" + dept + "',Customer='" + cust + "',Vkorg='" + vkorg + "',Property='" + Property + "',BPConactPerson='" + BPcontact + "')";

        let prodSet = this.getOwnerComponent().getModel("ZODATA_FR_SRV");
        var that = this;



        prodSet.remove(urldept, {

          success: function (result) {
            // everything is OK 

            sap.m.MessageBox.success("Department Key Contact " + BPcontact + " de-linked successfully from customer " + cust + " " + customername);
            // that.fetchVisitDetails(that.visitid);
            that.fetchCustomer(that.getView().getModel("customerModel").getProperty("/Customer"), that.vkorg);

          },
          error: function (err) {
            // some error occuerd 
            sap.m.MessageBox.error("There is an issue in saving data. Please check data and try again.");

          }
        });
      },

      onApproveDeleteDialogPress: function (oEvent) {
        var departmentData = oEvent.getSource().getBindingContext("customerModel").getObject();
        this.departmentData = departmentData
        if (!this.oApproveDialog) {
          this.oApproveDialog = new Dialog({
            type: sap.m.DialogType.Message,
            title: "Confirm",
            content: new sap.m.Text({
              text: "Do you want to delete this Key Contact?"
            }),
            beginButton: new sap.m.Button({
              type: sap.m.ButtonType.Emphasized,
              text: "Submit",
              press: function () {
                sap.m.MessageToast.show("Submit pressed!");
                this.oApproveDialog.close();
                this.onDeleteDepartmentKey(this.departmentData);
              }.bind(this)
            }),
            endButton: new sap.m.Button({
              text: "Cancel",
              press: function () {
                this.oApproveDialog.close();
              }.bind(this)
            })
          });
        }

        this.oApproveDialog.open();
      },
      onTranslateCommentPressed: function (oEvent) {

        var btntext = oEvent.getSource().getText();
        var field = oEvent.getSource().getParent();
        var text = field.getText();
        if (btntext.includes("English")) {
          this.translateCallENCommon(text, field);
        } else if (btntext.includes("Español")) {
          this.translateCallESCommon(text, field);

        } else {
          this.fetchVisitDetails(this.visitid);
          field.removeStyleClass("textAreaTranslateSP");
          field.removeStyleClass("textAreaTranslateEN");
        }
      },

      translateCallESCommon(text, field) {

        var text = text;
        //   this.translateLanguage(text,"es",oEvent.getSource().getParent().getParent().getContent()[0]);
        var sourceField = field
        // var that = this._view;
        var that = this;

        var data = {
          "q": text,
          "target": 'es',
          "source": 'en',

          "key": "AIzaSyARq_VIDUxAl-xrs9bV_921ZzSggNjHAzE"
        };
        $.ajax({
          url: "https://translation.googleapis.com/language/translate/v2",
          headers: {
            Accept: "text/plain; charset=utf-8",
            "Content-Type": "text/plain; charset=utf-8"
          },
          data: data,
          success: function (response) {
            var translatedText = response.data.translations[0].translatedText;
            sourceField.setText(translatedText);
            sourceField.removeStyleClass("textAreaTranslateEN");
            sourceField.addStyleClass("textAreaTranslateSP");

          }
        });
      },
      translateCallENCommon(text, field) {

        var text = text;
        //   this.translateLanguage(text,"es",oEvent.getSource().getParent().getParent().getContent()[0]);
        var sourceField = field
        // var that = this._view;
        var that = this;

        var data = {
          "q": text,
          "target": 'en',
          "source": 'es',

          "key": "AIzaSyARq_VIDUxAl-xrs9bV_921ZzSggNjHAzE"
        };
        $.ajax({
          url: "https://translation.googleapis.com/language/translate/v2",
          headers: {
            Accept: "text/plain; charset=utf-8",
            "Content-Type": "text/plain; charset=utf-8"
          },
          data: data,
          success: function (response) {
            var translatedText = response.data.translations[0].translatedText;
            sourceField.setText(translatedText);
            sourceField.removeStyleClass("textAreaTranslateSP");

            sourceField.addStyleClass("textAreaTranslateEN");




          }
        });
      },

      onChangeModeSelected: function (oEvent) {

        if (this.getView().getModel("chageModeModel").getData().changeMode) {
          this.getView().setModel(new sap.ui.model.json.JSONModel({
            changeMode: false
          }), "chageModeModel");
          //  oEvent.getSource().setText("Display");

        } else {
          this.checkAuthorization(this.getView().getModel("visitModel").getData().Ernam);
          // this.getView().setModel(new sap.ui.model.json.JSONModel({changeMode: true})
          // , "chageModeModel");
          // oEvent.getSource().setText("Edit")

        }

      },
      validatePhoneNumber_prospect: function (oEvent) {
        var email = oEvent.mParameters.value;

        oEvent.getSource().setValueState("None");

        var mailregex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

        if (!mailregex.test(email)) {

          if (email === '') {
            return;
          }
          //  sap.m.MessageBox.show(email + " is not a valid phone number");

          oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
          //  oEvent.getSource().setValue('')
          return;
        } else {
          this.getView().setBusy(true);
          oEvent.getSource().setValueState(sap.ui.core.ValueState.None);


          this.getView().getModel("flagValueModel").setProperty("/mobileNumberValidated", false);
          var email1 = email.split("(")[1].split(")").join("");

        }

      },
      validatePhoneNumber: function (oEvent) {
        var email = oEvent.mParameters.value;
        // if (email.length < 14 && !email.includes("_")) {
        //   return;
        // }
        oEvent.getSource().setValueState("None");




        var mailregex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

        if (!mailregex.test(email)) {

          if (email === '') {
            return;
          }
          //  sap.m.MessageBox.show(email + " is not a valid phone number");

          oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
          //  oEvent.getSource().setValue('')
          return;
        } else {
          this.getView().setBusy(true);
          oEvent.getSource().setValueState(sap.ui.core.ValueState.None);


          this.getView().getModel("flagValueModel").setProperty("/mobileNumberValidated", false);
          var email1 = email.split("(")[1].split(")").join("");


          let defaultModel = this.getOwnerComponent().getModel("ZODATA_FR_SRV");
          var that = this;
          that.mobileValidate = oEvent.getSource();

          var filterSupplier =
            new sap.ui.model.Filter("ContactPersonMobile", sap.ui.model.FilterOperator.EQ, email);;

          var filterSupplier2 =
            new sap.ui.model.Filter("ContactPersonMobile", sap.ui.model.FilterOperator.EQ, email1);;
          defaultModel.read("/ZBMM_GETCONTACTPERSON", {
            urlParameters: {


            },
            filters: [filterSupplier, filterSupplier2],
            success: function (oData, oResponse) {
              that.getView().setBusy(false);
              // var plant = oData.results.find(element => element.parid === "WRK");
              that.getView().getModel("flagValueModel").setProperty("/mobileNumberValidated", true);

              var oDataResults = oData;
              if (oDataResults.results.length > 0) {
                that.getView().setModel(new sap.ui.model.json.JSONModel(oDataResults), "mobileKeyDeptModel");
                that.mobileValidate.setValueState("None");

                that.openMobileValidateView();
              } else {
                that.mobileValidate.setValueState("None");

              }
            },

            error: function (oError) {
              that.getView().getModel("flagValueModel").setProperty("/mobileNumberValidated", true);

              that.getView().setBusy(false);
            }
          });
        }

      },
      openMobileValidateView: function () {


        var oView = this.getView();
        var that = this;
        // create popover
        if (!this._pPopover_mob) {
          this._pPopover_mob = sap.ui.core.Fragment.load({
            id: oView.getId(),
            name: "customer.porky.zfieldrepvisit.view.keydeptmobile",
            controller: this
          }).then(function (oPopover) {
            oView.addDependent(oPopover);


            return oPopover;
          });
        } else {
          this._pPopover_mob = undefined;
          if (that.mobileValidateDialog) {
            that.mobileValidateDialog.destroy();
            that.mobileValidateDialog = undefined;
          }
          this._pPopover_mob = sap.ui.core.Fragment.load({
            id: oView.getId(),
            name: "customer.porky.zfieldrepvisit.view.keydeptmobile",
            controller: this
          }).then(function (oPopover) {
            oView.addDependent(oPopover);


            return oPopover;
          });



        }
        this._pPopover_mob.then(function (oPopover) {
          that.mobileValidateDialog = oPopover;

          oPopover.open();


        });
      },

      onValidationSuccessNotes: function (oEvent) {
        alert("12")
      },
      onActivateImages: function (oEvent) {

        this.onCreateVisit_Step();
      },

      onChangeSalesOrg: function (oEvent) {
        var source = oEvent.getSource();
        // this.getView().setModel(new sap.ui.model.json.JSONModel(
        //   {
        //     "salesorg": "",
        //     "moe" : false

        //   }
        // ), "userValues");
        this.getView().getModel("userValues").setProperty("/salesorg", "")

        var oButton = oEvent.getSource(),
          oView = this.getView();
        var that = this;
        // create popover
        if (!this._pPopover) {
          this._pPopover = sap.ui.core.Fragment.load({
            id: oView.getId(),
            name: "customer.porky.zfieldrepvisit.view.salesorg",
            controller: this
          }).then(function (oPopover) {
            oView.addDependent(oPopover);
            oPopover.setModel(that.getView().getModel("userValues"));
            oPopover.getContent()[0].getItems()[1].setValue(that.vkorg)

            return oPopover;
          });
        }
        this._pPopover.then(function (oPopover) {
          oPopover.open();
          oPopover.getContent()[0].getItems()[1].setValue(that.vkorg)

        });


      },
      handleSalesOrgPress: function (oEvent) {
        var salesorg = oEvent.getSource().getParent().getContent()[0].getItems()[1].getValue();
        this.salesorg = salesorg;
        this.vkorg = salesorg;
        if (this.vkorg.trim() !== "")
          // this.getView().setModel(new sap.ui.model.json.JSONModel(
          //   {
          //     "salesorg": this.vkorg

          //   }
          // ), "userValues");
          this.getView().getModel("userValues").setProperty("/salesorg", this.vkorg);
        oEvent.getSource().getParent().close();
      },
      onRemoveMobileAssignment12121: function (oEvent) {

        var object = oEvent.getSource().getBindingContext("mobileKeyDeptModel").getObject();
        object.ContactPersonMobile = "";
        var vkorg = object.Vkorg;
        var Customer = object.Customer;
        var dept = object.Department;
        var Property = object.Property;
        var BPConactPerson = object.BPConactPerson;

        //var url = "/sap/opu/odata/sap/ZODATA_FR_SRV/ZRMM_DEPARTMENTCONACT(Customer='1002024',Vkorg='3000',Department='S',Property='ZSERVICECO')";




        let prodSet = this.getOwnerComponent().getModel("ZODATA_FR_SRV");

        var that = this;
        var sourceDialog = oEvent.getSource().getParent();
        //  var payloadData =  {"Type":"C","Notes":oEvent.mParameters.value      };
        //   prodSet.setHeaders({
        //     "If-Match": "*",
        //     "Content-Type" : "application/json",
        //     "Prefer": "handling=strict",
        //     "sap-message-scope": "BusinessObject",
        //     "sap-contextid-accept" :"header",
        //     "Accept-Language": "en"
        // });
        if (BPConactPerson === '') {
          prodSet.create("/ZRMM_DEPARTMENTCONACT", object, {
              success: function (result) {
                // everything is OK 

                sap.m.MessageBox.success("New Contact " + result.BPConactPerson + " saved successfully and Mobile Number is removed.");
                // that.fetchVisitDetails(that.visitid);
                that.fetchCustomer(that.getView().getModel("customerModel").getProperty("/Customer"), that.vkorg);
                sourceDialog.close();

              },
              error: function (err) {
                // some error occuerd 
                sap.m.MessageBox.error("There is an issue in saving data. Please check data and try again." + JSON.parse(err.responseText).error.message.value);

              }
            }

          );
        } else {
          //   prodSet.setHeaders({
          //     "If-Match": "*",
          //     "Content-Type" : "application/json",
          //     "Prefer": "handling=strict",
          //     "sap-message-scope": "BusinessObject",
          //     "sap-contextid-accept" :"header",
          //     "Accept-Language": "en"
          // });
          prodSet.update("/ZRMM_DEPARTMENTCONACT(Customer='" + Customer + "',Vkorg='" + vkorg + "',Department='" + dept + "',Property='" + Property + "',BPConactPerson='" + BPConactPerson + "')", object, {
              success: function (result) {
                // everything is OK 

                sap.m.MessageBox.success("Data saved successfully for " + BPConactPerson);
                // that.fetchVisitDetails(that.visitid);
                that.fetchCustomer(that.getView().getModel("customerModel").getProperty("/Customer"), that.vkorg);
                sourceDialog.close();
              },
              error: function (err) {
                // some error occuerd 
                sap.m.MessageBox.error("There is an issue in saving data. Please check data and try again." + JSON.parse(err.responseText).error.message.value);

              }
            }

          );

        }

      },

      onAssignMobileAssignment: function (oEvent) {

        var object = oEvent.getSource().getBindingContext("mobileKeyDeptModel").getObject();

        var that = this;

        var that = this;

        var street = this.getView().getModel("customerModel").getData().StreetName;
        var city = this.getView().getModel("customerModel").getData().CityName;


        if (!this.oApproveDialog1) {
          this.oApproveDialog1 = new Dialog({
            type: sap.m.DialogType.Message,
            title: "Confirm",
            content: new sap.m.Text({
              text: "This option will keep all existing accounts and add " + street + " " + city + " to " + object.ContactPersonName + ".Are you to perform this option?"
            }),
            beginButton: new sap.m.Button({
              type: sap.m.ButtonType.Emphasized,
              text: "Submit",
              press: function (oEvent) {
                oEvent.getSource().getParent().close();

                if (!this.pDialogKeyPeople_mob) {
                  this.pDialogKeyPeople_mob = this.loadFragment({
                    name: "customer.porky.zfieldrepvisit.view.manageKeyPeople"
                  });
                } else {

                }
                var that = this;
                if (that.mobileValidateDialog) {
                  that.mobileValidateDialog.destroy();
                  that.mobileValidateDialog = undefined;
                }

                if (that.addNewKeyPeopleDialog)
                  that.addNewKeyPeopleDialog.close()
                var obj = object;
                obj.Customer = that.getView().getModel("customerModel").getProperty("/Customer");
                if (obj.Whatsapp && obj.Whatsapp === '02') {
                  obj.Whatsapp = false;
                }
                if (obj.Whatsapp && obj.Whatsapp === '01') {
                  obj.Whatsapp = true;
                }
                if (!obj.Whatsapp) {
                  obj.Whatsapp = false;
                }


                if (obj.Email && obj.Email === '02') {
                  obj.Email = false;
                }
                if (obj.Email && obj.Email === '01') {
                  obj.Email = true;
                }
                if (!obj.Email) {
                  obj.Email = false;
                }

                that.getView().setModel(new sap.ui.model.json.JSONModel(obj), "selectedKeyPeople");
                that.pDialogKeyPeople_mob.then(function (oDialog) {


                  oDialog.open();



                });
                that.getView().addDependent(this.pDialogKeyPeople_mob);
                this.oApproveDialog1.close()
              }.bind(this)
            }),
            endButton: new sap.m.Button({
              text: "Cancel",
              press: function () {
                this.oApproveDialog1.close();
              }.bind(this)
            })
          });
        }

        this.oApproveDialog1.open();






      },

      onRemoveMobileAssignment: function (oEvent) {

        var object = oEvent.getSource().getBindingContext("mobileKeyDeptModel").getObject();

        var that = this;


        var departmentData = object;
        this.departmentData = departmentData
        if (!this.oApproveDialog) {
          this.oApproveDialog = new Dialog({
            type: sap.m.DialogType.Message,
            title: "Confirm",
            content: new sap.m.Text({
              text: "Are you sure you want to perform this action?"
            }),
            beginButton: new sap.m.Button({
              type: sap.m.ButtonType.Emphasized,
              text: "Submit",
              press: function () {
                //  sap.m.MessageToast.show("Submit pressed!");
                this.oApproveDialog.close();
                if (that.mobileValidateDialog) {
                  that.mobileValidateDialog.destroy();
                  that.mobileValidateDialog = undefined;
                }
                if (that.addNewKeyPeopleDialog)
                  that.addNewKeyPeopleDialog.close()

                if (that.oApproveDialog1) {
                  that.oApproveDialog1.close();
                }

                try {
                  if (that.pDialogKeyPeople_mob) {
                    that.pDialogKeyPeople_mob.close();
                  }
                } catch (e) {

                }
                try {

                  if (that.pDialogKeyPeople) {
                    that.pDialogKeyPeople.close();
                  }
                } catch (e) {

                }




                this.onDeleteDepartmentKey(this.departmentData);
                this.onReAssignMobileAssignment(object);
              }.bind(this)
            }),
            endButton: new sap.m.Button({
              text: "Cancel",
              press: function () {
                this.oApproveDialog.close();
              }.bind(this)
            })
          });
        }

        this.oApproveDialog.open();



      },

      onReAssignMobileAssignment: function (object) {

        var object = object;

        var that = this;




        if (!this.pDialogKeyPeople_mob) {
          this.pDialogKeyPeople_mob = this.loadFragment({
            name: "customer.porky.zfieldrepvisit.view.manageKeyPeople"
          });
        } else {

        }
        var that = this;
        if (that.mobileValidateDialog) {
          that.mobileValidateDialog.destroy();
          that.mobileValidateDialog = undefined;
        }

        if (that.addNewKeyPeopleDialog)
          that.addNewKeyPeopleDialog.close()
        var obj = object;
        obj.Customer = that.getView().getModel("customerModel").getProperty("/Customer");

        if (obj.Whatsapp && obj.Whatsapp === '02') {
          obj.Whatsapp = false;
        }
        if (obj.Whatsapp && obj.Whatsapp === '01') {
          obj.Whatsapp = true;
        }
        if (!obj.Whatsapp) {
          obj.Whatsapp = false;
        }


        if (obj.Email && obj.Email === '02') {
          obj.Email = false;
        }
        if (obj.Email && obj.Email === '01') {
          obj.Email = true;
        }
        if (!obj.Email) {
          obj.Email = false;
        }
        that.getView().setModel(new sap.ui.model.json.JSONModel(obj), "selectedKeyPeople");
        this.pDialogKeyPeople_mob.then(function (oDialog) {


          oDialog.open();



        });
        this.getView().addDependent(this.pDialogKeyPeople_mob);

      },

      onLinkQuickViewPress: function (oEvent) {



        var that = this;
        this.QuickViewEventSource = oEvent.getSource();

        if (!that._pPopover_quickView) {
          that._pPopover_quickView = sap.ui.core.Fragment.load({
            id: that.getView().getId() + "23",
            name: "customer.porky.zfieldrepvisit.view.quickViewVisits",
            controller: that
          }).then(function (oPopover) {
            that.getView().addDependent(oPopover);
            // that.getView().setModel(new sap.ui.model.json.JSONModel(
            //   {
            //     "Orgtext": text,
            //     "text": translatedText,
            //     "lang": 'Spanish'

            //   }
            // ), "translateModel");
            return oPopover;
          });
        } else {

        }
        that._pPopover_quickView.then(function (oPopover) {
          oPopover.openBy(that.QuickViewEventSource);
          var shipTo = that.QuickViewEventSource.getModel("customerModel").getData().Customer;
          var aFilters = []



          var filter = new sap.ui.model.Filter("Customer", sap.ui.model.FilterOperator.Contains, shipTo);
          var filter_status = new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.NE, '1');

          aFilters.push(filter);





          var farrayobj = new sap.ui.model.Filter({
            filters: aFilters,
            and: false,
          });

          var farrayobj1 = new sap.ui.model.Filter({
            filters: [farrayobj, filter_status],
            and: true,
          });




          // update list binding
          var oList = oPopover.getContent()[0];
          var oBinding = oList.getBinding("items");
          oBinding.filter(farrayobj1, "Application");
        });
      },
      onUpdateFinishedList: function (oEvent) {
        var tableCount = oEvent.getParameters().total;
        this.getView().setModel(new sap.ui.model.json.JSONModel({
          "countList": "(" + tableCount + ")"
        }), "countModel");
      },
      onClickItemVisitList: function (oEvent) {

        //   var ctxobj = oEvent.mParameters.listItem.getBindingContext().getObject();
        var ctxobj = oEvent.getSource().getBindingContext("ZRMM_FRVISITV2_CDS").getObject();

        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("newvisit", {
          visitid: ctxobj.Visitid,
          shipto: ctxobj.Customer,
          vkorg: ctxobj.Vkorg
        });
      },

      onClickItemVisitList_delete: function (oEvent) {

        //   var ctxobj = oEvent.mParameters.listItem.getBindingContext().getObject();
        var ctxobj = oEvent.getSource().getBindingContext("existingDraftModel").getObject();

        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("newvisit", {
          visitid: ctxobj.Visitid,
          shipto: ctxobj.Customer,
          vkorg: ctxobj.Vkorg
        });
        oEvent.getSource().getParent().getParent().close();

      },

      onAddMOEOrder: function (oEvent) {


        if (!this.pDialogKeyPeople2) {
          this.pDialogKeyPeople2 = this.loadFragment({
            name: "customer.porky.zfieldrepvisit.view.moeDetailsNew"
          });
        } else {

        }
        var that = this;

        var obj = {
          "Kunwe": this.customer,
          "Vkorg": this.vkorg,
          "Device": "",
          "MobNumber": "",
          "SmtpAddr": "",
          "Emailconfirm": false,
          "Department": "",
          "Notes": ""
        }
        //  debugger;

        that.getView().setModel(new sap.ui.model.json.JSONModel(obj), "selectedMOEPeople");
        this.pDialogKeyPeople2.then(function (oDialog) {


          oDialog.open();



        });
        this.getView().addDependent(this.pDialogKeyPeople2);
      },

      onDeleteDraft_ask: function (oEvent) {



        var that = this;

        that.exitDialog = new Dialog({
          type: sap.m.DialogType.Message,
          title: "Confirm",
          content: new sap.m.Text({
            text: "Are you sure you want to delete these Visit(s)?"
          }),
          buttons: [new sap.m.Button({
            width: "100px",

            type: sap.m.ButtonType.Emphasized,
            text: "Yes",
            press: function () {
              that.onDeleteDraft();
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


      onDeleteDraft: function (oEvent) {


        //       debugger;
        var that = this;
        var selectContexts = this.getView().getModel("existingDraftModel").getData().items;

        selectContexts.forEach(element => {

          var visitid = element.Visitid;

          that.updateVisit(visitid, element.Customer, element.Vkorg);

        });
        that.pDialog_extdraftDialog.close();
      },



      openExistingDraft: function (obj) {

        if (!this.pDialog_extdraft) {
          this.pDialog_extdraft = this.loadFragment({
            name: "customer.porky.zfieldrepvisit.view.existingDraft"
          });
        } else {
          //  this.pDialog_extdraft.close();
          //  this.pDialog_extdraft.destroy();
          this.pDialog_extdraft = null;
          this.pDialog_extdraft = this.loadFragment({
            name: "customer.porky.zfieldrepvisit.view.existingDraft"
          });
        }
        var that = this;

        //  debugger;

        that.getView().setModel(new sap.ui.model.json.JSONModel({
          "items": obj
        }), "existingDraftModel");
        this.pDialog_extdraft.then(function (oDialog) {

          that.pDialog_extdraftDialog = oDialog;
          that.getView().addDependent(oDialog);
          oDialog.open();



        });

      },

      formatSelectedKeyDepartment: function (departments) {


        var arrayDept = [];
        if (!departments) {
          return "";
        }

        return departments.split(",");
      },

      onSelectedDepartmentEvent: function (oEvent) {


        //    debugger;
        var deptKey = oEvent.mParameters.selectedItem.getKey();

        if (deptKey === 'D') {
          this.getView().getModel("selectedKeyPeople").setProperty("/Property", "ZSERVICECO");
        } else if (deptKey === 'S') {
          this.getView().getModel("selectedKeyPeople").setProperty("/Property", "ZCONCESSIO");

        } else {
          this.getView().getModel("selectedKeyPeople").setProperty("/Property", "");

        }

        //    {= ${selectedKeyPeople>/Department} === 'D' ? 'ZSERVICECO' : ${selectedKeyPeople>/Department} === 'S' ? 'ZCONCESSIO' : ''}"  visible="{= ${selectedKeyPeople>/Department} === 'D' ? true : ${selectedKeyPeople>/Department} === 'S' ? true : false}
      },

      onAddNewMOEContact: function (oEvent) {

        var that = this;
        var data = oEvent.getSource().getParent().getModel("selectedMOEPeople").getData();
        // oEvent.getSource().getParent().close();

        if (data.Department === '' || (data.Department.length == 1 && data.Department[0] === '')) {
          sap.m.MessageBox.error("Please select department");
          return;
        }

        if (data.Device === '') {
          sap.m.MessageBox.error("Please select device type");
          return;
        }

        if (data.MobNumber === '') {
          sap.m.MessageBox.error("Please enter mobile number");
          return;
        }
        if (data.Emailconfirm === true) {
          data.Emailconfirm = 'X';

          if (data.SmtpAddr === "" || !data.SmtpAddr) {
            sap.m.MessageBox.error("Please enter email address");
            return;
          }
        } else {
          data.Emailconfirm = '';
        }
        if (data.Department !== "" && typeof data.Department !== 'string') {

          data.Department.shift();
          data.Department = data.Department.join(",");
        }
        data.Bname = data.firstName + " " + data.lastName + " " + data.MobNumber
        delete data.firstName;
        delete data.lastName;
        oEvent.getSource().getParent().close();
        that.getView().setBusy(true);

        let prodSet = this.getOwnerComponent().getModel("ZODATA_FR_SRV");
        //   prodSet.setHeaders({
        //     "If-Match": "*",
        //     "Content-Type" : "application/json",
        //     "Prefer": "handling=strict",
        //     "sap-message-scope": "BusinessObject",
        //     "sap-contextid-accept" :"header",
        //     "Accept-Language": "en"
        // });
        prodSet.create("/RequestMOESet", data, {
          success: function (result) {
            // everything is OK 
            //     debugger;
            that.getView().setBusy(false);
            //oEvent.getSource().getParent().close();
            sap.m.MessageBox.success(result.Notes);
            that.fetchCustomer(that.getView().getModel("customerModel").getProperty("/Customer"), that.vkorg);

          },
          error: function (err) {
            // some error occuerd 
            that.getView().setBusy(false);

            sap.m.MessageBox.error("There is an issue in creating new visit. Please check data and try again." + JSON.parse(err.error.message.value));

          }
        });


      },
      requestMOEForDeptContact: function (oEvent) {
        //  debugger;
        var obj = oEvent.oSource.getBindingContext("customerModel").getObject();

        if (!obj.ContactPersonMobile || obj.ContactPersonMobile.trim() === '') {


          sap.m.MessageBox.error("Please update contact with mobile number and try again.");
          return;
        }
        if (oEvent.getSource().getText() !== "MOE") {

          window.open("http://porky.zendesk.com/tickets/" + obj.RequestMoeTicket, '_blank').focus();
          return;
        }
        if (!this.pDialogKeyPeople2) {
          this.pDialogKeyPeople2 = this.loadFragment({
            name: "customer.porky.zfieldrepvisit.view.moeDetailsNew"
          });
        } else {

        }
        var that = this;

        var obj = {
          "firstName": obj.ContactFirstName,
          "lastName": obj.ContactLastName,
          "Kunwe": this.customer,
          "Vkorg": this.vkorg,
          "Device": "",
          "MobNumber": obj.ContactPersonMobile,
          "SmtpAddr": obj.ContactPersonEmail,
          "Emailconfirm": false,
          "Department": obj.Department,
          "Notes": "MOE Request for " + obj.ContactPersonName
        }
        //  debugger;

        that.getView().setModel(new sap.ui.model.json.JSONModel(obj), "selectedMOEPeople");
        this.pDialogKeyPeople2.then(function (oDialog) {


          oDialog.open();



        });
        this.getView().addDependent(this.pDialogKeyPeople2);
      },

      checkWithMOE: function (email, mobile, RequestMoeStatus) {
        return true;
        if (email === "" && mobile === '') {

          return false;
        }

        var moeData = this.getView().getModel("moeModel").getData().results;

        var email = moeData.mobile;

        let obj = this.getView().getModel("moeModel").getData().results.find(o => (o.mobile !== null && o.mobile && (o.mobile === mobile || (o.mobile !== null && o.mobile === mobile.replace(/\D+/g, "")))));
        if (obj) {
          return false;
        }

        // if(RequestMoeStatus === '' || !RequestMoeStatus ){
        //   return false;
        // }

      },

      shareNotes: async function (oEvent) {
        // debugger
        // var notesObject = oEvent.getSource().getBindingContext("notesModel").getObject();

        // const shareData = {
        //   title: "Visit#"+notesObject.Visitid,
        //   text: oEvent.getSource().getParent().getParent().getContent()[0].getValue() +" - By \n"+notesObject.Ernam,
        //   url: ""
        // };
        // try {
        //   await navigator.share(shareData);
        // //  resultPara.textContent = "MDN shared successfully";
        // } catch (err) {
        // //  resultPara.textContent = `Error: ${err}`;
        // }


        // create dialog lazily
        if (!this.pDialogShareNotes) {
          this.pDialogShareNotes = this.loadFragment({
            name: "customer.porky.zfieldrepvisit.view.shareNotes"
          });
        } else {

          if (this.pDialogUser1_n) {
            this.pDialogUser1_n.destroy();
            this.pDialogShareNotes = undefined;
            this.pDialogUser1_n = undefined;
            this.pDialogShareNotes = this.loadFragment({
              name: "customer.porky.zfieldrepvisit.view.shareNotes"
            });
          }
        }
        var that = this;
        this.pDialogShareNotes.then(function (oDialog) {

          that.pDialogUser1_n = oDialog;
          that.getView().addDependent(that.pDialogUser1_n);


          oDialog.open();
          // var oFilter = [];
          // oFilter.push(new sap.ui.model.Filter("vkorg", sap.ui.model.FilterOperator.EQ, that.vkorg));

          // oDialog.getBinding("items").filter(oFilter);
          //  that.getView().byId("mapSlider").setValue(3);

          //   var oMap = that.getView().byId("vbi");
          // that.getLocation();

        });
        var that = this;

        // setTimeout(() => {
        //   var oFilter = [];
        //   oFilter.push(new sap.ui.model.Filter("vkorg", sap.ui.model.FilterOperator.EQ, that.vkorg));

        //   that.pDialogUser.getBinding("items").filter(oFilter);
        // }, 1000);
        this.getView().addDependent(this.pDialogShareNotes);


      },

      onPressMOEActiveSwitch: function (oEvent) {
        var that = this;
        this.getView().setBusy(true);
        var data = this.getView().getModel("selectedMOEPeople").getData();
        var flagValue = '';
        if (oEvent.mParameters.state) {
          flagValue = 'X';

        }
        var objectData = {

        }
        let prodSet = this.getOwnerComponent().getModel("ZODATA_FR_SRV");

        var obj = {
          "Kunwe": this.customer,
          "Vkorg": this.vkorg,
          "AccountInactive": flagValue,
          "SmtpAddr": data.smtp_addr
        }
        //   prodSet.setHeaders({
        //     "If-Match": "*",
        //     "Content-Type" : "application/json",
        //     "Prefer": "handling=strict",
        //     "sap-message-scope": "BusinessObject",
        //     "sap-contextid-accept" :"header",
        //     "Accept-Language": "en"
        // });
        prodSet.update("/RequestMOESet(Kunwe='" + this.customer + "',Vkorg='" + this.vkorg + "',SmtpAddr='" + data.smtp_addr + "')", obj, {
          success: function (result) {

            // everything is OK 
            //debugger;
            that.getView().setBusy(false);
            //oEvent.getSource().getParent().close();
            sap.m.MessageBox.success("MOE changes saved successfully");
            that.fetchCustomer(that.getView().getModel("customerModel").getProperty("/Customer"), that.vkorg);

          },
          error: function (err) {
            // some error occuerd 
            that.getView().setBusy(false);

            sap.m.MessageBox.error("There is an issue in processing this request. Please check data and try again.");

          }
        });

      },

      onFilterActiveMOE: function (oEvent) {

        var flagValue = "";
        if (oEvent.mParameters.state) {
          flagValue = 'X';

        }
        var tblBinding = this.getView().byId("moetable").getBinding("items");

        if (flagValue === 'X') {
          var oFilter = new sap.ui.model.Filter("account_inactive", sap.ui.model.FilterOperator.NE, 'X');
          tblBinding.filter(oFilter, sap.ui.model.FilterType.Application);;
        } else {
          tblBinding.filter(null, sap.ui.model.FilterType.Application);;
        }

      },
      handleConfirmNotes: async function (oEvent) {
        //     debugger;

        var selectedItems = oEvent.getSource().getParent().getContent()[0].getSelectedItems()
        if (selectedItems.length === 0) {

          sap.m.MessageBox.error("Please select atleast one visit note to share");
          return;
        }
        //  oEvent.mParameters.selectedItems[0].getBindingContext("notesModel").getObject()
        var totalTextBody = "",
          totalTextTitle = "";
        var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
          pattern: "EEE, MMM d, yyyy"
        });
        var customerAddress = this.getView().getModel("customerModel").getProperty("/StreetName")

        //string in the same format as "Thu, Jan 29, 2017"
        selectedItems.forEach(element => {
          var object = element.getBindingContext("notesModel").getObject();
          totalTextTitle += "Customer Visit - " + customerAddress + " ";
          totalTextBody += "VisitID#" + Number(object.Visitid) + " \n " + object.Notes + "\n By - " + object.Createdby + "\n On - " + oDateFormat.format(object.Createdatetime) + "\n\n";
        });

        // var notesObject = oEvent.getSource().getBindingContext("notesModel").getObject();

        const shareData = {
          title: "Visits - " + totalTextTitle,
          text: totalTextBody
          //,
          // url: ""
        };
        try {
          await navigator.share(shareData);
          //  resultPara.textContent = "MDN shared successfully";
        } catch (err) {
          //  resultPara.textContent = `Error: ${err}`;
        }

      },


      onCommentDelete: function (oEvent) {
        //    debugger;
        var obj = oEvent.getSource().getBindingContext("commentsModel").getObject();
        this.checkDeleteComment(obj);
        // var visitid = oEvent.getSource().getBindingContext("commentsModel").getObject().Visitid;
        // var lineid = oEvent.getSource().getBindingContext("commentsModel").getObject().Lineid;
        // let defaultModel1 = this.getOwnerComponent().getModel("ZRMM_FRVISITV2_CDS");
        // obj.Loevm = true;
        // delete obj.editable;
        // delete obj.originalText;
        // var that = this;
        // this.getView().setBusy(true);

        // defaultModel1.update("/ZRMM_FRVISITV2NOTES(Visitid='"+visitid+"',Lineid="+lineid+")",obj, {
        //   success: function (oData, oResponse) {
        //     that.getView().setBusy(false);
        //     sap.m.MessageBox.success("Comment successfully deleted");
        //     // var plant = oData.results.find(element => element.parid === "WRK");
        //    // that.fetchVisitDetails(that.visitid);
        //     that.extractComments(visitid)

        //   },

        //   error: function (oError) {
        //     sap.m.MessageBox.error("There in issue with this action.");
        //   }
        // });
      },

      onDeleteComment_last: function (obj) {
        let defaultModel1 = this.getOwnerComponent().getModel("ZRMM_FRVISITV2_CDS");
        var visitid = obj.Visitid;
        var lineid = obj.Lineid;
        obj.Loevm = true;
        delete obj.editable;
        delete obj.originalText;
        var that = this;
        this.getView().setBusy(true);

        //   defaultModel1.setHeaders({
        //     "If-Match": "*",
        //     "Content-Type" : "application/json",
        //     "Prefer": "handling=strict",
        //     "sap-message-scope": "BusinessObject",
        //     "sap-contextid-accept" :"header",
        //     "Accept-Language": "en"
        // });
        defaultModel1.update("/ZRMM_FRVISITV2NOTES(Visitid='" + visitid + "',Lineid=" + lineid + ")", obj, {
          success: function (oData, oResponse) {
            that.getView().setBusy(false);
            sap.m.MessageBox.success("Comment successfully deleted");
            // var plant = oData.results.find(element => element.parid === "WRK");
            // that.fetchVisitDetails(that.visitid);
            that.extractComments(visitid)

          },

          error: function (oError) {
            sap.m.MessageBox.error("There in issue with this action.");
          }
        });
      },








      onTranslateShareNotesEng: async function (oEvent) {

        //    debugger;
        //  var notesData = this.getView().getModel("notesModel").getData();
        var selectedItems = oEvent.getSource().getParent().getContent()[0].getSelectedItems();
        if (selectedItems.length === 0) {

          sap.m.MessageBox.error("Please select atleast one visit note to share");
          return;
        }
        //  oEvent.mParameters.selectedItems[0].getBindingContext("notesModel").getObject()
        var totalTextBody = "",
          totalTextTitle = "";
        var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
          pattern: "EEE, MMM d, yyyy"
        });

        //string in the same format as "Thu, Jan 29, 2017"
        selectedItems.forEach(element => {
          var object = element.getBindingContext("notesModel").getObject();
          totalTextTitle += "Customer Visit ";
          totalTextBody += "VisitID#" + Number(object.Visitid) + " \n " + object.Notes + "\n Visit By - " + object.Createdby + "\n Created On - " + oDateFormat.format(object.Createdatetime) + "\n\n";
        });

        // var notesObject = oEvent.getSource().getBindingContext("notesModel").getObject();




        ;
        //   this.translateLanguage(text,"es",oEvent.getSource().getParent().getParent().getContent()[0]);
        //  this.source = oEvent.getSource().getParent().getParent().getContent()[0];
        // var that = this._view;
        var that = this;
        var customerAddress = this.getView().getModel("customerModel").getProperty("/StreetName")

        var data = {
          "q": totalTextBody,
          "target": 'en',
          "source": 'es',
          "key": "AIzaSyARq_VIDUxAl-xrs9bV_921ZzSggNjHAzE"
        };
        $.ajax({
          url: "https://translation.googleapis.com/language/translate/v2",
          headers: {
            Accept: "text/plain; charset=utf-8",
            "Content-Type": "text/plain; charset=utf-8"
          },
          data: data,
          success: async function (response) {
            var translatedText = response.data.translations[0].translatedText;
            translatedText = translatedText.split("Visit By -").join("\nVisit By -");
            translatedText = translatedText.split("Created On -").join("\nCreated On -")
            translatedText = translatedText.split("VisitID#").join("\n\nVisitID#")
            const shareData = {
              title: "Customer Visit - " + customerAddress,
              text: translatedText
              //,
              // url: ""
            };

            try {
              await navigator.share(shareData);
              //  resultPara.textContent = "MDN shared successfully";
            } catch (err) {
              //  resultPara.textContent = `Error: ${err}`;
            }


          }
        });


      },


      onTranslateShareNotesSpn: async function (oEvent) {
        //    debugger;
        //  var notesData = this.getView().getModel("notesModel").getData();
        var selectedItems = oEvent.getSource().getParent().getContent()[0].getSelectedItems();

        if (selectedItems.length === 0) {

          sap.m.MessageBox.error("Please select atleast one visit note to share");
          return;
        }

        //  oEvent.mParameters.selectedItems[0].getBindingContext("notesModel").getObject()
        var totalTextBody = "",
          totalTextTitle = "";
        var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
          pattern: "EEE, MMM d, yyyy"
        });

        //string in the same format as "Thu, Jan 29, 2017"
        selectedItems.forEach(element => {
          var object = element.getBindingContext("notesModel").getObject();
          totalTextTitle += "Customer Visit ";
          totalTextBody += "VisitID#" + Number(object.Visitid) + " \n " + object.Notes + "\n By - " + object.Createdby + "\n Created On - " + oDateFormat.format(object.Createdatetime) + "\n\n";
        });

        // var notesObject = oEvent.getSource().getBindingContext("notesModel").getObject();




        ;
        //   this.translateLanguage(text,"es",oEvent.getSource().getParent().getParent().getContent()[0]);
        //  this.source = oEvent.getSource().getParent().getParent().getContent()[0];
        // var that = this._view;
        var that = this;
        var customerAddress = that.getView().getModel("customerModel").getProperty("/StreetName")

        var data = {
          "q": totalTextBody,
          "target": 'es',
          "source": 'en',

          "key": "AIzaSyARq_VIDUxAl-xrs9bV_921ZzSggNjHAzE"
        };
        $.ajax({
          url: "https://translation.googleapis.com/language/translate/v2",
          headers: {
            Accept: "text/plain; charset=utf-8",
            "Content-Type": "text/plain; charset=utf-8",
            "Access-Control-Allow-Origin": "*"
          },
          data: data,
          success: async function (response) {
            var translatedText = response.data.translations[0].translatedText;
            translatedText = translatedText.split("Por -").join("\nPor -");
            translatedText = translatedText.split("Creado el -").join("\nCreado el -")
            translatedText = translatedText.split("VisitID#").join("\n\nVisitID#")

            const shareData = {
              title: "Customer Visit - " + customerAddress,
              text: translatedText
              //,
              // url: ""
            };

            try {
              await navigator.share(shareData);
              //  resultPara.textContent = "MDN shared successfully";
            } catch (err) {
              //  resultPara.textContent = `Error: ${err}`;
            }


          }
        });
      },


      onCancelShareNotes: function (oEvent) {
        oEvent.getSource().getParent().close();


      },

      extractDefaultValues: async function (oEvent) {

        var that = this;

        return new Promise(function (resolve, reject) {

          console.log('Call made') //First text in console

          let defaultModel = that.getOwnerComponent().getModel("ZODATA_FR_SRV");


          var salesOrgList = that.getOwnerComponent().getModel("salesOrgCentralModel").getData();
          var salesOrgFilters = [];

          salesOrgList.forEach(element => {
            salesOrgFilters.push(new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, element));

          });
          var user = 'RSONI';
          if (sap.ushell.Container.getService("UserInfo").getId() === 'DEFAULT_USER') {

            user = 'RSONI';
          } else {
            user = sap.ushell.Container.getService("UserInfo").getId();
          }
          salesOrgFilters.push(new sap.ui.model.Filter("UserID", sap.ui.model.FilterOperator.EQ, user));





          defaultModel.read("/ZRMM_USER_SMPARTNER_VH", {
            filters: [salesOrgFilters],
            success: function (oData, oResponse) {

              // var plant = oData.results.find(element => element.parid === "WRK");
              var arrayUsers = oData.results;

              if (oData.results.length == 1) {
                that.getView().getModel("newProspect").setProperty("/Kunn2", arrayUsers[0].Saleslead)
                that.getView().getModel("newProspect").setProperty("/Kunn2_name", arrayUsers[0].SalesleadName)
                that.getView().getModel("newProspect").setProperty("/Vkorg", arrayUsers[0].SalesOrganization)

              }


              resolve();

            },

            error: function (oError) {

              sap.m.MessageBox.error("There in issue with this action.");
              resolve();
            }
          });
        });



      },

      onOpenProspect: async function (oEvent) {


        ////Extract default sales lead

        var that = this;
        that.getView().setModel(new sap.ui.model.json.JSONModel({
          "Land1": "US"
        }), "newProspect");
        await this.extractDefaultValues();
        var that = this;


        if (this.getView().getModel("googlePlacesModel"))
          this.getView().getModel("googlePlacesModel").setData("");

        if (this.getView().byId("prospectF4Dialog")) {
          this.getView().byId("prospectF4Dialog").removeAllItems();
          this.getView().byId("searchBoxGoogle").setValue("");

        }
        if (this.getView().getModel("prospectModelPlaces"))
          this.getView().getModel("prospectModelPlaces").setData({
            "places": []
          });
        if (!this.pDialogOpenProspect) {
          this.pDialogOpenProspect = this.loadFragment({
            name: "customer.porky.zfieldrepvisit.view.prospectF4"
          });
        } else {
          if (this.getView().getModel("prospectModelPlaces"))

            this.getView().getModel("prospectModelPlaces").setData({
              "places": []
            });

          that.pDialogOpenProspect_d.destroy();
          that.pDialogOpenProspect_d = undefined;

          this.pDialogOpenProspect = this.loadFragment({
            name: "customer.porky.zfieldrepvisit.view.prospectF4"
          });
        }


        this.pDialogOpenProspect.then(function (oDialog) {


          oDialog.open();
          oDialog.getContent()[0].setSelectedKey("Search");


          let prodSet = that.getOwnerComponent().getModel("ZODATA_FR_SRV");
          // that.getView().byId("idSO").setModel(prodSet);

          that.pDialogOpenProspect_d = oDialog;

          var fobj = new sap.ui.model.Filter("Country", sap.ui.model.FilterOperator.EQ, 'US');
          that.getView().byId("regionDropDown").getBinding("items").filter([fobj])



        });
        this.getView().addDependent(this.pDialogOpenProspect);
      },

      getLocation: function () {
        var that = this;
        var getPosition = {
          enableHighAccuracy: true,
          timeout: 9000,
          maximumAge: 0
        };

        function success(gotPosition) {
          that.uLat = gotPosition.coords.latitude;
          that.uLon = gotPosition.coords.longitude;
          that.resetuLat = gotPosition.coords.latitude;
          that.resetuLong = gotPosition.coords.longitude;
          // that.uLon="-73.9352";
          // that.uLat="40.730610";



        };

        function error(err) {
          //   console.warn(`ERROR(${err.code}): ${err.message}`);
          //   that.getView().setBusy(false);
          //  if(!that.uLat)
          //  sap.m.MessageToast.show("Trying to fetch current location");
        };

        navigator.geolocation.getCurrentPosition(success, error, getPosition);

      },

      handleSearchCustomer_prspct: function (oEvent) {

        if (!this.uLat) {

          sap.m.MessageToast.show("Fetching location...");
          this.getLocation();
          return;
        }
        var sQuery = oEvent.getParameter("query");
        // var that = this._view;
        var that = this;

        var data = {
          "includedType": this.getView().getModel("googlePlacesModel").getProperty("/selectedType"),
          "textQuery": sQuery,
          "maxResultCount": 100,
          "locationBias": {
            "circle": {
              "center": {
                "latitude": this.uLat,
                "longitude": this.uLon
              },
              "radius": 50000.0
            }
          }
        };
        data = JSON.stringify(data);
        $.ajax({
          type: 'POST',
          url: "https://places.googleapis.com/v1/places:searchText",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Goog-Api-Key": 'AIzaSyARq_VIDUxAl-xrs9bV_921ZzSggNjHAzE',
            "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.id,places.location,places.photos,places.types,places.nationalPhoneNumber,places.websiteUri"
          },
          data: data,
          success: function (response) {
            //   debugger;

            that.getView().setModel(new sap.ui.model.json.JSONModel(
              response), "prospectModelPlaces");

          }
        });
      },


      splitDisplayName: function (displayName, maxLength = 35) {
        const text = displayName.text || displayName; // Handle both object and string

        if (text.length <= maxLength) {
          return {
            Name1: text,
            Name2: ""
          };
        }

        // Find the last space within the maxLength limit
        let splitIndex = maxLength;
        let lastSpaceIndex = text.lastIndexOf(' ', maxLength);

        // If we found a space within the limit, use that as split point
        if (lastSpaceIndex > 0) {
          splitIndex = lastSpaceIndex;
        } else {
          // If no space found within limit, find the first space after maxLength
          let firstSpaceAfter = text.indexOf(' ', maxLength);
          if (firstSpaceAfter !== -1) {
            splitIndex = firstSpaceAfter;
          } else {
            // No spaces at all, use original logic as fallback
            splitIndex = maxLength;
          }
        }

        const name1 = text.substring(0, splitIndex).trim();
        const name2 = text.substring(splitIndex).trim();

        // Handle case where Name2 might still be too long
        let finalName2 = name2;
        if (name2.length > maxLength) {
          const secondSplit = name2.lastIndexOf(' ', maxLength);
          if (secondSplit > 0) {
            finalName2 = name2.substring(0, secondSplit).trim();
          } else {
            finalName2 = name2.substring(0, maxLength).trim();
          }
        }

        return {
          Name1: name1,
          Name2: finalName2
        };
      },

      onClickProspectGoogleSearch: function (oEvent) {

        //     debugger;
        var obj = oEvent.getSource().getBindingContext("prospectModelPlaces").getObject();

        var obj1 = {};
        // obj1.Name1 =  obj.displayName.text.substring(0,35) ;
        // if(obj.displayName.text.length > 35)
        // obj1.Name2 =  obj.displayName.text.substring(35,obj.displayName.text.length) ;

        const splitResult = this.splitDisplayName(obj.displayName, 35);
        obj1.Name1 = splitResult.Name1;
        obj1.Name2 = splitResult.Name2;
        obj1.Street = obj.formattedAddress.split(",")[0];
        obj1.Ort01 = obj.formattedAddress.split(",")[1];
        obj1.Regio = obj.formattedAddress.split(",")[2].trim().split(" ")[0];
        obj1.TelNumber = obj.nationalPhoneNumber;
        obj1.Zip = obj.formattedAddress.split(",")[2].substring(3, 9).trim();


        if (obj1.Name1)
          this.getView().getModel("newProspect").setProperty("/Name1", obj1.Name1.trim());

        if (obj1.Name2)
          this.getView().getModel("newProspect").setProperty("/Name2", obj1.Name2.trim());

        if (obj1.Street)
          this.getView().getModel("newProspect").setProperty("/Street", obj1.Street.trim());

        if (obj1.Ort01)
          this.getView().getModel("newProspect").setProperty("/Ort01", obj1.Ort01.trim());

        if (obj1.Regio)
          this.getView().getModel("newProspect").setProperty("/Regio", obj1.Regio.trim());

        if (obj1.TelNumber)
          this.getView().getModel("newProspect").setProperty("/TelNumber", obj1.TelNumber.trim());

        if (obj1.Zip)
          this.getView().getModel("newProspect").setProperty("/Pstlz", obj1.Zip.trim());

        this.getView().getModel("newProspect").setProperty("/Land1", 'US');

        oEvent.getSource().getParent().getParent().getParent().getParent().setSelectedKey("Heavy")



      },

      onCreateProspect: function (oEvent) {

        var data1 = this.getView().getModel("newProspect").getData();
        //   data1.Vkorg = this.vkorg ;

        if (typeof data1.Kunn2 === 'undefined' || data1.Kunn2.trim() === '') {

          sap.m.MessageBox.error("Please enter Sales Lead");
          return;

        }

        if (data1.Zzpriceexists && data1.Zzpriceexists === true) {
          data1.Zzpriceexists = 'X'
        } else {
          data1.Zzpriceexists = ''
        }

        if (data1.Zzprojectedsales && Array.isArray(data1.Zzprojectedsales)) {
          data1.Zzprojectedsales = data1.Zzprojectedsales[0] + "";
        }
        this.dialogProspect = oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getParent().getParent().getParent();

        var data = {
          Prospect: data1,
          Testrun: 'N'
        };
        var that = this;
        let prodSet = this.getOwnerComponent().getModel("ZODATA_FR_SRV");

        this.dialogProspect.setBusy(true);

        if (data.Prospect.Kunn2_name) {
          delete data.Prospect.Kunn2_name;
        }
        if (data.Prospect.Kunn2) {
          data.Prospect.Parvw = "SM";
        }


        prodSet.create("/ProspectCreateSet", data, {
            success: function (result) {
              // everything is OK 

              //   sap.m.MessageBox.success("New Customer Prospect " + result.Prospect.Kunnr + " was created successfully");
              sap.m.MessageBox.success("New Customer Prospect " + result.Prospect.Kunnr + " was created successfully", {
                actions: [sap.m.MessageBox.Action.OK, "Create Visit"],
                emphasizedAction: sap.m.MessageBox.Action.OK,
                onClose: function (sAction) {
                  if (sAction === 'Create Visit') {

                    that.fetchCustomer(result.Prospect.Kunnr, that.vkorg);
                    that.pDialogOpenProspect_d.close();

                  } else {
                    that.getView().byId("prospectIconTab").setSelectedKey("Ok")
                  }
                },
                dependentOn: that.getView()
              });
              that.getView().getModel("newProspect").setData({});
              that.getView().setModel(new sap.ui.model.json.JSONModel({
                "Land1": "US"
              }), "newProspect");
              that.dialogProspect.setBusy(false);



            },
            error: function (err) {
              // some error occuerd 
              that.dialogProspect.setBusy(false);

              if (JSON.parse(err.responseText).error.message.value) {

                var jsmsg = JSON.parse(err.responseText).error.message.value;
                var splitArray = jsmsg.split("<>");


                if (splitArray.length < 2) {

                  sap.m.MessageBox.error(jsmsg);
                  return;
                }
                if (jsmsg.split("existing") && splitArray[1].split(" ")[0]) {

                  if (jsmsg.split("Prospect ")[1]) {
                    var prospectNumber = jsmsg.split("Prospect ")[1].split(" ")[0];
                  } else {
                    var prospectNumber = jsmsg.split("Customer ")[1].split(" ")[0];

                  }


                  if (that.getView().getModel("newProspect").getData().Bukrs !== splitArray[1].split("Company Code")[1].trim()) {
                    if (jsmsg.split("<>").length > 1) {
                      var msg1 = splitArray[0];
                      var msg2 = splitArray[1];
                      var msg3 = splitArray[2];
                      var msg4 = splitArray[3];
                      var msg5 = splitArray[4];

                    }
                    sap.m.MessageBox.error(msg1 + "\n" + msg2 + "\n" + msg3 + "\n" + msg4 + "\n" + msg5, {
                      actions: ["Bypass", MessageBox.Action.OK],
                      emphasizedAction: [MessageBox.Action.OK],
                      onClose: function (sAction) {
                        if (sAction === "Bypass") {

                          that.onCreateProspect_Override(that.dialogProspect);
                        }
                      },
                      dependentOn: that.getView()
                    });
                    return;

                  } else if (that.getView().getModel("newProspect").getData().Bukrs === splitArray[1].split("Company Code")[1].trim()) {

                    if (jsmsg.split("<>").length > 1) {
                      var msg1 = splitArray[0];
                      var msg2 = splitArray[1];
                      var msg3 = splitArray[2];
                      var msg4 = splitArray[3];
                      var msg5 = splitArray[4];

                    }
                    sap.m.MessageBox.error(msg1 + "\n" + msg2 + "\n" + msg3 + "\n" + msg4 + "\n" + msg5, {
                      actions: ["Request Control", MessageBox.Action.OK],
                      emphasizedAction: [MessageBox.Action.OK],
                      onClose: function (sAction) {
                        if (sAction === "Request Control") {

                          that.onCreateProspect_RequestControl(that.dialogProspect, prospectNumber, that.getView().getModel("newProspect").getData().Vkorg);
                        }

                      },
                      dependentOn: that.getView()
                    });
                    return;
                  }


                }

                if (jsmsg.split("<>").length > 1) {
                  var msg1 = splitArray[0];
                  var msg2 = splitArray[1];
                  var msg3 = splitArray[2];
                  var msg4 = splitArray[3];
                  var msg5 = splitArray[4];

                }
                sap.m.MessageBox.error(msg1 + "\n" + msg2 + "\n" + msg3 + "\n" + msg4 + "\n" + msg5);

              } else {
                sap.m.MessageBox.error("There is an issue in creating new customer prospect. Please check data and try again.", {
                  actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                  emphasizedAction: MessageBox.Action.OK,
                  onClose: function (sAction) {
                    //	MessageToast.show("Action selected: " + sAction);
                  },
                  dependentOn: this.getView()
                });
              }

            }
          }

        );





      },

      onCreateProspect_RequestControl: function (dialog, Kunnr, vkorg) {

        //RequestControlSet

        let prodSet = this.getOwnerComponent().getModel("ZODATA_FR_SRV");

        prodSet.read("/RequestControlSet(Kunnr='" + Kunnr + "',Vkorg='" + vkorg + "')", {
            success: function (result) {
              // everything is OK 

              sap.m.MessageBox.success("Request has been sent");


            },
            error: function (err) {
              // some error occuerd 
              // that.getView().setBusy(false);
              sap.m.MessageBox.error("There is an error sending the request.");


            }
          }

        );
      },







      onCreateProspect_Override: function (dialog) {

        var data1 = this.getView().getModel("newProspect").getData();

        //   data1.Vkorg = this.vkorg ;

        if (typeof data1.Kunn2 === 'undefined' || data1.Kunn2.trim() === '') {

          sap.m.MessageBox.error("Please enter Sales Lead");
          return;

        }

        if (data1.Zzpriceexists && data1.Zzpriceexists === true) {
          data1.Zzpriceexists = 'X'
        } else {
          data1.Zzpriceexists = ''
        }

        if (data1.Zzprojectedsales && Array.isArray(data1.Zzprojectedsales)) {
          data1.Zzprojectedsales = data1.Zzprojectedsales[0] + "";
        }
        this.dialogProspect = dialog;

        var data = {
          Prospect: data1,
          Testrun: 'N',
          Bypasschecks: "X"
        };
        var that = this;
        let prodSet = this.getOwnerComponent().getModel("ZODATA_FR_SRV");

        this.dialogProspect.setBusy(true);

        if (data.Prospect.Kunn2_name) {
          delete data.Prospect.Kunn2_name;
        }
        if (data.Prospect.Kunn2) {
          data.Prospect.Parvw = "SM";
        }


        prodSet.create("/ProspectCreateSet", data, {
            success: function (result) {
              // everything is OK 

              //   sap.m.MessageBox.success("New Customer Prospect " + result.Prospect.Kunnr + " was created successfully");
              sap.m.MessageBox.success("New Customer Prospect " + result.Prospect.Kunnr + " was created successfully", {
                actions: [sap.m.MessageBox.Action.OK, "Create Visit"],
                emphasizedAction: sap.m.MessageBox.Action.OK,
                onClose: function (sAction) {
                  if (sAction === 'Create Visit') {

                    that.fetchCustomer(result.Prospect.Kunnr, that.vkorg);
                    that.pDialogOpenProspect_d.close();

                  } else {
                    that.getView().byId("prospectIconTab").setSelectedKey("Ok")
                  }
                },
                dependentOn: that.getView()
              });
              that.getView().getModel("newProspect").setData({});
              that.getView().setModel(new sap.ui.model.json.JSONModel({
                "Land1": "US"
              }), "newProspect");
              that.dialogProspect.setBusy(false);



            },
            error: function (err) {
              // some error occuerd 
              that.dialogProspect.setBusy(false);

              if (JSON.parse(err.responseText).error.message.value) {

                var jsmsg = JSON.parse(err.responseText).error.message.value;
                var splitArray = jsmsg.split("<>");

                if (splitArray.length < 2) {

                  sap.m.MessageBox.error(jsmsg);
                  return;
                }



                if (jsmsg.split("<>").length > 1) {
                  var msg1 = splitArray[0];
                  var msg2 = splitArray[1];
                  var msg3 = splitArray[2];
                  var msg4 = splitArray[3];
                  var msg5 = splitArray[4];

                }
                sap.m.MessageBox.error(msg1 + "\n" + msg2 + "\n" + msg3 + "\n" + msg4 + "\n" + msg5);

              } else {
                sap.m.MessageBox.error("There is an issue in creating new customer prospect. Please check data and try again.", {
                  actions: [MessageBox.Action.OK],
                  emphasizedAction: MessageBox.Action.OK,
                  onClose: function (sAction) {
                    //	MessageToast.show("Action selected: " + sAction);
                  },
                  dependentOn: this.getView()
                });
              }

            }
          }

        );





      },




      onOpenSMF4Help: function (oEvent) {

        var that = this;


        if (!this.pDialogOpenSMF4) {
          this.pDialogOpenSMF4 = this.loadFragment({
            name: "customer.porky.zfieldrepvisit.view.SMf4"
          });
        } else {

        }


        this.pDialogOpenSMF4.then(function (oDialog) {


          oDialog.open();



          that.pDialogOpenSMF4_d = oDialog;

          var salesOrgList = that.getOwnerComponent().getModel("salesOrgCentralModel").getData();
          var salesOrgFilters = [];

          salesOrgList.forEach(element => {
            salesOrgFilters.push(new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, element));

          });
          var user = 'RSONI';
          if (sap.ushell.Container.getService("UserInfo").getId() === 'DEFAULT_USER') {

            user = 'RSONI';
          } else {
            user = sap.ushell.Container.getService("UserInfo").getId();
          }
          salesOrgFilters.push(new sap.ui.model.Filter("UserID", sap.ui.model.FilterOperator.EQ, user));



          // var fobj = new sap.ui.model.Filter("Country", sap.ui.model.FilterOperator.EQ, 'US');
          that.pDialogOpenSMF4_d.getBinding("items").filter(salesOrgFilters)



        });
        this.getView().addDependent(this.pDialogOpenSMF4);
      },
      handleConfirmSMPartner: function (oEvent) {

        var vObj = oEvent.mParameters.selectedItem.getBindingContext("ZODATA_FR_SRV").getObject();
        var sm = vObj.Saleslead;
        this.getView().getModel("newProspect").setProperty("/Kunn2", sm);
        this.getView().getModel("newProspect").setProperty("/Kunn2_name", vObj.SalesleadName);
        this.getView().getModel("newProspect").setProperty("/Parvw", 'SM');
        this.getView().getModel("newProspect").setProperty("/Vkorg", vObj.SalesOrganization);
        this.getView().getModel("newProspect").setProperty("/Bukrs", vObj.CompanyCode);

        //  this.getView().byId("idInputSM").setValue(sm);
        //   debugger;
      },
      handleSMPartnerSearch: function (oEvent) {
        // debugger;
        var query = oEvent.mParameters.value;
        var oFilter1 = new sap.ui.model.Filter("SalesleadName", sap.ui.model.FilterOperator.Contains, query);
        var oFilter2 = new sap.ui.model.Filter("Saleslead", sap.ui.model.FilterOperator.Contains, query);

        var salesOrgFilters = [];
        var salesOrgList = this.getOwnerComponent().getModel("salesOrgCentralModel").getData();


        salesOrgList.forEach(element => {
          salesOrgFilters.push(new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, element));

        });
        var user = 'RSONI';
        if (sap.ushell.Container.getService("UserInfo").getId() === 'DEFAULT_USER') {

          user = 'RSONI';
        } else {
          user = sap.ushell.Container.getService("UserInfo").getId();
        }

        var salesOrgFilters_1 = new sap.ui.model.Filter({
          filters: salesOrgFilters,
          and: false,
        });
        //  salesOrgFilters.push(new sap.ui.model.Filter("UserID", sap.ui.model.FilterOperator.EQ, user));
        // salesOrgFilters.push(oFilter1);
        // salesOrgFilters.push(oFilter2);


        // var fobj = new sap.ui.model.Filter("Country", sap.ui.model.FilterOperator.EQ, 'US');

        var farrayobj1 = new sap.ui.model.Filter({
          filters: [salesOrgFilters_1, new sap.ui.model.Filter("UserID", sap.ui.model.FilterOperator.EQ, user)],
          and: true,
        });

        var farrayobj2 = new sap.ui.model.Filter({
          filters: [oFilter1, oFilter2],
          and: false,
        });

        oEvent.getSource().getBinding("items").filter([farrayobj1, farrayobj2]);;
      },

      onCreateVisit_Followup: function (oEvent) {

        var isProspect = this.getView().getModel("prospectModel").getProperty("/prospect");


        if (isProspect) {
          var oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("newvisit", {
            shipto: this.getView().getModel("visitModel").getProperty("/Customer"),
            vkorg: this.getView().getModel("visitModel").getProperty("/Vkorg"),
            prospect: true
          });

          // this.fetchCustomer(this.getView().getModel("visitModel").getProperty("/Customer"), this.getView().getModel("visitModel").getProperty("/Vkorg"));
        } else {
          var oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("newvisit", {
            shipto: this.getView().getModel("visitModel").getProperty("/Customer"),
            vkorg: this.getView().getModel("visitModel").getProperty("/Vkorg")
          });
          // this.fetchCustomer(this.getView().getModel("visitModel").getProperty("/Customer"), this.getView().getModel("visitModel").getProperty("/Vkorg"));

        }

        this.checkIfDraftExist(this.getView().getModel("visitModel").getProperty("/Customer"));


      },
      onMOECatalog: function (oEvent) {
        //   debugger;

        var shipto = oEvent.getSource().getBindingContext("moeModel").getObject().kunwe;
        var vkorg = oEvent.getSource().getBindingContext("moeModel").getObject().p_vkorg;
        var catalog = oEvent.getSource().getBindingContext("moeModel").getObject().catalog_name;
        var item_proposal = oEvent.getSource().getBindingContext("moeModel").getObject().item_proposal;
        var ats = oEvent.getSource().getBindingContext("moeModel").getObject().ats;

        if (typeof item_proposal === 'undefined' || item_proposal === '') {
          item_proposal = "N";
        }


        //  debugger;

        var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); // get a handle on the global XAppNav service


        var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
          target: {
            semanticObject: "Material",
            action: "ZMOECATS"
          },
          params: {

            "itemproposal": item_proposal,
            "catalog": catalog,
            "ats": ats,
            "vkorg": vkorg,
            "kunwe": shipto
          }
        })) || ""; // generate the Hash to display a Supplier
        oCrossAppNavigator.toExternal({
          target: {
            shellHash: hash
          }
        }); // navigate to Supplier application


      },

      // Cookie utility methods
      setCookie: function (name, value, days) {
        var expires = "";
        if (days) {
          var date = new Date();
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + encodeURIComponent(value || "") + expires + "; path=/";
      },

      getCookie: function (name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) === ' ') c = c.substring(1, c.length);
          if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
      },

      deleteCookie: function (name) {
        document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      },

      getCookieKey: function () {
        var customer = this.getView().getModel("customerModel") .getProperty("/Customer") || "";
        var visitId = this.getView().getModel("visitModel") .getProperty("/Visitid") || "NEW";
        return "visitNotes_" + customer + "_" + visitId;
      },


      recoverAndSaveNotesFromCookie: function () {
        var that = this;
        var cookieKey = this.getCookieKey();
        var savedNotes = this.getCookie(cookieKey);

        if (savedNotes) {
          // Update the model with cookie data
          var notesModel = this.getView().getModel("notesModel");
          if (notesModel && notesModel.getData().results) {
            var currentNote = notesModel.getData().results.find(
              element => element.Visitid === that.visitid || element.Visitid === 'NEW'
            );
            if (currentNote) {
              currentNote.Notes = savedNotes;
              notesModel.refresh();
            }
          }

          // Automatically save to server
          var visitId = this.getView().getModel("visitModel") .getProperty("/Visitid");

          setTimeout(function () {
            if (visitId === 'NEW' || visitId === '' || typeof visitId === 'undefined') {
              that.getView().getModel("visitModel").setProperty("/status", "1");
              that.onCreateVisit_Periodic(that);
            } else {
              that.onUpdateNotes_periodic();
            }
          }, 500);
        }
      },

      openMap: function (oEvent) {



        if (!this.uLat) {

          sap.m.MessageToast.show("Fetching location...");
          this.getLocation_init();
          return;
        }
        if (this.getView().getModel("userValues").getProperty("/milesSet") === '') {
          this.getView().getModel("userValues").setProperty("/milesSet", 3);
        }

        //   this.extractShipto1();
        this.getView().setModel(new sap.ui.model.json.JSONModel({
          deleted: false,
          creditBlock: false
        }), "searchModel");
        // create dialog lazily
        if (!this.pDialogMap) {
          this.pDialogMap = this.loadFragment({
            name: "customer.porky.zfieldrepvisit.view.mapview1"
          });
        } else {

        }
        var that = this;
        this.pDialogMap.then(function (oDialog) {

          that.mapDialog = oDialog;

          oDialog.open();


          var filter = new sap.ui.model.Filter([
            new sap.ui.model.Filter("Deleted", sap.ui.model.FilterOperator.NE, true),
            new sap.ui.model.Filter("CreditBLock", sap.ui.model.FilterOperator.NE, true)

          ], true);




          //     that.byId("idProductsTable").getBinding("items").filter(filter, "Application");

          // //    that.getView().getModel("userValues").setProperty("/userValues",  that.byId("idProductsTable").getItems())
          //     setTimeout(() => {
          //         that._oGlobalFilter = new sap.ui.model.Filter([
          //             //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);


          //             new sap.ui.model.Filter("Deleted", sap.ui.model.FilterOperator.NE, true),
          //             new sap.ui.model.Filter("CreditBLock", sap.ui.model.FilterOperator.NE, true)

          //         ], true);



          //         that.byId("idProductsTable").getBinding("items").filter(that._oGlobalFilter, "Application");
          //     that.getView().getModel("userValues").setProperty("/countShipTo",  that.byId("idProductsTable").getItems().length)

          //   }, 200);

          that.getView().byId("mapSlider").setValue(3);

          var oMap = that.getView().byId("vbi");
          // that.getLocation();

          var oMapConfig = {
            "MapProvider": [{
              "name": "GMAP",
              "Source": [{
                "id": "s1",
                "url": "https://mt.google.com/vt/lyrs=m&x={X}&y={Y}&z={LOD}"
              }]
            }],
            "MapLayerStacks": [{
              "name": "DEFAULT",
              "MapLayer": {
                "name": "layer1",
                "refMapProvider": "GMAP",
                "opacity": "1",
                "colBkgnd": "RGB(255,255,255)"
              }
            }]
          };

          oMap.setMapConfiguration(oMapConfig);
          oMap.setRefMapLayerStack("DEFAULT");
          oMap.setCenterPosition(that.getView().getModel("customerModel").getProperty("/Longitude") + ";" + that.getView().getModel("customerModel").getProperty("/Latitude"));

          that.onSearchCustomersMapCenter(that.getView().getModel("customerModel").getProperty("/Longitude"), that.getView().getModel("customerModel").getProperty("/Latitude"));
        });
        //   setTimeout(() => {
        //    that.getView().byId("vbi").setCenterPosition(that.uLon + ";" + that.uLat);

        //   }, 1500);

        this.getView().addDependent(this.pDialogMap);








      },

      onSearchCustomersMapCenter: function (long, lat) {

        //  debugger;
        var oMap = this.getView().byId("vbi");

        var centerLoc = oMap.getCenterPosition();


        this.uLat = lat;
        this.uLon = long;
        this.getView().byId("smartTable_custF4_map").rebindTable();
      },

      onBeforeRebindCustomerF4_map: function (oEvent) {


        if (this.getView().getModel("userValues").getProperty("/milesSet") === '') {
          this.getView().getModel("userValues").setProperty("/milesSet", 3);
        }
        var stringPath = "/ZBMM_FieldRepNearbyCustomer(p_lat=" + encodeURIComponent(Number(this.uLat)) + "m,p_long=" + encodeURIComponent(Number(this.uLon)) + "m,p_distinm=" + this.getView().getModel("userValues").getProperty("/milesSet") + ")/Set";

        stringPath = (stringPath);
        oEvent.getSource().setTableBindingPath(stringPath);

        var oBindingParams = oEvent.getParameter("bindingParams");




        var salesOrgList = this.getOwnerComponent().getModel("salesOrgCentralModel").getData();


        salesOrgList.forEach(element => {
          var oFilter = new sap.ui.model.Filter("vkorg", sap.ui.model.FilterOperator.EQ, element);
          oBindingParams.filters.push(oFilter);
        });


      },

      getDistanceFromLatLonInKm: function (lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1); // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        // conversion factor
        const factor = 0.621371

        // calculate miles
        d = d * factor;

        function deg2rad(deg) {
          return deg * (Math.PI / 180)
        }
        return d;
      },
      insertAtIndex: function (arr, index, newItem) {
        const insert = (arr, index, newItem) => [
          // part of the array before the specified index
          ...arr.slice(0, index),
          // inserted item
          newItem,
          // part of the array after the specified index
          ...arr.slice(index)
        ]

        return insert(arr, index, newItem);

      },
      closeDialog: function (oEvent) {
        oEvent.getSource().getParent().getParent().close();

      },

      handlePopoverPress: function (oEvent) {


        if (!this.oEscapePreventDialog) {
          var obj = oEvent.getSource().getBindingContext("latlongModel").getObject();
          this.oEscapePreventDialog = new Dialog({
            title: obj.ShiptoName,
            content: new sap.m.Text({
              text: obj.sorg + " - " + obj.Shipto + " - " + obj.ShiptoName + "; Street: " + obj.stras + "; Distance: " + obj.distance
            }).addStyleClass("sapUiSmallMargin"),
            buttons: [
              new sap.m.Button({
                text: "Close",
                press: function () {
                  this.oEscapePreventDialog.close();
                  // this.oEscapePreventDialog.destroyContents();
                  this.oEscapePreventDialog.destroy();
                  this.oEscapePreventDialog = undefined;
                }.bind(this)
              }),
              new sap.m.Button({
                text: "Directions",
                press: function () {
                  this.oEscapePreventDialog.close();
                  // this.oEscapePreventDialog.destroyContents();
                  this.oEscapePreventDialog.destroy();
                  this.oEscapePreventDialog = undefined;
                  this.mapsSelector(obj);
                }.bind(this)
              }),

              new sap.m.Button({
                text: "Sales Dashboard",
                press: function () {
                  this.oEscapePreventDialog.close();
                  // this.oEscapePreventDialog.destroyContents();
                  this.oEscapePreventDialog.destroy();
                  this.oEscapePreventDialog = undefined;
                  this.openSalesDashboard(obj);
                }.bind(this)
              }),
              new sap.m.Button({
                text: "New Visit",
                press: function () {
                  this.oEscapePreventDialog.close();
                  // this.oEscapePreventDialog.destroyContents();
                  this.oEscapePreventDialog.destroy();
                  this.oEscapePreventDialog = undefined;
                  this.openMapNewVisit(obj, this);
                }.bind(this)
              }),
              // ,
              // new sap.m.Button({
              //     text: "Filter Visit",
              //     press: function () {
              //         this.filterVisitByCustomer(obj.Shipto);
              //     }.bind(this)
              // })
            ]
            //,
            // escapeHandler: function (oPromise) {
            //     if (!this.oConfirmEscapePreventDialog) {
            //         this.oConfirmEscapePreventDialog = new Dialog({
            //             title: "Are you sure?",
            //             content: new sap.m.Text({ text: "Your unsaved changes will be lost" }),
            //             type: DialogType.Message,
            //             icon: IconPool.getIconURI("message-information"),
            //             buttons: [
            //                 new sap.m.Button({
            //                     text: "Yes",
            //                     press: function () {
            //                         this.oConfirmEscapePreventDialog.close();
            //                         oPromise.resolve();
            //                     }.bind(this)
            //                 }),
            //                 new sap.m.Button({
            //                     text: "No",
            //                     press: function () {
            //                         this.oConfirmEscapePreventDialog.close();
            //                         oPromise.reject();
            //                     }.bind(this)
            //                 })
            //             ]
            //         });
            //     }

            //     this.oConfirmEscapePreventDialog.open();
            // }.bind(this)
          });
        }

        this.oEscapePreventDialog.open();
      },

      mapsSelector: function (objectVar) {


        var orgPosition = this.resetuLat + "," + this.resetuLong;
        if /* if we're on iOS, open in Apple Maps */ ((navigator.platform.indexOf("iPhone") != -1) ||
          (navigator.platform.indexOf("iPad") != -1) ||
          (navigator.platform.indexOf("iPod") != -1))
          //   window.open("https://maps.google.com/maps?saddr="+orgPosition+"+&daddr="+objectVar.pos.split(";")[1]+","+objectVar.pos.split(";")[0]);
          window.open("https://maps.google.com/maps?saddr=" + orgPosition + "+&daddr=" + objectVar.stras + "+" + objectVar.city);

        else /* else use Google */
          window.open("https://maps.google.com/maps?saddr=" + orgPosition + "+&daddr=" + objectVar.stras + "+" + objectVar.city);
      },
      openMapNewVisit: function (obj, _view) {

        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("newvisit", {
          visitid: 'NEW',
          shipto: obj.Shipto,
          vkorg: obj.sorg
        });
        _view.mapDialog.close()
      },

      openSalesDashboard: function (obj) {
        //      debugger;
        var shipto = obj.Shipto;
        var vkorg = obj.sorg;





        sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then(function (oService) {
          oService.hrefForExternalAsync({
            target: {
              semanticObject: "Sales",
              action: "ZSDCUSTDASH_OVP"
            },
            params: {

              "Customer": shipto,
              "SalesOrganization": vkorg,
              "CompanyCode": obj.CompanyCode


            }
          }).then(function (sHref) {


            oService.toExternal({
              target: {
                shellHash: sHref
              }
            });
            setTimeout(() => {
              location.reload();

            }, 1000);
          });
        });

      },


      onChangeDistance: function (oEvent) {
        var miles = oEvent.mParameters.value;
        this.miles = miles;
        this.getView().getModel("userValues").setProperty("/milesSet", miles);
        //   this.setMilesShipto(miles);
        var that = this;

        // setTimeout(() => {
        //     that._oGlobalFilter = new sap.ui.model.Filter([
        //         //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);


        //         new sap.ui.model.Filter("Deleted", sap.ui.model.FilterOperator.NE, true),
        //         new sap.ui.model.Filter("CreditBLock", sap.ui.model.FilterOperator.NE, true)

        //     ], true);



        //     that.byId("idProductsTable").getBinding("items").filter(this._oGlobalFilter, "Application");
        //     that.getView().getModel("userValues").setProperty("/countShipTo",  that.byId("idProductsTable").getItems().length)

        //   }, 200);

        this.getView().byId("smartTable_custF4_map").rebindTable();

      },

      openSalesDashboard_1: function () {

        var obj = {};

        obj.Shipto = this.getView().getModel("customerModel").getData().Customer;
        obj.CompanyCode = this.getView().getModel("customerModel").getData().CompanyCode;
        obj.sorg = this.getView().getModel("customerModel").getData().SalesOrganization;
        this.openSalesDashboard(obj);


      },
      onProspectReminder: function () {

        this.onOpenCalendarDialog(true);
      },
      onChangeStartDate: function (oEvent) {
        var oModel = this.getView().getModel("calendarEventModel");
        var oStartDate = oEvent.getSource().getDateValue();

        if (!oStartDate) return;

        // Set end date to same as start date
        oModel.setProperty("/Enddate", new Date(oStartDate.getTime()));

        // Re-validate
        this._validateCalendarDates();
      },

      onChangeStartTime: function (oEvent) {
        var oModel = this.getView().getModel("calendarEventModel");
        var sStartTime = oEvent.getSource().getValue();

        if (!sStartTime) return;

        var parts = sStartTime.split(":");
        var startHours = parseInt(parts[0]) || 0;
        var startMins = parseInt(parts[1]) || 0;
        var startTotalMins = startHours * 60 + startMins;

        // Calculate existing difference if end time already set
        var sCurrentEndTime = oModel.getProperty("/EndtimeStr");
        var diffMins = 60; // default 1 hour

        if (this.diffMins && this.diffMins != 60) {
          // Apply the difference to new start time
          var newEndTotalMins = startTotalMins + this.diffMins;
        } else {
          var newEndTotalMins = startTotalMins + diffMins;

        }



        // Cap at 23:59
        if (newEndTotalMins >= 24 * 60) {
          newEndTotalMins = 23 * 60 + 59;
        }

        var newEndHours = Math.floor(newEndTotalMins / 60);
        var newEndMins = newEndTotalMins % 60;

        var sEndTime = String(newEndHours).padStart(2, "0") + ":" + String(newEndMins).padStart(2, "0");
        oModel.setProperty("/StarttimeStr", sStartTime);
        oModel.setProperty("/EndtimeStr", sEndTime);

        this._validateCalendarDates();
      },

      onChangeEndDate: function (oEvent) {
        this._validateCalendarDates();
      },

      onChangeEndTime: function (oEvent) {

        this.setDifference();
        this._validateCalendarDates();
      },

      setDifference: function () {

        var oModel = this.getView().getModel("calendarEventModel");

        var sCurrentEndTime = oModel.getProperty("/EndtimeStr");
        var sCurrentStartTime = oModel.getProperty("/StarttimeStr");

        this.diffMins = 60; // default 1 hour

        if (sCurrentStartTime) {
          var endParts = sCurrentEndTime.split(":");
          var endHours = parseInt(endParts[0]) || 0;
          var endMins = parseInt(endParts[1]) || 0;
          var endTotalMins = endHours * 60 + endMins;

          var startParts = sCurrentStartTime.split(":");
          var startHours = parseInt(startParts[0]) || 0;
          var startMins = parseInt(startParts[1]) || 0;
          var startTotalMins = startHours * 60 + startMins;

          var calculatedDiff = endTotalMins - startTotalMins;

          // Only preserve diff if it's a positive value (end was after start)
          // Otherwise fall back to 1 hour default
          if (calculatedDiff > 0) {
            this.diffMins = calculatedDiff;
          }
        }
      },

      _validateCalendarDates: function () {
        var oModel = this.getView().getModel("calendarEventModel");
        var oData = oModel.getData();

        if (!oData.Startdate || !oData.Enddate) return true;

        var oStartDate = new Date(oData.Startdate);
        var oEndDate = new Date(oData.Enddate);

        if (oData.Isallday) {
          // For all-day, just compare dates (strip time)
          oStartDate.setHours(0, 0, 0, 0);
          oEndDate.setHours(0, 0, 0, 0);

          if (oEndDate < oStartDate) {
            oModel.setProperty("/dateError", "End date must be on or after start date.");
            return false;
          }
        } else {
          // Parse time strings
          var startTimeParts = (oData.StarttimeStr || "00:00").split(":");
          var endTimeParts = (oData.EndtimeStr || "00:00").split(":");

          oStartDate.setHours(parseInt(startTimeParts[0]) || 0, parseInt(startTimeParts[1]) || 0, 0, 0);
          oEndDate.setHours(parseInt(endTimeParts[0]) || 0, parseInt(endTimeParts[1]) || 0, 0, 0);

          if (oEndDate <= oStartDate) {
            oModel.setProperty("/dateError", "End date/time must be after start date/time.");
            return false;
          }
        }

        oModel.setProperty("/dateError", "");
        return true;
      },

      onOpenCalendarDialog: function (args) {



        var oCustomer = this.getView().getModel("customerModel").getData();

        // Default to tomorrow, 9am-10am
        if (args === true) {
          //               var oTomorrow = new Date();
          // oTomorrow.setDate(oTomorrow.getDate() + 1);
          // oTomorrow.setHours(0, 0, 0, 0);

          var oTomorrow = this.getView().getModel("customerModel").getProperty("/ProjectedDelivery");
          //   oTomorrow.setHours(0, 0, 0, 0);

          oTomorrow.setDate(oTomorrow.getDate());



          this.getView().setModel(new sap.ui.model.json.JSONModel({
            Subject: "Potential 1st Delv. - " + oCustomer.CustomerFullName,
            Body: "Potential 1st Delv. at " + oCustomer.StreetName + ", " + oCustomer.CityName,
            Startdate: oTomorrow,
            Isallday: true,
            StarttimeStr: "09:00",
            Enddate: oTomorrow,
            EndtimeStr: "10:00",
            Kunnr: oCustomer.Customer,
            Vkorg: this.vkorg
          }), "calendarEventModel");


        } else {
          var oTomorrow = new Date();
          oTomorrow.setDate(oTomorrow.getDate() + 1);
          // oTomorrow.setHours(0, 0, 0, 0);

          // if(this.getView().getModel("customerModel").getProperty("/ProjectedDelivery")){
          // var oTomorrow = this.getView().getModel("customerModel").getProperty("/ProjectedDelivery");
          // oTomorrow.setDate(oTomorrow.getDate() + 1);
          // oTomorrow.setHours(0, 0, 0, 0);

          // }

          this.getView().setModel(new sap.ui.model.json.JSONModel({
            Subject: "Follow-up w/ " + oCustomer.CustomerFullName,
            Body: "Follow-up at " + oCustomer.StreetName + ", " + oCustomer.CityName,
            Startdate: oTomorrow,
            StarttimeStr: "09:00",
            Enddate: oTomorrow,
            EndtimeStr: "10:00",
            Kunnr: oCustomer.Customer,
            Vkorg: this.vkorg
          }), "calendarEventModel");
        }

        if (!this.pCalendarDialog) {
          this.pCalendarDialog = this.loadFragment({
            name: "customer.porky.zfieldrepvisit.view.calendarEvent"
          });
        }
        var that = this;
        this.pCalendarDialog.then(function (oDialog) {
          that.pCalendarDialog_d = oDialog;
          that.getView().addDependent(oDialog);
          oDialog.open();
        });
      },

      onCloseCalendarDialog: function () {
        if (this.pCalendarDialog_d) {
          this.pCalendarDialog_d.close();
        }
      },

      onCreateCalendarEvent: function () {
        var that = this;

        // Replace the end-after-start validation block inside onCreateCalendarEvent with:
        if (!this._validateCalendarDates()) {
          var sError = this.getView().getModel("calendarEventModel").getProperty("/dateError");
          sap.m.MessageBox.error(sError || "End date/time must be after start date/time.");
          return;
        }
        var oData = this.getView().getModel("calendarEventModel").getData();

        // Validation
        if (!oData.Subject || oData.Subject.trim() === "") {
          sap.m.MessageBox.error("Please enter a subject.");
          return;
        }
        if (!oData.Startdate) {
          sap.m.MessageBox.error("Please select a start date.");
          return;
        }
        if (!oData.Enddate) {
          sap.m.MessageBox.error("Please select an end date.");
          return;
        }

        // Convert time strings (HH:mm) to Edm.Time format (PT#H#M0S)
        function timeStrToEdmTime(timeStr) {
          if (!timeStr) return "PT00H00M00S";
          var parts = timeStr.split(":");
          var hours = parseInt(parts[0]) || 0;
          var mins = parseInt(parts[1]) || 0;
          return "PT" + String(hours).padStart(2, "0") + "H" + String(mins).padStart(2, "0") + "M00S";
        }

        var oPayload = {
          Kunnr: oData.Kunnr,
          Isallday: oData.Isallday,
          Vkorg: oData.Vkorg,
          KunnrSm: oData.Kunnr,
          Subject: oData.Subject,
          Body: oData.Body || "",
          Startdate: "/Date(" + new Date(oData.Startdate).getTime() + ")/",
          Starttime: timeStrToEdmTime(oData.StarttimeStr),
          Enddate: "/Date(" + new Date(oData.Enddate).getTime() + ")/",
          Endtime: timeStrToEdmTime(oData.EndtimeStr)
        };

        // Validate end is after start
        var startMs = new Date(oData.Startdate).getTime() + oPayload.Starttime.ms;
        var endMs = new Date(oData.Enddate).getTime() + oPayload.Endtime.ms;
        if (endMs <= startMs) {
          sap.m.MessageBox.error("End date/time must be after start date/time.");
          return;
        }

        this.getView().setBusy(true);

        var oDataModel = this.getOwnerComponent().getModel("ZODATA_FR_SRV");
        oDataModel.create("/MSCalEventSet", oPayload, {
          success: function (result) {
            that.getView().setBusy(false);
            that.onCloseCalendarDialog();
            sap.m.MessageBox.success("Calendar invite sent successfully!");
          },
          error: function (oError) {
            that.getView().setBusy(false);
            var sMsg = "Error sending calendar invite.";
            try {
              sMsg = JSON.parse(oError.responseText).error.message.value || sMsg;
            } catch (e) {}
            sap.m.MessageBox.error(sMsg);
          }
        });
      },

      onSliderOrdDept: function (oEvent) {
        var bState = oEvent.getParameter("state");
        var oTable = this.getView().byId("keyTablezfieldrep");
        var oBinding = oTable.getBinding("items");

        if (bState) {
          var oFilter = new sap.ui.model.Filter("Department", sap.ui.model.FilterOperator.BT, "A", "Z");
          oBinding.filter(oFilter, sap.ui.model.FilterType.Application);
        } else {
          oBinding.filter([], sap.ui.model.FilterType.Application);
        }
      }




    });
  }
);