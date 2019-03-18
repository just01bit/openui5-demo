/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/thirdparty/jquery','sap/base/Log','sap/base/util/ObjectPath','sap/ui/base/ManagedObjectMetadata','sap/ui/core/Renderer'],function(q,L,O,M,R){"use strict";var E=function(c,C){M.apply(this,arguments);};E.prototype=Object.create(M.prototype);E.uid=M.uid;E.prototype.getElementName=function(){return this._sClassName;};E.prototype.getRendererName=function(){return this._sRendererName;};E.prototype.getRenderer=function(){if(this._oRenderer){return this._oRenderer;}var r=this.getRendererName();if(!r){return;}this._oRenderer=O.get(r);if(this._oRenderer){return this._oRenderer;}L.warning("Synchronous loading of Renderer for control class '"+this.getName()+"', due to missing Renderer dependency.","SyncXHR",null,function(){return{type:"SyncXHR",name:r};});this._oRenderer=sap.ui.requireSync(r.replace(/\./g,"/"))||O.get(r);return this._oRenderer;};E.prototype.applySettings=function(c){var s=c.metadata;this._sVisibility=s.visibility||"public";var r=c.hasOwnProperty("renderer")?(c.renderer||""):undefined;delete c.renderer;M.prototype.applySettings.call(this,c);var p=this.getParent();this._sRendererName=this.getName()+"Renderer";this.dnd=Object.assign({draggable:false,droppable:false},p.dnd,(typeof s.dnd=="boolean")?{draggable:s.dnd,droppable:s.dnd}:s.dnd);if(typeof r!=="undefined"){if(typeof r==="string"){this._sRendererName=r||undefined;return;}if(typeof r==="object"){var o=O.get(this.getRendererName());if(o===r){this._oRenderer=r;return;}if(o===undefined&&typeof r.extend==="function"){O.set(this.getRendererName(),r);this._oRenderer=r;return;}}if(typeof r==="function"){r={render:r};}var p=this.getParent();var b;if(p instanceof E){b=p.getRenderer();}if(!b){b=R;}var o=Object.create(b);q.extend(o,r);this._oRenderer=o;O.set(this.getRendererName(),o);}};E.prototype.afterApplySettings=function(){M.prototype.afterApplySettings.apply(this,arguments);this.register&&this.register(this);};E.prototype.isHidden=function(){return this._sVisibility==="hidden";};var m=E.prototype.metaFactoryAggregation;function A(c,n,i){m.apply(this,arguments);this.dnd=Object.assign({draggable:false,droppable:false,layout:"Vertical"},(typeof i.dnd=="boolean")?{draggable:i.dnd,droppable:i.dnd}:i.dnd);}A.prototype=Object.create(m.prototype);E.prototype.metaFactoryAggregation=A;E.prototype.getDragDropInfo=function(a){if(!a){return this.dnd;}var o=this._mAllAggregations[a]||this._mAllPrivateAggregations[a];if(!o){return{};}return o.dnd;};return E;},true);
