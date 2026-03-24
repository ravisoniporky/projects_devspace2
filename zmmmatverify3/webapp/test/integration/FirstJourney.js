sap.ui.define([
    "sap/ui/test/opaQunit",
    "./pages/JourneyRunner"
], function (opaTest, runner) {
    "use strict";

    function journey() {
        QUnit.module("First journey");

        opaTest("Start application", function (Given, When, Then) {
            Given.iStartMyApp();

            Then.onTheZC_ProductList.iSeeThisPage();
            Then.onTheZC_ProductList.onFilterBar().iCheckFilterField("Product");
            Then.onTheZC_ProductList.onFilterBar().iCheckFilterField("Plant");
            Then.onTheZC_ProductList.onFilterBar().iCheckFilterField("Old product number");
            Then.onTheZC_ProductList.onFilterBar().iCheckFilterField("Product Group");
            Then.onTheZC_ProductList.onTable().iCheckColumns(28, {"Product":{"header":"Product"},"Plant":{"header":"Plant"},"ProductOldID":{"header":"Product"},"ProductType":{"header":"ProductType"},"BaseUnit":{"header":"Base Unit of Measure"},"GrossWeight":{"header":"Gross Weight"},"NetWeight":{"header":"Net Weight"},"ProductGroup":{"header":"Material Group"},"ProductHierarchy":{"header":"PHL1"},"ManufacturerNumber":{"header":"Manufacturer"},"ProductManufacturerNumber":{"header":"MPN"},"ExternalProductGroup":{"header":"Ext. Material Group"},"POText":{"header":"PO Text"},"EPStorageLocation":{"header":"EP SLoc"},"RackTyp":{"header":"Rack Type"},"Seq":{"header":"SLoc Sequence"},"SLOCNote":{"header":"SLoc Note"},"SLOCHeight":{"header":"SLoc Height"},"Building":{"header":"Building"},"Aisle":{"header":"Aisle"},"CaseBarcodeStatus":{"header":"Case Barcode Status"},"GroupSequence":{"header":"Group Sequence"},"CodeSequence":{"header":"Code Sequence"},"Hi":{"header":"Hi"},"Ti":{"header":"Ti"},"MaterialCondition":{"header":"Material Condition"},"ZBrand":{"header":"Brand"},"CodeDateType":{"header":"Code Date Type"}});

        });


        opaTest("Navigate to ObjectPage", function (Given, When, Then) {
            // Note: this test will fail if the ListReport page doesn't show any data
            
            When.onTheZC_ProductList.onFilterBar().iExecuteSearch();
            
            Then.onTheZC_ProductList.onTable().iCheckRows();

            When.onTheZC_ProductList.onTable().iPressRow(0);
            Then.onTheZC_ProductObjectPage.iSeeThisPage();

        });

        opaTest("Teardown", function (Given, When, Then) { 
            // Cleanup
            Given.iTearDownMyApp();
        });
    }

    runner.run([journey]);
});