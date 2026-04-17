sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("customer.porky.zbpcontactcreate.controller.CreateContact", {
        onInit: function () {


          //  this.getView().byId("field0").setModel(this.getOwnerComponent().getModel("ZCFI_WEBEXDASH_BPCONTACT_CDS"));
            
            this.getView().setModel(new sap.ui.model.json.JSONModel({"Bpcontactfirstname": "",
                "Bpcontactfunction":"",
                "Bpcontactdepartment":"",
                "Bpcontactphone":"",
                "Bpcontactemail":"",
                "Bpcontactfirstname":"",
                "Bpcontactlastname":"",
                "Businesspartner":"",
                "Preferredphonetype":"M"

            }), "contactModel");

            this.getView().setModel(new sap.ui.model.json.JSONModel({
              "isNumberValidated":false

          }), "validatePhone");


            // this.getView().byId("smartform").setModel(this.getOwnerComponent().getModel("ZCFI_WEBEXDASH_BPCONTACT_CDS"));
       
            this.getView().byId("smartFilterBar").setModel(this.getOwnerComponent().getModel("ZCFI_WEBEXDASH_BPCONTACT_CDS"));
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteCreateContact").attachMatched(this._onRouteMatched, this);

            this.case = 'phone';

      
        },

        _onRouteMatched: function(oEvent){


            let defaultModel = this.getOwnerComponent().getModel("ZCXA_USERDEFAULT_CDS");
            var that = this;

            if(this.getOwnerComponent().getComponentData().startupParameters && this.getOwnerComponent().getComponentData().startupParameters.SalesOrganization && this.getOwnerComponent().getComponentData().startupParameters.SalesOrganization[0]  
        
            && this.getOwnerComponent().getComponentData().startupParameters.CompanyCode[0] 
        
            && this.getOwnerComponent().getComponentData().startupParameters.Telephone[0] )
                {

                    var that = this;
                    setTimeout(() => {
                        
                        that.getView().byId("smartFilterBar").setFilterData({SalesOrganization: this.getOwnerComponent().getComponentData().startupParameters.SalesOrganization[0] ,
                            CompanyCode :this.getOwnerComponent().getComponentData().startupParameters.CompanyCode[0]
                        })
                       // that.getView().getModel("contactModel").setProperty("/Businesspartner",this.getOwnerComponent().getComponentData().startupParameters.Customer[0]);
                        that.getView().getModel("contactModel").setProperty("/Bpcontactphone",this.getOwnerComponent().getComponentData().startupParameters.Telephone[0]);

                        

                    }, 500);
                    return;
                }

                    if(this.getOwnerComponent().getComponentData().startupParameters && this.getOwnerComponent().getComponentData().startupParameters.SalesOrganization && this.getOwnerComponent().getComponentData().startupParameters.SalesOrganization[0]  
        
            && this.getOwnerComponent().getComponentData().startupParameters.CompanyCode[0]  &&  this.getOwnerComponent().getComponentData().startupParameters.Customer
        
            &&  this.getOwnerComponent().getComponentData().startupParameters.Customer[0] )
                {

                    var that = this;
                    setTimeout(() => {
                        that.getView().byId("smartFilterBar").setFilterData({SalesOrganization: this.getOwnerComponent().getComponentData().startupParameters.SalesOrganization[0] ,
                            CompanyCode :this.getOwnerComponent().getComponentData().startupParameters.CompanyCode[0],
                            Customer :this.getOwnerComponent().getComponentData().startupParameters.Customer[0]
                        })
                         that.getView().getModel("contactModel").setProperty("/Businesspartner",this.getOwnerComponent().getComponentData().startupParameters.Customer[0]);
                         that.extractCustomer(this.getOwnerComponent().getComponentData().startupParameters.Customer[0]);

                       // that.getView().getModel("contactModel").setProperty("/Businesspartner",this.getOwnerComponent().getComponentData().startupParameters.Customer[0]);
                       // that.getView().getModel("contactModel").setProperty("/Bpcontactphone",this.getOwnerComponent().getComponentData().startupParameters.Telephone[0]);

                        

                    }, 500);
                    return;
                }
            defaultModel.read("/ZCXA_USERDEFAULT", {
                success: function (oData, oResponse) {


                    var salesorg = oData.results.find(element => element.parid === "VKO");

                    if (typeof salesorg !== "undefined") {

                        var dateToday = (new Date());
                    //    that.getView().getModel("userValues").setProperty("/salesorg", salesorg.parva);

                    setTimeout(() => {
                        that.getView().byId("smartFilterBar").setFilterData({SalesOrganization: salesorg.parva });

                    }, 200);

                        

                    }

                    var companycode = oData.results.find(element => element.parid === "BUK");

                    if (typeof companycode !== "undefined") {

                        var dateToday = (new Date());
                     //   that.getView().getModel("userValues").setProperty("/salesorg", companycode.parva);

                     setTimeout(() => {
                        that.getView().byId("smartFilterBar").setFilterData({CompanyCode: companycode.parva });

                     }, 200);

                        

                    }


                    


                },

                error: function (oError) {

                    sap.m.MessageBox.error(JSON.parse(oError.responseText).error.message.value                );
                }
            });


        },
        onCreateContact_final: function(){

          var that = this;
          var obj = this.getView().getModel("contactModel").getData();
          //  obj.Businesspartner = this.getView().byId("field0").getValue();
            let defaultModel1 = this.getOwnerComponent().getModel();

            var selObj = this.getView().getModel("contactModel").getData();

         

            if(selObj.Businesspartner.trim() === ''){
                

                if(this.getView().byId("bpPartner").getValue().trim() === ''){
                    this.getView().byId("bpPartner").setValueState("Error");
                    this.getView().byId("smartFilterBar").getControlByKey("Customer").setValueState("Error")
                }else{
                    this.getView().byId("bpPartner").setValueState("None");
                    this.getView().byId("smartFilterBar").getControlByKey("Customer").setValueState("None")

                 
                }
              //  sap.m.MessageBox.show("Please enter all mandatory fields");
           //     return;
            }else{
                this.getView().byId("smartFilterBar").getControlByKey("Customer").setValueState("None")

            }


            if(selObj.Bpcontactphone.trim() === ''){
                

                if(this.getView().byId("telenumber").getValue().trim() === ''){
                    this.getView().byId("telenumber").setValueState("Error");
                }else{
                    this.getView().byId("telenumber").setValueState("None");
                 
                }
              //  sap.m.MessageBox.show("Please enter all mandatory fields");
           //     return;
            }else{
                this.getView().byId("telenumber").setValueState("None");

            }



            if(selObj.Bpcontactfirstname.trim() === ''){
                

                if(this.getView().byId("firstname").getValue().trim() === ''){
                    this.getView().byId("firstname").setValueState("Error");
                }else{
                    this.getView().byId("firstname").setValueState("None");
                 
                }
              //  sap.m.MessageBox.show("Please enter all mandatory fields");
           //     return;
            }else{
                this.getView().byId("firstname").setValueState("None");

            }


            if(selObj.Bpcontactdepartment.trim() === ''){
                

                if(this.getView().byId("deptName").getValue().trim() === ''){
                    this.getView().byId("deptName").setValueState("Error");
                }else{
                    this.getView().byId("deptName").setValueState("None");
                 
                }
              //  sap.m.MessageBox.show("Please enter all mandatory fields");
           //     return;
            }else{
                this.getView().byId("deptName").setValueState("None");
 
            }
            //



            if(selObj.Businesspartner.trim() === '' || selObj.Bpcontactphone.trim() === '' || selObj.Bpcontactfirstname.trim() === '' || selObj.Bpcontactdepartment.trim() === '' || selObj.Bpcontactlastname.trim() === ''){
                

                sap.m.MessageBox.show("Please enter all mandatory fields");
                return;
            }

            if(obj.PrevCustName){
              delete obj.PrevCustName;
            }

            
            defaultModel1.create("/bpcontactpersonSet",obj, {
                
                success: function (oData, oResponse) {
                  // var plant = oData.results.find(element => element.parid === "WRK");
                 // var oDataResults = oData;
              //    debugger;
                    that.onResetContact();
                    sap.m.MessageBox.show(oData.Return.Message);
                 
                  
      
        
      
                },
      
                error: function (oError) {
  
                   //   debugger;
                  sap.m.MessageBox.error(JSON.parse(oError.responseText).error.message.value                );
      
                 // that.getView().setModel(new sap.ui.model.json.JSONModel({}, "lowestValuePO"));
                }
              });
        },

        onCreateContact: function(){

          
          var that = this;

          if(this.getView().getModel("contactModel").getProperty("/Bpcontactaction") !== 'REASSIGN' && this.getView().getModel("contactModel").getProperty("/Bpcontactaction") !== 'ASSIGN'){

            // if(this.getView().byId("telenumber").getValueState() !== 'Success')
            //   {
            //     sap.m.MessageBox.error("Please validate telephone number");
            //     return;

            //   }else{
            //     this.getView().getModel("contactModel").setProperty("/Bpcontactaction","SUBMIT");
            //   }
            if(this.getView().getModel("validatePhone").getProperty("/isNumberValidated") === true){

            
              this.getView().getModel("contactModel").setProperty("/Bpcontactaction","SUBMIT");
            }else{
              sap.m.MessageBox.error("Please validate telephone number");
              return;
            }

          }
           
          if(this.getView().getModel("contactModel").getProperty("/Bpcontactaction") === 'SUBMIT'){
          sap.m.MessageBox.warning("This action will add this contact for customer "+this.getView().getModel("customerAddressModel").getProperty("/CustomerName")+"?", {
            actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
            emphasizedAction: sap.m.MessageBox.Action.OK,
            onClose: function (sAction) {

              if(sAction === 'CANCEL'){

              }else{
                that.onCreateContact_final();

              }
            //  MessageToast.show("Action selected: " + sAction);
             // debugger;
            },
            dependentOn: this.getView()
          });

        }else if (this.getView().getModel("contactModel").getProperty("/Bpcontactaction") === 'ASSIGN'){


          //This option will keep all existing accounts and add 1016 St. Nicholas Avenue New York to Benjamin H.Are you to perform this option?
          sap.m.MessageBox.warning("This action will assign existing Contact Person "+this.getView().getModel("contactModel").getProperty("/Bpcontactperson")+" "+this.getView().getModel("contactModel").getProperty("/Bpcontactfirstname") +" "+this.getView().getModel("contactModel").getProperty("/Bpcontactlastname") +" to Customer "+this.getView().getModel("contactModel").getProperty("/Bpcontactpartner")+" ("+this.getView().getModel("customerAddressModel").getProperty("/CustomerName")+"). Do you want to continue??", {
            actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
            emphasizedAction: sap.m.MessageBox.Action.OK,
            onClose: function (sAction) {

              if(sAction === 'CANCEL'){

              }else{
                that.onCreateContact_final();

              }
            //  MessageToast.show("Action selected: " + sAction);
             // debugger;
            },
            dependentOn: this.getView()
          });

        }else if (this.getView().getModel("contactModel").getProperty("/Bpcontactaction") === 'REASSIGN'){

          sap.m.MessageBox.warning("This action will remove Contact Person "+this.getView().getModel("contactModel").getProperty("/Bpcontactperson")+" "+this.getView().getModel("contactModel").getProperty("/Bpcontactfirstname")+" "+this.getView().getModel("contactModel").getProperty("/Bpcontactlastname")+" from Customer "+this.getView().getModel("contactModel").getProperty("/Bpcontactpartner")+" ("+this.getView().getModel("contactModel").getProperty("/PrevCustName")+") and assign to customer "+this.getView().getModel("contactModel").getProperty("/Businesspartner")+" ("+this.getView().getModel("customerAddressModel").getProperty("/CustomerName")+"). Do you want to continue? ", {
            actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
            emphasizedAction: sap.m.MessageBox.Action.OK,
            onClose: function (sAction) {

              if(sAction === 'CANCEL'){

              }else{
                that.onCreateContact_final();

              }
            //  MessageToast.show("Action selected: " + sAction);
             // debugger;
            },
            dependentOn: this.getView()
          });
        }




            
        },

        onResetContact: function(){
            this.getView().setModel(new sap.ui.model.json.JSONModel({
                "Bpcontactfunction":"",
                "Bpcontactdepartment":"",
                "Bpcontactphone":"",
                "Bpcontactemail":"",
                "Bpcontactfirstname":"",
                "Bpcontactlastname":"",
                "Businesspartner":"",
                 "Preferredphonetype":"M"
            }), "contactModel");
            this.getView().setModel(new sap.ui.model.json.JSONModel({"name": "",
            
            }), "customerModel");
            this.getView().byId("telenumber").setEditable(true); 
            this.getView().byId("idemail").setEditable(true); 

            

            this.getView().byId("smartFilterBar").getControlByKey("Customer").setValue("");
            this.getView().setModel(new sap.ui.model.json.JSONModel({}), "customerAddressModel");
            // this.getView().byId("field0").setValue("");
            // this.getView().byId("field0").setValueState("None");
            this.getView().getModel("validatePhone").setProperty("/isNumberValidated",false);

        },

        onSearchBPFilters: function(oEvent){
          var customer =  oEvent.getSource().getFilterData().Customer;
          this.extractCustomer(customer);
          this.getView().setModel(new sap.ui.model.json.JSONModel({"name": oEvent.getSource().getControlByKey("Customer").getValue().split(" (")[0].trim(),
            
        }), "customerModel");
          this.getView().getModel("contactModel").setProperty("/Businesspartner",customer);

          this.validateEmail(null);
          this.validatePhoneNumber(null);

        },

        validateEmail: function (oEvent) {
          var that = this;
            var email;
            this.case = 'email';

            if(oEvent !== null){
            if(oEvent.getSource().getId().includes("buttonStatus")            ){
              email = this.getView().getModel("contactModel").getProperty("/Bpcontactemail");
         
              this.getView().byId("idemail").setValueState("None");

              if(this.getView().getModel("contactModel").getProperty("/Businesspartner") === ''){

                sap.m.MessageBox.error("Please select customer");
                return;
              }
              this.getView().byId("idemail").setValueState("None");

            }else{
              oEvent.getSource().setValueState("None");

            email = oEvent.mParameters.value;
         
            oEvent.getSource().setValueState("None");
            // if(this.getView().getModel("contactModel").getProperty("/Businesspartner") === ''){

            //  // sap.m.MessageBox.error("Please select customer");
            //   return;
            // }

            }

          
    
    
         //   var email = oEvent.getSource().getValue();
    
            this.emailValidate = oEvent.getSource();
            

          }else{
            this.emailValidate = this.getView().byId("idemail").getValue();
            email = this.getView().byId("idemail").getValue();
          }
            var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
    
            if (!mailregex.test(email)) {
              if (email === '') {
                return;
              }
    
              sap.m.MessageToast.show(email + " is not a valid email address");
    
              this.getView().byId("idemail").setValueState(sap.ui.core.ValueState.Error);
              // oEvent.getSource().setValue('')
              return;
            } else {

              if(this.getView().getModel("contactModel").getProperty("/Businesspartner") === ''){

                // sap.m.MessageBox.error("Please select customer");
                 return;
               }


              let defaultModel = this.getOwnerComponent().getModel("ZCFI_WEBEXDASH_BPCONTACT_CDS");


              this.getView().byId("idemail").setValueState(sap.ui.core.ValueState.None);

              var filterSupplier2 =
              new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ,  that.getView().byId("smartFilterBar").getFilterData().SalesOrganization);;

              var filterSupplier3 =
              new sap.ui.model.Filter("ContactPersonEmail", sap.ui.model.FilterOperator.EQ,  email);;


            var filterSupplier4 =
            new sap.ui.model.Filter("Customer", sap.ui.model.FilterOperator.NE, that.getView().byId("smartFilterBar").getFilterData().Customer);;


            defaultModel.read("/ZCFI_WEBEXDASH_BPCONTACT", {
              urlParameters: {
    
    
              },
              filters: [ filterSupplier3],
              success: function (oData, oResponse) {
                that.getView().setBusy(false);
                // var plant = oData.results.find(element => element.parid === "WRK");
              //  that.getView().getModel("flagValueModel").setProperty("/mobileNumberValidated",true);

                var oDataResults = oData;
                if (oDataResults.results.length > 0) {
                  that.getView().setModel(new sap.ui.model.json.JSONModel(oDataResults
                  ), "mobileKeyDeptModel");
           //       that.mobileValidate.setValueState("None");
                  
                  that.openMobileValidateView();
                } else {
          //        that.mobileValidate.setValueState("Success");
    
                }
              },
    
              error: function (oError) {
                that.getView().getModel("flagValueModel").setProperty("/mobileNumberValidated",true);
    
                that.getView().setBusy(false);
              }
            });
          }






    
            
    
    
           
    
    
    
    
          },

          extractCustomer: function(customer){

            let defaultModel = this.getOwnerComponent().getModel("ZCFI_WEBEXDASH_BPCONTACT_CDS");
            var that = this;

            var Filter = new sap.ui.model.Filter('Customer', 'EQ', customer);

            defaultModel.read("/ZI_BP_VALUEHELP", 
                {
                    filters: [Filter]  ,

                success: function (oData, oResponse) {

                 //   debugger;
                    that.getView().setModel(new sap.ui.model.json.JSONModel(oData.results[0]), "customerAddressModel");


                },

                error: function (oError) {

                    sap.m.MessageBox.error(JSON.parse(oError.responseText).error.message.value                );
                }
            });


          },

          validateExistingUser: function(oEvent){

          },

          validatePhoneNumber: function (oEvent) {
          //  debugger;
          this.getView().getModel("validatePhone").setProperty("/isNumberValidated",false);

          var email;
          this.case = 'phone';

          if(oEvent !== null){
            if(oEvent.getSource().getId().includes("buttonStatus")            ){
              email = this.getView().getModel("contactModel").getProperty("/Bpcontactphone");
         
              this.getView().byId("telenumber").setValueState("None");

              if(this.getView().getModel("contactModel").getProperty("/Businesspartner") === ''){

                sap.m.MessageBox.error("Please select customer");
                return;
              }

            }else{
            email = oEvent.mParameters.value;
         
            oEvent.getSource().setValueState("None");
            if(this.getView().getModel("contactModel").getProperty("/Businesspartner") === ''){

             // sap.m.MessageBox.error("Please select customer");
              return;
            }

            }
            
          }else{
            email = this.getView().byId("telenumber").getValue();
          }
    
    
            var mailregex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    
            if (!mailregex.test(email)) {
    
              if (email === '') {
                return;
              }
            //  sap.m.MessageBox.show(email + " is not a valid phone number");
    
            this.getView().byId("telenumber").setValueState(sap.ui.core.ValueState.Error);
            //  oEvent.getSource().setValue('')
              return;
            } else {
              this.getView().setBusy(true);
              this.getView().byId("telenumber").setValueState(sap.ui.core.ValueState.None);
    
            
             // this.getView().getModel("flagValueModel").setProperty("/mobileNumberValidated",false);
            //  if(email.includes("(") && email.includes(")")){
            // var email1 = email.split("(")[1].split(")").join("");
            //  }
              
    
    
            let defaultModel = this.getOwnerComponent().getModel("ZCFI_WEBEXDASH_BPCONTACT_CDS");
            var that = this;
            that.mobileValidate =this.getView().byId("telenumber")
    
            // var filterSupplier =
            //   new sap.ui.model.Filter("Customer", sap.ui.model.FilterOperator.EQ,  that.getView().byId("smartFilterBar").getFilterData().Customer);;
    
            var filtersalesorg =
              new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ,  that.getView().byId("smartFilterBar").getFilterData().SalesOrganization);;

              var filterSupplier_blankSalesOrg =
              new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ,  null);;

              if(email.includes("(") && email.includes(")")){
              var filterSupplier3 =
              new sap.ui.model.Filter("MobilePhoneFormatted", sap.ui.model.FilterOperator.EQ,  email.split("")[1]+email.split("")[2]+email.split("")[3]+email.split("")[6]+email.split("")[7]+email.split("")[8]+email.split("")[10]+email.split("")[11]+email.split("")[12]+email.split("")[13]
            );;
            var filterSupplier31 =
            new sap.ui.model.Filter("TelephoneFormatted", sap.ui.model.FilterOperator.EQ,  email.split("")[1]+email.split("")[2]+email.split("")[3]+email.split("")[6]+email.split("")[7]+email.split("")[8]+email.split("")[10]+email.split("")[11]+email.split("")[12]+email.split("")[13]
          );;

        


     
           var filter2scenario = new sap.ui.model.Filter([filterSupplier3,
            filterSupplier31
         ],false);

        }else{
          var filter2scenario = new sap.ui.model.Filter([ new sap.ui.model.Filter("TelephoneFormatted", sap.ui.model.FilterOperator.EQ,  email)],false);
        }

         var filter2_v1scene = new sap.ui.model.Filter([filter2scenario,
          filtersalesorg
       ],true);

         var filter2_v2scene = new sap.ui.model.Filter([filter2scenario,
          filterSupplier_blankSalesOrg
       ],true);

            defaultModel.read("/ZCFI_WEBEXDASH_BPCONTACT", {
              urlParameters: {
    
    
              },
              filters: [new sap.ui.model.Filter([filter2_v1scene,
                filter2_v2scene
             ],false)],
              success: function (oData, oResponse) {
                that.getView().setBusy(false);
                // var plant = oData.results.find(element => element.parid === "WRK");
              //  that.getView().getModel("flagValueModel").setProperty("/mobileNumberValidated",true);

                var oDataResults = oData;
                if (oDataResults.results.length > 0) {
                  that.getView().setModel(new sap.ui.model.json.JSONModel(oDataResults
                  ), "mobileKeyDeptModel");
                  that.mobileValidate.setValueState("None");
                  
                  that.openMobileValidateView();

                } else {
                  that.getView().getModel("validatePhone").setProperty("/isNumberValidated",true);
                    //        that.mobileValidate.setValueState("Success");
    
                }
              },
    
              error: function (oError) {
                that.getView().getModel("validatePhone").setProperty("/isNumberValidated",false);

                that.getView().getModel("flagValueModel").setProperty("/mobileNumberValidated",true);
    
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
                name: "customer.porky.zbpcontactcreate.view.keydeptmobile",
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
                name: "customer.porky.zbpcontactcreate.view.keydeptmobile",
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

          onRemoveMobileAssignment: function(oEvent){
            var obj = oEvent.getSource().getBindingContext("mobileKeyDeptModel").getObject();
            var contactModel = this.getView().getModel("contactModel");

            contactModel.setProperty("/Bpcontactfirstname",obj.ContactPersonFirstName);
            contactModel.setProperty("/Bpcontactlastname",obj.ContactPersonLastName);
            
            contactModel.setProperty("/Bpcontactemail",obj.ContactPersonEmail);
            contactModel.setProperty("/Bpcontactdepartment",obj.ContactPersonDepartment);
            contactModel.setProperty("/Bpcontactperson",obj.ContactPeson);
            contactModel.setProperty("/Bpcontactfunction",obj.ContactPersonFunction);
            contactModel.setProperty("/Bpcontactpartner",obj.Customer);
            contactModel.setProperty("/PrevCustName",obj.CustomerName);

            contactModel.setProperty("/Bpcontactaction","REASSIGN");
            oEvent.getSource().getParent().getParent().getParent().getParent().close()
            if(this.case === 'phone'){
              this.getView().byId("telenumber").setEditable(false);
              this.getView().byId("idemail").setEditable(true);

              }else{
              this.getView().byId("idemail").setEditable(false);
              this.getView().byId("telenumber").setEditable(true);

              }
            
         //   contactModel.setProperty("/Bpcontactphone",obj.);
            // contactModel.setProperty("/Bpcontactfirstname","");
            // contactModel.setProperty("/Bpcontactfirstname","");


          },

          onAssignMobileAssignment: function(oEvent){

            var obj = oEvent.getSource().getBindingContext("mobileKeyDeptModel").getObject();
            var contactModel = this.getView().getModel("contactModel");

            contactModel.setProperty("/Bpcontactfirstname",obj.ContactPersonFirstName);
            contactModel.setProperty("/Bpcontactlastname",obj.ContactPersonLastName);
            contactModel.setProperty("/Bpcontactemail",obj.ContactPersonEmail);
            contactModel.setProperty("/Bpcontactdepartment",obj.ContactPersonDepartment);
            contactModel.setProperty("/Bpcontactperson",obj.ContactPeson);
            contactModel.setProperty("/Bpcontactfunction",obj.ContactPersonFunction);
       
            contactModel.setProperty("/Bpcontactaction","ASSIGN");
            oEvent.getSource().getParent().getParent().getParent().getParent().close()

            if(this.case === 'phone'){
              this.getView().byId("telenumber").setEditable(false);
              this.getView().byId("idemail").setEditable(true);

              }else{
              this.getView().byId("idemail").setEditable(false);
              this.getView().byId("telenumber").setEditable(true);
              contactModel.setProperty("/Bpcontactphone",obj.PreferredPhoneNumber);
              if(obj.PreferredPhoneNumber === ''){
                contactModel.setProperty("/Bpcontactphone",obj.Telephone);
             
              }
              if(obj.Telephone === ''){
                contactModel.setProperty("/Bpcontactphone",obj.MobilePhone);
             
              }



              }
            
         //   contactModel.setProperty("/Bpcontactphone",obj.);
            // contactModel.setProperty("/Bpcontactfirstname","");
            // contactModel.setProperty("/Bpcontactfirstname","");





          },
          handleClose: function(oEvent){
            return;
            debugger;
          },

          onClickCancel: function(oEvent){
            oEvent.getSource().getParent().close()

          //  debugger;
          }
    });
});
