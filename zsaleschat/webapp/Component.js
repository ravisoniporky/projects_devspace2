sap.ui.define([
    "sap/ui/core/UIComponent",
    "shell/porky/zsaleschat/zsaleschat/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("shell.porky.zsaleschat.zsaleschat.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();
         //  this.createContent()
        },

        createContent : function () {

            
            if(!document.getElementById("chatbot")){
                var newElement = document.createElement("script");
                newElement.setAttribute("id","chatbot");
                   newElement.setAttribute("type","module");

                   var htmlContent = "import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';createChat({webhookUrl: 'https://n8n.porky.com/webhook/ca5d5391-7830-49f2-9b12-e9f037dfce70/chat'});"
                   newElement.insertAdjacentHTML('afterbegin', htmlContent);
 document.body.appendChild(newElement)
             
                 

                  var newElement = document.createElement("link");
                newElement.setAttribute("href","https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css");
                 newElement.setAttribute("rel","stylesheet");
                document.body.appendChild(newElement)

            }
        }
    });
});