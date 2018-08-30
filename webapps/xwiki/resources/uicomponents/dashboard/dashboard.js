require.config({paths:{gadgetWizard:"$xwiki.getSkinFile('uicomponents/dashboard/gadgetWizard', true)"}});var XWiki=(function(b){b.Dashboard=Class.create({initialize:function(c){this.element=c;this.gadgetsClass="XWiki.GadgetClass";this.readMetadata();this.displayWarning();this.edited=false;this.removed=new Array();this.element.addClassName("dashboard-edit");this.containers=c.select(".gadget-container");this.createDragAndDrops();this.addGadgetsHandlers();this.addNewGadgetHandler();this.addNewContainerHandler();document.observe("xwiki:actions:save",this.saveChanges.bindAsEventListener(this))},readMetadata:function(){this.editURL=this.element.down(".metadata .editurl").readAttribute("href");this.removeURL=this.element.down(".metadata .removeurl").readAttribute("href");this.addURL=this.element.down(".metadata .addurl").readAttribute("href");this.sourcePage=this.element.down(".metadata .sourcepage").innerHTML;this.sourceSpace=this.element.down(".metadata .sourcespace").innerHTML;this.sourceWiki=this.element.down(".metadata .sourcewiki").innerHTML;this.sourceURL=this.element.down(".metadata .sourceurl").readAttribute("href")},displayWarning:function(){if(b.currentDocument.page!=this.sourcePage||b.currentDocument.space!=this.sourceSpace||b.currentDocument.wiki!=this.sourceWiki){var f=new Element("div",{"class":"box warningmessage differentsource"});var d="$escapetool.javascript($services.localization.render('dashboard.actions.edit.differentsource.information'))";var c="$escapetool.javascript($services.localization.render('dashboard.actions.edit.differentsource.warning'))";var e=new Element("a",{href:this.sourceURL});e.update(this.sourceWiki+":"+this.sourceSpace+"."+this.sourcePage);f.insert(d);f.insert(e);f.insert(c);this.element.insert({top:f})}},_getContainerId:function(c){return c.readAttribute("id").substring(16)},_getGadgetId:function(c){return c.readAttribute("id").substring(7)},_getMacroCallComment:function(c){return"<!--"+c+"--><!--stopmacro-->"},_parseMacroCallComment:function(d){var c=d.indexOf("-->");if(d.startsWith("<!--startmacro:")&&c>0){return d.substr(4,c-4)}else{return null}},_insertPlaceholder:function(c){if(c.down(".gadget")||c.down(".gadget-placeholder")){return}var d=new Element("div",{"class":"gadget-placeholder"}).update("$escapetool.javascript($services.localization.render('dashboard.gadget.actions.drop'))");c.insert(d)},_removePlaceholder:function(d){var c=d.select(".gadget-placeholder");c.each(function(e){e.remove()})},_doOnStartDrag:function(){this.containers.each(this._insertPlaceholder)},_doOnEndDrag:function(){this.containers.each(this._removePlaceholder)},createDragAndDrops:function(){var c=new Array();this.containers.each(function(d){c.push(d.readAttribute("id"))});c.each(function(d){this.makeSortable(d,c,this.onMoveGadget.bind(this))}.bind(this));Draggables.addObserver({onStart:this._doOnStartDrag.bind(this),onEnd:this._doOnEndDrag.bind(this)})},makeSortable:function(c,d,e){Sortable.create(c,{tag:"div",only:"gadget",handle:"gadget-title",overlap:"vertical",scroll:window,containment:d,dropOnEmpty:true,constraint:false,ghosting:false,hoverclass:"gadget-container-hover-highlight",onUpdate:e})},addGadgetsHandlers:function(){this.element.select(".gadget").each(this.addGadgetHandlers.bind(this))},addGadgetHandlers:function(f){var e=new Element("span",{"class":"remove action",title:"$escapetool.javascript($services.localization.render('dashboard.gadget.actions.delete.tooltip'))"});e.observe("click",this.onRemoveGadget.bindAsEventListener(this));var c=new Element("span",{"class":"edit action",title:"$escapetool.javascript($services.localization.render('dashboard.gadget.actions.edit.tooltip'))"});c.observe("click",this.onEditGadgetClick.bindAsEventListener(this));var d=new Element("div",{"class":"gadget-actions"});d.insert(c);d.insert(e);f.insert(d)},addNewGadgetHandler:function(){var c=new Element("div",{"class":"addgadget",title:"$escapetool.javascript($services.localization.render('dashboard.actions.add.tooltip'))"});c.update("$escapetool.javascript($services.localization.render('dashboard.actions.add.button'))");c.observe("click",this.onAddGadgetClick.bindAsEventListener(this));var d=this.element.down(".differentsource");if(d){d.insert({after:c})}else{this.element.insert({top:c})}c.insert({after:new Element("div",{"class":"clearfloats"})})},onAddGadgetClick:function(c){this.runGadgetWizard($(c.target),null,this.onAddGadgetComplete.bind(this))},runGadgetWizard:function(c,d,e){if(c.hasClassName("loading")){return}c.addClassName("loading");require(["gadgetWizard"],function(f){f(d).done(e).always(function(){c.removeClassName("loading")})})},onAddGadgetComplete:function(g){var f=this._getMacroCallComment(g.content);var c=this.containers.length;var h=this.containers.last().select(".gadget").length+1;var d=new Hash();d.set("classname",this.gadgetsClass);d.set(this.gadgetsClass+"_title",g.title);d.set(this.gadgetsClass+"_content",f);d.set("RequiresHTMLConversion",this.gadgetsClass+"_content");d.set(this.gadgetsClass+"_content_syntax","xwiki/2.0");d.set(this.gadgetsClass+"_position",c+", "+h);var e=this.getFormToken();d.set("form_token",e);this._x_notification=new b.widgets.Notification("$escapetool.javascript($services.localization.render('dashboard.actions.add.loading'))","inprogress");new Ajax.Request(this.addURL,{parameters:d,onSuccess:function(i){window.location.reload()}.bind(this),onFailure:function(i){var j=i.statusText;if(i.statusText==""||i.status==12031){j="Server not responding"}this._x_notification.replace(new b.widgets.Notification("$escapetool.javascript($services.localization.render('dashboard.actions.add.failed'))"+j,"error",{timeout:5}))}.bind(this),on0:function(i){i.request.options.onFailure(i)}.bind(this)})},onEditGadgetClick:function(c){var h=c.element().up(".gadget");if(h){var d=h.down(".metadata");if(!d){return}var k=d.down(".isMacro");if(k&&k.innerHTML=="true"){var e=this._getGadgetId(h);var l,f;var i=d.down(".title");if(i){l=i.innerHTML}var m=d.down(".content");if(m){var g=m.innerHTML;f=this._parseMacroCallComment(g)}this.runGadgetWizard($(c.target),{title:l,content:f},function(n){this.onEditGadgetComplete(e,n)}.bind(this))}else{var j=new b.widgets.ModalPopup("$escapetool.javascript($services.localization.render('dashboard.gadget.actions.edit.error.notmacro'))",{},{title:"$escapetool.javascript($services.localization.render('dashboard.gadget.actions.edit.error.notmacro.title'))"});j.showDialog()}}},onEditGadgetComplete:function(c,g){var f=this._getMacroCallComment(g.content);var e=new Hash();e.set(this.gadgetsClass+"_"+c+"_title",g.title);e.set(this.gadgetsClass+"_"+c+"_content",f);e.set("RequiresHTMLConversion",this.gadgetsClass+"_"+c+"_content");e.set(this.gadgetsClass+"_"+c+"_content_syntax","xwiki/2.0");e.set("ajax","1");var d=this.getFormToken();e.set("form_token",d);this._x_notification=new b.widgets.Notification("$escapetool.javascript($services.localization.render('dashboard.gadget.actions.edit.loading'))","inprogress");new Ajax.Request(this.editURL,{parameters:e,onSuccess:function(h){window.location.reload()}.bind(this),onFailure:function(h){var i=h.statusText;if(h.statusText==""||h.status==12031){i="Server not responding"}this._x_notification.replace(new b.widgets.Notification("$escapetool.javascript($services.localization.render('dashboard.gadget.actions.edit.failed'))"+i,"error",{timeout:5}))}.bind(this),on0:function(h){h.request.options.onFailure(h)}.bind(this)})},onRemoveGadget:function(e){var d=e.element();var f=d.up(".gadget");if(!f){return}var c=this._getGadgetId(f);this.removed.push(c);new b.widgets.ConfirmedAjaxRequest(this.removeURL,{parameters:{classname:encodeURIComponent(this.gadgetsClass),classid:encodeURIComponent(c),ajax:"1",form_token:this.getFormToken()},onCreate:function(){d.disabled=true},onSuccess:function(g){f.remove()}.bind(this)},{confirmationText:"$escapetool.javascript($services.localization.render('dashboard.gadget.actions.delete.confirm'))",progressMessageText:"$escapetool.javascript($services.localization.render('dashboard.gadget.actions.delete.inProgress'))",successMessageText:"$escapetool.javascript($services.localization.render('dashboard.gadget.actions.delete.done'))",failureMessageText:"$escapetool.javascript($services.localization.render('dashboard.gadget.actions.delete.failed'))"})},addNewContainerHandler:function(){var c=new Element("div",{"class":"addcontainer",title:"$escapetool.javascript($services.localization.render('dashboard.actions.columns.add.tooltip'))"});c.update("$escapetool.javascript($services.localization.render('dashboard.actions.columns.add.button'))");c.observe("click",this.onAddColumn.bindAsEventListener(this));var d=this.element.down(".addgadget");d.insert({before:c})},onAddColumn:function(d){var h=this.containers.last();var f=this._getContainerId(h);var l=1+parseInt(f,10);var e="gadgetcontainer_"+l;var c=new Element("div",{"class":h.readAttribute("class"),id:e});h.removeClassName("last-column");h.insert({after:c});this.containers.push(c);var i="container-columns-"+(this.containers.length-1);var g="container-columns-"+this.containers.length;var j=h.parentNode;j.addClassName(g);j.removeClassName(i);var k=new Array();this.containers.each(function(m){k.push(m.readAttribute("id"))});this.createDragAndDrops()},doEditGadgets:function(e){var d=this.prepareEditParameters();d.set("ajax","1");var c=this.getFormToken();d.set("form_token",c);new Ajax.Request(this.editURL,{parameters:d,onSuccess:function(f){this.edited=false;if(e){e()}}.bind(this),onFailure:function(f){var g=f.statusText;if(f.statusText==""||f.status==12031){g="Server not responding"}this._x_notification=new b.widgets.Notification("$escapetool.javascript($services.localization.render('dashboard.actions.edit.failed'))"+g,"error",{timeout:5});if(e){e()}}.bind(this),on0:function(f){f.request.options.onFailure(f)}.bind(this)})},onMoveGadget:function(c){this.edited=true},saveChanges:function(d){if(!this.edited){return}d.stop();d.memo.originalEvent.stop();var c=d.memo.originalEvent.element();this._x_edit_notification=new b.widgets.Notification("$escapetool.javascript($services.localization.render('dashboard.actions.save.loading'))","inprogress");this.doEditGadgets(function(){if(!this.edited){c.click()}if(this._x_edit_notification){this._x_edit_notification.hide()}}.bind(this))},prepareEditParameters:function(){var c=new Hash();this.containers.each(function(e){var d=this._getContainerId(e);e.select(".gadget").each(function(i,h){var f=this._getGadgetId(i);var g=this.gadgetsClass+"_"+f+"_position";var j=d+", "+(h+1);c.set(g,j)},this)},this);return c},getFormToken:function(){var c=this.element.up("form");if(c){var d=c.form_token;if(d){return d.value}}return""}});function a(){if(b.contextaction=="inline"||(b.contextaction=="edit"&&$("inline"))){var c=$$(".dashboard")[0];if(c){new b.Dashboard(c)}}return true}(b.domIsLoaded&&a())||document.observe("xwiki:dom:loaded",a);return b}(XWiki||{}));