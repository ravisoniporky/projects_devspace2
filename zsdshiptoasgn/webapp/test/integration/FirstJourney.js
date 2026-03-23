sap.ui.define([
    "sap/ui/test/opaQunit",
    "./pages/JourneyRunner"
], function (opaTest, runner) {
    "use strict";

    function journey() {
        QUnit.module("First journey");

        opaTest("Start application", function (Given, When, Then) {
            Given.iStartMyApp();

            Then.onTheZCSD_SHIPTO_PARTNERSList.iSeeThisPage();
            Then.onTheZCSD_SHIPTO_PARTNERSList.onFilterBar().iCheckFilterField("Sales Organization");
            Then.onTheZCSD_SHIPTO_PARTNERSList.onFilterBar().iCheckFilterField("Shipto");
            Then.onTheZCSD_SHIPTO_PARTNERSList.onTable().iCheckColumns(15, {"Customer":{"header":"Customer"},"Shipto":{"header":"Shipto"},"SalesLead":{"header":"Sales Lead"},"CustomerAddress":{"header":"Customer Address"},"SalesSupport":{"header":"Sales Support"},"ShiptoName":{"header":"Shipto Name"},"SalesLeadName":{"header":"Sales Lead Name"},"SalesSupportName":{"header":"Sales Support Name"},"CustomerHiearchyL1":{"header":"Customer Hiearchy L1"},"CustomerHiearchyL2":{"header":"Customer Hiearchy L2"},"CustomerHiearchyL3":{"header":"Customer Hiearchy L3"},"CustomerHiearchyL3Name":{"header":"Customer Hiearchy L1 Name"},"CustomerHiearchyL2Name":{"header":"Customer Hiearchy L2 Name"},"CustomerHiearchyL1Name":{"header":"Customer Hiearchy L3 Name"},"selectflag":{"header":"Select"}});

        });


        opaTest("Navigate to ObjectPage", function (Given, When, Then) {
            // Note: this test will fail if the ListReport page doesn't show any data
            
            When.onTheZCSD_SHIPTO_PARTNERSList.onFilterBar().iExecuteSearch();
            
            Then.onTheZCSD_SHIPTO_PARTNERSList.onTable().iCheckRows();

            When.onTheZCSD_SHIPTO_PARTNERSList.onTable().iPressRow(0);
            Then.onTheZCSD_SHIPTO_PARTNERSObjectPage.iSeeThisPage();

        });

        opaTest("Teardown", function (Given, When, Then) { 
            // Cleanup
            Given.iTearDownMyApp();
        });
    }

    runner.run([journey]);
});