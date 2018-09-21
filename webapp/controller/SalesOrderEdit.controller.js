sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function (Controller, MessageToast) {
	"use strict";
	
	var gSalesOrder;
	
	return Controller.extend("my.sampleorders.SampleOrders.controller.SalesOrderEdit", {
		onInit: function() {
			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.getRoute("salesordedit").attachPatternMatched(this._onDetailMatched, this);
		},	
		
		onSave: function(oEvent) {
			var	oModel = this.getView().getModel();
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			
			// submit changes to server
			oModel.submitChanges();
			MessageToast.show(oBundle.getText("saved"));
			
			this._oRouter.navTo("salesord", {
				ID: gSalesOrder
			});
		},
		
		onCancel: function(oEvent) {
			this._oRouter.navTo("salesord", {
				ID: gSalesOrder
			});
		},
		
		onNavBack: function() {
			this._oRouter.navTo("salesord", {
				ID: gSalesOrder
			});
		},
		
		_onDetailMatched: function(oEvent) {
			
			gSalesOrder = oEvent.getParameter("arguments").ID;
			
			var sObjectPath =
			"/SalesOrderSet('" + oEvent.getParameter("arguments").ID + "')";
			var oView = this.getView();
			oView.bindElement(sObjectPath);
		}
	});
});	
	