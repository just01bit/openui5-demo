/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./InputBase','./Popover','sap/ui/core/Item','./ColumnListItem','./Table','./library','sap/ui/core/IconPool','sap/ui/Device','sap/ui/core/Control','./SuggestionsPopover',"sap/ui/dom/containsOrEquals","sap/base/assert","sap/base/util/deepEqual","./InputRenderer","sap/ui/thirdparty/jquery","sap/ui/dom/jquery/selectText"],function(I,P,a,C,T,l,b,D,c,S,d,e,f,g,q){"use strict";var L=l.ListType;var h=l.InputTextFormatMode;var j=l.InputType;var k=I.extend("sap.m.Input",{metadata:{library:"sap.m",properties:{type:{type:"sap.m.InputType",group:"Data",defaultValue:j.Text},maxLength:{type:"int",group:"Behavior",defaultValue:0},dateFormat:{type:"string",group:"Misc",defaultValue:'YYYY-MM-dd',deprecated:true},showValueHelp:{type:"boolean",group:"Behavior",defaultValue:false},showSuggestion:{type:"boolean",group:"Behavior",defaultValue:false},valueHelpOnly:{type:"boolean",group:"Behavior",defaultValue:false},filterSuggests:{type:"boolean",group:"Behavior",defaultValue:true},maxSuggestionWidth:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:null},startSuggestion:{type:"int",group:"Behavior",defaultValue:1},showTableSuggestionValueHelp:{type:"boolean",group:"Behavior",defaultValue:true},description:{type:"string",group:"Misc",defaultValue:null},fieldWidth:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:'50%'},valueLiveUpdate:{type:"boolean",group:"Behavior",defaultValue:false},selectedKey:{type:"string",group:"Data",defaultValue:""},textFormatMode:{type:"sap.m.InputTextFormatMode",group:"Misc",defaultValue:h.Value},textFormatter:{type:"any",group:"Misc",defaultValue:""},suggestionRowValidator:{type:"any",group:"Misc",defaultValue:""},enableSuggestionsHighlighting:{type:"boolean",group:"Behavior",defaultValue:true},autocomplete:{type:"boolean",group:"Behavior",defaultValue:true}},defaultAggregation:"suggestionItems",aggregations:{suggestionItems:{type:"sap.ui.core.Item",multiple:true,singularName:"suggestionItem"},suggestionColumns:{type:"sap.m.Column",multiple:true,singularName:"suggestionColumn",bindable:"bindable",forwarding:{getter:"_getSuggestionsTable",aggregation:"columns"}},suggestionRows:{type:"sap.m.ColumnListItem",multiple:true,singularName:"suggestionRow",bindable:"bindable",forwarding:{getter:"_getSuggestionsTable",aggregation:"items"}},_suggestionPopup:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},_valueHelpIcon:{type:"sap.ui.core.Icon",multiple:false,visibility:"hidden"}},associations:{selectedItem:{type:"sap.ui.core.Item",multiple:false},selectedRow:{type:"sap.m.ColumnListItem",multiple:false}},events:{liveChange:{parameters:{value:{type:"string"},escPressed:{type:"boolean"},previousValue:{type:"string"}}},valueHelpRequest:{parameters:{fromSuggestions:{type:"boolean"}}},suggest:{parameters:{suggestValue:{type:"string"},suggestionColumns:{type:"sap.m.ListBase"}}},suggestionItemSelected:{parameters:{selectedItem:{type:"sap.ui.core.Item"},selectedRow:{type:"sap.m.ColumnListItem"}}},submit:{parameters:{value:{type:"string"}}}},designtime:"sap/m/designtime/Input.designtime"}});b.insertFontFaceStyle();k.prototype.init=function(){I.prototype.init.call(this);this._fnFilter=S._DEFAULTFILTER;this._bUseDialog=D.system.phone;this._bFullScreen=D.system.phone;this._iSetCount=0;this._oRb=sap.ui.getCore().getLibraryResourceBundle("sap.m");};k.prototype.exit=function(){I.prototype.exit.call(this);this._deregisterEvents();this.cancelPendingSuggest();if(this._iRefreshListTimeout){clearTimeout(this._iRefreshListTimeout);this._iRefreshListTimeout=null;}if(this._oSuggPopover){this._oSuggPopover.destroy();this._oSuggPopover=null;}};k.prototype.onBeforeRendering=function(){var s=this.getSelectedKey(),i=this.getShowValueHelp()&&this.getEnabled()&&this.getEditable(),E=this.getAggregation("_endIcon")||[],o=E[0],p;I.prototype.onBeforeRendering.call(this);this._deregisterEvents();if(s){this.setSelectedKey(s);}if(this.getShowSuggestion()){if(this.getShowTableSuggestionValueHelp()){this._oSuggPopover._addShowMoreButton();}else{this._oSuggPopover._removeShowMoreButton();}p=this._oSuggPopover._oPopupInput;if(p){p.setType(this.getType());}}if(i){o=this._getValueHelpIcon();o.setProperty("visible",true,true);}else{if(o){o.setProperty("visible",false,true);}}};k.prototype.onAfterRendering=function(){I.prototype.onAfterRendering.call(this);if(this._bUseDialog&&this.getEditable()&&this.getEnabled()){this.$().on("click",q.proxy(function(E){if(this._onclick){this._onclick(E);}if(this.getShowSuggestion()&&this._oSuggPopover&&E.target.id!=this.getId()+"-vhi"){this._oSuggPopover._oPopover.open();}},this));}};k.prototype._getDisplayText=function(i){var t=this.getTextFormatter();if(t){return t(i);}var s=i.getText(),K=i.getKey(),m=this.getTextFormatMode();switch(m){case h.Key:return K;case h.ValueKey:return s+' ('+K+')';case h.KeyValue:return'('+K+') '+s;default:return s;}};k.prototype._onValueUpdated=function(n){if(this._bSelectingItem||n===this._sSelectedValue){return;}var K=this.getSelectedKey(),H;if(K===''){return;}if(this._hasTabularSuggestions()){H=this._oSuggPopover._oSuggestionTable&&!!this._oSuggPopover._oSuggestionTable.getSelectedItem();}else{H=this._oSuggPopover._oList&&!!this._oSuggPopover._oList.getSelectedItem();}if(H){return;}this.setProperty("selectedKey",'',true);this.setAssociation("selectedRow",null,true);this.setAssociation("selectedItem",null,true);this.fireSuggestionItemSelected({selectedItem:null,selectedRow:null});};k.prototype._updateSelectionFromList=function(){if(this._iPopupListSelectedIndex<0){return false;}var s=this._oSuggPopover._oList.getSelectedItem();if(s){if(this._hasTabularSuggestions()){this.setSelectionRow(s,true);}else{this.setSelectionItem(s._oItem,true);}}return true;};k.prototype.setSelectionItem=function(i,m){this._bSelectingItem=true;if(!i){this.setAssociation("selectedItem",null,true);return;}var n=this._iSetCount,N;this.setAssociation("selectedItem",i,true);this.setProperty("selectedKey",i.getKey(),true);if(m){this.fireSuggestionItemSelected({selectedItem:i});}if(n!==this._iSetCount){N=this.getValue();}else{N=this._getDisplayText(i);}this._sSelectedValue=N;this.updateInputField(N);this._iPopupListSelectedIndex=-1;if(!(this._bUseDialog&&this instanceof sap.m.MultiInput&&this._isMultiLineMode)){this._closeSuggestionPopup();}this._bSelectingItem=false;};k.prototype.setSelectedItem=function(i){if(typeof i==="string"){i=sap.ui.getCore().byId(i);}if(i!==null&&!(i instanceof a)){return this;}this.setSelectionItem(i);return this;};k.prototype.setSelectedKey=function(K){K=this.validateProperty("selectedKey",K);this.setProperty("selectedKey",K,true);if(this._hasTabularSuggestions()){return this;}if(!K){this.setSelectionItem();return this;}var i=this.getSuggestionItemByKey(K);this.setSelectionItem(i);return this;};k.prototype.getSuggestionItemByKey=function(K){var m=this.getSuggestionItems()||[],o,i;for(i=0;i<m.length;i++){o=m[i];if(o.getKey()===K){return o;}}};k.prototype.setSelectionRow=function(o,i){if(!o){this.setAssociation("selectedRow",null,true);return;}this._bSelectingItem=true;var m,s=this.getSuggestionRowValidator();if(s){m=s(o);if(!(m instanceof a)){m=null;}}var n=this._iSetCount,K="",N;this.setAssociation("selectedRow",o,true);if(m){K=m.getKey();}this.setProperty("selectedKey",K,true);if(i){this.fireSuggestionItemSelected({selectedRow:o});}if(n!==this._iSetCount){N=this.getValue();}else{if(m){N=this._getDisplayText(m);}else{N=this._fnRowResultFilter?this._fnRowResultFilter(o):S._DEFAULTRESULT_TABULAR(o);}}this._sSelectedValue=N;this.updateInputField(N);this._iPopupListSelectedIndex=-1;if(!(this._bUseDialog&&this instanceof sap.m.MultiInput&&this._isMultiLineMode)){this._closeSuggestionPopup();}this._bSelectingItem=false;};k.prototype.setSelectedRow=function(o){if(typeof o==="string"){o=sap.ui.getCore().byId(o);}if(o!==null&&!(o instanceof C)){return this;}this.setSelectionRow(o);return this;};k.prototype._getValueHelpIcon=function(){var t=this,E=this.getAggregation("_endIcon")||[],v=E[0];if(!v){v=this.addEndIcon({id:this.getId()+"-vhi",src:b.getIconURI("value-help"),useIconTooltip:false,noTabStop:true,press:function(o){if(!t.getValueHelpOnly()){var p=this.getParent(),$;if(D.support.touch){$=p.$('inner');$.attr('readonly','readonly');p.focus();$.removeAttr('readonly');}else{p.focus();}t.bValueHelpRequested=true;t.fireValueHelpRequest({fromSuggestions:false});}}});}return v;};k.prototype._fireValueHelpRequestForValueHelpOnly=function(){if(this.getEnabled()&&this.getEditable()&&this.getShowValueHelp()&&this.getValueHelpOnly()){if(D.system.phone){this.focus();}this.fireValueHelpRequest({fromSuggestions:false});}};k.prototype.ontap=function(E){I.prototype.ontap.call(this,E);this._fireValueHelpRequestForValueHelpOnly();};k.prototype.setWidth=function(w){return I.prototype.setWidth.call(this,w||"100%");};k.prototype.getWidth=function(){return this.getProperty("width")||"100%";};k.prototype.setFilterFunction=function(F){if(F===null||F===undefined){this._fnFilter=S._DEFAULTFILTER;return this;}e(typeof(F)==="function","Input.setFilterFunction: first argument fnFilter must be a function on "+this);this._fnFilter=F;return this;};k.prototype.setRowResultFunction=function(F){var s;if(F===null||F===undefined){this._fnRowResultFilter=S._DEFAULTRESULT_TABULAR;return this;}e(typeof(F)==="function","Input.setRowResultFunction: first argument fnFilter must be a function on "+this);this._fnRowResultFilter=F;s=this.getSelectedRow();if(s){this.setSelectedRow(s);}return this;};k.prototype.closeSuggestions=function(){this._closeSuggestionPopup();};k.prototype._doSelect=function(s,E){if(D.support.touch){return;}var o=this._$input[0];if(o){var r=this._$input;o.focus();r.selectText(s?s:0,E?E:r.val().length);}return this;};k.prototype._isSuggestionItemSelectable=function(i){return i.getVisible()&&(this._hasTabularSuggestions()||i.getType()!==L.Inactive);};k.prototype._isIncrementalType=function(){var t=this.getType();if(t==="Number"||t==="Date"||t==="Datetime"||t==="Month"||t==="Time"||t==="Week"){return true;}return false;};k.prototype.onsapescape=function(E){var i;if(this._oSuggPopover&&this._oSuggPopover._oPopover.isOpen()){E.originalEvent._sapui_handledByControl=true;this._iPopupListSelectedIndex=-1;this._closeSuggestionPopup();if(this._sBeforeSuggest!==undefined){if(this._sBeforeSuggest!==this.getValue()){i=this._lastValue;this.setValue(this._sBeforeSuggest);this._lastValue=i;}this._sBeforeSuggest=undefined;}return;}if(this.getValueLiveUpdate()){this.setProperty("value",this._lastValue,true);}if(I.prototype.onsapescape){I.prototype.onsapescape.apply(this,arguments);}};k.prototype.onsapenter=function(E){this.cancelPendingSuggest();if(this._oSuggPopover&&this._oSuggPopover._oPopover.isOpen()){if(!this._updateSelectionFromList()){this._closeSuggestionPopup();}}if(I.prototype.onsapenter){I.prototype.onsapenter.apply(this,arguments);}if(this.getEnabled()&&this.getEditable()&&!(this.getValueHelpOnly()&&this.getShowValueHelp())){this.fireSubmit({value:this.getValue()});}};k.prototype.onsapfocusleave=function(E){var s=this._oSuggPopover,p=s&&s._oPopover,F=E.relatedControlId&&sap.ui.getCore().byId(E.relatedControlId),o=F&&F.getFocusDomRef(),i=p&&o&&d(p.getDomRef(),o);if(p instanceof P){if(i){this._bPopupHasFocus=true;if(D.system.desktop&&f(p.getFocusDomRef(),o)){this.focus();}}else{if(this.getDOMValue()===this._sSelectedSuggViaKeyboard){this._sSelectedSuggViaKeyboard=null;}}}if(!i&&(!s||!s._sProposedItemText)){I.prototype.onsapfocusleave.apply(this,arguments);}this.bValueHelpRequested=false;};k.prototype.onmousedown=function(E){var p=this._oSuggPopover&&this._oSuggPopover._oPopover;if((p instanceof P)&&p.isOpen()){E.stopPropagation();}};k.prototype._deregisterEvents=function(){if(this._oSuggPopover){this._oSuggPopover._deregisterResize();}if(this._bUseDialog&&this._oSuggPopover&&this._oSuggPopover._oPopover){this.$().off("click");}};k.prototype.updateSuggestionItems=function(){this._bSuspendInvalidate=true;this.updateAggregation("suggestionItems");this._synchronizeSuggestions();this._bSuspendInvalidate=false;return this;};k.prototype.invalidate=function(){if(!this._bSuspendInvalidate){c.prototype.invalidate.apply(this,arguments);}};k.prototype.cancelPendingSuggest=function(){if(this._iSuggestDelay){clearTimeout(this._iSuggestDelay);this._iSuggestDelay=null;}};k.prototype._triggerSuggest=function(v){this.cancelPendingSuggest();this._bShouldRefreshListItems=true;if(!v){v="";}if(v.length>=this.getStartSuggestion()){this._iSuggestDelay=setTimeout(function(){if(this._sPrevSuggValue!==v){this._bBindingUpdated=false;this.fireSuggest({suggestValue:v});if(!this._bBindingUpdated){this._refreshItemsDelayed();}this._sPrevSuggValue=v;}}.bind(this),300);}else if(this._bUseDialog){if(this._oSuggPopover._oList instanceof T){this._oSuggPopover._oList.addStyleClass("sapMInputSuggestionTableHidden");}else if(this._oSuggPopover._oList&&this._oSuggPopover._oList.destroyItems){this._oSuggPopover._oList.destroyItems();}}else if(this._oSuggPopover&&this._oSuggPopover._oPopover.isOpen()){setTimeout(function(){var n=this.getDOMValue()||'';if(n<this.getStartSuggestion()){this._iPopupListSelectedIndex=-1;this._closeSuggestionPopup();}}.bind(this),0);}};(function(){k.prototype.setShowSuggestion=function(v){this.setProperty("showSuggestion",v,true);this._iPopupListSelectedIndex=-1;if(v){this._oSuggPopover=this._getSuggestionsPopover();}else{this._oSuggPopover&&this._oSuggPopover._destroySuggestionPopup();}return this;};k.prototype.setShowTableSuggestionValueHelp=function(v){this.setProperty("showTableSuggestionValueHelp",v,true);if(!(this._oSuggPopover&&this._oSuggPopover._oPopover)){return this;}if(v){this._oSuggPopover._addShowMoreButton();}else{this._oSuggPopover._removeShowMoreButton();}return this;};k.prototype.oninput=function(E){I.prototype.oninput.call(this,E);if(E.isMarked("invalid")){return;}var v=this.getDOMValue();if(this.getValueLiveUpdate()){this.setProperty("value",v,true);this._onValueUpdated(v);}this.fireLiveChange({value:v,newValue:v});if(this.getShowSuggestion()&&!this._bUseDialog){this._triggerSuggest(v);}};k.prototype.getValue=function(){return this.getDomRef("inner")&&this._$input?this.getDOMValue():this.getProperty("value");};k.prototype._refreshItemsDelayed=function(){clearTimeout(this._iRefreshListTimeout);this._iRefreshListTimeout=setTimeout(function(){if(this._oSuggPopover){this._oSuggPopover._refreshListItems();}}.bind(this),0);};k.prototype.addSuggestionItem=function(i){this.addAggregation("suggestionItems",i,true);if(this._oSuggPopover){this._synchronizeSuggestions();this._oSuggPopover._createSuggestionPopupContent();}return this;};k.prototype.insertSuggestionItem=function(i,m){this.insertAggregation("suggestionItems",m,i,true);if(this._oSuggPopover){this._synchronizeSuggestions();this._oSuggPopover._createSuggestionPopupContent();}return this;};k.prototype.removeSuggestionItem=function(i){var r=this.removeAggregation("suggestionItems",i,true);this._synchronizeSuggestions();return r;};k.prototype.removeAllSuggestionItems=function(){var r=this.removeAllAggregation("suggestionItems",true);this._synchronizeSuggestions();return r;};k.prototype.destroySuggestionItems=function(){this.destroyAggregation("suggestionItems",true);this._synchronizeSuggestions();return this;};k.prototype.addSuggestionRow=function(i){i.setType(L.Active);this.addAggregation("suggestionRows",i);this._synchronizeSuggestions();this._oSuggPopover._createSuggestionPopupContent();return this;};k.prototype.insertSuggestionRow=function(i,m){i.setType(L.Active);this.insertAggregation("suggestionRows",i,m);this._synchronizeSuggestions();this._oSuggPopover._createSuggestionPopupContent();return this;};k.prototype.removeSuggestionRow=function(i){var r=this.removeAggregation("suggestionRows",i);this._synchronizeSuggestions();return r;};k.prototype.removeAllSuggestionRows=function(){var r=this.removeAllAggregation("suggestionRows");this._synchronizeSuggestions();return r;};k.prototype.destroySuggestionRows=function(){this.destroyAggregation("suggestionRows");this._synchronizeSuggestions();return this;};k.prototype.bindAggregation=function(){if(arguments[0]==="suggestionRows"||arguments[0]==="suggestionColumns"||arguments[0]==="suggestionItems"){this._getSuggestionsPopover()._createSuggestionPopupContent(arguments[0]==="suggestionRows"||arguments[0]==="suggestionColumns");this._bBindingUpdated=true;}return I.prototype.bindAggregation.apply(this,arguments);};k.prototype._closeSuggestionPopup=function(){if(this._oSuggPopover){this._bShouldRefreshListItems=false;this.cancelPendingSuggest();this._oSuggPopover._oPopover.close();if(!this._bUseDialog&&this.$().hasClass("sapMInputFocused")){this.openValueStateMessage();}this.$("SuggDescr").text("");this.$("inner").removeAttr("aria-haspopup");this.$("inner").removeAttr("aria-activedescendant");this._sPrevSuggValue=null;}};k.prototype._synchronizeSuggestions=function(){this._bShouldRefreshListItems=true;this._refreshItemsDelayed();if(!this.getDomRef()||(this._oSuggestionPopup&&this._oSuggestionPopup.isOpen())){return;}this._synchronizeSelection();};k.prototype._synchronizeSelection=function(){var s=this.getSelectedKey();if(!s){return;}if(this.getValue()&&!this.getSelectedItem()&&!this.getSelectedRow()){return;}this.setSelectedKey(s);};})();k.prototype.onfocusin=function(E){I.prototype.onfocusin.apply(this,arguments);this.$().addClass("sapMInputFocused");if(!this._bUseDialog&&this._oSuggPopover&&this._oSuggPopover._oPopover&&this._oSuggPopover._oPopover.isOpen()){this.closeValueStateMessage();}if(!this._bPopupHasFocus&&!this.getStartSuggestion()&&!this.getValue()){this._triggerSuggest(this.getValue());}this._bPopupHasFocus=undefined;this._sPrevSuggValue=null;};k.prototype.onsapshow=function(E){if(!this.getEnabled()||!this.getEditable()||!this.getShowValueHelp()){return;}this.bValueHelpRequested=true;this.fireValueHelpRequest({fromSuggestions:false});E.preventDefault();E.stopPropagation();};k.prototype.onsaphide=k.prototype.onsapshow;k.prototype.onsapselect=function(E){this._fireValueHelpRequestForValueHelpOnly();};k.prototype.onfocusout=function(E){I.prototype.onfocusout.apply(this,arguments);this.$().removeClass("sapMInputFocused");this.closeValueStateMessage(this);};k.prototype._hasTabularSuggestions=function(){return!!(this.getAggregation("suggestionColumns")&&this.getAggregation("suggestionColumns").length);};k.prototype._getSuggestionsTable=function(){return this._getSuggestionsPopover()._getSuggestionsTable();};k.prototype.clone=function(){var i=c.prototype.clone.apply(this,arguments),m;m=this.getBindingInfo("suggestionColumns");if(m){i.bindAggregation("suggestionColumns",q.extend({},m));}m=this.getBindingInfo("suggestionRows");if(m){i.bindAggregation("suggestionRows",q.extend({},m));}i.setRowResultFunction(this._fnRowResultFilter);return i;};k.prototype.setValue=function(v){this._iSetCount++;I.prototype.setValue.call(this,v);this._onValueUpdated(v);return this;};k.prototype.setDOMValue=function(v){this._$input.val(v);};k.prototype.getDOMValue=function(){return this._$input.val();};k.prototype.updateInputField=function(n){if(this._oSuggPopover&&this._oSuggPopover._oPopover.isOpen()&&this._bUseDialog){this._oSuggPopover._oPopupInput.setValue(n);this._oSuggPopover._oPopupInput._doSelect();}else{n=this._getInputValue(n);this.setDOMValue(n);this.onChange(null,null,n);}};k.prototype.getAccessibilityInfo=function(){var i=I.prototype.getAccessibilityInfo.apply(this,arguments);i.description=((i.description||"")+" "+this.getDescription()).trim();return i;};k.prototype.preventChangeOnFocusLeave=function(E){return this.bFocusoutDueRendering||this.bValueHelpRequested;};k.prototype._getSuggestionsPopover=function(){if(!this._oSuggPopover){this._oSuggPopover=new S(this);this._oSuggPopover._createSuggestionPopup();this._oSuggestionPopup=this._oSuggPopover._oPopover;}return this._oSuggPopover;};return k;});
