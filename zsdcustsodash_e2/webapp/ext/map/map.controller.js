(function () {
    "use strict";

    /* controller for custom card  */
    // Controller : https://ui5.sap.com/#/topic/121b8e6337d147af9819129e428f1f75
    // controller class name can be like app.ovp.ext.customList.CustomList where app.ovp can be replaced with your application namespace
    sap.ui.define([], function() {
        return {
            onInit: function () {


                var that = this;
                var oMap = that.getView().byId("vbi");
               //  that.getLocation();

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


                    this.getView().setModel(new sap.ui.model.json.JSONModel(
                        {
                            "salesorg": "",
                            "ccode": "",
                            "wkending": new Date(),
                            "numweeks": "13",
                            "selectedView": "keyname",
                            "selectedKey": "1",
                            "cusStart": null,
                            "cusEnd": null,
                            "countShipTo": "",
                            "milesSet" : 3,
                            "location" : true,
                            "infobarvkorg": "",
                            "infobarmiles":"No miles radius is set"
                        }
                    ), "userValues");
                    this.fetchCustomers();

                   // oMap.setCenterPosition(that.uLon + ";" + that.uLat);

            },
          
            // getLocation: function () {
            //     var that = this;
            //     var getPosition = {
            //         enableHighAccuracy: false,
            //         timeout: 9000,
            //         maximumAge: 0
            //     };

            //     function success(gotPosition) {
            //         that.uLat = gotPosition.coords.latitude;
            //         that.uLon = gotPosition.coords.longitude;
            //         // that.uLon="-73.9352";
            //         // that.uLat="40.730610";

            //         if (that.getView().byId("vbi"))
            //             that.getView().byId("vbi").setCenterPosition(that.uLon + ";" + that.uLat);
            //         that.extractShipto();
            //         that.getView().setBusy(false);

            //     };

            //     function error(err) {
            //         console.warn(`ERROR(${err.code}): ${err.message}`);
            //         that.getView().setBusy(false);
            //       //  if(!that.uLat)
            //       //  sap.m.MessageToast.show("Trying to fetch current location");
            //     };

            //     navigator.geolocation.getCurrentPosition(success, error, getPosition);

            // },



            getLocation_customer: function () {



                // that.uLat = lat;
                // that.uLon = long;
                // that.uLon="-73.9352";
                // that.uLat="40.730610";

                var that = this;
                if (that.getView().byId("vbi"))
                    that.getView().byId("vbi").setCenterPosition(that.uLon + ";" + that.uLat);
             //   that.extractShipto();
                that.getView().setBusy(false);

            },

    
            getDistanceFromLatLonInKm: function (lat1, lon1, lat2, lon2) {
                var R = 6371; // Radius of the earth in km
                var dLat = deg2rad(lat2 - lat1);  // deg2rad below
                var dLon = deg2rad(lon2 - lon1);
                var a =
                    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2)
                    ;
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

                return insert(arr, index, newItem)
                    ;

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
                    "tooltip": that.customerName,
                    "type": "Success",
                    "text": that.customerName,
                    "Shipto": that.customerName,
                    "ShiptoName": that.customerName,
                    "stras": "",
                    "Salesman": "",
                    "distance": 0,
                    "scale": "2;2;2",
                    "selected": false,
                    "city": "",
                    "level": "",
                    "altkn": ""


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

                //    this.extractShiptoRollups();


            },

            onAfterRendering: function () {

            //    this.extractRequest();

                var that = this;
                this.getModel().attachRequestCompleted(function(oEvent){
  
  
                  if(oEvent.mParameters.url.includes("ZCSD_CUSTSODASHAGGR")){
                  //  that.fetchMap();
                  var filterData = that.getView().getParent().getComponentData().mainComponent.getGlobalFilter().getFilterData();
                  that.CompanyCode = filterData.CompanyCode;
                  that.SalesOrganization = filterData.SalesOrganization;
                  that.Customer = filterData.Customer;
                  that.centerTheMap();
                 
                //  that.setMilesShipto(5);
                  
               //   that.fetchMap();
                  }
  
                });
            },
            centerTheMap: function(){
                var that = this;
                var dataobj = that.getView().getModel("latlongModelOriginal").getData().Spots.items;
                var jsArray = [];
                if(typeof that.Customer === 'undefined'){
                    that.Customer = that.getView().getParent().getComponentData().mainComponent.getGlobalFilter().getFilterData().Customer;
                }
                for (var count1 = 0; count1 < dataobj.length; count1++) {
                if(dataobj[count1].Shipto === that.Customer){
                    that.uLat = dataobj[count1].lat;
                    that.uLon = dataobj[count1].long;
                    that.customerName = dataobj[count1].ShiptoName;
                    that.getLocation_customer();
              
                }
            }



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
            that.getView().getModel("latlongModelOriginal").setSizeLimit(999999);
            if (that.getView().byId("vbi")){
                that.getView().byId("vbi").setCenterPosition(that.uLon + ";" + that.uLat);
            }
            that.setMilesShipto(5);
            },

            onExit: function () {},

            fetchCustomers: function(){
                let runDateSet = this.getView().getModel();
                runDateSet.setSizeLimit(999999);

                var that = this;

                var filterData = this.getView().getParent().getComponentData().mainComponent.getGlobalFilter().getFilterData();
           //     var CompanyCode = filterData.CompanyCode;
                var SalesOrganization = filterData.SalesOrganization;


                var oFilter = [];
                oFilter.push(new sap.ui.model.Filter("vkorg", sap.ui.model.FilterOperator.Contains, "'"+SalesOrganization.toString()+"'"));
                runDateSet.read("/ZBSD_GETDEFAULTSHMORE", {
                    urlParameters: {
                        
                        "$top" : "99999"
            
                      },
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
                                "Shipto": oData.results[count].kunnr
                                ,
                                "ShiptoName": oData.results[count].name1
                                ,
                                "stras": oData.results[count].stras
                                ,
                                "Salesman": oData.results[count].sm,
                                "Scale": "1;1;1",
                                "selected": true,
                                "city": oData.results[count].ort01,
                                "level": oData.results[count].hier1_name,
                                "altkn": oData.results[count].altkn



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
                        that.getView().getModel("latlongModelOriginal").setSizeLimit(999999);

                        that.getView().setModel(new sap.ui.model.json.JSONModel(
                            JSON.parse(JSON.stringify(jsObj))
                        ), "latlongModel");
                        that.getView().getModel("latlongModel").setSizeLimit(999999);

                        that.getView().getModel("latlongModel").setSizeLimit("9999");
                        that.centerTheMap();
                     //   that.getLocation_customer();

                        //  that.getLocation();
                    //    that.setMilesShipto1(3);
                    //    that.setMilesShipto(3);


                     //   that.miles = 3;



                    },

                    error: function (oError) {
                    }
                });
            },


            filterTableNearByCustomers: function (customers) {

                var aFilters = []

                customers.forEach(element => {

                    var filter = new sap.ui.model.Filter("Customer", sap.ui.model.FilterOperator.Contains, element.Shipto);
                    aFilters.push(filter);

                });


                // this.getView().setModel(new sap.ui.model.json.JSONModel({
                //     "SS" : salesPerson }
                // ), "SSModel");

               



                var farrayobj = new sap.ui.model.Filter({
                    filters: aFilters,
                    and: false,
                });
                if(this.getView().getModel("SSModel") && this.getView().getModel("SSModel").getProperty("/SS")){
                    var salesPerson = this.getView().getModel("SSModel").getProperty("/SS");
                    this.getView().setBusy(true);
                    var filter = new sap.ui.model.Filter("SalesSupport", sap.ui.model.FilterOperator.Contains, salesPerson);
                    aFilters.push(filter);
                    var farrayobj1 = new sap.ui.model.Filter({
                        filters: [farrayobj,filter],
                        and: true,
                    });

                    var oList = this.byId("idList");
                var oBinding = oList.getBinding("items");
                    oBinding.filter(farrayobj1, "Application");
                    this.getView().setBusy(false);

                    return;
                }

               

                // update list binding
                var oList = this.byId("idList");
                var oBinding = oList.getBinding("items");
                this.getView().setBusy(true);

                oBinding.filter(farrayobj, "Application");
                this.getView().setBusy(false);
            },

            handlePopoverPress: function (oEvent) {
                // var oButton =  oEvent.getSource().getParent();
                //    var oView = this.getView();
                //     var object = oEvent.getSource().getBindingContext("latlongModel").sPath                    ;


                // // create popover
                // if (!this._pPopover) {
                //     this._pPopover = Fragment.load({
                //         id: oView.getId(),
                //         name: "customer.porky.zfieldrepvisit.view.Popover",
                //         controller: this
                //     }).then(function(oPopover) {
                //         oView.addDependent(oPopover);
                //         oPopover.setModel(oView.getModel("latlongModel"));

                //         oPopover.bindElement(object);
                //         return oPopover;
                //     });
                // }
                // this._pPopover.then(function(oPopover) {
                //     oPopover.openBy(oButton);
                // });

                if (!this.oEscapePreventDialog) {
                    var obj = oEvent.getSource().getBindingContext("latlongModel").getObject();
                    this.oEscapePreventDialog = new sap.m.Dialog({
                        title: obj.ShiptoName,
                        content: new sap.m.Text({ text: obj.Shipto + " - " + obj.ShiptoName + "; Street: " + obj.stras + "; Distance: " + obj.distance }).addStyleClass("sapUiSmallMargin"),
                        buttons: [
                            new sap.m.Button({
                                text: "Close",
                                press: function () {
                                    this.oEscapePreventDialog.close();
                                    // this.oEscapePreventDialog.destroyContents();
                                    this.oEscapePreventDialog.destroy();
                                    this.oEscapePreventDialog = undefined;
                                }.bind(this)
                            }), new sap.m.Button({
                                text: "Open Customer",
                                press: function () {
                                    this.oEscapePreventDialog.close();
                                    // this.oEscapePreventDialog.destroyContents();
                                    this.oEscapePreventDialog.destroy();
                                    this.oEscapePreventDialog = undefined;
                                    this.openNewCustomer(obj.Shipto);
                                }.bind(this)
                            }),
                            new sap.m.Button({
                                text: "Directions",
                                press: function () {
                                    this.mapsSelector(obj);
                                }.bind(this)
                            })
                           
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

            openNewCustomer: function(oEvent){
            //    debugger
            //    var gfilters =  this.getView().getParent().getComponentData().mainComponent.getGlobalFilter();
            //    this.getView().getParent().getComponentData().mainComponent.getGlobalFilter().getControlByKey("Customer").setValue(oEvent)

               var filterData = this.getView().getParent().getComponentData().mainComponent.getGlobalFilter().getFilterData();

               var mParams = {
               
                   "CompanyCode" : filterData.CompanyCode,
                   "SalesOrganization": filterData.SalesOrganization,
                   "Customer": oEvent,
                   "sap-ushell-navmode":"explace"
               
                  
               };

               sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then(function (oService) {
                   oService.hrefForExternalAsync({
                       target: {
                           semanticObject: "Sales",
                           action: "ZSDCUSTDASH_OVP"
                       },
                       params: mParams
                   }).then(function (sHref) {
                       oService.toExternal({
                           target: {
                               shellHash: sHref
                           }
                       });
                   });

               });

            },
            onChangeDistance: function (oEvent) {
                var miles = oEvent.mParameters.value;
                this.miles = miles;
                this.getView().getModel("userValues").setProperty("/milesSet", miles);
                this.setMilesShipto(miles);
            },

            setMilesShipto1: function (miles) {
                var that = this;


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
                    that.getView().getModel("latlongModelOriginal").setSizeLimit(999999);

                   
                    that.getView().getModel("latlongModel").setSizeLimit(999999);

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

                that.filterTableNearByCustomers(jsArray);

            },

            shareMapDirection: function (oEvent) {
                // Check if the Web Share API is supported
                var objectVar = oEvent.getSource().getParent().getBindingContext("latlongModel").getObject();
                var orgPosition = this.uLat + "," + this.uLon;

                this.mapsSelector(objectVar, orgPosition);
                //                 const shareData = {
                //                     title: "Rajneesh is tired",
                //                     text: "But see he is trying",
                //                     url: "https://www.google.com/maps/dir/?api=1&origin="+orgPosition+"&destination="+objectVar.pos,
                //                   };

                //   if (navigator.share) {
                //     // Try to share the data
                //     try {
                //        navigator.share(shareData);
                //       sap.m.MessageToast.show("Data shared successfully");
                //     } catch (err) {
                //       // Handle any errors
                //       sap.m.MessageToast.show("Error while sharing:", err);
                //     }
                //   } else {
                //     // Fallback to some other sharing method
                //     sap.m.MessageToast.show("Web Share API not supported");
                //   }
            },


            mapsSelector: function (objectVar) {


                var orgPosition = this.uLat + "," + this.uLon;
                if /* if we're on iOS, open in Apple Maps */
                    ((navigator.platform.indexOf("iPhone") != -1) ||
                    (navigator.platform.indexOf("iPad") != -1) ||
                    (navigator.platform.indexOf("iPod") != -1))
                    //   window.open("https://maps.google.com/maps?saddr="+orgPosition+"+&daddr="+objectVar.pos.split(";")[1]+","+objectVar.pos.split(";")[0]);
                    window.open("https://maps.google.com/maps?saddr=" + orgPosition + "+&daddr=" + objectVar.stras + "+" + objectVar.city);

                else /* else use Google */
                    window.open("https://maps.google.com/maps?saddr=" + orgPosition + "+&daddr=" + objectVar.stras + "+" + objectVar.city);
            },

            onChangeDistance: function(oEvent){
                debugger;
                var miles = oEvent.mParameters.value;
                this.miles = miles;
                this.getView().getModel("userValues").setProperty("/milesSet", miles);
                this.setMilesShipto(miles);
            }
        }
    });
})();