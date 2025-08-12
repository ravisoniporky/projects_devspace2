sap.ui.define([
    "sap/m/MessageToast",
	"sap/ui/core/format/DateFormat",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], (MessageToast, DateFormat, Controller, JSONModel) => {
    "use strict";

    return Controller.extend("customer.porky.zporkyagent.controller.MainScreen", {
      		onInit: function() {
			// set mock model
			var sPath = sap.ui.require.toUrl("sap/m/sample/Feed/feed.json");
            var oFormat = DateFormat.getDateTimeInstance({ style: "medium" });
			var oModel = new JSONModel();
            var oDate = new Date();
			var sDate = oFormat.format(oDate);
            var data = {
                "EntryCollection" : [{
                    "Author": "Sales Agent",
                    "AuthorPicUrl": "sap-icon://customer-and-contacts",
                    "Type" : "Request",
                    "Date" : sDate,
                    "Text" : "HI I am an AI Agent. I am ready to help. Please tell me how may I assist you..."
                }]
            }

            oModel.setData(data);
			this.getView().setModel(oModel);
		},



		onPost: function(oEvent) {
			var oFormat = DateFormat.getDateTimeInstance({ style: "medium" });
			var oDate = new Date();
			var sDate = oFormat.format(oDate);
			// create new entry
			var sValue = oEvent.getParameter("value");
			var oEntry = {
				Author: "You",
				AuthorPicUrl: "sap-icon://person-placeholder",
				Type: "Reply",
				Date: "" + sDate,
				Text: sValue
			};

			// update model
			var oModel = this.getView().getModel();
			var aEntries = oModel.getData().EntryCollection;
			aEntries.push(oEntry);
			oModel.setData({
				EntryCollection: aEntries
			});
            this.triggerChatAgent(sValue);
		},
        triggerChatAgent: function(sValue){

            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://n8n.srv921954.hstgr.cloud/webhook/914f7aa3-6ef5-4789-8a7a-46e1bb064622', true);

          
            xhr.setRequestHeader('Authorization', 'Basic cmF2aXNvbmkxODpNaXZhYW4xQCM0');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            var that = this;
            this.xhr = xhr;
            xhr.onload = function (e) {
                // do something to response
                //   console.log(that.xhr);
            //     console.log("Success -" + this.responseText);
            //  //   that.getView().byId("page").setTitle(this.responseText);
            //     that.getView().setModel(new sap.ui.model.json.JSONModel(
            //         JSON.parse(this.responseText)
            //     ), "orderInfoModel");
            // debugger;

            };
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var res = JSON.parse(xhr.response);
                //   debugger;

                var oFormat = DateFormat.getDateTimeInstance({ style: "medium" });
                var oDate = new Date();
                var sDate = oFormat.format(oDate);
                // create new entry
                var oEntry = {
                    Author: "Sales Agent",
                    AuthorPicUrl: "sap-icon://customer-and-contacts",
                    Type: "Reply",
                    Date: "" + sDate,
                    Text: res.output
                };
    
                // update model
                var oModel = that.getView().getModel();
                var aEntries = oModel.getData().EntryCollection;
                aEntries.push(oEntry);
                oModel.setData({
                    EntryCollection: aEntries
                });

                }else if(xhr.readyState === 4  && (xhr.status === 500 || xhr.status === 501)){
                //    sap.m.MessageBox.error("There is an error submitting this note");


                var res = JSON.parse(xhr.response);
                //   debugger;

                var oFormat = DateFormat.getDateTimeInstance({ style: "medium" });
                var oDate = new Date();
                var sDate = oFormat.format(oDate);
                // create new entry
                var oEntry = {
                    Author: "Sales Agent",
                    AuthorPicUrl: "sap-icon://customer-and-contacts",
                    Type: "Reply",
                    Date: "" + sDate,
                    Text: res.message
                };
    
                // update model
                var oModel = that.getView().getModel();
                var aEntries = oModel.getData().EntryCollection;
                aEntries.push(oEntry);
                oModel.setData({
                    EntryCollection: aEntries
                });
                }
            };
          
            var data = {
                "message": sValue, // product ID from above call
               
                };
            xhr.send(JSON.stringify(data));
        },

		onSenderPress: function(oEvent) {
			MessageToast.show("Clicked on Link: " + oEvent.getSource().getSender());
		},

		onIconPress: function(oEvent) {
			MessageToast.show("Clicked on Image: " + oEvent.getSource().getSender());
		},

        onNavigateSalesAgent: function(oEvent){
            var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("View1");
        },

        openWhatsappBroadcast: function(oEvent){

            this.isOldMaterial = true;
            if (!this.pDialogUser) {
              this.pDialogUser = this.loadFragment({
                name: "customer.porky.zporkyagent.view.Whatsapp"
              });
            } else {
    
              if (this.pDialogUser1) {
                this.pDialogUser1.destroy();
                this.pDialogUser = undefined;
                this.pDialogUser1 = undefined;
                this.pDialogUser = this.loadFragment({
                  name: "customer.porky.zporkyagent.view.Whatsapp"
                });
              }
            }
            var that = this;
            this.pDialogUser.then(function (oDialog) {
    
              that.pDialogUser1 = oDialog;
    
              oDialog.open();
             
         
    
            });
            var that = this;
            this.getView().addDependent(this.pDialogUser);

        },
        onPressBroadcastMessage: function(oEvent){

            var text = this.getView().byId("idTextArea").getValue();






            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://n8n.srv921954.hstgr.cloud/webhook/443e6261-a8de-4233-8103-288d1a3adc4f', true);

          
            xhr.setRequestHeader('Authorization', 'Basic cmF2aXNvbmkxODpNaXZhYW4xQCM0');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            var that = this;
            this.xhr = xhr;
            xhr.onload = function (e) {
                // do something to response
                //   console.log(that.xhr);
            //     console.log("Success -" + this.responseText);
            //  //   that.getView().byId("page").setTitle(this.responseText);
            //     that.getView().setModel(new sap.ui.model.json.JSONModel(
            //         JSON.parse(this.responseText)
            //     ), "orderInfoModel");
            // debugger;

            };
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var res = JSON.parse(xhr.response);
                //   debugger;

                sap.m.MessageToast.show("Broadcast sent successfully");

                that.pDialogUser1.close();

                }else if(xhr.readyState === 4  && (xhr.status === 500 || xhr.status === 501)){
                //    sap.m.MessageBox.error("There is an error submitting this note");


                var res = JSON.parse(xhr.response);
                //   debugger;
                that.pDialogUser1.close();
              
                }
            };
          
            var data = {
                "message": text, // product ID from above call
               
                };
            xhr.send(JSON.stringify(data));

        }
    });
});