sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("customer.porky.zmmcatalogmnt.controller.UserView", {

		onInit: function () {

        },
		onTableRowSelectionChange: function(oEvent){
		//	debugger;

			var obj = oEvent.mParameters.rowContext.getObject();

			var model = this.getOwnerComponent().getModel("shiptoUserModel");
			model.setProperty("/SalesOrganization",obj.SalesOrganization);
			model.setProperty("/Shipto",obj.Shipto);
			model.setProperty("/CatalogId",obj.CatalogId);
			model.setProperty("/ATS",obj.ATS);
			model.setProperty("/itemproposal","Y");

			

			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("RouteView1");

		}
	});
});