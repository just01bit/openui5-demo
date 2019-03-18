/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/f/cards/BaseContent","sap/m/HBox","sap/m/VBox","sap/m/Text","sap/m/Title","sap/f/Avatar","sap/m/Link"],function(B,H,V,T,a,A,L){"use strict";var O=B.extend("sap.f.cards.ObjectContent",{renderer:{}});O.prototype._getRootContainer=function(){if(this._bIsBeingDestroyed){return null;}var h=this.getAggregation("_content");if(!h){h=new H({wrap:"Wrap"});this.setAggregation("_content",h);}return h;};O.prototype.init=function(){B.prototype.init.apply(this,arguments);this._getRootContainer();};O.prototype._updateModel=function(){this._addGroups();B.prototype._updateModel.apply(this,arguments);};O.prototype._addGroups=function(){var c=this._getRootContainer();var g=this.getConfiguration().groups;g.forEach(function(G){var o=new V();o.addStyleClass("sapFCardObjectGroup");o.addItem(new a({text:G.title}));G.items.forEach(function(i){var I=new T({text:i.label});I.addStyleClass("sapFCardObjectItemLabel");var b;if(i.value){b=new T({text:i.value});}else if(i.link){b=new L({href:i.link,text:i.link});}b.addStyleClass("sapFCardObjectItemText");if(i.icon){var h=new H({items:[new A({customDisplaySize:"2.5rem",displaySize:"Custom",src:i.icon.src}),new V({items:[I,b]})]});o.addItem(h);}else{o.addItem(I);o.addItem(b);}});c.addItem(o);});};return O;});
