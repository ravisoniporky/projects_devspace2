sap.ui.define([], function () {
    "use strict";
    return sap.ui.controller("customer.porky.zcustardash.ext.controller.extension", {

        onAfterRendering1: function() {
			//Get reference of Global FIlter

         //   debugger;
			var oGlobalFilter = this.getView().byId("ovpGlobalFilter");
			

            var oData = {"customer" : oGlobalFilter.getFilterData().Customer.items[0].key};
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
		},
		     onAfterRendering: function() {
			if (this._autoSearchDone) { return; }
			this._autoSearchDone = true;
			var oGlobalFilter = this.getView().byId("ovpGlobalFilter");
			if (!oGlobalFilter) { return; }
			setTimeout(function() {
				oGlobalFilter.search();
			}, 0);
		}
    
    });
});

