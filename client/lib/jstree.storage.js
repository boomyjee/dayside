/*
 * jsTree storage plugin
 * Stores the currently opened/selected nodes in a jStorage and then restores them
 * Depends on the jStorage plugin
 */
(function ($) {
	$.jstree.plugin("storage", {
		__init : function () {
			var s = this._get_settings().storage,
				tmp;
			if(!!s.save_loaded) {
				tmp = $.jStorage.get(s.save_loaded);
				if(tmp && tmp.length) { this.data.core.to_load = tmp.split(","); }
			}
			if(!!s.save_opened) {
				tmp = $.jStorage.get(s.save_opened);
				if(tmp && tmp.length) { this.data.core.to_open = tmp.split(","); }
			}
			if(!!s.save_selected) {
				tmp = $.jStorage.get(s.save_selected);
				if(tmp && tmp.length && this.data.ui) { this.data.ui.to_select = tmp.split(","); }
			}
			this.get_container()
				.one( ( this.data.ui ? "reselect" : "reopen" ) + ".jstree", $.proxy(function () {
					this.get_container()
						.bind("open_node.jstree close_node.jstree select_node.jstree deselect_node.jstree", $.proxy(function (e) { 
								if(this._get_settings().storage.auto_save) { this.save_storage((e.handleObj.namespace + e.handleObj.type).replace("jstree","")); }
							}, this));
				}, this));
		},
		defaults : {
			save_loaded		: "jstree_load",
			save_opened		: "jstree_open",
			save_selected	: "jstree_select",
			auto_save		: true
		},
		_fn : {
			save_storage : function (c) {
				if(this.data.core.refreshing) { return; }
				var s = this._get_settings().storage;
				if(!c) { // if called manually and not by event
					if(s.save_loaded) {
						this.save_loaded();
						$.jStorage.set(s.save_loaded, this.data.core.to_load.join(","));
					}
					if(s.save_opened) {
						this.save_opened();
						$.jStorage.set(s.save_opened, this.data.core.to_open.join(","));
					}
					if(s.save_selected && this.data.ui) {
						this.save_selected();
						$.jStorage.set(s.save_selected, this.data.ui.to_select.join(","));
					}
					return;
				}
				switch(c) {
					case "open_node":
					case "close_node":
						if(!!s.save_opened) { 
							this.save_opened(); 
							$.jStorage.set(s.save_opened, this.data.core.to_open.join(",")); 
						}
						if(!!s.save_loaded) { 
							this.save_loaded(); 
							$.jStorage.set(s.save_loaded, this.data.core.to_load.join(",")); 
						}
						break;
					case "select_node":
					case "deselect_node":
						if(!!s.save_selected && this.data.ui) { 
							this.save_selected(); 
							$.jStorage.set(s.save_selected, this.data.ui.to_select.join(",")); 
						}
						break;
				}
			}
		}
	});
})(jQuery);
//*/