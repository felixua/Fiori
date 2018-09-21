sap.ui.define([
	"sap/ui/base/Object",
	"sap/m/Dialog",
	"sap/m/MessageToast",
	"sap/m/Button",
	"sap/ui/comp/valuehelpdialog/ValueHelpDialog",
	"sap/ui/comp/filterbar/FilterBar",
	"sap/ui/comp/filterbar/FilterGroupItem",
	"sap/ui/model/resource/ResourceModel"
], function(sapUiObject,
            Dialog,
            MessageToast,
            Button,
            ValueHelpDialog,
            FilterBar,
            FilterGroupItem,
            ResourceModel) {
	"use strict";
	
	return sapUiObject.extend("my.sampleorders.SampleOrders.controller.PopUpHelper", {
		onInit: function() {
			var i18nModel = new ResourceModel({
	            bundleName: "my.sampleorders.SampleOrders.i18n.i18n"
	        });
			
			this.getView().setModel(i18nModel, "i18n");
		},
		
		openSalesNumberPopUp: function(that) {
			var oBundle = that.getView().getModel("i18n").getResourceBundle();
			
			var oValueHelpDialog = new ValueHelpDialog({
			
			title: oBundle.getText("salesOrders"),
			supportMultiselect: false,
			supportRanges: false,
			supportRangesOnly: false,
			key: "SalesOrderID",				
			descriptionKey: "SalesOrderID",

			ok: function(oControlEvent) {
				var aTokens = oControlEvent.getParameters("tokens");
				
				 if (aTokens.tokens.length !== 0) {
				 	/*  that.setSalesNumberID(aTokens.tokens[0].getKey());
				     	that._completeRefresh(that,aTokens.tokens[0].getKey()); */
				    
				    that._oRouter.navTo("salesord", {
				    	ID: aTokens.tokens[0].getKey()
				    });          	
				
				 	oValueHelpDialog.close();
				 }	
			},

			cancel: function(oControlEvent) {
				MessageToast.show(oBundle.getText("cancel"));
				oValueHelpDialog.close();
			},

			afterClose: function() {
				oValueHelpDialog.destroy();
			}
		});
		
		
		var oFilterBar = new FilterBar({
			advancedMode:  false,
			filterBarExpanded: false,
		/*	filterGroupItems: [new FilterGroupItem({ groupTitle: "foo", groupName: "gn1", name: "n1", label: "Sales Order ID", control: new sap.m.Input()}),
			                   new FilterGroupItem({ groupTitle: "foo", groupName: "gn1", name: "n2", label: "Customer Name", control: new sap.m.Input()})], */
			
			search: function(oEvt) {
				var oSource = oEvt.getSource();
				var oBarContent = oSource.getContent();
				var oToolBarContent = oBarContent[0].getContent();
				var oSearch = oToolBarContent[1];
				var oValue = oSearch.getValue();
				
				var oBinding = oValueHelpDialog.getTable().getBinding("rows");
				var oFilter = new sap.ui.model.Filter({
					filters:[ 
						new sap.ui.model.Filter({
							path: "SalesOrderID", 
							operator: sap.ui.model.FilterOperator.Contains, 
							value1: oValue
						}),
						new sap.ui.model.Filter({
							path: "CustomerName", 
							operator: sap.ui.model.FilterOperator.Contains, 
							value1: oValue
						})
					]
				});
				oBinding.filter(oFilter);
			}
		});		
		
		if (oFilterBar.setBasicSearch) {
			oFilterBar.setBasicSearch(new sap.m.SearchField({showSearchButton:false, placeholder:"Search"}));  
		}
		
		oValueHelpDialog.setFilterBar(oFilterBar);
		
		var oColModel = new sap.ui.model.json.JSONModel();
		oColModel.setData({
			cols: [
			      	{label: oBundle.getText("salesOrderId"), template: "SalesOrderID"},
			        {label: oBundle.getText("customerName"), template: "CustomerName"},
			        {label: oBundle.getText("netAmount"), template: "NetAmount"},
			        {label: oBundle.getText("currencyCode"), template: "CurrencyCode"}
			      ]
		});
		oValueHelpDialog.getTable().setModel(oColModel, "columns");

		
		var oRowsModel = that.getView().getModel();
		oValueHelpDialog.getTable().setModel(oRowsModel);
		oValueHelpDialog.getTable().bindRows("/SalesOrderSet"); 
		
		oValueHelpDialog.open();
	},
	
	showErrorMsg: function(that, oError) {
			
			var oBundel = that.getView().getModel("i18n").getResourceBundle();
			
			that.setViewAttribute("/busy", false);
			var errorMsg;
			try {
				errorMsg = JSON.parse(oError.responseText).error.message.value;
			} catch (err) {
				var xml = new DOMParser().parseFromString(oError.responseText, "text/xml");
				var newJsonObject = that._xmlToJsonObject(xml);
				try {
					errorMsg = newJsonObject.error.message;
				} catch (err2) {
					errorMsg = newJsonObject.html.body.h1;
				}

			}

			var dialog = new Dialog({
				title: oBundel.getText("errorLabel"),
				type: "Message",
				state: "Error",
				content: new Text({
					text: errorMsg
				}),
				beginButton: new Button({
					text: "OK",
					press: function() {
						dialog.close();
					}.bind(that)
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});

			dialog.open();
		}	
	});
});