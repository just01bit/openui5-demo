/*!

 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./Binding','./Filter','./Sorter'],function(B,F,S){"use strict";var L=B.extend("sap.ui.model.ListBinding",{constructor:function(M,p,c,s,f,P){B.call(this,M,p,c,P);this.aSorters=m(s,S);this.aFilters=[];this.aApplicationFilters=m(f,F);this.oCombinedFilter=null;this.bUseExtendedChangeDetection=false;this.bDetectUpdates=true;},metadata:{"abstract":true,publicMethods:["getContexts","getCurrentContexts","sort","attachSort","detachSort","filter","attachFilter","detachFilter","getDistinctValues","isGrouped","getLength","isLengthFinal"]}});function m(a,b){if(Array.isArray(a)){return a;}return a instanceof b?[a]:[];}L.prototype.getCurrentContexts=function(){return this.getContexts();};L.prototype.getLength=function(){return 0;};L.prototype.isLengthFinal=function(){return true;};L.prototype.getDistinctValues=function(p){return null;};L.prototype.attachSort=function(f,l){this.attachEvent("sort",f,l);};L.prototype.detachSort=function(f,l){this.detachEvent("sort",f,l);};L.prototype._fireSort=function(a){this.fireEvent("sort",a);};L.prototype.attachFilter=function(f,l){this.attachEvent("filter",f,l);};L.prototype.detachFilter=function(f,l){this.detachEvent("filter",f,l);};L.prototype._fireFilter=function(a){this.fireEvent("filter",a);};L.prototype.isGrouped=function(){return!!(this.aSorters&&this.aSorters[0]&&this.aSorters[0].fnGroup);};L.prototype.getGroup=function(c){return this.aSorters[0].getGroup(c);};L.prototype.enableExtendedChangeDetection=function(d,k){this.bUseExtendedChangeDetection=true;this.bDetectUpdates=d;if(typeof k==="string"){this.getEntryKey=function(c){return c.getProperty(k);};}else if(typeof k==="function"){this.getEntryKey=k;}if(this.update){this.update();}};L.prototype.getContextData=function(c){var C;if(this.getEntryKey&&!this.bDetectUpdates){C=this.getEntryKey(c);if(this.isGrouped()){C+="-"+this.getGroup(c).key;}}else{C=this.getEntryData(c);}return C;};L.prototype.getEntryData=function(c){return JSON.stringify(c.getObject());};L.prototype.getFilterInfo=function(i){if(this.oCombinedFilter){return this.oCombinedFilter.getAST(i);}return null;};L.prototype.checkDataState=function(p){var d=this.getDataState(),r=this.oModel?this.oModel.resolve(this.sPath,this.oContext):null,t=this;function f(){t.fireEvent("AggregatedDataStateChange",{dataState:d});d.changed(false);t._sDataStateTimout=null;}if(!p||r&&r in p){if(r){d.setModelMessages(this.oModel.getMessagesByPath(r));}if(d&&d.changed()){if(this.mEventRegistry["DataStateChange"]){this.fireEvent("DataStateChange",{dataState:d});}if(this.bIsBeingDestroyed){f();}else if(this.mEventRegistry["AggregatedDataStateChange"]){if(!this._sDataStateTimout){this._sDataStateTimout=setTimeout(f,0);}}}}};return L;});
