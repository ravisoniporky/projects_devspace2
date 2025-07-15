sap.ui.define([], function () {
    "use strict";
    return sap.ui.controller("customer.porky.zsdcustsodashe2.ext.controller.extension", {

        onAfterRendering: function() {
			//Get reference of Global FIlter

			var oGlobalFilter = this.getView().byId("ovpGlobalFilter");
			

            var oData = {"Customer" : oGlobalFilter.getFilterData().Customer.items[0].key,
				"CompanyCode":oGlobalFilter.getFilterData().CompanyCode.items[0].key,
				"SalesOrganization":oGlobalFilter.getFilterData().SalesOrganization.items[0].key
			};
            this.getOwnerComponent().getModel("filterModel").setData(oData)

			// //Create JSON data to be defaulted
			// var oToday = new Date();
			// var o90DayesEarlier = new Date();
			// o90DayesEarlier.setDate(o90DayesEarlier.getDate() - 90);
			// var oDefaultFilter = {
			// 	InspectionDate: {
			// 			low: o90DayesEarlier,
			// 			high: oToday
			// 	}
			// };

			// //Default the Goabl filter values
			// oGlobalFilter.setFilterData(oDefaultFilter);
		}
    
    });
});

