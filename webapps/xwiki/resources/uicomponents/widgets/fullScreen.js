var XWiki=(function(c){var a=c.widgets=c.widgets||{};a.FullScreen=Class.create({margin:0,buttonSize:16,editFullScreenLabel:$jsontool.serialize($services.localization.render("core.editors.fullscreen.editFullScreen")),exitFullScreenLabel:$jsontool.serialize($services.localization.render("core.editors.fullscreen.exitFullScreen")),initialize:function(){this.buttons=$(document.body).down(".bottombuttons");if(!this.buttons){this.buttons=new Element("div",{"class":"bottombuttons"}).update(new Element("div",{"class":"buttons"}));this.buttons._x_isCustom=true;document.body.appendChild(this.buttons.hide())}this.buttonsPlaceholder=new Element("span");this.toolbarPlaceholder=new Element("span");this.createCloseButtons();$$("textarea",".maximizable").each(function(e){this.addBehavior(e)}.bind(this));document.observe("xwiki:dom:updated",function(e){e.memo.elements.each(function(f){f.select("textarea",".maximizable").each(function(g){this.addBehavior(g)}.bind(this))}.bind(this))}.bind(this));this.maximizedReference=$(document.body).down("input[name='x-maximized']");if(this.maximizedReference&&this.maximizedReference.value!=""){var d=$$(this.maximizedReference.value);if(d&&d.length>0){this.makeFullScreen(d[0])}}this.unloadHandler=this.cleanup.bind(this);Event.observe(window,"unload",this.unloadHandler)},addBehavior:function(d){if(this.isWikiContent(d)){this.addWikiContentButton(d)}else{if(this.isWikiField(d)){this.addWikiFieldButton(d)}else{this.addElementButton(d)}}},isWikiContent:function(d){return d.name=="content"&&d.visible()},isWikiField:function(d){return d.visible()},addWikiContentButton:function(d){d._toolbar=$(document.body).down(".leftmenu2");if(d._toolbar){d._toolbar.insert({top:this.createOpenButton(d)})}else{this.addWikiFieldButton(d)}},addElementButton:function(d){Element.insert(d,{before:this.createOpenLink(d)})},addWikiFieldButton:function(d){Element.insert(d,{before:this.createOpenLink(d)})},createOpenButton:function(e){var d=new Element("img",{"class":"fullScreenEditButton",title:this.editFullScreenLabel,alt:this.editFullScreenLabel,src:$jsontool.serialize($xwiki.getSkinFile("icons/silk/arrow_out.png"))});d.observe("click",this.makeFullScreen.bind(this,e));d.observe("mousedown",this.preventDrag.bindAsEventListener(this));e._x_fullScreenActivator=d;d._x_maximizedElement=e;return d},createOpenLink:function(e){var f=new Element("div",{"class":"fullScreenEditLinkContainer"});var d=new Element("a",{"class":"fullScreenEditLink",title:this.editFullScreenLabel}).update(this.editFullScreenLabel+" &raquo;");d.observe("click",this.makeFullScreen.bind(this,e));f.update(d);e._x_fullScreenActivator=d;d._x_maximizedElement=e;return f},createCloseButtons:function(){this.closeButton=new Element("img",{"class":"fullScreenCloseButton",title:this.exitFullScreenLabel,alt:this.exitFullScreenLabel,src:$jsontool.serialize($xwiki.getSkinFile("icons/silk/arrow_in.png"))});this.closeButton.observe("click",this.closeFullScreen.bind(this));this.closeButton.observe("mousedown",this.preventDrag.bindAsEventListener(this));this.closeButton.hide();this.actionCloseButton=new Element("input",{type:"button","class":"button",value:this.exitFullScreenLabel});this.actionCloseButtonWrapper=new Element("span",{"class":"buttonwrapper"});this.actionCloseButtonWrapper.update(this.actionCloseButton);this.actionCloseButton.observe("click",this.closeFullScreen.bind(this));this.actionCloseButtonWrapper.hide();this.buttons.down(".buttons").insert({top:this.actionCloseButtonWrapper})},makeFullScreen:function(e){document.fire("xwiki:fullscreen:enter",{target:e});if(this.maximizedReference){if(e.id){this.maximizedReference.value=e.tagName+"[id='"+e.id+"']"}else{if(e.name){this.maximizedReference.value=e.tagName+"[name='"+e.name+"']"}else{if(e.className){this.maximizedReference.value=e.tagName+"."+e.className}}}}this.maximized=e;if(typeof e.setSelectionRange=="function"){var g=e.selectionStart;var i=e.selectionEnd;var h=e.scrollTop}e._originalStyle={width:e.style.width,height:e.style.height};var j=e.up();j.addClassName("fullScreenWrapper");if(e._toolbar){if(e._toolbar.hasClassName("leftmenu2")){j.insert({top:e._toolbar.replace(this.toolbarPlaceholder)})}e._x_fullScreenActivator.replace(this.closeButton)}j.insert(this.buttons.replace(this.buttonsPlaceholder).show());var f=e.up();e._x_fullScreenActivator.hide();while(f!=document.body){f._originalStyle={overflow:f.style.overflow,position:f.style.position,width:f.style.width,height:f.style.height,left:f.style.left,right:f.style.right,top:f.style.top,bottom:f.style.bottom,padding:f.style.padding,margin:f.style.margin};f.setStyle({overflow:"visible",position:"absolute",width:"100%",height:"100%",left:0,top:0,right:0,bottom:0,padding:0,margin:0});f.siblings().each(function(k){k._originalDisplay=k.style.display;k.setStyle({display:"none"});k._fullscreenHidden=true});f=f.up()}document.body._originalStyle={overflow:f.style.overflow,width:f.style.width,height:f.style.height};var d=$(document.body).up();d._originalStyle={overflow:d.style.overflow,width:d.style.width,height:d.style.height};$(document.body).setStyle({overflow:"hidden",width:"100%",height:"100%"});d.setStyle({overflow:"hidden",width:"100%",height:"100%"});this.resizeListener=this.resizeTextArea.bind(this,e);Event.observe(window,"resize",this.resizeListener);this.closeButton.show();this.actionCloseButtonWrapper.show();this.resizeTextArea(e);if(typeof e.setSelectionRange=="function"){e.scrollTop=h;e.selectionStart=g;e.selectionEnd=i}document.fire("xwiki:fullscreen:entered",{target:e})},closeFullScreen:function(){var e=this.maximized;document.fire("xwiki:fullscreen:exit",{target:e});if(typeof e.setSelectionRange=="function"){var h=e.selectionStart;var k=e.selectionEnd;var j=e.scrollTop}this.closeButton.hide();this.actionCloseButtonWrapper.hide();Event.stopObserving(window,"resize",this.resizeListener);e.up().removeClassName("fullScreenWrapper");var g=e.up();var d=[];while(g!=document.body){d.push(g);g=g.up()}var f=d.length;while(f--){g=d[f];g.setStyle(g._originalStyle);g.siblings().each(function(i){if(i._fullscreenHidden){i.style.display=i._originalDisplay||""}})}document.body.setStyle(document.body._originalStyle);$(document.body).up().setStyle($(document.body).up()._originalStyle);this.buttonsPlaceholder.replace(this.buttons);if(this.buttons._x_isCustom){this.buttons.hide()}if(e._toolbar){if(e._toolbar.hasClassName("leftmenu2")){this.toolbarPlaceholder.replace(e._toolbar)}this.closeButton.replace(e._x_fullScreenActivator)}if(Prototype.Browser.IE){setTimeout(function(){e._x_fullScreenActivator.show();this.setStyle(this._originalStyle)}.bind(e),500)}else{e._x_fullScreenActivator.show();e.setStyle(e._originalStyle)}delete this.maximized;if(this.maximizedReference){this.maximizedReference.value=""}if(typeof e.setSelectionRange=="function"){e.scrollTop=j;e.selectionStart=h;e.selectionEnd=k}document.fire("xwiki:fullscreen:exited",{target:e})},resizeTextArea:function(e){if(!this.maximized){return}var d=document.viewport.getHeight();var f=document.viewport.getWidth();f=f-this.margin;d=d-e.positionedOffset().top-this.margin-this.buttons.getHeight();e.setStyle({width:f+"px",height:d+"px"});document.fire("xwiki:fullscreen:resized",{target:e})},preventDrag:function(d){d.stop()},cleanup:function(){Event.stopObserving(window,"unload",this.unloadHandler);try{this.actionCloseButtonWrapper.remove()}catch(d){}}});function b(){return new a.FullScreen()}(c.domIsLoaded&&b())||document.observe("xwiki:dom:loaded",b);return c}(XWiki||{}));