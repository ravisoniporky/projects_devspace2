sap.ui.define([
        "sap/ui/core/mvc/Controller",
        'sap/ui/core/Fragment',
        "sap/m/Dialog",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/model/json/JSONModel",
        "sap/ui/Device"
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, Dialog, Filter, FilterOperator, JSONModel, Device) {
        "use strict";

        return Controller.extend("customer.porky.zfieldrepvisit.controller.View1", {
            onInit: function () {
                //     this.getView().setBusy(true);

                // set the device model
                var oDeviceModel = new JSONModel(Device);
                oDeviceModel.setDefaultBindingMode("OneWay");
                this.getView().setModel(oDeviceModel, "device");



                var jsObj = {
                    "Spots": {
                        "items": []

                    }
                };


                this.getView().setModel(new sap.ui.model.json.JSONModel(
                    jsObj
                ), "latlongModel");

                  this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(
                    jsObj
                ), "latlongModel");

                this.getView().setModel(new sap.ui.model.json.JSONModel({
                    "salesorg": "",
                    "salesOrgString": "",
                    "ccode": "",
                    "wkending": new Date(),
                    "numweeks": "13",
                    "selectedView": "keyname",
                    "selectedKey": "1",
                    "cusStart": null,
                    "cusEnd": null,
                    "countShipTo": "",
                    "milesSet": 3,
                    "location": true,
                    "infobarvkorg": "",
                    "infobarmiles": "No miles radius is set",
                    "salesOrgList": [],
                    "currentMode": "Customer"

                }), "userValues");


                let prodSet = this.getOwnerComponent().getModel("ZODATA_FR_SRV");


                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteView1").attachMatched(this._onRouteMatched, this);

                this.getView().setModel(new sap.ui.model.json.JSONModel({
                    "countList": ""
                }), "countModel");




                let defaultModel = this.getOwnerComponent().getModel("ZCXA_USERDEFAULT_CDS");
                var that = this;
                defaultModel.read("/ZCXA_USERDEFAULT", {
                    success: function (oData, oResponse) {
                        var salesorg = oData.results.find(element => element.parid === "VKO");
                        var location = oData.results.find(element => element.parid === "ZFMT_IGNORE_DISTANCE");
                        var kna1Para = oData.results.find(element => element.parid === "ZKNA1SS");

                        var visittype = oData.results.find(element => element.parid === "ZFMT_VISITTYPE");

                        if (visittype) {

                            that.visittype = visittype.parva;
                        }
                        if (oData.results.find(element => element.parid === "ZFMT_PARTNERTYPE")) {
                            var prospectParam = oData.results.find(element => element.parid === "ZFMT_PARTNERTYPE").parva;
                        }

                        if (typeof prospectParam !== "undefined") {

                            if (prospectParam === 'C') {
                                that.getView().byId("segmentButtonProspectMode").setVisible(false);
                                that.getView().getModel("userValues").setProperty("/currentMode", "Customer");

                            } else if (prospectParam === 'P') {

                                that.getView().byId("segmentButtonProspectMode").setVisible(false);
                                that.getView().getModel("userValues").setProperty("/currentMode", "Prospect");

                            } else if (prospectParam === 'CP') {

                                that.getView().byId("segmentButtonProspectMode").getModel("userValues").setProperty("/currentMode", "Customer");
                                that.getView().setVisible(true);

                            } else {
                                that.getView().byId("segmentButtonProspectMode").setVisible(false);
                                that.getView().getModel("userValues").setProperty("/currentMode", "Customer");

                            }

                        } else {
                            that.getView().byId("segmentButtonProspectMode").setVisible(false);
                            that.getView().getModel("userValues").setProperty("/currentMode", "Customer");

                        }

                            var salesOrgData = that.getOwnerComponent().getModel("salesOrgCentralModel") ? that.getOwnerComponent().getModel("salesOrgCentralModel").getData() : null;

                        if (typeof salesorg !== "undefined" ) {

                            that.getView().getModel("userValues").setProperty("/salesorg", salesorg.parva);
                            that.getView().getModel("userValues").setProperty("/salesOrgString", salesorg.parva);

                            if(salesOrgData && salesOrgData.length > 0){
                            
                            }else{
                                var salesOrgList = that.getView().getModel("userValues").getProperty("/salesOrgList");
                            salesOrgList.push(salesorg.parva);
                            that.getView().getModel("userValues").setProperty("/salesOrgList", salesOrgList);
                            that.getOwnerComponent().getModel("salesOrgCentralModel").setData(that.getView().getModel("userValues").getProperty("/salesOrgList"));


                            }



                            that.filterListBySalesOrg(salesorg.parva);
                            that.getView().getModel("userValues").setProperty("/infobarvkorg", "Sales Org set to " + salesorg.parva);
                            var oModel = sap.ui.getCore().getModel("defaultValuesModel");
                            //var oModel1 = new sap.ui.model.json.JSONModel("model/Testmodel.json");
                            var oData = {
                                salesorg: salesorg.parva
                            };
                            var oModel1 = new sap.ui.model.json.JSONModel(oData);
                            sap.ui.getCore().setModel(oModel1, "userDefaultGlobal");
                            // oModel.setProperty("/salesorg",salesorg.parva)
                            that.salesorg = salesorg.parva;
                            that.vkorg = salesorg.parva;


                            if (location) {
                                that.getView().getModel("userValues").setProperty("/location", location.parva === 'X' ? false : true);
                                that.rebindAllTables();

                                if (location.parva !== 'X') {
                                    setTimeout(() => {
                                        that.getLocation();

                                    }, 500);
                                } else {
                                    that.getView().getModel("userValues").setProperty("/milesSet", "");

                                    that.getLocation_alltime();
                                    that.getView().setBusy(false);
                                }

                            } else {
                                setTimeout(() => {
                                    that.getLocation();

                                }, 500);
                            }

                            that.getView().byId("smartTable_visitF4").rebindTable();
                            that.getView().byId("smartTable_visitF4_draft").rebindTable();
                            that.getView().byId("smartTable_visitF4_prospect").rebindTable();
                            that.getView().byId("smartTable_visitF4_prospect_draft").rebindTable();

                             that._setSalesOrgsToURL();

                        }

                        if (typeof kna1Para !== "undefined") {

                            that.filterVisitsbySS(kna1Para.parva);

                        }
                    },

                    error: function (oError) {}
                });


                this.checkAuthorization();

                this.getLocation_init();
                this.getView().setModel(new sap.ui.model.json.JSONModel({
                    deleted: false,
                    creditBlock: false
                }), "searchModel");

                this.getOwnerComponent().getModel().setSizeLimit(9999);









                this.getOwnerComponent().getModel().attachRequestCompleted(function (oEvent) {

                    if (oEvent.mParameters.url.includes("ZBMM_FieldRepNearbyCustomer") && !oEvent.mParameters.url.includes("$count")) {

                        //  debugger;
                        try{
                        that.getView().byId("idSpots").removeAllItems()
                        }catch(e){

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
                            "tooltip": "My Location",
                            "type": "Success",
                            "text": "My Location",
                            "Shipto": "My Location",
                            "ShiptoName": "My Location",
                            "stras": "",
                            "Salesman": "",
                            "distance": 0,
                            "scale": "2;2;2",
                            "selected": false,
                            "city": "",
                            "level": "",
                            "altkn": "",
                            "sorg": "",
                            "CreditBLock": false,
                            "Deleted": false,
                            "CompanyCode": ""



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


                this.checkifFMTSuperUser();

            },

            rebindAllTables: function (oEvent) {

                var that = this;
                that.getView().byId("smartTable_visitF4").rebindTable();
                that.getView().byId("smartTable_visitF4_draft").rebindTable();
                that.getView().byId("smartTable_visitF4_prospect").rebindTable();
                that.getView().byId("smartTable_visitF4_prospect_draft").rebindTable();
            },




            onDeleteSalesOrg: function (oEvent) {

                if (oEvent.getSource().getParent().getParent().getSelectedItems().length === 0) {

                    sap.m.MessageBox.error("Please select one item to delete");
                    return;
                }
                if (oEvent.getSource().getParent().getParent().getItems().length === 1 || oEvent.getSource().getParent().getParent().getItems().length === oEvent.getSource().getParent().getParent().getSelectedItems().length) {

                    sap.m.MessageBox.error("Sales Organization list can't be empty");
                    return;
                }

                var selectedItems = oEvent.getSource().getParent().getParent().getSelectedItems();

                var salesOrgList = this.getView().getModel("userValues").getProperty("/salesOrgList");

                selectedItems.forEach(element => {

                    var index = salesOrgList.indexOf(element.getTitle());
                    if (index > -1) { // only splice array when item is found
                        salesOrgList.splice(index, 1); // 2nd parameter means remove one item only
                    }
                });
                this.getView().getModel("userValues").setProperty("/salesOrgList", salesOrgList);
                this.getOwnerComponent().getModel("salesOrgCentralModel").setData(this.getView().getModel("userValues").getProperty("/salesOrgList"));

                that.getView().byId("smartTable_visitF4").rebindTable();
                that.getView().byId("smartTable_visitF4_draft").rebindTable();
                that.getView().byId("smartTable_visitF4_prospect").rebindTable();
                that.getView().byId("smartTable_visitF4_prospect_draft").rebindTable();

                this.extractShipTo_UpdateSOrg();

                this.filterListBySalesOrg();


                //   debugger;
            },

            onAddSalesOrg: function (oEvent) {

                //   debugger;
                if (oEvent.getSource().getParent().getItems()[0].getSelectedItem() === null) {
                    return;
                }
                if (oEvent.getSource().getParent().getItems()[0].getSelectedItem().getText() === '' || oEvent.getSource().getParent().getItems()[0].getSelectedItem().getKey() === '000') {
                    return;
                }

                var sorg = oEvent.getSource().getParent().getItems()[0].getSelectedItem().getText().split("-")[0].trim();
                oEvent.getSource().getParent().getItems()[0].setValueState("None");
                var salesOrgList = this.getView().getModel("userValues").getProperty("/salesOrgList");

                var flagIsDuplicate = false;
                salesOrgList.forEach(element => {

                    if (sorg === element) {
                        flagIsDuplicate = true;
                        return;
                    }
                });
                if (flagIsDuplicate) {
                    return;
                }
                salesOrgList.push(sorg);
                this.getView().getModel("userValues").setProperty("/salesOrgList", salesOrgList);
                this.getOwnerComponent().getModel("salesOrgCentralModel").setData(this.getView().getModel("userValues").getProperty("/salesOrgList"));

                this.extractShipTo_UpdateSOrg();

                this.filterListBySalesOrg();
                oEvent.getSource().getParent().getItems()[0].setSelectedKey();

                //     this.getView().byId("idSalesOrgSelec").setSelectedKey("000");
                var that = this;
                setTimeout(() => {
                    that.getView().byId("idSalesOrgSelec").setSelectedKey("");

                }, 200);
                //  this.getView().byId("smartTable_visitF4").rebindTable();
                this._setSalesOrgsToURL();

            },

            onFinishedVisits_draft: function (oEvent) {
                this.getView().getModel("countModel").setProperty("/countList_draft", oEvent.getSource().getMaxItemsCount())
                setTimeout(this.func4.bind(this), 2000);

            },
            onFinishedVisits_prospect: function (oEvent) {
                this.getView().getModel("countModel").setProperty("/countList_prospect", oEvent.getSource().getMaxItemsCount())
                setTimeout(this.func3.bind(this), 2000);

            },
            onFinishedVisits_prospect_draft: function (oEvent) {

                this.getView().getModel("countModel").setProperty("/countList_prospect_draft", oEvent.getSource().getMaxItemsCount());
                setTimeout(this.func2.bind(this), 2000);


            },
            func1: function () {
                this.getView().getModel("countModel").setProperty("/countList", this.getView().byId("smartTable_visitF4").getTable().getMaxItemsCount());

            },

            func2: function () {
                this.getView().getModel("countModel").setProperty("/countList_prospect_draft", this.getView().byId("smartTable_visitF4_prospect_draft").getTable().getMaxItemsCount());

            },

            func3: function () {
                this.getView().getModel("countModel").setProperty("/countList_prospect", this.getView().byId("smartTable_visitF4_prospect").getTable().getMaxItemsCount());

            },

            func4: function () {
                this.getView().getModel("countModel").setProperty("/countList_draft", this.getView().byId("smartTable_visitF4_draft").getTable().getMaxItemsCount());

            },
            onFinishedVisits: function (oEvent) {
                var that = this;


                setTimeout(this.func1.bind(this), 2000);



            },

            onChangeSalesOrgField: function (oEvent) {

                oEvent.getSource().setValueState("None");
            },

            onSelectionChangeSalesOrg: function (oEvent) {

                var sorg = oEvent.mParameters.listItem.getTitle();



                if (oEvent.getSource().getItems().length === 1) {

                    sap.m.MessageBox.error("Sales Organization list can't be empty");
                    oEvent.mParameters.listItem.setSelected(true);
                    return;
                }




                var salesOrgList = this.getView().getModel("userValues").getProperty("/salesOrgList");


                var index = salesOrgList.indexOf(sorg);
                if (index > -1) { // only splice array when item is found
                    salesOrgList.splice(index, 1); // 2nd parameter means remove one item only
                }
                this.getView().getModel("userValues").setProperty("/salesOrgList", salesOrgList);
                this.getOwnerComponent().getModel("salesOrgCentralModel").setData(this.getView().getModel("userValues").getProperty("/salesOrgList"));

                this.extractShipTo_UpdateSOrg();

                this.filterListBySalesOrg();
                var items = oEvent.getSource().getItems();

                items.forEach(element => {
                    element.setSelected(true);
                });

                this._setSalesOrgsToURL();


            },

            onShowSalesOrgVH: function (oEvent) {

                // create dialog lazily
                if (!this.pDialog) {
                    this.pDialog = this.loadFragment({
                        name: "customer.porky.zfieldrepvisit.view.fragments.salesorgf4"
                    });
                }
                var that = this;
                this.pDialog.then(function (oDialog) {

                    oDialog.open();
                });
                this.getView().addDependent(this.pDialog);
            },

            filterVisitsbySS: function (salesPerson) {

                var aFilters = []


                var filter = new Filter("SalesSupport", FilterOperator.Contains, salesPerson);
                aFilters.push(filter);

                var filtersalesorg = new Filter("Vkorg", FilterOperator.Contains, this.getView().getModel("userValues").getProperty("/salesorg"));
                aFilters.push(filtersalesorg);




                var farrayobj = new Filter({
                    filters: aFilters,
                    and: false,
                });

                // update list binding
                var oList = this.byId("idList");
                var oBinding = oList.getBinding("items");
                // this.getView().setBusy(true);

                oBinding.filter(farrayobj, "Application");
                //   this.getView().setBusy(false);

                this.getView().setModel(new sap.ui.model.json.JSONModel({
                    "SS": salesPerson
                }), "SSModel");

            },

            visitsNearBy: function (oEvent) {

            },

                 _setSalesOrgsToURL: function() {
    var salesOrgData = this.getOwnerComponent().getModel("salesOrgCentralModel").getData();
    if (salesOrgData && salesOrgData.length > 0) {
        var salesOrgsString = salesOrgData.join(',');
        var currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('salesOrgs', salesOrgsString);
        window.history.replaceState({}, '', currentUrl.toString());
    }
},

_getSalesOrgsFromURL: function() {
    var urlParams = new URLSearchParams(window.location.search);
    var salesOrgsParam = urlParams.get('salesOrgs');
    if (salesOrgsParam) {
        var salesOrgArray = salesOrgsParam.split(',');
        this.getOwnerComponent().getModel("salesOrgCentralModel").setData(salesOrgArray);
                            this.getView().getModel("userValues").setProperty("/salesOrgList",salesOrgArray)

    }
},


            _onRouteMatched: function (oEvent) {

                // if(location.href.includes("ZFIELDVISIT=")){
                //     var oRouter = this.getOwnerComponent().getRouter();

                //    var visitid = location.href.split("ZFIELDVISIT=")[1].split("&")[0];
                //    oRouter.navTo("newvisit", {
                //     visitid: visitid
                // });
                // return;

                // }
                this._isOnInit1 = true;
                var that = this;

                           // ADD THESE TWO LINES:
    this._getSalesOrgsFromURL();
    this._setSalesOrgsToURL();

                setTimeout(() => {
                    that.getView().byId("idList").getBinding("items").refresh(true);

                    // this.byId("idList").bindItems({dd
                    //     path: "/ZBMM_FieldRepNearby(p_vkorg='3000',p_lat='0',p_long='0',p_distinm='0')/Set"

                    // });
                    that.getView().byId("idList_draft").getBinding("items").refresh(true);
                    that.getView().byId("idList_prospect").getBinding("items").refresh(true);
                    that.getView().byId("smartTable_visitF4").rebindTable();
                    that.getView().byId("smartTable_visitF4_draft").rebindTable();
                    that.getView().byId("smartTable_visitF4_prospect").rebindTable();
                    that.getView().byId("smartTable_visitF4_prospect_draft").rebindTable();


                }, 500);
            },

            onClickItemVisitList: function (oEvent) {

                //   var ctxobj = oEvent.mParameters.listItem.getBindingContext().getObject();
                var ctxobj = oEvent.mParameters.listItem.getBindingContext().getObject()

                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("newvisit", {
                    visitid: ctxobj.Visitid,
                    shipto: ctxobj.Customer,
                    vkorg: ctxobj.Vkorg
                });
            },

            openNewVisit: function (oEvent) {

                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("newvisit", {

                    vkorg: this.vkorg
                })
            },
            onAddProspect: function (oEvent) {

                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("newvisit", {

                    vkorg: this.vkorg,
                    prospect: true
                })
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
                        name: "customer.porky.zfieldrepvisit.view.mapview"
                    });
                } else {

                }
                var that = this;
                this.pDialogMap.then(function (oDialog) {


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
                    oMap.setCenterPosition(that.uLon + ";" + that.uLat);
                    that.getView().byId("smartTable_custF4_map").rebindTable();
                    that.onResetMap()


                });
                //   setTimeout(() => {
                //    that.getView().byId("vbi").setCenterPosition(that.uLon + ";" + that.uLat);

                //   }, 1500);

                this.getView().addDependent(this.pDialogMap);








            },

            extractShipTo_UpdateSOrg: function () {

                this.getView().byId("smartTable_visitF4").rebindTable();
                this.getView().byId("smartTable_visitF4_draft").rebindTable();
                this.getView().byId("smartTable_visitF4_prospect").rebindTable();
                this.getView().byId("smartTable_visitF4_prospect_draft").rebindTable();

                return;
                var oFilter = [];
                //   oFilter.push(new sap.ui.model.Filter("vkorg", sap.ui.model.FilterOperator.EQ, this.vkorg));

                var salesOrgList = this.getView().getModel("userValues").getProperty("/salesOrgList");
                let runDateSet = this.getOwnerComponent().getModel("ZODATA_FR_SRV");
                var that = this;
                //  var salesorg = '';
                salesOrgList.forEach(element => {
                    var filter = new Filter("vkorg", FilterOperator.Contains, element);
                    oFilter.push(filter);
                    //    salesorg = salesorg+" "+element;

                });
                runDateSet.read("/ZI_DefaultSHVH", {
                    filters: oFilter,
                    success: function (oData, oResponse) {
                        var jsArray = [];
                        that.getView().setBusy(false);

                        for (var count = 0; count < oData.results.length; count++) {
                            var dist = that.getDistanceFromLatLonInKm(oData.results[count].zzlatitude, oData.results[count].zzlongitude, that.uLat, that.uLon);
                            dist = Math.round((dist + Number.EPSILON) * 100) / 100;
                            if (dist === null) {
                                sap.m.MessageToast.show("Fetching location...");
                                return;
                            }
                            jsArray.push({
                                "pos": oData.results[count].zzlongitude + ";" + oData.results[count].zzlatitude + ";0",
                                "lat": oData.results[count].zzlatitude,
                                "long": oData.results[count].zzlongitude,
                                "tooltip": oData.results[count].name1 + " " + dist + "miles",
                                "type": "Error",
                                "text": oData.results[count].kunnr,
                                "distance": Number(dist),
                                "Shipto": oData.results[count].kunnr,
                                "ShiptoName": oData.results[count].name1,
                                "stras": oData.results[count].stras,
                                "Salesman": oData.results[count].sm,
                                "Scale": "1;1;1",
                                "selected": true,
                                "city": oData.results[count].ort01,
                                "level": oData.results[count].hier1_name,
                                "altkn": oData.results[count].altkn,
                                "sorg": oData.results[count].vkorg,
                                "CreditBLock": oData.results[count].CreditBLock,
                                "Deleted": oData.results[count].Deleted



                            })

                        }


                        var jsObj = {
                            "Spots": {
                                "items": jsArray


                            }
                        };

                        that.getView().setModel(new sap.ui.model.json.JSONModel(
                            JSON.parse(JSON.stringify(jsObj))
                        ), "latlongModelOriginal");
                        that.getView().setModel(new sap.ui.model.json.JSONModel(
                            JSON.parse(JSON.stringify(jsObj))
                        ), "latlongModel");
                        that.getView().getModel("latlongModel").setSizeLimit("9999");
                        //  that.getLocation();
                        that.setMilesShipto1(3);
                        that.setMilesShipto(3);


                        //  that.miles = 3;



                    },

                    error: function (oError) {}
                });
            },


            extractShipto: function () {
                //  this.getLocation();


                return;
                var that = this;
                if (!this.uLat) {
                    that.getView().setBusy(false);

                    return;
                }
                let runDateSet = this.getOwnerComponent().getModel("ZODATA_FR_SRV");
                var that = this;


                if (that.getView().getModel("latlongModelOriginal") && that.getView().getModel("latlongModelOriginal").getData().Spots.items.length > 0) {

                    that.getView().setBusy(false);

                    var dataobj = that.getView().getModel("latlongModelOriginal").getData().Spots.items;
                    var jsArray = [];

                    for (var count = 0; count < dataobj.length; count++) {
                        // var dist = Number(currentData.Spots.items[count].distance);

                        var dist = that.getDistanceFromLatLonInKm(dataobj[count].lat, dataobj[count].long, that.uLat, that.uLon);
                        dist = Math.round((dist + Number.EPSILON) * 100) / 100;

                        dataobj[count].distance = dist;


                    }


                    for (var count = 0; count < dataobj.length; count++) {

                        var dist = that.getDistanceFromLatLonInKm(dataobj[count].lat, dataobj[count].long, that.uLat, that.uLon);
                        dist = Math.round((dist + Number.EPSILON) * 100) / 100;
                        //    if(dist === null){
                        //        sap.m.MessageToast.show("Fetching location...");
                        //        return;
                        //    }
                        dataobj[count].distance = dist;
                        //"distance":Number(dist),


                        //  jsArray.push(currentData.Spots.items[count]) ;

                    }

                    var jsObj = {
                        "Spots": {
                            "items": dataobj
                        }
                    };

                    that.getView().setModel(new sap.ui.model.json.JSONModel(
                        JSON.parse(JSON.stringify(jsObj))
                    ), "latlongModelOriginal");

                    that.getView().getModel("latlongModel").setSizeLimit("9999");
                    //    that.getLocation();
                    that.setMilesShipto1(3);

                    that.setMilesShipto(3);


                } else {


                    var oFilter = [];
                    //   oFilter.push(new sap.ui.model.Filter("vkorg", sap.ui.model.FilterOperator.EQ, this.vkorg));

                    var salesOrgList = this.getView().getModel("userValues").getProperty("/salesOrgList");

                    //  var salesorg = '';
                    salesOrgList.forEach(element => {
                        var filter = new Filter("vkorg", FilterOperator.Contains, element);
                        oFilter.push(filter);
                        //    salesorg = salesorg+" "+element;

                    });
                    runDateSet.read("/ZI_DefaultSHVH", {
                        filters: oFilter,
                        success: function (oData, oResponse) {
                            var jsArray = [];
                            that.getView().setBusy(false);

                            for (var count = 0; count < oData.results.length; count++) {
                                var dist = that.getDistanceFromLatLonInKm(oData.results[count].zzlatitude, oData.results[count].zzlongitude, that.uLat, that.uLon);
                                dist = Math.round((dist + Number.EPSILON) * 100) / 100;
                                if (dist === null) {
                                    sap.m.MessageToast.show("Fetching location...");
                                    return;
                                }
                                jsArray.push({
                                    "pos": oData.results[count].zzlongitude + ";" + oData.results[count].zzlatitude + ";0",
                                    "lat": oData.results[count].zzlatitude,
                                    "long": oData.results[count].zzlongitude,
                                    "tooltip": oData.results[count].name1 + " " + dist + "miles",
                                    "type": "Error",
                                    "text": oData.results[count].kunnr,
                                    "distance": Number(dist),
                                    "Shipto": oData.results[count].kunnr,
                                    "ShiptoName": oData.results[count].name1,
                                    "stras": oData.results[count].stras,
                                    "Salesman": oData.results[count].sm,
                                    "Scale": "1;1;1",
                                    "selected": true,
                                    "city": oData.results[count].ort01,
                                    "level": oData.results[count].hier1_name,
                                    "altkn": oData.results[count].altkn,
                                    "sorg": oData.results[count].vkorg,
                                    "CreditBLock": oData.results[count].CreditBLock,
                                    "Deleted": oData.results[count].Deleted




                                })

                            }


                            var jsObj = {
                                "Spots": {
                                    "items": jsArray


                                }
                            };

                            that.getView().setModel(new sap.ui.model.json.JSONModel(
                                JSON.parse(JSON.stringify(jsObj))
                            ), "latlongModelOriginal");
                            that.getView().getModel("latlongModel").setSizeLimit("9999");
                            //  that.getLocation();
                            that.setMilesShipto1(3);
                            that.setMilesShipto(3);


                            that.miles = 3;



                        },

                        error: function (oError) {}
                    });

                }
            },









            extractShipto1: function () {
                //  this.getLocation();
                return;

                var that = this;
                if (!this.uLat) {
                    that.getView().setBusy(false);

                    return;
                }
                let runDateSet = this.getOwnerComponent().getModel("ZODATA_FR_SRV");
                var that = this;


                if (that.getView().getModel("latlongModelOriginal") && that.getView().getModel("latlongModelOriginal").getData().Spots.items.length > 0) {

                    that.getView().setBusy(false);

                    var dataobj = that.getView().getModel("latlongModelOriginal").getData().Spots.items;
                    var jsArray = [];

                    for (var count = 0; count < dataobj.length; count++) {
                        // var dist = Number(currentData.Spots.items[count].distance);

                        var dist = that.getDistanceFromLatLonInKm(dataobj[count].lat, dataobj[count].long, that.uLat, that.uLon);
                        dist = Math.round((dist + Number.EPSILON) * 100) / 100;

                        dataobj[count].distance = dist;


                    }


                    for (var count = 0; count < dataobj.length; count++) {

                        var dist = that.getDistanceFromLatLonInKm(dataobj[count].lat, dataobj[count].long, that.uLat, that.uLon);
                        dist = Math.round((dist + Number.EPSILON) * 100) / 100;
                        //    if(dist === null){
                        //        sap.m.MessageToast.show("Fetching location...");
                        //        return;
                        //    }
                        dataobj[count].distance = dist;
                        //"distance":Number(dist),


                        //  jsArray.push(currentData.Spots.items[count]) ;

                    }

                    var jsObj = {
                        "Spots": {
                            "items": dataobj
                        }
                    };

                    that.getView().setModel(new sap.ui.model.json.JSONModel(
                        JSON.parse(JSON.stringify(jsObj))
                    ), "latlongModelOriginal");

                    that.getView().getModel("latlongModel").setSizeLimit("9999");
                    //    that.getLocation();
                    that.setMilesShipto1(3);

                    that.setMilesShipto(3);


                } else {


                    var oFilter = [];
                    oFilter.push(new sap.ui.model.Filter("vkorg", sap.ui.model.FilterOperator.EQ, this.vkorg));
                    runDateSet.read("/ZI_DefaultSHVH", {
                        filters: oFilter,
                        success: function (oData, oResponse) {
                            var jsArray = [];
                            that.getView().setBusy(false);

                            for (var count = 0; count < oData.results.length; count++) {
                                var dist = that.getDistanceFromLatLonInKm(oData.results[count].zzlatitude, oData.results[count].zzlongitude, that.uLat, that.uLon);
                                dist = Math.round((dist + Number.EPSILON) * 100) / 100;
                                if (dist === null) {
                                    sap.m.MessageToast.show("Fetching location...");
                                    return;
                                }
                                jsArray.push({
                                    "pos": oData.results[count].zzlongitude + ";" + oData.results[count].zzlatitude + ";0",
                                    "lat": oData.results[count].zzlatitude,
                                    "long": oData.results[count].zzlongitude,
                                    "tooltip": oData.results[count].name1 + " " + dist + "miles",
                                    "type": "Error",
                                    "text": oData.results[count].kunnr,
                                    "distance": Number(dist),
                                    "Shipto": oData.results[count].kunnr,
                                    "ShiptoName": oData.results[count].name1,
                                    "stras": oData.results[count].stras,
                                    "Salesman": oData.results[count].sm,
                                    "Scale": "1;1;1",
                                    "selected": true,
                                    "city": oData.results[count].ort01,
                                    "level": oData.results[count].hier1_name,
                                    "altkn": oData.results[count].altkn,
                                    "sorg": oData.results[count].vkorg,
                                    "CreditBLock": oData.results[count].CreditBLock,
                                    "Deleted": oData.results[count].Deleted




                                })

                            }


                            var jsObj = {
                                "Spots": {
                                    "items": jsArray


                                }
                            };

                            that.getView().setModel(new sap.ui.model.json.JSONModel(
                                JSON.parse(JSON.stringify(jsObj))
                            ), "latlongModelOriginal");
                            that.getView().getModel("latlongModel").setSizeLimit("9999");
                            //  that.getLocation();
                            //    that.setMilesShipto1(3);
                            that.setMilesShipto(3);


                            that.miles = 3;



                        },

                        error: function (oError) {}
                    });

                }
            },



            getLocation_init: function () {
                var that = this;
                var getPosition = {
                    enableHighAccuracy: true,
                    timeout: 2000,
                    maximumAge: 0
                };

                function success(gotPosition) {
                    that.uLat = gotPosition.coords.latitude;
                    that.uLon = gotPosition.coords.longitude;
                    that.resetuLat = gotPosition.coords.latitude;
                    that.resetuLong = gotPosition.coords.longitude;
                    // that.uLon="-73.9352";
                    // that.uLat="40.730610";

                    // if (that.getView().byId("vbi"))
                    //     that.getView().byId("vbi").setCenterPosition(that.uLon + ";" + that.uLat);
                    //   that.extractShipto();
                    //  that.extractShipTo_UpdateSOrg();

                    // that.getView().setBusy(false);

                };

                function error(err) {
                    console.warn(`ERROR(${err.code}): ${err.message}`);
                    that.getView().setBusy(false);
                    that.tryLocationAnother();
                    //  if(!that.uLat)
                    //  sap.m.MessageToast.show("Trying to fetch current location");
                };

                navigator.geolocation.getCurrentPosition(success, error, getPosition);

            },

            getLocation: function () {
                var that = this;
                var getPosition = {
                    enableHighAccuracy: true,
                    timeout: 2000,
                    maximumAge: 0
                };

                function success(gotPosition) {
                    that.uLat = gotPosition.coords.latitude;
                    that.uLon = gotPosition.coords.longitude;
                    that.resetuLat = gotPosition.coords.latitude;
                    that.resetuLong = gotPosition.coords.longitude;
                    // that.uLon="-73.9352";
                    // that.uLat="40.730610";

                    if (that.getView().byId("vbi"))
                        that.getView().byId("vbi").setCenterPosition(that.uLon + ";" + that.uLat);
                    that.extractShipto();
                    that.getView().setBusy(false);

                    that.getView().byId("smartTable_visitF4").rebindTable();
                    that.getView().byId("smartTable_visitF4_draft").rebindTable();
                    that.getView().byId("smartTable_visitF4_prospect").rebindTable();
                    that.getView().byId("smartTable_visitF4_prospect_draft").rebindTable();
                };

                function error(err) {
                    console.warn(`ERROR(${err.code}): ${err.message}`);
                    that.getView().setBusy(false);

                    that.tryLocationAnother();
                    //  if(!that.uLat)
                    //  sap.m.MessageToast.show("Trying to fetch current location");
                };

                navigator.geolocation.getCurrentPosition(success, error, getPosition);

            },
            tryLocationAnother: function (oEvent) {

                var that = this;

                fetch('https://ip-api.com/json/')
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        console.log(data);
                        // You can access specific data points like:
                        console.log("City:", data.city);
                        console.log("Country:", data.country_name);
                        console.log("Latitude:", data.latitude);
                        console.log("Longitude:", data.longitude);

                        that.uLat = data.latitude;
                        that.uLon = data.longitude;
                        that.resetuLat = data.latitude;
                        that.resetuLong = data.longitude;
                    })
                    .catch(function (error) {
                        console.error('Error fetching IP geolocation:', error);

                        var that = this;

                        if (navigator.geolocation) {
                            // Calls getCurrentPosition with success and error callbacks, plus options
                            navigator.geolocation.getCurrentPosition(showPosition, showError);
                        } else {
                            document.getElementById("output").innerHTML = "Geolocation is not supported by this browser.";
                        }

                        function showPosition(position) {


                            that.uLat = position.coords.latitude;
                            that.uLon = position.coords.longitude;
                            that.resetuLat = position.coords.latitude;
                            that.resetuLong = position.coords.longitude;

                        }

                        function showError(position) {}

                    });
            },

            getLocation_alltime: function () {
                var that = this;
                var getPosition = {
                    enableHighAccuracy: true,
                    timeout: 2000,
                    maximumAge: 0
                };

                function success(gotPosition) {
                    that.uLat = gotPosition.coords.latitude;
                    that.uLon = gotPosition.coords.longitude;
                    that.resetuLat = gotPosition.coords.latitude;
                    that.resetuLong = gotPosition.coords.longitude;
                    // that.uLon="-73.9352";
                    // that.uLat="40.730610";

                    if (that.getView().byId("vbi"))
                        that.getView().byId("vbi").setCenterPosition(that.uLon + ";" + that.uLat);
                    that.extractShipto1();
                    that.getView().setBusy(false);

                };

                function error(err) {
                    console.warn(`ERROR(${err.code}): ${err.message}`);
                    that.getView().setBusy(false);
                    that.tryLocationAnother();
                    //  if(!that.uLat)
                    //  sap.m.MessageToast.show("Not able to get current location");
                };

                navigator.geolocation.getCurrentPosition(success, error, getPosition);

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

            setMilesShipto: function (miles) {
                var that = this;
                //   that.getLocation();

                var jsArray = [];
                var currentData = that.getView().getModel("latlongModelOriginal").getData();
                var city, cuhier, prev;
                for (var count = 0; count < currentData.Spots.items.length; count++) {

                    // if(Number(that.shipto) === Number(currentData.Spots.items[count].Shipto)){
                    //     city = currentData.Spots.items[count].city;
                    //     cuhier = currentData.Spots.items[count].level;
                    //     prev = currentData.Spots.items[count].altkn;
                    //     continue;
                    // }
                    var dist = Number(currentData.Spots.items[count].distance);
                    if (dist > miles) {
                        continue;
                    }

                    currentData.Spots.items[count].selected = true;
                    currentData.Spots.items[count].type = "Error";
                    jsArray.push(currentData.Spots.items[count]);

                }
                this.getView().getModel("userValues").setProperty("/countShipTo", jsArray.length);


                jsArray = that.insertAtIndex(jsArray, 0, {
                    "pos": that.uLon + ";" + that.uLat + ";0",
                    "tooltip": "My Location",
                    "type": "Success",
                    "text": "My Location",
                    "Shipto": "My Location",
                    "ShiptoName": "My Location",
                    "stras": "",
                    "Salesman": "",
                    "distance": 0,
                    "scale": "2;2;2",
                    "selected": false,
                    "city": "",
                    "level": "",
                    "altkn": "",
                    "sorg": "",
                    "CreditBLock": false,
                    "Deleted": false



                });
                var jsObj = {
                    "Spots": {
                        "items": jsArray


                    }
                };


                //  that.getView().setModel(new sap.ui.model.json.JSONModel(    
                //      jsObj
                //  ), "latlongModel");
                that.getView().getModel("latlongModel").setData(jsObj);
                that.getView().getModel("latlongModel").setSizeLimit("9999");

                  that.getView().getOwnerComponent("latlongModel").setData(jsObj);
                that.getView().getOwnerComponent("latlongModel").setSizeLimit("9999");









                //    this.extractShiptoRollups();


            },

            setMilesShipto1: function (miles) {
                var that = this;




                this.getView().getModel("userValues").setProperty("/milesSet", miles);
                this.rebindAllTables();
                return;

                if (that.getView().getModel("latlongModelOriginal") && that.getView().getModel("latlongModelOriginal").getData().Spots.items.length > 0) {

                    var dataobj = that.getView().getModel("latlongModelOriginal").getData().Spots.items;
                    var jsArray = [];

                    for (var count = 0; count < dataobj.length; count++) {
                        // var dist = Number(currentData.Spots.items[count].distance);

                        var dist = that.getDistanceFromLatLonInKm(dataobj[count].lat, dataobj[count].long, that.uLat, that.uLon);
                        dist = Math.round((dist + Number.EPSILON) * 100) / 100;

                        dataobj[count].distance = dist;


                    }


                    for (var count = 0; count < dataobj.length; count++) {

                        var dist = that.getDistanceFromLatLonInKm(dataobj[count].lat, dataobj[count].long, that.uLat, that.uLon);
                        dist = Math.round((dist + Number.EPSILON) * 100) / 100;
                        //    if(dist === null){
                        //        sap.m.MessageToast.show("Fetching location...");
                        //        return;
                        //    }
                        dataobj[count].distance = dist;
                        //"distance":Number(dist),


                        //  jsArray.push(currentData.Spots.items[count]) ;

                    }

                    var jsObj = {
                        "Spots": {
                            "items": dataobj
                        }
                    };

                    that.getView().setModel(new sap.ui.model.json.JSONModel(
                        JSON.parse(JSON.stringify(jsObj))
                    ), "latlongModelOriginal");

                    that.getView().getModel("latlongModel").setSizeLimit("9999");


                }



                //////



                var jsArray = [];
                var currentData = that.getView().getModel("latlongModelOriginal").getData();
                var city, cuhier, prev;
                for (var count = 0; count < currentData.Spots.items.length; count++) {

                    // if(Number(that.shipto) === Number(currentData.Spots.items[count].Shipto)){
                    //     city = currentData.Spots.items[count].city;
                    //     cuhier = currentData.Spots.items[count].level;
                    //     prev = currentData.Spots.items[count].altkn;
                    //     continue;
                    // }
                    var dist = Number(currentData.Spots.items[count].distance);
                    if (dist > miles) {
                        continue;
                    }

                    currentData.Spots.items[count].selected = true;
                    currentData.Spots.items[count].type = "Error";
                    jsArray.push(currentData.Spots.items[count]);

                }


                if (this.getView().getModel("userValues").getProperty("/location")) {
                    that.filterTableNearByCustomers(jsArray);
                }

            },
            filterTableNearByCustomers: function (customers) {

                var aFilters = []

                if (customers.length > 100) {

                    sap.m.MessageToast.show("Customers are more than 100. Please select lower mile range");
                    return;
                }

                customers.forEach(element => {

                    var filter = new Filter("Customer", FilterOperator.Contains, element.Shipto);
                    aFilters.push(filter);

                });
                var filtersalesorg = new Filter("Vkorg", FilterOperator.Contains, this.getView().getModel("userValues").getProperty("/salesorg"));
                //  aFilters.push(filtersalesorg);


                // this.getView().setModel(new sap.ui.model.json.JSONModel({
                //     "SS" : salesPerson }
                // ), "SSModel");

                var farrayobj_customers = new Filter({
                    filters: aFilters,
                    and: false,
                });



                var farrayobj = new Filter({
                    filters: [farrayobj_customers, filtersalesorg],
                    and: true,
                });
                if (this.getView().getModel("SSModel") && this.getView().getModel("SSModel").getProperty("/SS")) {
                    var salesPerson = this.getView().getModel("SSModel").getProperty("/SS");
                    //     this.getView().setBusy(true);
                    var filter = new Filter("SalesSupport", FilterOperator.Contains, salesPerson);
                    aFilters.push(filter);
                    var filtersalesorg = new Filter("Vkorg", FilterOperator.Contains, this.getView().getModel("userValues").getProperty("/salesorg"));

                    var farrayobj1 = new Filter({
                        filters: [farrayobj, filter, filtersalesorg],
                        and: true,
                    });
                    var filter_status1 = new Filter({
                        filters: [new Filter("status", FilterOperator.NE, '1'), new Filter("CustomerAccountGroup", FilterOperator.NE, 'ZPR')],
                        and: true,
                    });

                    var oList = this.byId("idList");
                    var oBinding = oList.getBinding("items");
                    oBinding.filter([farrayobj1, filter_status1], "Application");
                    this.getView().setBusy(false);

                    var filter_status = new Filter("status", FilterOperator.EQ, '1');

                    var farrayobj1 = new Filter({
                        filters: [farrayobj, filter, filter_status],
                        and: true,
                    });
                    var oList = this.byId("idList_draft");
                    var oBinding = oList.getBinding("items");
                    oBinding.filter(farrayobj1, "Application");
                    this.getView().setBusy(false);





                    // Filter for prospects
                    var filter_status = new Filter("CustomerAccountGroup", FilterOperator.EQ, 'ZPR');
                    var farrayobj1 = new Filter({
                        filters: [farrayobj, filter, filter_status],
                        and: true,
                    });





                    var oList = this.byId("idList_prospect");
                    var oBinding = oList.getBinding("items");
                    oBinding.filter(farrayobj1, "Application");
                    this.getView().setBusy(false);


                    return;
                }



                // update list binding
                var oList = this.byId("idList");
                var oBinding = oList.getBinding("items");
                //    this.getView().setBusy(true);
                var filter_status1 = new Filter({
                    filters: [new Filter("status", FilterOperator.NE, '1'), new Filter("CustomerAccountGroup", FilterOperator.NE, 'ZPR')],
                    and: true,
                });
                oBinding.filter([farrayobj, filter_status1], "Application");
                this.getView().setBusy(false);


                var filter_status = new Filter("status", FilterOperator.EQ, '1');
                var filtersalesorg = new Filter("Vkorg", FilterOperator.Contains, this.getView().getModel("userValues").getProperty("/salesorg"));


                var farrayobj1 = new Filter({
                    filters: [farrayobj, filter_status, filtersalesorg],
                    and: true,
                });
                var oList = this.byId("idList_draft");
                var oBinding = oList.getBinding("items");
                oBinding.filter(farrayobj1, "Application");
                this.getView().setBusy(false);



                // Filter for prospects
                var filter_status = new Filter("CustomerAccountGroup", FilterOperator.EQ, 'ZPR');

                var farrayobj1 = new Filter({
                    filters: [farrayobj, filter_status, filtersalesorg],
                    and: true,
                });





                var oList = this.byId("idList_prospect");
                var oBinding = oList.getBinding("items");
                oBinding.filter(farrayobj1, "Application");
                this.getView().setBusy(false);




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
            onChangeDistanceMainPage: function (oEvent) {
                var miles1 = oEvent.mParameters.value;
                this.miles1 = miles1;
                this.getView().getModel("userValues").setProperty("/milesSet", miles1);
                this.setMilesShipto1(miles1);

            },

            closeDialog: function (oEvent) {
                oEvent.getSource().getParent().getParent().close();

            },
            shareMapDirection: function (oEvent) {

                var objectVar = oEvent.getSource().getBindingContext().getObject();
                var orgPosition = objectVar.zzlatitude + "," + objectVar.zzlongitude;

                this.mapsSelector(objectVar, orgPosition);

            },

            shareNewVisit: function (oEvent) {
                var objectVar = oEvent.getSource().getBindingContext().getObject();

                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("newvisit", {
                    visitid: 'NEW',
                    shipto: objectVar.kunnr,
                    vkorg: objectVar.vkorg
                });

            },

            onSearchCustomersMapCenter: function (oEvent) {

                //  debugger;
                var oMap = this.getView().byId("vbi");

                var centerLoc = oMap.getCenterPosition();


                this.uLat = centerLoc.split(";")[1];
                this.uLon = centerLoc.split(";")[0];
                this.getView().byId("smartTable_custF4_map").rebindTable();

            },
            onResetMap: function (oEvent) {

                this.uLat = this.resetuLat + "";
                this.uLon = this.resetuLong + "";
                this.getView().byId("smartTable_custF4_map").rebindTable();
                var oMap = this.getView().byId("vbi");

                oMap.setCenterPosition(this.resetuLong + ";" + this.resetuLat);

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
                                    this.openMapNewVisit(obj);
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

            openSalesDashboardFromTable: function(oEvent){

                var objectVar = oEvent.getSource().getBindingContext().getObject();

             
                objectVar.Shipto = objectVar.kunnr;
                objectVar.sorg = objectVar.vkorg;
                 objectVar.CompanyCode = objectVar.bukrs;
                

                this.openSalesDashboard(objectVar);
            },

            openSalesDashboard: function (obj) {
                //      debugger;
                var shipto = obj.Shipto;
                var vkorg = obj.sorg;

                // var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); // get a handle on the global XAppNav service


                // var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternalAsync({
                //     target: {
                //         semanticObject: "Sales",
                //         action: "ZSDCUSTDASH_OVP"
                //     },
                //     params: {

                //         "Customer": shipto,
                //         "SalesOrganization": vkorg,
                //         "CompanyCode": obj.CompanyCode


                //     }
                // })) || ""; // generate the Hash to display a Supplier
                // oCrossAppNavigator.toExternal({
                //     target: {
                //         shellHash: hash
                //     }
                // }); // navigate to Supplier application



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

            handleEmailPress: function (oEvent) {
                this.byId("myPopover").close();
                MessageToast.show("E-Mail has been sent");
            },

            onClickSpot: function (oEvent) {
                var obj = oEvent.getSource().getBindingContext("latlongModel").getObject();
                this.mapsSelector(obj);


            },





            filterGlobally: function (oEvent) {

                var sQuery = this.getView().byId("searchFilterGlobal").getValue();
                var that = this;
                var oBinding = this.byId("idProductsTable").getBinding("items");
                this.byId("idProductsTable").getBinding("items").filter();
                this._oGlobalFilter = null;
                if (sQuery) {
                    //     this._oGlobalFilter = new sap.ui.model.Filter([
                    //         //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
                    //         new sap.ui.model.Filter("Shipto", sap.ui.model.FilterOperator.Contains, sQuery),
                    //         new sap.ui.model.Filter("ShiptoName", sap.ui.model.FilterOperator.Contains, sQuery),
                    //         new sap.ui.model.Filter("stras", sap.ui.model.FilterOperator.Contains, sQuery),
                    //         new sap.ui.model.Filter("Salesman", sap.ui.model.FilterOperator.Contains, sQuery),
                    //         new sap.ui.model.Filter("city", sap.ui.model.FilterOperator.Contains, sQuery),
                    //         new sap.ui.model.Filter("level", sap.ui.model.FilterOperator.Contains, sQuery)
                    //     ], false);
                    //     this._oGlobalFilter = new sap.ui.model.Filter([this._oGlobalFilter ,
                    //         new sap.ui.model.Filter("Deleted", sap.ui.model.FilterOperator.NE, true),
                    //         new sap.ui.model.Filter("CreditBLock", sap.ui.model.FilterOperator.NE, true)

                    //     ], true);




                    //     this.byId("idProductsTable").getBinding("items").filter(this._oGlobalFilter, "Application");

                    //     if(!this.getView().getModel("searchModel").getProperty("/deleted") && !this.getView().getModel("searchModel").getProperty("/CreditBLock")){
                    //   //      that.getView().getModel("userValues").setProperty("/userValues",  that.byId("idProductsTable").getItems())
                    //         setTimeout(() => {
                    //             that.getView().getModel("userValues").setProperty("/countShipTo",  that.byId("idProductsTable").getItems().length)

                    //           }, 200);

                    //         return;
                    //     }
                } else {

                    //   this.byId("idProductsTable").getBinding("items").filter(null, "Application");
                }

                var oFilterBlocks = [],
                    flagDeleted = false,
                    flagCreditBloc = false;

                var salesOrgList = that.getOwnerComponent().getModel("salesOrgCentralModel").getData();
                var salesOrgFilters = [];

                salesOrgList.forEach(element => {
                    salesOrgFilters.push(new sap.ui.model.Filter("vkorg", sap.ui.model.FilterOperator.EQ, element));

                });
                var oFilterBlocks = []

                if (this.getView().getModel("searchModel").getProperty("/deleted") && this.getView().getModel("searchModel").getProperty("/CreditBLock")) {

                    //     oFilterBlocks.push(new sap.ui.model.Filter("Deleted", sap.ui.model.FilterOperator.EQ, true));
                    //     oFilterBlocks.push(new sap.ui.model.Filter("CreditBLock", sap.ui.model.FilterOperator.EQ, true));
                    //     var filterBlockArray =  new sap.ui.model.Filter(oFilterBlocks, false);

                    //     if( this._oGlobalFilter !== null){
                    //     this._oGlobalFilter = new sap.ui.model.Filter([
                    //       //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
                    //       this._oGlobalFilter, filterBlockArray



                    //     ], false);
                    // }else{
                    //     this._oGlobalFilter = new sap.ui.model.Filter([
                    //         //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
                    //         filterBlockArray



                    //       ], false);
                    // }
                    //    // var finalFilters = [this._oGlobalFilter];

                    //   //  this._oGlobalFilter1 = new sap.ui.model.Filter(finalFilters, true);
                    //     oBinding.filter([this._oGlobalFilter]);


                    this._oGlobalFilter = new sap.ui.model.Filter([
                        //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
                        new sap.ui.model.Filter("Shipto", sap.ui.model.FilterOperator.Contains, sQuery),
                        new sap.ui.model.Filter("ShiptoName", sap.ui.model.FilterOperator.Contains, sQuery),
                        new sap.ui.model.Filter("stras", sap.ui.model.FilterOperator.Contains, sQuery),
                        new sap.ui.model.Filter("Salesman", sap.ui.model.FilterOperator.Contains, sQuery),
                        new sap.ui.model.Filter("city", sap.ui.model.FilterOperator.Contains, sQuery),
                        new sap.ui.model.Filter("level", sap.ui.model.FilterOperator.Contains, sQuery),
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





                    this.byId("idProductsTable").getBinding("items").filter(this._oGlobalFilter, "Application");

                }




                if (!this.getView().getModel("searchModel").getProperty("/deleted") && this.getView().getModel("searchModel").getProperty("/CreditBLock")) {

                    //   //  oFilterBlocks.push(new sap.ui.model.Filter("CreditBLock", sap.ui.model.FilterOperator.EQ, true));
                    //   //  var filterBlockArray =  new sap.ui.model.Filter(oFilterBlocks, true);

                    //   if(this._oGlobalFilter !== null){
                    //     this._oGlobalFilter = new sap.ui.model.Filter([
                    //       //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
                    //       this._oGlobalFilter, new sap.ui.model.Filter("CreditBLock", sap.ui.model.FilterOperator.EQ, true), , new sap.ui.model.Filter("CreditBLock", sap.ui.model.FilterOperator.EQ, false)



                    //     ], false);
                    // }else{
                    //     this._oGlobalFilter = new sap.ui.model.Filter([
                    //         new sap.ui.model.Filter("CreditBLock", sap.ui.model.FilterOperator.EQ, true)



                    //       ], false);
                    // }
                    //   //  var finalFilters = [this._oGlobalFilter];

                    //   //  this._oGlobalFilter1 = new sap.ui.model.Filter(finalFilters, true);
                    //     oBinding.filter([this._oGlobalFilter]);


                    this._oGlobalFilter = new sap.ui.model.Filter([
                        //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
                        new sap.ui.model.Filter("Shipto", sap.ui.model.FilterOperator.Contains, sQuery),
                        new sap.ui.model.Filter("ShiptoName", sap.ui.model.FilterOperator.Contains, sQuery),
                        new sap.ui.model.Filter("stras", sap.ui.model.FilterOperator.Contains, sQuery),
                        new sap.ui.model.Filter("Salesman", sap.ui.model.FilterOperator.Contains, sQuery),
                        new sap.ui.model.Filter("city", sap.ui.model.FilterOperator.Contains, sQuery),
                        new sap.ui.model.Filter("level", sap.ui.model.FilterOperator.Contains, sQuery),
                        new sap.ui.model.Filter("CreditBLock", sap.ui.model.FilterOperator.EQ, true),

                        new sap.ui.model.Filter("CreditBLock", sap.ui.model.FilterOperator.EQ, false)
                    ], false);

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

                            new sap.ui.model.Filter("CreditBLock", sap.ui.model.FilterOperator.EQ, true)
                        ], true);
                    }





                    this.byId("idProductsTable").getBinding("items").filter(this._oGlobalFilter, "Application");

                }




                if (this.getView().getModel("searchModel").getProperty("/deleted") && !this.getView().getModel("searchModel").getProperty("/CreditBLock")) {

                    //    // oFilterBlocks.push(new sap.ui.model.Filter("Deleted", sap.ui.model.FilterOperator.EQ, true));
                    //    // var filterBlockArray =  new sap.ui.model.Filter(oFilterBlocks, true);

                    //    if(this._oGlobalFilter !== null){
                    //     this._oGlobalFilter = new sap.ui.model.Filter([
                    //       //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
                    //       this._oGlobalFilter, new sap.ui.model.Filter("Deleted", sap.ui.model.FilterOperator.EQ, false), new sap.ui.model.Filter("Deleted", sap.ui.model.FilterOperator.EQ, true)




                    //     ], false);
                    // }else{
                    //     this._oGlobalFilter = new sap.ui.model.Filter([
                    //          new sap.ui.model.Filter("Deleted", sap.ui.model.FilterOperator.EQ, false)




                    //       ], false);
                    // }
                    // //    var finalFilters = [this._oGlobalFilter];

                    //   //  this._oGlobalFilter1 = new sap.ui.model.Filter(finalFilters, true);
                    //     oBinding.filter([this._oGlobalFilter]);



                    this._oGlobalFilter = new sap.ui.model.Filter([
                        //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
                        new sap.ui.model.Filter("Shipto", sap.ui.model.FilterOperator.Contains, sQuery),
                        new sap.ui.model.Filter("ShiptoName", sap.ui.model.FilterOperator.Contains, sQuery),
                        new sap.ui.model.Filter("stras", sap.ui.model.FilterOperator.Contains, sQuery),
                        new sap.ui.model.Filter("Salesman", sap.ui.model.FilterOperator.Contains, sQuery),
                        new sap.ui.model.Filter("city", sap.ui.model.FilterOperator.Contains, sQuery),
                        new sap.ui.model.Filter("level", sap.ui.model.FilterOperator.Contains, sQuery),
                        new sap.ui.model.Filter("Deleted", sap.ui.model.FilterOperator.EQ, true),

                        new sap.ui.model.Filter("Deleted", sap.ui.model.FilterOperator.EQ, false),
                    ], false);

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

                            new sap.ui.model.Filter("Deleted", sap.ui.model.FilterOperator.EQ, true)
                        ], true);
                    }





                    this.byId("idProductsTable").getBinding("items").filter(this._oGlobalFilter, "Application");


                }


                if (!this.getView().getModel("searchModel").getProperty("/deleted") && !this.getView().getModel("searchModel").getProperty("/CreditBLock")) {


                    // this._oGlobalFilter = new sap.ui.model.Filter([
                    //   //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
                    //   this._oGlobalFilter, new sap.ui.model.Filter("Deleted", sap.ui.model.FilterOperator.EQ, '')




                    // ], false);
                    //   var finalFilters = [this._oGlobalFilter];

                    // this._oGlobalFilter1 = new sap.ui.model.Filter(finalFilters, true);
                    //  oBinding.filter([this._oGlobalFilter1]);



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



                        this.byId("idProductsTable").getBinding("items").filter(this._oGlobalFilter, "Application");

                    } else {
                        this._oGlobalFilter = new sap.ui.model.Filter([
                            //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);


                            new sap.ui.model.Filter("Deleted", sap.ui.model.FilterOperator.NE, true),
                            new sap.ui.model.Filter("CreditBLock", sap.ui.model.FilterOperator.NE, true)

                        ], true);



                        this.byId("idProductsTable").getBinding("items").filter(this._oGlobalFilter, "Application");
                    }

                }
                setTimeout(() => {
                    that.getView().getModel("userValues").setProperty("/countShipTo", that.byId("idProductsTable").getItems().length)

                }, 200);


            },

            setFullScreen: function (oEvent) {
                var mapControl = this.getView().byId("mapContainerID");
                mapControl.setFullScreen(true);
            },
            onSearchVisit: function (oEvent) {
                // add filter for search
                var aFilters = [];
                var sQuery;
                if (oEvent) {
                    sQuery = oEvent.getSource().getValue();
                } else {
                    sQuery = this.getView().byId("searchField").getValue();

                }
                if (sQuery && sQuery.length > 0) {
                    var filter = new Filter("Visitid", FilterOperator.Contains, sQuery);
                    aFilters.push(filter);

                    var filter = new Filter("Customer", FilterOperator.Contains, sQuery);
                    aFilters.push(filter);

                    var filter = new Filter("Visittype", FilterOperator.Contains, sQuery);
                    aFilters.push(filter);

                    var filter = new Filter("VisitDescription", FilterOperator.Contains, sQuery);
                    aFilters.push(filter);

                    var filter = new Filter("Ernam", FilterOperator.Contains, sQuery);
                    aFilters.push(filter);

                    var filter = new Filter("Aenam", FilterOperator.Contains, sQuery);
                    aFilters.push(filter);

                    var filter = new Filter("StreetName", FilterOperator.Contains, sQuery);
                    aFilters.push(filter);

                    var filter = new Filter("CityName", FilterOperator.Contains, sQuery);
                    aFilters.push(filter);

                    var filter = new Filter("PostalCode", FilterOperator.Contains, sQuery);
                    aFilters.push(filter);


                    var filter = new Filter("CustomerPreviousAccount", FilterOperator.Contains, sQuery);
                    aFilters.push(filter);


                    var filter = new Filter("SalesLead", FilterOperator.Contains, sQuery);
                    aFilters.push(filter);

                    var filter = new Filter("SalesLeadName", FilterOperator.Contains, sQuery);
                    aFilters.push(filter);

                    var filter = new Filter("SaleSupportName", FilterOperator.Contains, sQuery);
                    aFilters.push(filter);

                    var filter = new Filter("CHL1", FilterOperator.Contains, sQuery);
                    aFilters.push(filter);


                    var filter = new Filter("CHL1Name", FilterOperator.Contains, sQuery);
                    aFilters.push(filter);


                    var filter = new Filter("CustomerFullName", FilterOperator.Contains, sQuery);
                    aFilters.push(filter);

                }
                var filtersalesorg = new Filter("Vkorg", FilterOperator.Contains, this.getView().getModel("userValues").getProperty("/salesorg"));
                //  aFilters.push(filtersalesorg);
                var farrayobj = new Filter({
                    filters: aFilters,
                    and: false,
                });


                if (this.getView().getModel("SSModel") && this.getView().getModel("SSModel").getProperty("/SS")) {
                    var salesPerson = this.getView().getModel("SSModel").getProperty("/SS");
                    // this.getView().setBusy(true);
                    var filter_ss = new Filter("SalesSupport", FilterOperator.Contains, salesPerson);
                    var farrayobj1 = new Filter({
                        filters: [farrayobj, filter_ss, filtersalesorg],
                        and: true,
                    });

                    if (sQuery.trim() === '') {
                        var filtersalesorg = new Filter("Vkorg", FilterOperator.Contains, this.getView().getModel("userValues").getProperty("/salesorg"));

                        farrayobj1 = new Filter({
                            filters: [filter_ss, filtersalesorg],
                            and: true,
                        });
                    }
                    var filter_status1 = new Filter({
                        filters: [new Filter("status", FilterOperator.NE, '1'), new Filter("CustomerAccountGroup", FilterOperator.NE, 'ZPR')],
                        and: true,
                    });

                    var oList = this.byId("idList");
                    var oBinding = oList.getBinding("items");
                    oBinding.filter([farrayobj1, filter_status1], "Application");
                    this.getView().setBusy(false);


                    var filter_status = new Filter("status", FilterOperator.EQ, '1');
                    var filtersalesorg = new Filter("Vkorg", FilterOperator.Contains, this.getView().getModel("userValues").getProperty("/salesorg"));

                    var farrayobj1 = new Filter({
                        filters: [farrayobj, filter_ss, filter_status, filtersalesorg],
                        and: true,
                    });

                    if (sQuery.trim() === '') {
                        var filtersalesorg = new Filter("Vkorg", FilterOperator.Contains, this.getView().getModel("userValues").getProperty("/salesorg"));
                        var farrayobj1 = new Filter({
                            filters: [filter_ss, filter_status, filtersalesorg],
                            and: true,
                        });
                    }
                    var oList = this.byId("idList_draft");
                    var oBinding = oList.getBinding("items");
                    oBinding.filter(farrayobj1, "Application");
                    this.getView().setBusy(false);





                    // Filter for prospects
                    var filter_status = new Filter("CustomerAccountGroup", FilterOperator.EQ, 'ZPR');

                    var farrayobj1 = new Filter({
                        filters: [farrayobj, filter_ss, filter_status, filtersalesorg],
                        and: true,
                    });

                    if (sQuery.trim() === '') {
                        var filtersalesorg = new Filter("Vkorg", FilterOperator.Contains, this.getView().getModel("userValues").getProperty("/salesorg"));
                        var farrayobj1 = new Filter({
                            filters: [filter_ss, filter_status, filtersalesorg],
                            and: true,
                        });
                    }



                    var oList = this.byId("idList_prospect");
                    var oBinding = oList.getBinding("items");
                    oBinding.filter(farrayobj1, "Application");
                    this.getView().setBusy(false);


                    return;
                }



                // update list binding
                var filter_status1 = new Filter({
                    filters: [new Filter("status", FilterOperator.NE, '1'), new Filter("CustomerAccountGroup", FilterOperator.NE, 'ZPR')],
                    and: true,
                });

                var oList = this.byId("idList");
                var oBinding = oList.getBinding("items");
                if (sQuery.trim() === '') {
                    oBinding.filter([filter_status1, filtersalesorg], "Application");

                } else {
                    oBinding.filter([farrayobj, filter_status1, filtersalesorg], "Application");

                }


                var filter_status = new Filter("status", FilterOperator.EQ, '1');

                var farrayobj1 = new Filter({
                    filters: [farrayobj, filter_status, filtersalesorg],
                    and: true,
                });

                if (sQuery.trim() === '') {
                    var farrayobj1 = new Filter({
                        filters: [filter_status, filtersalesorg],
                        and: true,
                    });
                }
                var oList = this.byId("idList_draft");
                var oBinding = oList.getBinding("items");
                oBinding.filter(farrayobj1, "Application");
                this.getView().setBusy(false);




                // Filter for prospects
                var filter_status = new Filter("CustomerAccountGroup", FilterOperator.EQ, 'ZPR');

                var farrayobj1 = new Filter({
                    filters: [farrayobj, filter_status, filtersalesorg],
                    and: true,
                });

                if (sQuery.trim() === '') {
                    var farrayobj1 = new Filter({
                        filters: [filter_status, filtersalesorg],
                        and: true,
                    });
                }



                var oList = this.byId("idList_prospect");
                var oBinding = oList.getBinding("items");
                oBinding.filter(farrayobj1, "Application");
                this.getView().setBusy(false);


            },
            onUpdateFinishedList: function (oEvent) {
                var tableCount = oEvent.getParameters().total;
                // this.getView().setModel(new sap.ui.model.json.JSONModel(
                //     { "countList": "(" + tableCount + ")" }
                // ), "countModel");
                //     this.getView().getModel("countModel").setProperty("/countList","("+tableCount+")");

            },
            onUpdateFinishedList_draft: function (oEvent) {
                var tableCount = oEvent.getParameters().total;
                // this.getView().setModel(new sap.ui.model.json.JSONModel(
                //     { "countList_draft": "(" + tableCount + ")" }
                // ), "countModel");

                var count = 0;

                var items = oEvent.getSource().getItems();
                items.forEach(element => {

                    if (element.getVisible() === true) {
                        count++;
                    }
                });

                //    this.getView().getModel("countModel").setProperty("/countList_draft","("+count+")");
            },

            onUpdateFinishedList_prospect: function (oEvent) {
                var tableCount = oEvent.getParameters().total;
                // this.getView().setModel(new sap.ui.model.json.JSONModel(
                //     { "countList_draft": "(" + tableCount + ")" }
                // ), "countModel");
                //    this.getView().getModel("countModel").setProperty("/countList_prospect","("+tableCount+")");
            },

            openMapNewVisit: function (obj) {


                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("newvisit", {
                    visitid: 'NEW',
                    shipto: obj.Shipto,
                    vkorg: obj.sorg
                });
                this.oEscapePreventDialog.close()
            },
            filterVisitByCustomer: function (Shipto) {



                var aFilters = []
                var filter = new Filter("Customer", FilterOperator.Contains, Shipto);
                aFilters.push(filter);


                var filtersalesorg = new Filter("Vkorg", FilterOperator.Contains, this.getView().getModel("userValues").getProperty("/salesorg"));
                aFilters.push(filtersalesorg);

                if (this.getView().getModel("SSModel") && this.getView().getModel("SSModel").getProperty("/SS")) {
                    var filter = new Filter("SalesSupport", FilterOperator.Contains, salesPerson);
                    aFilters.push(filter);
                }

                var farrayobj = new Filter({
                    filters: aFilters,
                    and: false,
                });

                // update list binding
                var oList = this.byId("idList");
                var oBinding = oList.getBinding("items");
                var filter_status1 = new Filter({
                    filters: [new Filter("status", FilterOperator.NE, '1'), new Filter("CustomerAccountGroup", FilterOperator.NE, 'ZPR')],
                    and: true,
                });
                oBinding.filter([farrayobj, filter_status1], "Application");
                this.pDialog.close();


                var filter_status = new Filter("status", FilterOperator.EQ, '1');

                var farrayobj1 = new Filter({
                    filters: [farrayobj, filter, filter_status],
                    and: true,
                });
                var oList = this.byId("idList_draft");
                var oBinding = oList.getBinding("items");
                oBinding.filter(farrayobj1, "Application");
                this.getView().setBusy(false);


                // Filter for prospects
                var filter_status = new Filter("status", FilterOperator.EQ, '1');

                var farrayobj1 = new Filter({
                    filters: [farrayobj, filter, filter_status],
                    and: true,
                });
                var oList = this.byId("idList_prospect");
                var oBinding = oList.getBinding("items");
                oBinding.filter(farrayobj1, "Application");
                this.getView().setBusy(false);
            },
            onChangeSalesOrg: function (oEvent) {
                var source = oEvent.getSource();
                var that = this;
                //     this.getView().getModel( "userValues").setProperty("/salesorg","");

                var oButton = oEvent.getSource(),
                    oView = this.getView();

                // create popover
                if (!this._pPopover) {
                    this._pPopover = sap.ui.core.Fragment.load({
                        id: oView.getId(),
                        name: "customer.porky.zfieldrepvisit.view.salesorg",
                        controller: this
                    }).then(function (oPopover) {
                        oView.addDependent(oPopover);
                        oPopover.setModel(that.getView().getModel("userValues"));
                        //   oPopover.getContent()[0].getItems()[1].setValue(oView.getModel("userValues").getProperty("/salesorg"));
                        //    oPopover.getContent()[0].getItems()[1].getItems()[0].setValue(oView.getModel("userValues").getProperty("/salesorg"));
                        //    oPopover.getContent()[0].getItems()[1].getItems()[0].setModel(that.getOwnerComponent().getModel("ZI_DEFAULTSHVH_CDS"))

                        return oPopover;
                    });
                }
                this._pPopover.then(function (oPopover) {
                    // oPopover.openBy(oButton);
                    oPopover.open();
                    that.getView().addDependent(oPopover);
                    //   that.getView().byId("idSalesOrgSelec").addItem(new sap.ui.core.Item({key:'000',text:'Please Select Sales Org'}));
                    //   that.getView().byId("idSalesOrgSelec").setSelectedKey("000");

                    //     oPopover.getContent()[0].getItems()[1].setValue(that.vkorg)
                    //    oPopover.getContent()[0].getItems()[1].getItems()[0].setModel(that.getOwnerComponent().getModel("ZI_DEFAULTSHVH_CDS"));
                    //   oPopover.getContent()[0].getItems()[1].getItems()[0].setValue(that.vkorg);

                });


            },
            filterListBySalesOrg: function (salesorg) {


                this.getView().byId("smartTable_visitF4").rebindTable();
                this.getView().byId("smartTable_visitF4_draft").rebindTable();
                this.getView().byId("smartTable_visitF4_prospect").rebindTable();
                this.getView().byId("smartTable_visitF4_prospect_draft").rebindTable();

                return;
                var aFilters = [];
                var salesOrgList = this.getView().getModel("userValues").getProperty("/salesOrgList");

                var salesorg = '';
                salesOrgList.forEach(element => {
                    var filter = new Filter("Vkorg", FilterOperator.Contains, element);
                    aFilters.push(filter);
                    salesorg = salesorg + " " + element;

                });


                this.getView().setModel(new sap.ui.model.json.JSONModel({
                    salesorg: salesorg
                }), "salesorgModel");


                if (this.getView().getModel("SSModel") && this.getView().getModel("SSModel").getProperty("/SS")) {
                    var salesPerson = this.getView().getModel("SSModel").getProperty("/SS");

                    var filter = new Filter("SalesSupport", FilterOperator.Contains, salesPerson);
                    aFilters.push(filter);
                }

                //    this.getView().getModel("userValues").setProperty("/salesorg", salesorg);




                var farrayobj = new Filter({
                    filters: aFilters,
                    and: false,
                });

                var filter_status1 = new Filter({
                    filters: [new Filter("status", FilterOperator.NE, '1'), new Filter("CustomerAccountGroup", FilterOperator.NE, 'ZPR')],
                    and: true,
                });

                // update list binding
                var oList = this.byId("idList");
                var oBinding = oList.getBinding("items");
                this.getView().setBusy(true);

                oBinding.filter([farrayobj, filter_status1], "Application");
                this.getView().setBusy(false);


                var filter_status = new Filter("status", FilterOperator.EQ, '1');

                var farrayobj1 = new Filter({
                    filters: [farrayobj, filter_status],
                    and: true,
                });
                var oList = this.byId("idList_draft");
                var oBinding = oList.getBinding("items");
                oBinding.filter(farrayobj1, "Application");
                this.getView().setBusy(false);




                // Filter for prospects
                var filter_status = new Filter("CustomerAccountGroup", FilterOperator.EQ, 'ZPR');

                var farrayobj1 = new Filter({
                    filters: [farrayobj, filter_status],
                    and: true,
                });
                var oList = this.byId("idList_prospect");
                var oBinding = oList.getBinding("items");
                oBinding.filter(farrayobj1, "Application");
                this.getView().setBusy(false);
            },
            handleSalesOrgPress: function (oEvent) {
                var salesorg = oEvent.getSource().getParent().getContent()[0].getItems()[1].getValue();
                this.salesorg = salesorg;

                this.vkorg = salesorg;
                oEvent.getSource().getParent().close();
                this.filterListBySalesOrg(salesorg);

            },

            handleSalesOrgPressClose: function (oEvent) {
                oEvent.getSource().getParent().close();


            },

            openSettings: function (oEvent) {


                var that = this;
                this.QuickViewEventSource = oEvent.getSource();

                if (!that._pPopover_quickView) {
                    that._pPopover_quickView = sap.ui.core.Fragment.load({
                        id: that.getView().getId() + "253",
                        name: "customer.porky.zfieldrepvisit.view.SettingPopOver",
                        controller: that
                    }).then(function (oPopover) {
                        that.getView().addDependent(oPopover);

                        return oPopover;
                    });
                } else {

                }
                that._pPopover_quickView.then(function (oPopover) {
                    oPopover.openBy(that.QuickViewEventSource);

                });

            },

            // onChangeSwitchState: function(oEvent){
            //     if(!oEvent.mParameters.state){
            //     // var farrayobj = [];
            //     // var oList = this.byId("idList");
            //     // var aFilters = [];
            //     // if(this.getView().getModel("SSModel") && this.getView().getModel("SSModel").getProperty("/SS")){
            //     //     var salesPerson = this.getView().getModel("SSModel").getProperty("/SS");
            //     //     var filter = new Filter("SalesSupport", FilterOperator.Contains, salesPerson);
            //     //     aFilters.push(filter);
            //     //     errrr
            //     // }
            //     // var oBinding = oList.getBinding("items");
            //     // oBinding.filter(aFilters, "Application");

            //     // this.getView().getModel("userValues").setProperty("/milesSet", "");
            //     this.filterListBySalesOrg(this.getView().getModel( "userValues").getProperty("/salesorg"));
            //     }else{
            //         this.getLocation();
            //         this.getView().getModel("userValues").setProperty("/milesSet", "3");
            //         oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getContent()[1].setValue(3)                    ;
            //     }
            // },
            onChangeSwitchState: function (oEvent) {
                if (!oEvent.mParameters.selected) {



                    //     var farrayobj = [];
                    //     var oList = this.byId("idList");
                    //    // var oBinding = oList.getBinding("items");
                    //     var aFilters = [];
                    //     if(this.getView().getModel("SSModel") && this.getView().getModel("SSModel").getProperty("/SS")){
                    //         var salesPerson = this.getView().getModel("SSModel").getProperty("/SS");

                    //         var filter = new Filter("SalesSupport", FilterOperator.Contains, salesPerson);
                    //         aFilters.push(filter);
                    //     }
                    //     var oBinding = oList.getBinding("items");
                    //     oBinding.filter(aFilters, "Application");
                    this.getView().getModel("userValues").setProperty("/milesSet", "");

                    this.setMilesShipto1("");
                    // this.filterListBySalesOrg(this.getView().getModel( "userValues").getProperty("/salesorg"));
                    // this.resetLatLongModel();
                } else {
                    this.getLocation();
                    this.getView().getModel("userValues").setProperty("/milesSet", "3");
                    this.setMilesShipto1(3);
                    //  oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getContent()[1].setValue(3)                    ;
                }
            },
            onChangeSwitchState1: function (oEvent) {

                if (!oEvent.mParameters.selected) {
                    // this.resetLatLongModel();
                    this.setMilesShipto(9999);
                    this.filterListBySalesOrg(this.vkorg);
                } else {
                    this.extractShipto();
                    this.getView().byId("mapSlider").setValue(3);
                }
            },
            resetLatLongModel: function (oEvent) {

                var that = this;
                var dataobj = that.getView().getModel("latlongModelOriginal").getData().Spots.items;
                var jsArray = [];

                for (var count = 0; count < dataobj.length; count++) {
                    // var dist = Number(currentData.Spots.items[count].distance);

                    var dist = that.getDistanceFromLatLonInKm(dataobj[count].lat, dataobj[count].long, that.uLat, that.uLon);
                    dist = Math.round((dist + Number.EPSILON) * 100) / 100;

                    dataobj[count].distance = dist;


                }


                for (var count = 0; count < dataobj.length; count++) {

                    var dist = that.getDistanceFromLatLonInKm(dataobj[count].lat, dataobj[count].long, that.uLat, that.uLon);
                    dist = Math.round((dist + Number.EPSILON) * 100) / 100;
                    //    if(dist === null){
                    //        sap.m.MessageToast.show("Fetching location...");
                    //        return;
                    //    }
                    dataobj[count].distance = dist;
                    //"distance":Number(dist),


                    //  jsArray.push(currentData.Spots.items[count]) ;

                }

                var jsObj = {
                    "Spots": {
                        "items": dataobj
                    }
                };

                that.getView().setModel(new sap.ui.model.json.JSONModel(
                    JSON.parse(JSON.stringify(jsObj))
                ), "latlongModel");

                that.getView().getModel("latlongModel").setSizeLimit("9999");


                 that.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(
                    JSON.parse(JSON.stringify(jsObj))
                ), "latlongModel");

                that.getOwnerComponent().getModel("latlongModel").setSizeLimit("9999");

            },

            checkifFMTSuperUser: function () {

                let defaultModel = this.getOwnerComponent().getModel("ZCXA_USERAUTH_CDS");
                var that = this;
                var userauthFilters = new sap.ui.model.Filter([
                    //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
                    new sap.ui.model.Filter("authvalfrom", sap.ui.model.FilterOperator.EQ, '*'),

                    new sap.ui.model.Filter("bname", sap.ui.model.FilterOperator.EQ, sap.ushell.Container.getService("UserInfo").getId()),
                    new sap.ui.model.Filter("authfield", sap.ui.model.FilterOperator.EQ, 'USER'),
                    new sap.ui.model.Filter("authobject", sap.ui.model.FilterOperator.EQ, 'ZFMTSUPER')

                ], true);
                // var userauthFilters1 = new sap.ui.model.Filter([
                //   //         var oFilter = new sap.ui.model.Filter("Prodh1", sap.ui.model.FilterOperator.Contains,keyterm);
                //   new sap.ui.model.Filter("authvalfrom", sap.ui.model.FilterOperator.EQ, sap.ushell.Container.getService("UserInfo").getId()),

                //   userauthFilters

                // ], false);
                defaultModel.read("/ZCXA_USERAUTH", {
                    filters: [userauthFilters],
                    success: function (oData, oResponse) {
                        // var plant = oData.results.find(element => element.parid === "WRK");
                        var arrayUsers = oData.results;

                        var flagValue = false;

                        if (arrayUsers.length === 0) {
                            that.getView().setModel(new sap.ui.model.json.JSONModel({
                                superuser: false
                            }), "superUserModel");


                            return;
                        } else {
                            that.getView().setModel(new sap.ui.model.json.JSONModel({
                                superuser: true
                            }), "superUserModel");
                        }



                    },

                    error: function (oError) {

                        //  sap.m.MessageBox.error("There in issue with this action.");

                    }
                });
            },

            checkAuthorization: function () {

                var that = this;
                // if (user === sap.ushell.Container.getService("UserInfo").getId()) {
                //   that.getView().setModel(new sap.ui.model.json.JSONModel({ changeMode: true })
                //     , "chageModeModel");
                //   return;
                // }
                that.getView().setModel(new sap.ui.model.json.JSONModel({
                    currentUser: sap.ushell.Container.getService("UserInfo").getId()
                }), "currentUserModel");
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
                    new sap.ui.model.Filter("authvalfrom", sap.ui.model.FilterOperator.EQ, sap.ushell.Container.getService("UserInfo").getId()),

                    userauthFilters

                ], false);
                defaultModel.read("/ZCXA_USERAUTH", {
                    filters: [userauthFilters1],
                    success: function (oData, oResponse) {
                        // var plant = oData.results.find(element => element.parid === "WRK");
                        var arrayUsers = oData.results;

                        var flagValue = false;

                        if (arrayUsers.length === 0) {
                            that.getView().setModel(new sap.ui.model.json.JSONModel({
                                changeMode: false
                            }), "chageModeModel");

                            that.getView().byId("idList_draft").getBinding("items").refresh(true);
                            return;
                        }
                        var flagIsSuperUser = false;
                        arrayUsers.forEach(element => {

                            if (element.authvalfrom === "*") {
                                that.getView().setModel(new sap.ui.model.json.JSONModel({
                                    changeMode: true
                                }), "chageModeModel");

                                //   that.getView().byId("idList").getBinding("items").refresh(true);

                                // this.byId("idList").bindItems({
                                //     path: "/ZBMM_FieldRepNearby(p_vkorg='3000',p_lat='0',p_long='0',p_distinm='0')/Set"

                                // });
                                that.getView().byId("idList_draft").getBinding("items").refresh(true);
                                //   that.getView().byId("idList_prospect").getBinding("items").refresh(true);

                                flagValue = true;
                                flagIsSuperUser = true;
                                return;

                            }


                        });

                        if (flagIsSuperUser === false) {

                            that.getView().setModel(new sap.ui.model.json.JSONModel({
                                changeMode: false
                            }), "chageModeModel");

                            that.getView().byId("idList_draft").getBinding("items").refresh(true);

                        }

                        if (!flagValue) {
                            //  sap.m.MessageBox.error("You are not authorized to perform this action");

                        }

                    },

                    error: function (oError) {

                        //  sap.m.MessageBox.error("There in issue with this action.");

                    }
                });

            },

            onClickVisit: function (oEvent) {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("newvisit", {
                    visitid: 'NEW',
                    shipto: oEvent.getSource().getParent().getParent().getSelectedContexts()[0].getObject().Shipto,
                    vkorg: oEvent.getSource().getParent().getParent().getSelectedContexts()[0].getObject().sorg
                });
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







            onBeforeRebindVisit_F4: function (oEvent) {



                //       oEvent.getSource().applyVariant({
                //         sort: {
                //                  sortItems: [{ 
                //                                 columnKey: "Createdatetime", 
                //                                 operation:"Descending"}
                //                             ]
                //               }

                //    });
                var oSmartTable = oEvent.getSource();
                var mBindingParams = oEvent.mParameters.bindingParams;
                if (mBindingParams.sorter.length < 1) {
                    mBindingParams.sorter = [new sap.ui.model.Sorter("Createdatetime", true)];
                }

                // if (this._isOnInit == null) this._isOnInit = true; //To set this initial sorter only when view start
                // // if (this._isOnInit1 || (oSmartTable.getVariantManagement().getAllVariants()[0] && oSmartTable.getVariantManagement().getAllVariants().find(item => item.getVariantId() === oSmartTable.getVariantManagement().getCurrentVariantId()).getName()
                // //     === 'Standard')) {
                //         if (this._isOnInit1 ) {
                //     oSmartTable.applyVariant({
                //         sort: {
                //             sortItems: [{
                //                     columnKey: "Createdatetime",
                //                     operation: "Descending"
                //                 }
                //             ]
                //         }
                //     });
                // }
                this._isOnInit = false;
                if (this.getView().getModel("userValues").getProperty("/milesSet") === '') {
                    this.getView().getModel("userValues").setProperty("/milesSet", 3);
                }
                if (this.getView().getModel("userValues").getProperty("/location") && !isNaN(this.uLat)) {
                    var stringPath = "/ZBMM_FieldRepNearby(p_lat=" + encodeURIComponent(Number(this.uLat)) + "m,p_long=" + encodeURIComponent(Number(this.uLon)) + "m,p_distinm=" + this.getView().getModel("userValues").getProperty("/milesSet") + ")/Set";

                } else {
                    var stringPath = "/ZBMM_FieldRepNearby(p_lat=39.833851m,p_long=-74.87182m,p_distinm=10000)/Set";

                }
                stringPath = (stringPath);
                oEvent.getSource().setTableBindingPath(stringPath);

                var oBindingParams = oEvent.getParameter("bindingParams");




                var salesOrgList = this.getOwnerComponent().getModel("salesOrgCentralModel").getData();

                var salesorgstring = "";

                salesOrgList.forEach(element => {
                    var oFilter = new sap.ui.model.Filter("Vkorg", sap.ui.model.FilterOperator.EQ, element);
                    oBindingParams.filters.push(oFilter);
                    salesorgstring = salesorgstring + " " + element;
                });
                this.getView().getModel("userValues").setProperty("/salesOrgString", salesorgstring);

                //   oBindingParams.filters.push( new Filter("status", FilterOperator.NE, '1'));
                //   oBindingParams.filters.push( new Filter("status", FilterOperator.NE, 'X'));
                var farrayobj = new Filter({
                    filters: [new Filter("status", FilterOperator.NE, 'X'), new Filter("status", FilterOperator.EQ, '2')],
                    and: true,
                });
                oBindingParams.filters.push(farrayobj);

                oBindingParams.filters.push(new Filter("CustomerAccountGroup", FilterOperator.NE, 'ZPR'));

                if (this.visittype && this.visittype === 'SR') {

                    // oBindingParams.filters.push( new Filter("Visittype", FilterOperator.EQ, 'SR'));


                }

                //       oEvent.getSource().applyVariant({
                //         sort: {
                //                  sortItems: [{ 
                //                                 columnKey: "Createdatetime", 
                //                                 operation:"Descending"}
                //                             ]
                //               }
                //    });

            },
            onAfterVariantSaveVisit: function (oEvent) {

            },

            onBeforeRebindVisit_F4_draft: function (oEvent) {



                var oSmartTable = oEvent.getSource();
                // if (this._isOnInit1 == null) this._isOnInit1 = true; //To set this initial sorter only when view start
                // if (this._isOnInit1 )
                //     // || (oSmartTable.getVariantManagement().getAllVariants()[0] && oSmartTable.getVariantManagement().getAllVariants().find(item => item.getVariantId() === oSmartTable.getVariantManagement().getCurrentVariantId()).getName()
                //     // === 'Standard')) 
                //     {
                //     oSmartTable.applyVariant({
                //         sort: {
                //             sortItems: [{
                //                     columnKey: "Createdatetime",
                //                     operation: "Descending"
                //                 }
                //             ]
                //         }
                //     });
                // }
                var oSmartTable = oEvent.getSource();
                var mBindingParams = oEvent.mParameters.bindingParams;
                if (mBindingParams.sorter.length < 1) {
                    mBindingParams.sorter = [new sap.ui.model.Sorter("Createdatetime", true)];
                }
                this._isOnInit1 = false;
                if (this.getView().getModel("userValues").getProperty("/milesSet") === '') {
                    this.getView().getModel("userValues").setProperty("/milesSet", 3);
                }
                if (this.getView().getModel("userValues").getProperty("/location") && !isNaN(this.uLat)) {
                    var stringPath = "/ZBMM_FieldRepNearby(p_lat=" + encodeURIComponent(Number(this.uLat)) + "m,p_long=" + encodeURIComponent(Number(this.uLon)) + "m,p_distinm=" + this.getView().getModel("userValues").getProperty("/milesSet") + ")/Set";

                } else {
                    var stringPath = "/ZBMM_FieldRepNearby(p_lat=39.833851m,p_long=-74.87182m,p_distinm=10000)/Set";

                }
                stringPath = (stringPath);
                oEvent.getSource().setTableBindingPath(stringPath);

                var oBindingParams = oEvent.getParameter("bindingParams");




                var salesOrgList = this.getOwnerComponent().getModel("salesOrgCentralModel").getData();


                salesOrgList.forEach(element => {
                    var oFilter = new sap.ui.model.Filter("Vkorg", sap.ui.model.FilterOperator.EQ, element);
                    oBindingParams.filters.push(oFilter);
                });

                oBindingParams.filters.push(new Filter("status", FilterOperator.EQ, '1'));

                var farrayobj = new Filter({
                    filters: [new Filter("status", FilterOperator.NE, 'X'), new Filter("status", FilterOperator.EQ, '1')],
                    and: true,
                });
                oBindingParams.filters.push(farrayobj);
                oBindingParams.filters.push(new Filter("CustomerAccountGroup", FilterOperator.NE, 'ZPR'));

                if (this.getView().getModel("superUserModel") && this.getView().getModel("superUserModel").getProperty("/superuser")) {

                } else if (sap.ushell.Container.getService("UserInfo").getId() !== 'DEFAULT_USER') {
                    oBindingParams.filters.push(new Filter("Ernam", FilterOperator.EQ, sap.ushell.Container.getService("UserInfo").getId()));

                }


                if (this.visittype && this.visittype === 'SR') {

                    // oBindingParams.filters.push( new Filter("Visittype", FilterOperator.EQ, 'SR'));


                }

                //       oEvent.getSource().applyVariant({
                //         sort: {
                //                  sortItems: [{ 
                //                                 columnKey: "Createdatetime", 
                //                                 operation:"Descending"}
                //                             ]
                //               }
                //    });


            },

            onBeforeRebindVisit_F4_prospect_draft: function (oEvent) {



                var oSmartTable = oEvent.getSource();

                var oSmartTable = oEvent.getSource();
                var mBindingParams = oEvent.mParameters.bindingParams;
                if (mBindingParams.sorter.length < 1) {
                    mBindingParams.sorter = [new sap.ui.model.Sorter("Createdatetime", true)];
                }
                this._isOnInit1 = false;
                if (this.getView().getModel("userValues").getProperty("/milesSet") === '') {
                    this.getView().getModel("userValues").setProperty("/milesSet", 3);
                }
                if (this.getView().getModel("userValues").getProperty("/location") && !isNaN(this.uLat)) {
                    var stringPath = "/ZBMM_FieldRepNearby(p_lat=" + encodeURIComponent(Number(this.uLat)) + "m,p_long=" + encodeURIComponent(Number(this.uLon)) + "m,p_distinm=" + this.getView().getModel("userValues").getProperty("/milesSet") + ")/Set";

                } else {
                    var stringPath = "/ZBMM_FieldRepNearby(p_lat=39.833851m,p_long=-74.87182m,p_distinm=10000)/Set";

                }
                stringPath = (stringPath);
                oEvent.getSource().setTableBindingPath(stringPath);

                var oBindingParams = oEvent.getParameter("bindingParams");




                var salesOrgList = this.getOwnerComponent().getModel("salesOrgCentralModel").getData();


                salesOrgList.forEach(element => {
                    var oFilter = new sap.ui.model.Filter("Vkorg", sap.ui.model.FilterOperator.EQ, element);
                    oBindingParams.filters.push(oFilter);
                });


                //   oBindingParams.filters.push( new Filter("status", FilterOperator.NE, 'X'));
                //   oBindingParams.filters.push(new Filter("status", FilterOperator.EQ, '1'));
                var array = [];

                var farrayobj = new Filter({
                    filters: [new Filter("status", FilterOperator.NE, 'X'), new Filter("status", FilterOperator.EQ, '1')],
                    and: true,
                });
                oBindingParams.filters.push(farrayobj)

                oBindingParams.filters.push(new Filter("CustomerAccountGroup", FilterOperator.EQ, 'ZPR'));

                if (this.visittype && this.visittype === 'SR') {

                    // oBindingParams.filters.push( new Filter("Visittype", FilterOperator.EQ, 'SR'));


                }

                if (this.getView().getModel("superUserModel") && this.getView().getModel("superUserModel").getProperty("/superuser")) {

                } else if (sap.ushell.Container.getService("UserInfo").getId() !== 'DEFAULT_USER') {
                    oBindingParams.filters.push(new Filter("Ernam", FilterOperator.EQ, sap.ushell.Container.getService("UserInfo").getId()));

                }

            },

            onDeleteDraft_ask: function (oEvent) {



                var that = this;

                that.exitDialog = new Dialog({
                    type: sap.m.DialogType.Message,
                    title: "Confirm",
                    content: new sap.m.Text({
                        text: "Are you sure you want to delete this Visit?"
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
                var selectContexts = this.getView().byId("smartTable_visitF4_draft").getTable().getSelectedContexts();

                selectContexts.forEach(element => {

                    var visitid = element.getObject().Visitid;

                    that.updateVisit(visitid);

                });
            },


            onDeleteDraft_p: function (oEvent) {


                //         debugger;
                var that = this;
                var selectContexts = this.getView().byId("smartTable_visitF4_prospect_draft").getTable().getSelectedContexts();

                selectContexts.forEach(element => {

                    var visitid = element.getObject().Visitid;

                    that.updateVisit(visitid);

                });
            },





            onDeleteDraft_p_ask: function (oEvent) {


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
                            that.onDeleteDraft_p();
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

            updateVisit: function (visitid) {

                var obj = {
                    status: 'X'
                }
                let defaultModel1 = this.getOwnerComponent().getModel("ZRMM_FRVISITV2_CDS");
                defaultModel1.setHeaders({
                    "If-Match": "*"
                });
                var that = this;

                defaultModel1.update("/ZRMM_FRVISITV2('" + visitid + "')", obj, {
                    success: function (oData, oResponse) {
                        that.getView().setBusy(false);
                        that.getView().byId("smartTable_visitF4_draft").rebindTable();

                        that.getView().byId("smartTable_visitF4_prospect_draft").rebindTable();
                    },

                    error: function (oError) {
                        //      sap.m.MessageBox.error("There in issue with this action.");
                    }
                });
            },
            onSelectionChangeDraftTable: function (oEvent) {

                var selectedIndices = oEvent.getSource().getSelectedItems();

                if (selectedIndices.length > 0) {
                    this.getView().byId("deleteDraft").setEnabled(true);
                    this.getView().byId("deleteDraft_p").setEnabled(true);

                } else {
                    this.getView().byId("deleteDraft").setEnabled(false);
                    this.getView().byId("deleteDraft_p").setEnabled(true);

                }

            },


            onBeforeRebindVisit_F4_prospect: function (oEvent) {



                var oSmartTable = oEvent.getSource();

                var oSmartTable = oEvent.getSource();
                var mBindingParams = oEvent.mParameters.bindingParams;
                if (mBindingParams.sorter.length < 1) {
                    mBindingParams.sorter = [new sap.ui.model.Sorter("Createdatetime", true)];
                }
                this._isOnInit1 = false;
                if (this.getView().getModel("userValues").getProperty("/milesSet") === '') {
                    this.getView().getModel("userValues").setProperty("/milesSet", 3);
                }
                if (this.getView().getModel("userValues").getProperty("/location") && !isNaN(this.uLat)) {
                    var stringPath = "/ZBMM_FieldRepNearby(p_lat=" + encodeURIComponent(Number(this.uLat)) + "m,p_long=" + encodeURIComponent(Number(this.uLon)) + "m,p_distinm=" + this.getView().getModel("userValues").getProperty("/milesSet") + ")/Set";

                } else {
                    var stringPath = "/ZBMM_FieldRepNearby(p_lat=39.833851m,p_long=-74.87182m,p_distinm=10000)/Set";

                }
                stringPath = (stringPath);
                oEvent.getSource().setTableBindingPath(stringPath);

                var oBindingParams = oEvent.getParameter("bindingParams");




                var salesOrgList = this.getOwnerComponent().getModel("salesOrgCentralModel").getData();


                salesOrgList.forEach(element => {
                    var oFilter = new sap.ui.model.Filter("Vkorg", sap.ui.model.FilterOperator.EQ, element);
                    oBindingParams.filters.push(oFilter);
                });

                //   oBindingParams.filters.push(new Filter("status", FilterOperator.EQ, '2'));
                //   oBindingParams.filters.push( new Filter("status", FilterOperator.NE, 'X'));

                var array = [];

                var farrayobj = new Filter({
                    filters: [new Filter("status", FilterOperator.NE, 'X'), new Filter("status", FilterOperator.EQ, '2')],
                    and: true,
                });
                oBindingParams.filters.push(farrayobj);
                oBindingParams.filters.push(new Filter("CustomerAccountGroup", FilterOperator.EQ, 'ZPR'));
                if (this.visittype && this.visittype === 'SR') {

                    // oBindingParams.filters.push( new Filter("Visittype", FilterOperator.EQ, 'SR'));


                }
            },



            onShowAll: function (oEvent) {

                this.getView().getModel("userValues").setProperty("/location", false);
                this.uLat = 'abc';
                this.filterListBySalesOrg();
            },
            onClickMap: function(oEvent){
              //  debugger;

                var dataArray = this.getOwnerComponent().getModel("latlongModel").getData()

             var data = dataArray.Spots.items.find(item => item.Shipto === "My Location");
             
             if(data){
                data.pos = oEvent.mParameters.pos

             }

this.getOwnerComponent().getModel("latlongModel").setData(dataArray);
this.getView().getModel("latlongModel").setData(dataArray);
  //  debugger;



                this.uLat = oEvent.mParameters.pos.split(";")[1];
                this.uLon = oEvent.mParameters.pos.split(";")[0];
                this.getView().byId("smartTable_custF4_map").rebindTable();


            }



        });
    });