sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller, JSONModel) => {
    "use strict";

    // Page size used when re-reading rows to build the column totals.
    const TOTALS_PAGE_SIZE = 5000;

    // Numeric fields that get summed, paired with the field holding their unit/currency.
    const SUM_FIELDS = [
        { field: "DeliveryQuantity", target: "deliveryQuantity", unitField: "OrderQuantityUnit", unitTarget: "quantityUnit" },
        { field: "OrderQuantity", target: "orderQuantity", unitField: "OrderQuantityUnit", unitTarget: "quantityUnit" },
        { field: "NetWeight", target: "netWeight", unitField: "WeightUnit", unitTarget: "weightUnit" },
        { field: "SalesPriceAmount", target: "salesPriceAmount", unitField: "SalesPriceCurrency", unitTarget: "currency" }
    ];

    const SELECT = "DeliveryQuantity,OrderQuantity,NetWeight,SalesPriceAmount,OrderQuantityUnit,WeightUnit,SalesPriceCurrency";

    const emptyTotals = () => ({
        busy: false,
        deliveryQuantity: null,
        orderQuantity: null,
        netWeight: null,
        salesPriceAmount: null,
        quantityUnit: "",
        weightUnit: "",
        currency: ""
    });

    return Controller.extend("customer.porky.zreturnordcust.controller.View1", {

        onInit() {
            this.getView().setModel(new JSONModel(emptyTotals()), "totals");
        },

        onBeforeRebindTable(oEvent) {
            const mBindingParams = oEvent.getParameter("bindingParams");
            mBindingParams.parameters = mBindingParams.parameters || {};

            // Guarantee the fields shown in the custom columns (and their units) are read.
            const aSelect = String(mBindingParams.parameters.select || "").split(",").filter(Boolean);
            SELECT.split(",").forEach((sField) => {
                if (aSelect.indexOf(sField) === -1) {
                    aSelect.push(sField);
                }
            });
            mBindingParams.parameters.select = aSelect.join(",");

            // Re-query the column totals in a separate request every time the table (re)loads.
            this._loadTotals(mBindingParams.filters || []);
        },

        _loadTotals(aFilters) {
            const oModel = this.getView().getModel();
            const oTotals = this.getView().getModel("totals");
            if (!oModel) {
                return;
            }

            // Token guards against overlapping requests from rapid rebinds.
            this._iTotalsToken = (this._iTotalsToken || 0) + 1;
            const iToken = this._iTotalsToken;
            const isStale = () => iToken !== this._iTotalsToken;

            oTotals.setProperty("/busy", true);

            const mSums = {};
            const mUnits = {};
            SUM_FIELDS.forEach((o) => { mSums[o.field] = 0; });

            const pickUnit = (sTarget, sValue) => {
                if (!sValue) {
                    return;
                }
                const oUnit = mUnits[sTarget] = mUnits[sTarget] || { value: "", mixed: false };
                if (!oUnit.value) {
                    oUnit.value = sValue;
                } else if (oUnit.value !== sValue) {
                    oUnit.mixed = true;
                }
            };

            const readPage = (iSkip) => {
                oModel.read("/ZC_RETURNORDERSUMMARY_VE", {
                    filters: aFilters,
                    urlParameters: {
                        "$select": SELECT,
                        "$top": TOTALS_PAGE_SIZE,
                        "$skip": iSkip
                    },
                    success: (oData) => {
                        if (isStale()) {
                            return;
                        }
                        const aResults = (oData && oData.results) || [];
                        aResults.forEach((oRow) => {
                            SUM_FIELDS.forEach((o) => {
                                mSums[o.field] += parseFloat(oRow[o.field]) || 0;
                                pickUnit(o.unitTarget, oRow[o.unitField]);
                            });
                        });

                        if (aResults.length === TOTALS_PAGE_SIZE) {
                            readPage(iSkip + TOTALS_PAGE_SIZE);
                            return;
                        }

                        const oResult = emptyTotals();
                        SUM_FIELDS.forEach((o) => {
                            oResult[o.target] = mSums[o.field].toFixed(3);
                            const oUnit = mUnits[o.unitTarget];
                            oResult[o.unitTarget] = (oUnit && !oUnit.mixed) ? oUnit.value : "";
                        });
                        oTotals.setData(oResult);
                    },
                    error: () => {
                        if (isStale()) {
                            return;
                        }
                        oTotals.setData(emptyTotals());
                    }
                });
            };

            readPage(0);
        }
    });
});
