sap.ui.define([
    "sap/m/SliderTooltipBaseRenderer",
  ], function(SliderTooltipBaseRenderer) {
    "use strict";
  
    return Object.assign(SliderTooltipBaseRenderer, {
      renderTooltipContent: (oRm, oControl) =>

        oRm.openStart("div", oControl.getId() + "-inner")
          .class("demoMySliderTooltip")
          .class("sapMSliderTooltipInput")
          .class(SliderTooltipBaseRenderer.CSS_CLASS)
          .openEnd()
          .text("Miles " + oControl.getDayValue()+ console.log(oControl.getParent().getValue())
          )
          .close("div"),
    });
  });