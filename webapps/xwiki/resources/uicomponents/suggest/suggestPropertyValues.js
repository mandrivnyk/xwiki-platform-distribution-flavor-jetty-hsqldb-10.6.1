require.config({paths:{"xwiki-selectize":"$xwiki.getSkinFile('uicomponents/suggest/xwiki.selectize.js', true)?v=$escapetool.url($xwiki.version)"}});define("xwiki-suggestPropertyValues",["jquery","xwiki-selectize"],function(b){var a=function(d){var e=["$request.contextPath","rest","wikis",encodeURIComponent(XWiki.currentWiki),"classes",encodeURIComponent(d.attr("data-className")),"properties",encodeURIComponent(d.attr("data-propertyName")),"values"].join("/");return{create:true,load:function(f,g){b.getJSON(e,{fp:f,limit:10}).then(function(h){if(h&&b.isArray(h.propertyValues)){return h.propertyValues.map(c)}else{return[]}}).done(g).fail(g)}}};var c=function(e){var d=e.metaData||{};return{value:e.value,label:d.label,icon:d.icon,url:d.url,hint:d.hint}};b.fn.suggestPropertyValues=function(){return this.each(function(){b(this).xwikiSelectize(a(b(this)))})}});require(["jquery","xwiki-suggestPropertyValues","xwiki-events-bridge"],function(a){var b=function(d,e){var c=a((e&&e.elements)||document);c.find(".suggest-propertyValues").suggestPropertyValues()};a(document).on("xwiki:dom:updated",b);b()});