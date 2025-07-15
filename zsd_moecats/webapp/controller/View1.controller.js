sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("customer.porky.zsdmoecats.controller.View1", {
        onInit: function () {

            // if(this.getOwnerComponent().getComponentData().startupParameters.kunwe){
            //     var filter = this.getView().byId("smartFilter_custF4_map");
            //     setTimeout(() => {
            //         filter.setFilterData({'$Parameter.p_kunwe':4000});
                   
            //     }, 500);
            // }

            // if(this.getOwnerComponent().getComponentData().startupParameters.vkorg){
            //     var filter = this.getView().byId("smartFilter_custF4_map");
            //     setTimeout(() => {
            //         filter.setFilterData({'$Parameter.p_vkorg':4000});
                   
            //     }, 500);
            // }


            // if(this.getOwnerComponent().getComponentData().startupParameters.catalog){
            //     var filter = this.getView().byId("smartFilter_custF4_map");
            //     setTimeout(() => {
            //         filter.setFilterData({'$Parameter.p_catalog':'asg'});
                   
            //     }, 500);
            // }

            // if(this.getOwnerComponent().getComponentData().startupParameters.ats){
            //     var filter = this.getView().byId("smartFilter_custF4_map");
            //     setTimeout(() => {
            //         filter.setFilterData({'$Parameter.p_ats':'Y'});
                   
            //     }, 500);
            // }
            var that = this;

            if(this.getOwnerComponent().getComponentData().startupParameters.itemproposal && this.getOwnerComponent().getComponentData().startupParameters.ats
            && this.getOwnerComponent().getComponentData().startupParameters.catalog && this.getOwnerComponent().getComponentData().startupParameters.vkorg
            && this.getOwnerComponent().getComponentData().startupParameters.kunwe){
                var filter = this.getView().byId("smartFilter_custF4_map");
                setTimeout(() => {
                    filter.setFilterData({'$Parameter.p_itemproposal':that.getOwnerComponent().getComponentData().startupParameters.itemproposal[0]});
                    filter.setFilterData({'$Parameter.p_ats':that.getOwnerComponent().getComponentData().startupParameters.ats[0]});
                    filter.setFilterData({'$Parameter.p_catalog':that.getOwnerComponent().getComponentData().startupParameters.catalog[0]});
                    filter.setFilterData({'$Parameter.p_vkorg':that.getOwnerComponent().getComponentData().startupParameters.vkorg[0]});
                    filter.setFilterData({'$Parameter.p_kunwe':that.getOwnerComponent().getComponentData().startupParameters.kunwe[0]});
                    that.getView().byId("smartTable_custF4_map").rebindTable();
                   
                }, 500);
            }

        },
        onBeforeRebindTable: function(oEvent){




            var filterData = this.getView().byId("smartFilter_custF4_map").getFilterData()            ;
            var p_kunwe = filterData['$Parameter.p_kunwe'];
            var p_vkorg = filterData['$Parameter.p_vkorg'];
            var p_catalog = filterData['$Parameter.p_catalog'];
            var p_ats = filterData['$Parameter.p_ats'];
            var p_itemproposal = filterData['$Parameter.p_itemproposal'];





            
            var stringPath = "/ZCSD_E_MobileItemList(p_vkorg='" + p_vkorg +"',p_kunwe='"+p_kunwe+"',p_ats='"+p_ats+"',p_itemproposal='"+p_itemproposal+"',p_catalog='"+p_catalog+"')/Set";

            stringPath= (stringPath);
            oEvent.getSource().setTableBindingPath(stringPath);


        }
    });
});
