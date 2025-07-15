sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    return {
        onSaveMaterial: function(oEvent) {
            MessageToast.show("Custom handler invoked.");
       //     debugger;
            var that = this;
            var obj = oEvent.getSource().getParent().getParent().getBindingContext().getObject();
        var data = {
            "product": obj.Product, // product ID from above call
            "vkorg": obj.Vkorg, //same as above get from user parm
            "matnr" : obj.Matnr,
            "cimage": obj.Cimage // copy from getdetail call
            };
            this.sendXREFReqMaterial(obj.Product,obj.Vkorg,obj.Matnr,obj.Cimage);
        },
        onSaveNote: function(oEvent){
            MessageToast.show("2Custom handler invoked.");

        },

        sendXREFReqMaterial: function (product,vkorg,matnr,cimage) {

            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://api.porky.com/sap/zws_bc_bapi/ZBAPI_BCZbapiUpdCoXref', true);

            if(window.location.href.includes("DE2") || window.location.href.includes("de2")){
                xhr.setRequestHeader('X-PORKY-SYSID', 'DE2');
            }else if(window.location.href.includes("QA2") || window.location.href.includes("qa2")){
                xhr.setRequestHeader('X-PORKY-SYSID', 'QA2');
            }else{
            xhr.setRequestHeader('X-PORKY-SYSID', 'PRD');
            }
            xhr.setRequestHeader('X-PORKY-AUTH', 'cm1lbGxveTpsdWNreW1l');
            xhr.withCredentials = true;
            xhr.setRequestHeader('X-PORKY-APPID', 'XREF Tool');
            xhr.setRequestHeader('X-PORKY-APIKEY', '6bb0b04a-0466-490e-a8a5-53278b3df025');
            xhr.setRequestHeader('Authorization', 'Basic cm1lbGxveTpsdWNreW1l');
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
                    console.log(that.xhr);
                    console.log(res);
                    // debugger;
                    sap.m.MessageBox.show("Request submitted successfully");
                }
            };
            var data = {
                "product": product, // product ID from above call
                "vkorg": vkorg, //same as above get from user parm
                "matnr" : matnr,
                "cimage": cimage // copy from getdetail call
                };
            xhr.send(JSON.stringify(data));
        },

        sendXREFReqNote: function (product,vkorg,matnr,cimage) {

            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://api.porky.com/sap/zws_bc_bapi/ZBAPI_BCZbapiUpdCoXref', true);

            if(window.location.href.includes("DE2") || window.location.href.includes("de2")){
                xhr.setRequestHeader('X-PORKY-SYSID', 'DE2');
            }else if(window.location.href.includes("QA2") || window.location.href.includes("qa2")){
                xhr.setRequestHeader('X-PORKY-SYSID', 'QA2');
            }else{
            xhr.setRequestHeader('X-PORKY-SYSID', 'PRD');
            }
            xhr.setRequestHeader('X-PORKY-AUTH', 'cm1lbGxveTpsdWNreW1l');
            xhr.withCredentials = true;
            xhr.setRequestHeader('X-PORKY-APPID', 'XREF Tool');
            xhr.setRequestHeader('X-PORKY-APIKEY', '6bb0b04a-0466-490e-a8a5-53278b3df025');
            xhr.setRequestHeader('Authorization', 'Basic cm1lbGxveTpsdWNreW1l');
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
                    console.log(that.xhr);
                    console.log(res);
                    // debugger;
                    sap.m.MessageBox.show("Request submitted successfully");
                }
            };
            var data = {
                "product": product, // product ID from above call
                "vkorg": vkorg, //same as above get from user parm
                "matnr" : matnr,
                "cimage": cimage // copy from getdetail call
                };
            xhr.send(JSON.stringify(data));
        },
    };
});