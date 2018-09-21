sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"my/sampleorders/SampleOrders/controller/PopUpHelper"
], function (Controller,PopUpHelper) {
	"use strict";
	
	var gSalesOrder; 
	
	return Controller.extend("my.sampleorders.SampleOrders.controller.SalesOrder", {
		onInit: function() {
			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.getRoute("salesord").attachPatternMatched(this._onDetailMatched, this);
			this._oRouter.getRoute("main").attachPatternMatched(this._onMasterMatched, this);
		},
		
		onEdit: function(oEvent) {
			this._oRouter.navTo("salesordedit", {
				ID: gSalesOrder
			});
		},

		onNavBack: function() {
			this._oRouter.navTo("main");
			this._completeRefresh(this, "");
		},
		
		_onDetailMatched: function(oEvent) {
			
			gSalesOrder = oEvent.getParameter("arguments").ID;
			
			var sObjectPath =
			"/SalesOrderSet('" + oEvent.getParameter("arguments").ID + "')";
			var oView = this.getView();
			oView.bindElement(sObjectPath);
		},
		
		_onMasterMatched: function(oEvent) {
			var popUpHelper = new PopUpHelper();
		    this.getView().bindElement("");
			popUpHelper.openSalesNumberPopUp(this.getView().getController());
		},
		
		_completeRefresh: function(that, sSalesNumber) {
			var sPath;
			
			if (sSalesNumber !== "") {
			  sPath = "/SalesOrderSet('" + sSalesNumber + "')";
			}  else { 
			  sPath = "";
			}
			
			that.getView().bindElement(sPath);
		}	
	});
});	