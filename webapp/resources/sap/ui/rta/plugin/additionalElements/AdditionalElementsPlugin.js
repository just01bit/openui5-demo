/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/rta/plugin/Plugin","sap/ui/dt/ElementUtil","sap/ui/dt/OverlayRegistry","sap/ui/rta/Utils","sap/ui/fl/Utils","sap/ui/dt/Util","sap/ui/core/StashedControlSupport","sap/ui/dt/ElementDesignTimeMetadata","sap/base/Log"],function(q,P,E,O,U,F,D,S,a,L){"use strict";function _(s,o){var p,r=o.getRelevantContainer(!s),R=O.getOverlay(r);if(s){p=o.getParentElementOverlay();}else{p=o;}return{relevantContainerOverlay:R,parentOverlay:p,relevantContainer:r,parent:p&&p.getElement()};}function b(p,C){return C.sParentAggregationName;}function c(p,s){var o=p.getElement();var i=E.getAggregation(o,s).filter(function(C){var m=O.getOverlay(C);if(!this.hasStableId(m)){return false;}var r=p.getRelevantContainer(true);var R=O.getOverlay(r);var n=p;var t=false;do{t=!n.getElementVisibility();if(t){break;}if(n===R){break;}else{n=n.getParentElementOverlay();}}while(n);if(t){return true;}return m.getElementVisibility()===false;},this);var l=S.getStashedControls(o.getId());return i.concat(l);}var d=true,e=false;function f(r,m,p,s,C){var n=[];var i;var l;if(m.addODataProperty||m.custom){var o=m.aggregation;var t=m[m.addODataProperty?"addODataProperty":"custom"].designTimeMetadata;i=t.getAggregationDescription(o,p);if(i){l=s?i.singular:i.plural;n.push(l);}}if(m.reveal){m.reveal.controlTypeNames.forEach(function(i){l=s?i.singular:i.plural;n.push(l);});}var N=n.reduce(function(u,v){if(u.indexOf(v)===-1){u.push(v);}return u;},[]);var T=sap.ui.getCore().getLibraryResourceBundle("sap.ui.rta");if(N.length===1){l=N[0];}else if(C){l=C;}else{l=T.getText("MULTIPLE_CONTROL_NAME");}return T.getText(r,[l]);}function g(){return{designTimeMetadata:new a({data:{name:{singular:function(){return sap.ui.getCore().getLibraryResourceBundle("sap.uxap").getText("SECTION_CONTROL_NAME");},plural:function(){return sap.ui.getCore().getLibraryResourceBundle("sap.uxap").getText("SECTION_CONTROL_NAME_PLURAL");}},actions:{reveal:{changeType:"unstashControl",getAggregationName:b}}}}),action:{changeType:"unstashControl",getAggregationName:b}};}function h(m,r){var R;m.reveal.elements.some(function(i){if(i.element.getId()===r.getId()){R=i;return false;}});return R;}var A=P.extend("sap.ui.rta.plugin.additionalElements.AdditionalElementsPlugin",{metadata:{library:"sap.ui.rta",properties:{analyzer:"object",dialog:"object",commandFactory:"object"},associations:{},events:{}},getContextMenuTitle:function(o,i){var p=_(o,i);var m=this._getActions(o,i);return f("CTX_ADD_ELEMENTS",m,p.parent,d);},isAvailable:function(o,i){return i.every(function(l){return this._isEditableByPlugin(l,o);},this);},isEnabled:function(o,i){if(i.length>1){return false;}var l=i[0];var p;var I;if(o){p=l.getParentElementOverlay();if(p){I=true;}else{I=false;}}else{var m=this._getActions(o,l);if(m.reveal&&m.reveal.elements.length===0&&!m.addODataProperty){I=false;}else{I=true;}}return I;},registerElementOverlay:function(o){var m=o.getElement().getModel();if(m){var M=m.getMetaModel();if(M&&M.loaded){M.loaded().then(function(){this.evaluateEditable([o],{onRegistration:true});}.bind(this));}}P.prototype.registerElementOverlay.apply(this,arguments);},_getRevealActions:function(s,o){var p=_(s,o);var i=[p.parentOverlay];if(p.relevantContainer!==p.parent){i=E.findAllSiblingsInContainer(p.parent,p.relevantContainer).map(function(m){return O.getOverlay(m);}).filter(function(o){return o;});}var l;if(s){l=[o.getParentAggregationOverlay().getAggregationName()];}else{l=p.parentOverlay.getAggregationOverlays().filter(function(m){return!m.getDesignTimeMetadata().isIgnored(p.parent);}).map(function(m){return m.getAggregationName();});}var r=l.reduce(this._getRevealActionFromAggregations.bind(this,i),{});return r;},_getRevealActionFromAggregations:function(p,i,s){var I=p.reduce(function(l,o){return o?l.concat(c.call(this,o,s)):l;}.bind(this),[]);var r=I.reduce(this._invisibleToReveal.bind(this),{elements:[],controlTypeNames:[]});if(r.elements.length>0){i[s]={reveal:r};}return i;},_invisibleToReveal:function(r,i){var t=i.getMetadata().getName();var o;var R;var l=false;if(t==="sap.ui.core._StashedControl"){var s=g();o=s.designTimeMetadata;R=s.action;l=true;}else{var m=O.getOverlay(i);if(m){o=m.getDesignTimeMetadata();R=o&&o.getAction("reveal",i);if(R&&R.changeType){var n=i;if(R.changeOnRelevantContainer){n=m.getRelevantContainer();}if(this.hasChangeHandler(R.changeType,n)){if(R.changeOnRelevantContainer){var p=_(true,m);l=this.hasStableId(p.relevantContainerOverlay)&&this.hasStableId(p.parentOverlay);}else{l=true;}if(!R.getAggregationName){R.getAggregationName=b;}}}}}if(l){r.elements.push({element:i,designTimeMetadata:o,action:R});var N=o.getName(i);if(N){r.controlTypeNames.push(N);}}return r;},_getAddODataPropertyActions:function(s,o){var p=_(s,o);var i=p.parentOverlay.getDesignTimeMetadata();var l=i.getActionDataFromAggregations("addODataProperty",p.parent);var C=p.parent;var m=function(n,r){if(r){if(r.changeOnRelevantContainer){C=p.relevantContainer;}var t=O.getOverlay(C);if(r.changeType&&this.hasChangeHandler(r.changeType,C)&&this.hasStableId(t)){n[r.aggregation]={addODataProperty:{designTimeMetadata:i,action:r}};}return n;}};if(l&&l.length>0){return l.reduce(m.bind(this),{});}},_getCustomAddActions:function(s,o){var p=_(s,o);var i=p.parentOverlay.getDesignTimeMetadata();var l=i.getActionDataFromAggregations("add",p.parent,undefined,"custom");var C=p.parent;var m=function(n,r){if(r){var t=O.getOverlay(C);if(typeof r.getItems==="function"&&this.hasStableId(t)){var I=r.getItems(C);if(Array.isArray(I)){var v=I.every(function(u){if(u.changeSpecificData.relevantContainer){C=p.relevantContainer;}return u.changeSpecificData.changeType&&this.hasChangeHandler(u.changeSpecificData.changeType,C);}.bind(this));if(v){n[r.aggregation]={custom:{designTimeMetadata:i,action:r,items:I}};}}}return n;}};if(l&&l.length>0){return l.reduce(m.bind(this),{});}},_getActions:function(s,o){var C=this._getCustomAddActions(s,o);var r=this._getRevealActions(s,o);var m=this._getAddODataPropertyActions(s,o);var i=q.extend(true,r,m,C);var l=Object.keys(i);if(l.length===0){return{};}else if(l.length>1){L.error("reveal or addODataProperty action defined for more than 1 aggregation, that is not yet possible");}var n=l[0];i[n].aggregation=n;return i[n];},_hasRevealActionsOnChildren:function(o){var r=this._getRevealActions(false,o);return Object.keys(r).length>0;},showAvailableElements:function(o,i,I,C){var l=i[0];var p=_(o,l);var s=o&&l.getElement();var m=[];var n=this._getActions(o,l);if(n.addODataProperty){n.addODataProperty.relevantContainer=l.getRelevantContainer(!o);}m.push(n.reveal?this.getAnalyzer().enhanceInvisibleElements(p.parent,n):[],n.addODataProperty?this.getAnalyzer().getUnboundODataProperties(p.parent,n.addODataProperty):[],n.custom?this.getAnalyzer().getCustomAddItems(p.parent,n.custom,n.aggregation):[]);if(n.aggregation||C){this._setDialogTitle(n,p.parent,C);}return Promise.resolve().then(function(){if(n.addODataProperty){return U.isServiceUpToDate(p.parent);}}).then(function(){if(n.addODataProperty){this.getDialog()._oCustomFieldButton.setVisible(true);return U.isCustomFieldAvailable(p.parent);}else{this.getDialog()._oCustomFieldButton.setVisible(false);}}.bind(this)).then(function(r){if(r){this._oCurrentFieldExtInfo=r;this.getDialog().setCustomFieldEnabled(true);this.getDialog().detachEvent('openCustomField',this._onOpenCustomField,this);this.getDialog().attachEvent('openCustomField',null,this._onOpenCustomField,this);}}.bind(this)).then(j.bind(this,m)).then(function(r){this.getDialog().setElements(r);return this.getDialog().open().then(function(){return this._createCommands(p,s,n,I);}.bind(this)).catch(function(t){if(t instanceof Error){throw t;}});}.bind(this)).catch(function(r){if(r instanceof Error){throw r;}else{L.info("Service not up to date, skipping add dialog","sap.ui.rta");}});},_setDialogTitle:function(m,p,C){var s=f("HEADER_ADDITIONAL_ELEMENTS",m,p,e,C);this.getDialog().setTitle(s);if(C){this.getDialog()._oList.setNoDataText(this.getDialog()._oTextResources.getText("MSG_NO_FIELDS",C.toLowerCase()));}},_onOpenCustomField:function(o){var u=F.getUshellContainer();var C=u.getService("CrossApplicationNavigation");var H=(C&&C.hrefForExternal({target:{semanticObject:"CustomField",action:"develop"},params:{businessContexts:this._oCurrentFieldExtInfo.BusinessContexts,serviceName:this._oCurrentFieldExtInfo.ServiceName,serviceVersion:this._oCurrentFieldExtInfo.ServiceVersion,entityType:this._oCurrentFieldExtInfo.EntityType}}));U.openNewWindow(H);},_createCommands:function(p,s,m,i){var l=this.getDialog().getSelectedElements();l.sort(function(o,n){if(o.label>n.label){return-1;}if(o.label<n.label){return 1;}return 0;});if(l.length>0){return this.getCommandFactory().getCommandFor(p.parent,"composite").then(function(C){var o=Promise.resolve();l.forEach(function(n){switch(n.type){case"invisible":o=o.then(this._createCommandsForInvisibleElement.bind(this,C,n,p,s,m,i));break;case"odata":o=o.then(this._createCommandsForODataElement.bind(this,C,n,p,s,m,i));break;case"custom":o=o.then(this._createCommandsForCustomElement.bind(this,C,n,p,s,m,i));break;default:L.error("Can't create command for untreated element.type "+n.type);}},this);return o.then(function(){return C;});}.bind(this)).then(function(C){this.fireElementModified({"command":C});}.bind(this)).catch(function(M){throw D.propagateError(M,"AdditionalElementsPlugin#_createCommands","Error occured during _createCommands execution","sap.ui.rta.plugin");});}return Promise.resolve();},_createCommandsForInvisibleElement:function(C,s,p,o,m,i){return this._createRevealCommandForInvisible(s,m,p,o).then(function(r){C.addCommand(r);return this._createMoveCommandForInvisible(s,m,p,o,i);}.bind(this)).then(function(M){if(M){C.addCommand(M);}else{L.warning("No move action configured for "+p.parent.getMetadata().getName()+", aggregation: "+m.aggregation,"sap.ui.rta");}return C;});},_createCommandsForODataElement:function(C,s,p,o,m,i){var l=p.parentOverlay.getAggregationOverlay(m.aggregation);var n=l.getDesignTimeMetadata();var r=n.getAction("addODataProperty",p.parent);var t=r.changeHandlerSettings;var R;if(t&&t.content){R=t.content.requiredLibraries;}return Promise.resolve().then(function(){if(R){return this._createCommandForAddLibrary(p,m,R,n).then(function(u){C.addCommand(u);});}}.bind(this)).then(this._createCommandForOData.bind(this,s,m,p,o,i)).then(function(u){C.addCommand(u);return C;});},_createCommandForOData:function(s,m,p,o,i){var l=p.parentOverlay.getAggregationOverlay(m.aggregation);var n=l.getDesignTimeMetadata();var r=n.getAction("addODataProperty",p.parent);var C=r.changeHandlerSettings;var t;if(C&&C.key){t=C.key.oDataServiceVersion;}var R=p.parent;if(r.changeOnRelevantContainer){R=p.relevantContainer;}var u=U.getIndex(p.parent,o,m.aggregation,n.getData().getIndex);var v=this._getChangeHandler(r.changeType,R);var V;if(p.parentOverlay.getVariantManagement&&v&&v.revertChange){V=p.parentOverlay.getVariantManagement();}var M=F.getAppComponentForControl(p.parent).getManifest();var w=F.getODataServiceUriFromManifest(M);return this.getCommandFactory().getCommandFor(p.parent,"addODataProperty",{newControlId:U.createFieldLabelId(R,s.entityType,s.bindingPath),index:i!==undefined?i:u,bindingString:s.bindingPath,entityType:s.entityType,parentId:p.parent.getId(),oDataServiceVersion:t,oDataServiceUri:w,propertyName:s.name},n,V);},_createCommandForAddLibrary:function(p,m,r,o){var C=F.getAppComponentForControl(p.relevantContainer);var M=C.getManifest();var R=M["sap.app"].id;return this.getCommandFactory().getCommandFor(p.publicParent,"addLibrary",{reference:R,parameters:{libraries:r},appComponent:C},o);},_createRevealCommandForInvisible:function(s,m,p,o){var r=E.getElementInstance(s.elementId);var R=O.getOverlay(r);var i=h(m,r);var l=i.designTimeMetadata;var n=i.action;if(!R){var t=k(r,p,R);R=O.getOverlay(t);}var v;var u;var T=r.getMetadata().getName();if(T==="sap.ui.core._StashedControl"){u=r;}if(R){v=this.getVariantManagementReference(R,n,false,u);}if(n.changeOnRelevantContainer){return this.getCommandFactory().getCommandFor(r,"reveal",{revealedElementId:r.getId(),directParent:p.parent},l,v);}return this.getCommandFactory().getCommandFor(r,"reveal",{},l,v);},_createMoveCommandForInvisible:function(s,m,p,o,i){var r=E.getElementInstance(s.elementId);var R=O.getOverlay(r);var l;if(R){l=R.getParentAggregationOverlay().getAggregationName();}else{var n=h(m,r);l=n.action.getAggregationName(p.parent,r);}var t=k(r,p,R);var T=p.parent;var u=U.getIndex(p.parent,o,l);var v=U.getIndex(t,r,l)-1;u=i!==undefined?i:E.adjustIndexForMove(t,T,v,u);if(u!==v||p.parent!==r.getParent()){var w=O.getOverlay(r)?O.getOverlay(r).getParentAggregationOverlay():p.relevantContainerOverlay;var x=w.getDesignTimeMetadata();var M=x.getAction("move",r);var V;if(M){V=this.getVariantManagementReference(O.getOverlay(r),M,true);}return this.getCommandFactory().getCommandFor(p.relevantContainer,"move",{movedElements:[{element:r,sourceIndex:v,targetIndex:u}],source:{parent:t,aggregation:l},target:{parent:T,aggregation:l}},x,V);}return Promise.resolve();},_createCommandsForCustomElement:function(C,s,p,o,m,i){var l=p.parent;var n=p.parentOverlay.getAggregationOverlay(m.aggregation).getDesignTimeMetadata();var r=Object.assign({changeOnRelevantContainer:s.changeSpecificData.changeOnRelevantContainer,aggregationName:m.aggregation,changeType:s.changeSpecificData.changeType,addElementInfo:s.changeSpecificData.content,index:i||U.getIndex(p.parent,o,m.aggregation)},s.itemId&&{customItemId:s.itemId});var v;var t;var T=l.getMetadata().getName();if(T==="sap.ui.core._StashedControl"){t=l;}if(p.relevantContainerOverlay){v=this.getVariantManagementReference(p.relevantContainerOverlay,r,false,t);}return this.getCommandFactory().getCommandFor(l,"customAdd",r,n,v).then(function(u){if(u){C.addCommand(u);}return C;});},_isEditable:function(o){return{asSibling:this._isEditableCheck.call(this,o,true),asChild:this._isEditableCheck.call(this,o,false)};},_isEditableCheck:function(o,i){var l=false;var p=_(i,o);if(!p.relevantContainerOverlay){return false;}var m=this._getActions(i,o);if(m.addODataProperty){var n=m.addODataProperty.action;l=n&&n.aggregation===o.getParentAggregationOverlay().getAggregationName();}if(!l&&m.reveal){l=true;}if(!l&&m.custom){l=true;}if(!l&&!i){l=this._hasRevealActionsOnChildren(o)||this.checkAggregationsOnSelf(p.parentOverlay,"addODataProperty");}if(l){l=this.hasStableId(o)&&this.hasStableId(p.parentOverlay);}return l;},getMenuItems:function(l){var o=true;var p="CTX_ADD_ELEMENTS_AS_SIBLING";var r=20;var I="sap-icon://add";var m=[];for(var i=0;i<2;i++){if(this.isAvailable(o,l)){var M=this.getContextMenuTitle.bind(this,o);m.push({id:p,text:M,handler:function(o,l){return this.showAvailableElements(o,l);}.bind(this,o),enabled:this.isEnabled.bind(this,o),rank:r,icon:I,group:"Add"});}o=false;p="CTX_ADD_ELEMENTS_AS_CHILD";r=30;}return m;}});function j(p){return Promise.all(p).then(function(i){return this.getAnalyzer().getFilteredItemsList(i);}.bind(this));}function k(r,p,R){var o;if(R){o=R.getParentElementOverlay().getElement();}if(!o&&r.sParentId){o=sap.ui.getCore().byId(r.sParentId);}else if(!o){o=p.parent;}return o;}return A;});
