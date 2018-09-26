sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (Controller, MessageToast, MessageBox) {
	"use strict";

	var gSalesOrder;

	return Controller.extend("my.sampleorders.SampleOrders.controller.SalesOrderEdit", {
		onInit: function () {
			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.getRoute("salesordedit").attachPatternMatched(this._onDetailMatched, this);
		},

		onSave: function (oEvent) {
			var oModel = this.getView().getModel();
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var that = this;

			// submit changes to server
			oModel.submitChanges({
				success: function (oData) {
					for (var i = 0; i < oData.__batchResponses.length; i++) {

						var oResponse = oData.__batchResponses[i];
						if (typeof oResponse.response !== "undefined" && oResponse.response.statusCode !== "200") {
							that._parseError(oResponse);
							break;
						}
					}
					
					MessageToast.show(oBundle.getText("saved"));
				},

				error: function (E) {
					that._parseError(E);

					oModel.resetChanges();
				}
			});

			this._oRouter.navTo("salesord", {
				ID: gSalesOrder
			});
		},

		onCancel: function (oEvent) {
			this._oRouter.navTo("salesord", {
				ID: gSalesOrder
			});
		},

		onNavBack: function () {
			this._oRouter.navTo("salesord", {
				ID: gSalesOrder
			});
		},

		_onDetailMatched: function (oEvent) {

			gSalesOrder = oEvent.getParameter("arguments").ID;

			var sObjectPath =
				"/SalesOrderSet('" + oEvent.getParameter("arguments").ID + "')";
			var oView = this.getView();
			oView.bindElement(sObjectPath);
		},

		_parseError: function (E) {
			if (E.response) {
				var b = E.response.body;
				try {
					b = JSON.parse(b);
					if (b.error.innererror && b.error.innererror.errordetails) {
						var m = "";
						var a = "";
						var c = b.error.innererror.errordetails;
						for (var i = 0; i < c.length; i++) {
							 if (c[i].code.match("/IWBEP")) {
							 	continue;
							 }
							a += c[i].code + " : " + c[i].message + "\n";
						}
					}
					if (a === "") {
						a = b.error.code + " : " + b.error.message.value;
					}
					m = b.error.message.value;
				} catch (e) {
					jQuery.sap.log.warning("Could parse the response", ["parseError"], ["my.sampleorders.SampleOrders"]);
				}
			}
			
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			
			if (m === "") {
				m = oBundle.getText("INTERNAL_ERROR");
			}

			if (a === "") {
				a = oBundle.getText("INTERNAL_ERROR_BODY");
			}

			var M = {
				message: m,
				details: a
			};

			try {
				
				
				MessageBox.show(M.message, {
					icon: MessageBox.Icon.ERROR,
					title: oBundle.getText("ERROR"),
					actions: [MessageBox.Action.OK],
					details: M.details
				});
			} catch (o) {
				jQuery.sap.log.warning("Could parse the response", ["parseError"], ["my.sampleorders.SampleOrders"]);
			}
		}
	});
});