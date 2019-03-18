/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery",'sap/ui/base/ManagedObject','sap/m/InstanceManager','sap/ui/dt/Overlay','sap/ui/dt/Util','sap/ui/fl/Utils','sap/ui/core/Component','sap/ui/core/ComponentContainer','sap/ui/core/Element','sap/ui/dt/ElementUtil'],function(q,M,I,O,d,f,C,a,E,b){"use strict";var F={"add":"_activateFocusHandle","remove":"_deactivateFocusHandle"};var P=M.extend("sap.ui.rta.util.PopupManager",{metadata:{properties:{rta:"any"},associations:{autoCloseAreas:{type:"sap.ui.core.Control",multiple:true,singularName:"autoCloseArea"}},events:{open:{parameters:{oControl:{type:"sap.ui.core.Control"}}},close:{parameters:{oControl:{type:"sap.ui.core.Control"}}}},library:"sap.ui.rta"}});P.prototype.init=function(){this._oModalState=new Map();this._calculateMaxAllowedZIndex();};P.prototype._calculateMaxAllowedZIndex=function(){var o=I.getOpenDialogs().concat(I.getOpenPopovers());var m;if(o.length<1){return;}o.forEach(function(p){var i=parseInt(q(p.getDomRef()).css("z-index"));m=(m&&m<i)?m:i-5;});b.setMaxAllowedZIndex(m);};P.prototype._overrideInstanceFunctions=function(){this._applyPopupAttributes({method:this._createPopupOverlays,setModal:true,bringToTop:true});this._overrideAddPopupInstance();this._overrideRemovePopupInstance();};P.prototype.getCategorizedOpenPopups=function(){var o,c;o=I.getOpenDialogs();var e=this._getValidatedPopups(o);c=I.getOpenPopovers();var g=this._getValidatedPopups(c);var h={aDialogs:e.relevant,aPopovers:g.relevant,aAllSupportedPopups:e.allSupported.concat(g.allSupported)};return h;};P.prototype._getValidatedPopups=function(o){var A=[];o=o.filter(function(p){if(this._isPopupAdaptable(p)){A.push(p);return true;}else if(this._isSupportedPopup(p)&&(!(p instanceof sap.m.Popover))){A.push(p);}}.bind(this));return{relevant:o,allSupported:A};};P.prototype._isComponentInsidePopup=function(p){return q.isArray(p.getContent())?p.getContent().some(function(c){if(c instanceof a){return this.oRtaRootAppComponent===this._getAppComponentForControl(C.get(c.getComponent()));}}.bind(this)):false;};P.prototype._isSupportedPopup=function(p){return(p instanceof sap.m.Dialog||p instanceof sap.m.Popover);};P.prototype.setRta=function(r){if(r&&r._oDesignTime){this.setProperty("rta",r);var R=r.getRootControlInstance();this.oRtaRootAppComponent=this._getAppComponentForControl(R);this._overrideInstanceFunctions();var m=this._onModeChange.bind(this);r.attachModeChanged(m);}};P.prototype._onModeChange=function(e){var n=e.getParameters().mode;var A=function(m,p){if(m==='navigation'){p.oPopup[this._getFocusEventName("add")]();}else{p.oPopup[this._getFocusEventName("remove")]();if(this.getRta().getShowToolbars()){this.getRta().getToolbar().bringToFront();}}};n==='navigation'?this._applyPatchesToOpenPopups(d.curry(A)(n)):this._removePatchesToOpenPopups(d.curry(A)(n));};P.prototype._applyPatchesToOpenPopups=function(e){this._applyPopupAttributes({method:e,focus:true,setModal:false});};P.prototype._removePatchesToOpenPopups=function(e){this._applyPopupAttributes({method:e,setModal:true});};P.prototype._getFocusEventName=function(o){return F[o];};P.prototype._overrideAddPopupInstance=function(){this._fnOriginalAddDialogInstance=I.addDialogInstance;I.addDialogInstance=this._overrideAddFunctions(this._fnOriginalAddDialogInstance);this._fnOriginalAddPopoverInstance=I.addPopoverInstance;I.addPopoverInstance=this._overrideAddFunctions(this._fnOriginalAddPopoverInstance);};P.prototype._overrideAddFunctions=function(o){return function(p){var v=o.apply(I,arguments);if(this._isSupportedPopup(p)){if(this._isPopupAdaptable(p)&&this.getRta()._oDesignTime){p.attachAfterOpen(this._createPopupOverlays,this);this._setModal(true,p);this.fireOpen(p);}else if(!(p instanceof sap.m.Popover)){this._setModal(true,p);}}return v;}.bind(this);};P.prototype._setModal=function(s,p){var o=this._oModalState.get(p.oPopup);if(typeof o!=="boolean"&&s&&this.getRta().getMode()==='adaptation'){this._oModalState.set(p.oPopup,p.oPopup.getModal());p.oPopup.setModal(true);}else if(typeof o==="boolean"&&s===false){p.oPopup.setModal(o);this._oModalState.delete(p.oPopup);}};P.prototype._applyPopupAttributes=function(p){var r=this.getCategorizedOpenPopups();["aDialogs","aPopovers"].forEach(function(k){if(r[k].length>0){if(p.focus){if(r[k][0].oPopup.oContent){r[k][0].oPopup.oContent.focus();}}r[k].forEach(function(o){p.method.call(this,o);}.bind(this));}}.bind(this));r.aAllSupportedPopups.forEach(this._setModal.bind(this,p.setModal));};P.prototype._applyPopupPatch=function(p){var o=O.getOverlayContainer();var c=p.oPopup;var A=[c.oContent.getDomRef(),o.get(0)].concat(this.getAutoCloseAreas());if(this.getRta().getShowToolbars()){A.push(this.getRta().getToolbar().getDomRef());}c.setAutoCloseAreas(A);if(!this.fnOriginalPopupOnAfterRendering){this.fnOriginalPopupOnAfterRendering=c.onAfterRendering;}c.onAfterRendering=function(){var v=this.fnOriginalPopupOnAfterRendering.apply(c,arguments);c[this._getFocusEventName("remove")]();return v;}.bind(this);if(this.getRta().getMode()==='adaptation'){c[this._getFocusEventName("remove")]();}};P.prototype._overrideRemovePopupInstance=function(){this._fnOriginalRemoveDialogInstance=I.removeDialogInstance;I.removeDialogInstance=this._overrideRemoveFunctions(this._fnOriginalRemoveDialogInstance);this._fnOriginalRemovePopoverInstance=I.removePopoverInstance;I.removePopoverInstance=this._overrideRemoveFunctions(this._fnOriginalRemovePopoverInstance);};P.prototype._overrideRemoveFunctions=function(o){return function(p){var v=o.apply(I,arguments);if(this._isSupportedPopup(p)){if(this._isPopupAdaptable(p,false)&&this.getRta()._oDesignTime){this.getRta()._oDesignTime.removeRootElement(p);}this._oModalState.delete(p.oPopup);this.fireClose(p);}return v;}.bind(this);};P.prototype._getAppComponentForControl=function(c){var o,A;if(c instanceof C){o=c;}else{o=this._getComponentForControl(c);}if(o){A=f.getAppComponentForControl(o);}return A;};P.prototype._getComponentForControl=function(c){var o,r,p;if(c){o=C.getOwnerComponentFor(c);if(!o&&typeof c.getParent==="function"&&c.getParent()instanceof E){p=c.getParent();}else if(o){p=o;}if(p){r=this._getComponentForControl(p);}}return r?r:o;};P.prototype._createPopupOverlays=function(e){if(!e){return;}var p=(e instanceof E)?e:e.getSource();if(this.getRta()._oDesignTime.getRootElements().indexOf(p.getId())===-1&&!this._isComponentInsidePopup(p)){this.getRta()._oDesignTime.addRootElement(p);}p.detachAfterOpen(this._createPopupOverlays,this);this._applyPopupPatch(p);};P.prototype._restoreInstanceFunctions=function(){if(this._fnOriginalAddDialogInstance){I.addDialogInstance=this._fnOriginalAddDialogInstance;}if(this._fnOriginalRemoveDialogInstance){I.removeDialogInstance=this._fnOriginalRemoveDialogInstance;}if(this._fnOriginalAddPopoverInstance){I.addPopoverInstance=this._fnOriginalAddPopoverInstance;}if(this._fnOriginalRemovePopoverInstance){I.removePopoverInstance=this._fnOriginalRemovePopoverInstance;}this._applyPatchesToOpenPopups(this._removePopupPatch);};P.prototype._removePopupPatch=function(p){var o=p.oPopup;o[this._getFocusEventName("add")]();if(this.fnOriginalPopupOnAfterRendering){o.onAfterRendering=this.fnOriginalPopupOnAfterRendering;}};P.prototype._isPopupAdaptable=function(p){if(p.isPopupAdaptationAllowed&&!p.isPopupAdaptationAllowed()){return false;}var o=this._getAppComponentForControl(p);return this.oRtaRootAppComponent===o||this._isComponentInsidePopup(p);};P.prototype.exit=function(){this._restoreInstanceFunctions();delete this._oModalState;};return P;},true);
