/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/f/library","sap/base/security/encodeCSS"],function(l,e){"use strict";var A=l.AvatarSize;var a=l.AvatarType;var b={};b.render=function(r,o){var i=o.getInitials(),s=o._getActualDisplayType(),I=o._getImageFallbackType(),d=o.getDisplaySize(),D=o.getDisplayShape(),c=o.getImageFitType(),C=o.getCustomDisplaySize(),f=o.getCustomFontSize(),S=o._getEscapedSrc(),g="sapFAvatar",t=o.getTooltip_AsString(),h=o._getDefaultTooltip(),L=o.getAriaLabelledBy(),j=o.getAriaDescribedBy(),k=t&&i?h+" "+t:h,m=i?h+" "+i:h;r.write("<span");r.writeControlData(o);r.addClass(g);r.addClass(g+d);r.addClass(g+s);r.addClass(g+D);if(o.hasListeners("press")){r.addClass("sapMPointer");r.addClass("sapFAvatarFocusable");r.writeAttribute("role","button");r.writeAttribute("tabIndex",0);}else{r.writeAttribute("role","img");}if(d===A.Custom){r.addStyle("width",C);r.addStyle("height",C);r.addStyle("font-size",f);}if(t){r.writeAttributeEscaped("title",t);r.writeAttributeEscaped("aria-label",k);}else{r.writeAttributeEscaped("aria-label",m);}if(L&&L.length>0){r.writeAttributeEscaped("aria-labelledby",L.join(" "));}if(j&&j.length>0){r.writeAttributeEscaped("aria-describedby",j.join(" "));}r.writeClasses();r.writeStyles();r.write(">");if(s===a.Icon||I===a.Icon){r.renderControl(o._getIcon());}else if(s===a.Initials||I===a.Initials){r.write("<span");r.addClass(g+"InitialsHolder");r.writeClasses();r.write(">");r.writeEscaped(i);r.write("</span>");}if(s===a.Image){r.write("<span");r.addClass("sapFAvatarImageHolder");r.addClass(g+s+c);r.addStyle("background-image","url('"+e(S)+"')");r.writeClasses();r.writeStyles();r.write(">");r.write("</span>");}if(o._fnLightBoxOpen){r.write("<span class=\"sapFAvatarMagnifyingGlass\"></span>");}r.write("</span>");};return b;},true);
