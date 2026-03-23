sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/Dialog",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
  ],
  function (Controller, Dialog, Device, JSONModel, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("customer.porky.zfieldprospectcr.controller.View1", {
      onInit: function () {


        var oDeviceModel = new JSONModel(Device);
        oDeviceModel.setDefaultBindingMode("OneWay");
        this.getView().setModel(oDeviceModel, "device");


        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.getRoute("RouteView1").attachMatched(this._onRouteMatched, this);

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

        this._view = this.getView();

        this.getView().setModel(new sap.ui.model.json.JSONModel({
          deleted: false,
          creditBlock: false
        }), "searchModel");
        this.getLocation();

        that.getView().setModel(new sap.ui.model.json.JSONModel({
          "Land1": "US"
        }), "newProspect");
        this.getView().setModel(new sap.ui.model.json.JSONModel({
          "mobileNumberValidated": false
        }), "flagValueModel");

        this._getSalesOrgsFromURL();
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

            _getSalesOrgsFromURL: function() {
        
              var that = this;
              if(location.href.split("SalesOrganization=").length>1){
              var salesOrgsParam = location.href.split("SalesOrganization=")[1].split("&")[0]

              this.vkorg = salesOrgsParam;
              that.getView().getModel("newProspect").setProperty("/Vkorg", that.vkorg)
              that.getView().getModel("userValues").setProperty("/salesorg", that.vkorg)
          
        }else{
          this.vkorg  = undefined
        }
      },

      _onRouteMatched: function (oEvent) {

        let defaultModel = this.getOwnerComponent().getModel("ZCXA_USERDEFAULT_CDS");
        var that = this;
        defaultModel.read("/ZCXA_USERDEFAULT", {
          success: function (oData, oResponse) {
            if ( !that.vkorg) {
              var salesorg = oData.results.find(element => element.parid === "VKO");

              if (typeof salesorg !== "undefined") {


                that.salesorg = salesorg.parva;
                that.vkorg = salesorg.parva;

                that.getView().getModel("newProspect").setProperty("/Vkorg", that.vkorg)
                that.getView().getModel("userValues").setProperty("/salesorg", that.vkorg)
              }
              //      that.getView().getModel("visitModel").setProperty("/Vkorg",that.vkorg)
            } else {

            }

          },

          error: function (oError) {}
        });

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

      validatePhoneNumber_prospect: function (oEvent) {
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
          //      this.getView().setBusy(true);
          oEvent.getSource().setValueState(sap.ui.core.ValueState.None);


          this.getView().getModel("flagValueModel").setProperty("/mobileNumberValidated", false);
          var email1 = email.split("(")[1].split(")").join("");




        }

      },

      onOpenSMF4Help: function (oEvent) {

        var that = this;


        if (!this.pDialogOpenSMF4) {
          this.pDialogOpenSMF4 = this.loadFragment({
            name: "customer.porky.zfieldprospectcr.view.SMf4"
          });
        } else {

        }


        this.pDialogOpenSMF4.then(function (oDialog) {


          oDialog.open();



          that.pDialogOpenSMF4_d = oDialog;

          var salesOrgFilters = [];

          salesOrgFilters.push(new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, that.vkorg));

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


      handleSMPartnerSearch: function (oEvent) {
        // debugger;
        var query = oEvent.mParameters.value;
        var oFilter1 = new sap.ui.model.Filter("SalesleadName", sap.ui.model.FilterOperator.Contains, query);
        var oFilter2 = new sap.ui.model.Filter("Saleslead", sap.ui.model.FilterOperator.Contains, query);

        var salesOrgFilters = [];


        salesOrgFilters.push(new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, this.vkorg));

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

      handleSMPartnerSearch: function (oEvent) {
        // debugger;
        var query = oEvent.mParameters.value;
        var oFilter1 = new sap.ui.model.Filter("SalesleadName", sap.ui.model.FilterOperator.Contains, query);
        var oFilter2 = new sap.ui.model.Filter("Saleslead", sap.ui.model.FilterOperator.Contains, query);

        var salesOrgFilters = [];


        salesOrgFilters.push(new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, this.vkorg));

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

      handleConfirmSMPartner: function (oEvent) {

        var vObj = oEvent.mParameters.selectedItem.getBindingContext("ZODATA_FR_SRV").getObject();
        var sm = vObj.Saleslead;
        this.getView().getModel("newProspect").setProperty("/Kunn2", sm);
        this.getView().getModel("newProspect").setProperty("/Kunn2_name", vObj.SalesleadName);
        this.getView().getModel("newProspect").setProperty("/Parvw", 'SM');
        this.getView().getModel("newProspect").setProperty("/Vkorg", vObj.SalesOrganization);

        //  this.getView().byId("idInputSM").setValue(sm);
        //   debugger;
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
                actions: [sap.m.MessageBox.Action.OK],
                emphasizedAction: sap.m.MessageBox.Action.OK,
                onClose: function (sAction) {
                  if (sAction === 'Create Visit') {

                    that.fetchCustomer(result.Prospect.Kunnr, that.vkorg);
                    that.pDialogOpenProspect_d.close();

                  } else {
                    that.getView().byId("prospectIconTab").setSelectedKey("Ok");
                    setTimeout(() => {
                       history.go(-1);
                    }, 100);
                   
                  }
                },
                dependentOn: that.getView()
              });
              that.getView().getModel("newProspect").setData({});
              that.getView().setModel(new sap.ui.model.json.JSONModel({
                "Land1": "US"
              }), "newProspect");
                that.getView().getModel("newProspect").setProperty("/Vkorg", that.vkorg)
              that.dialogProspect.setBusy(false);



            },
            error: function (err) {
              // some error occuerd 
              that.dialogProspect.setBusy(false);

              if (JSON.parse(err.responseText).error.message.value) {

                var jsmsg = JSON.parse(err.responseText).error.message.value;
                var splitArray = jsmsg.split("<>");
                if (jsmsg.split("<>").length > 1) {
                  var msg1 = splitArray[0];
                  var msg2 = splitArray[1];
                  var msg3 = splitArray[2];
                  var msg4 = splitArray[3];
                  var msg5 = splitArray[4];

                }
                sap.m.MessageBox.error(msg1 + "\n" + msg2 + "\n" + msg3 + "\n" + msg4 + "\n" + msg5);

              } else {
                sap.m.MessageBox.error("There is an issue in creating new customer prospect. Please check data and try again.");
              }

            }
          }

        );

      },

      onSelectIconTab: function(oEvent){

        if( this.getView().getModel("newProspect").getProperty("/Vkorg") === ""){
         this.getView().getModel("newProspect").setProperty("/Vkorg", this.vkorg)

        }
        this.getView().byId("idSalesOrgSelec").setSelectedKey(this.getView().getModel("newProspect").getProperty("/Vkorg"))
      },

      onAddSalesOrg: function(oEvent){

        this.vkorg = oEvent.getSource().getSelectedKey();
         this.getView().getModel("newProspect").setProperty("/Vkorg", this.vkorg)
          this.getView().getModel("newProspect").setProperty("/Kunn2_name", "")
           this.getView().getModel("newProspect").setProperty("/Kunn2","")
       
      }
    });
  });