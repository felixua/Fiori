sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"my/sampleorders/SampleOrders/controller/PopUpHelper"
], function (Controller, JSONModel, PopUpHelper) {
	"use strict";	
	/**
	 * Global Parameters
	 **/
    var gSalesNumberID = "";
    
    var popUpHelper = new PopUpHelper();
    
	return Controller.extend("my.sampleorders.SampleOrders.controller.AppView", {
		
		getSalesNumberID: function(){
			return gSalesNumberID;
		},
		
		setSalesNumberID: function(sSalesNumber) {
			gSalesNumberID = sSalesNumber;
		},
		
		getPopUpHelper: function() {
			return popUpHelper;
		},
		
		setViewAttribute: function(sPath, sValue) {
			//Set View Attributes
			//sPath -> A function
			//sValue -> Corresponding value
			var globalViewDefinitionModel = this.getView().getModel("viewDefinitionModel");
			globalViewDefinitionModel.setProperty(sPath, sValue);
		},
		
		getViewAttribute: function(sPath) {
			var globalViewDefinitionModel = this.getView().getModel("viewDefinitionModel");
			return globalViewDefinitionModel.getProperty(sPath);
		},
		
		onInit: function() {
			// Model to control diffrent view models
			var globalViewDefinitionModelName = "viewDefinitionModel";
			//Create entryViewModel to connect oData model and front end
			var entryViewDefinitionModel = new JSONModel();
			//Set two way binding
			entryViewDefinitionModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
			//Set Model to the View
			this.getView().setModel(entryViewDefinitionModel, globalViewDefinitionModelName);
		},	
		
		onAfterRendering: function() {

			//If no partnernumber is given by uri, open pop up
/*			if (this.getSalesNumberID() === "" || this.getSalesNumberID() === null) {
				popUpHelper.openSalesNumberPopUp(this, this.getSalesNumberID());
			} else {
				this._completeRefresh(this, jQuery.trim(this.getSalesNumberID()));
			} 
			
			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.navTo("main"); */
		},	
		
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function(sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		}
		
/*		_completeRefresh: function(that, sSalesNumber) {
			var oModel = that.getView().getModel();
			var sPath = "/SalesOrderSet('" + sSalesNumber + "')";

			that.setViewAttribute("/busy", true);
			that.getView().bindElement(sPath);                         
			
   			oModel.read(sPath, {
				urlParameters: {
					json: true
				},
				success: function(oData, response) {
					//Set front end model
					that.getView();

					//Enable front end	
					that.setViewAttribute("/busy", false);
				},
				
				error: function(oError) {
					that.getPopUpHelper().openPartnerNumberPopUp(that);
					that.getPopUpHelper().showErrorMsg(that, oError);
				}
			});
		}, 
		
		_xmlToJsonObject: function(xml) {

			// Create the return object
			var obj = {};

			if (xml.nodeType === 1) { // element
				// do attributes
				if (xml.attributes.length > 0) {
					obj["@attributes"] = {};
					for (var j = 0; j < xml.attributes.length; j++) {
						var attribute = xml.attributes.item(j);
						obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
					}
				}
			} else if (xml.nodeType === 3) { // text
				obj = xml.nodeValue;
			}

			// do children
			// If just one text node inside
			if (xml.hasChildNodes() && xml.childNodes.length === 1 && xml.childNodes[0].nodeType === 3) {
				obj = xml.childNodes[0].nodeValue;
			} else if (xml.hasChildNodes()) {
				for (var i = 0; i < xml.childNodes.length; i++) {
					var item = xml.childNodes.item(i);
					var nodeName = item.nodeName;
					if (typeof(obj[nodeName]) === "undefined") {
						obj[nodeName] = this.xmlToJsonObject(item);
					} else {
						if (typeof(obj[nodeName].push) === "undefined") {
							var old = obj[nodeName];
							obj[nodeName] = [];
							obj[nodeName].push(old);
						}
						obj[nodeName].push(this.xmlToJsonObject(item));
					}
				}
			}
			return obj;
		} */
	});
});