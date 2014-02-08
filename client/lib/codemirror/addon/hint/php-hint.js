(function () {
    
    function forEach(arr, f) {
        for (var i = 0, e = arr.length; i < e; ++i) f(arr[i]);
    }
  
    function arrayContains(arr, item) {
        if (!Array.prototype.indexOf) {
            var i = arr.length;
            while (i--) {
                if (arr[i] === item) {
                    return true;
                }
            }
            return false;
        }
        return arr.indexOf(item) != -1;
    }

    function scriptHint(editor, keywords, getToken) {
        // Find the token at the cursor
        var cur = editor.getCursor(), token = getToken(editor, cur), tprop = token;
        // If it's not a 'word-style' token, ignore the token.
        if (!/^[\w$_]*$/.test(token.string)) {
            token = tprop = {
                start: cur.ch, 
                end: cur.ch, 
                string: "", 
                state: token.state,
                className: token.string == "." ? "property" : null
            };
        }
        // If it is a property, find out what it is a property of.
        while (tprop.className == "property") {
            tprop = getToken(editor, {
                line: cur.line, 
                ch: tprop.start
            });
            if (tprop.string != ".") return;
            tprop = getToken(editor, {
                line: cur.line, 
                ch: tprop.start
            });
            if (tprop.string == ')') {
                var level = 1;
                do {
                    tprop = getToken(editor, {
                        line: cur.line, 
                        ch: tprop.start
                    });
                    switch (tprop.string) {
                        case ')':
                            level++;
                            break;
                        case '(':
                            level--;
                            break;
                        default:
                            break;
                    }
                } while (level > 0)
                tprop = getToken(editor, {
                    line: cur.line, 
                    ch: tprop.start
                });
                if (tprop.className == 'variable')
                    tprop.className = 'function';
                else return; // no clue
            }
            if (!context) var context = [];
            context.push(tprop);
        }
        return {
            list: getCompletions(token, context, keywords),
            from: {
                line: cur.line, 
                ch: token.start
            },
            to: {
                line: cur.line, 
                ch: token.end
            }
        };
    }

    
    CodeMirror.phpHint = function(editor) {
        return scriptHint(editor, phpKeywords,
            function (e, cur) {
                return e.getTokenAt(cur);
            });
    }
    CodeMirror.registerHelper("hint", "php", CodeMirror.phpHint);
    
    var stringProps = ("charAt charCodeAt indexOf lastIndexOf substring substr slice trim trimLeft trimRight toUpperCase toLowerCase split concat match replace search").split(" ");
    var arrayProps = ("length concat join splice push pop shift unshift slice reverse sort indexOf lastIndexOf every some filter forEach map reduce reduceRight ").split(" ");
    var funcProps = ("_() __() __checked_selected_helper() __construct() __destruct() __get_option() " +
        "__ngettext() __ngettext_noop() __set() __tostring() _add_themes_utility_last() _added() " +
        "_admin_notice_multisite_activate_plugins_page() _admin_notice_post_locked() _admin_search_query() _block() _blockheader() _c() " +
        "_changed() _check() _check_timeout() _checkcode() _close_comments_for_old_post() _close_comments_for_old_posts() " +
        "_compareseq() _connect() _context() _createresponder() _crop_image_resource() _css_href() " +
        "_custom_background_cb() _data_close() _data_prepare() _data_read() _data_write() _data_write_block() " +
        "_deep_replace() _default() _default_wp_die_handler() _delete_attachment_theme_mod() _deleted() _descendants() " +
        "_destroycache() _diag() _disconnect() _draft_or_post_title() _e() _each() " +
        "_encode() _encodearray() _endblock() _enddiff() _escape() _ex() " +
        "_exec() _expandlinks() _fetch_remote_file() _fetch_with_format() _fill_empty_link_category() _fill_many_users() " +
        "_fill_single_user() _fill_user() _fix_attachment_links() _fix_attachment_links_replace_cb() _flip_image_resource() _future_post_hook() " +
        "_get_cron_array() _get_current_taxonomy() _get_custom_object_labels() _get_display_callback() _get_dropins() _get_form_callback() " +
        "_get_meta_table() _get_page_link() _get_plugin_data_markup_translate() _get_post_ancestors() _get_template_edit_filename() _get_term_children() " +
        "_get_term_hierarchy() _get_update_callback() _get_widget_id_base() _getcmd() _getlines() _getmatches() " +
        "_getoptions() _getplink() _gettempdir() _gettransport() _hash_hmac() _http_build_query() " +
        "_httprequest() _httpsrequest() _image_get_preview_ratio() _init() _init_caps() _insert_into_post_button() " +
        "_insert_replace_helper() _intutf() _json_decode_object_helper() _lcspos() _lines() _links_add_base() " +
        "_links_add_target() _list() _list_meta_row() _logmsg() _make_cat_compat() _make_email_clickable_cb() " +
        "_make_url_clickable_cb() _make_web_ftp_clickable_cb() _map() _maybe_update_core() _maybe_update_plugins() _maybe_update_themes() " +
        "_mb_substr() _media_button() _mime_types() _multisite_getusersblogs() _n() _n_noop() " +
        "_nav_menu_item_id_use_once() _nc() _nx() _nx_noop() _p() _pad_term_counts() " +
        "_page_rows() _page_traverse_name() _parse_json() _parse_xml() _post_row() _post_states() " +
        "_posttransport() _prepare_post_body() _preview_theme_stylesheet_filter() _preview_theme_template_filter() _print_scripts() _publish_post_hook() " +
        "_quit() _readbool() _readmsg() _readnull() _readnumber() _readstring() " +
        "_real_escape() _register() _register_one() _register_widget_form_callback() _register_widget_update_callback() _register_widgets() " +
        "_relatedtarget() _relocate_children() _response_to_rss() _rotate_image_resource() _save_post_hook() _search_plugins_filter_callback() " +
        "_set() _set_cron_array() _set_preview() _settimeout() _settype() _shiftboundaries() " +
        "_show_post_preview() _sort_nav_menu_items() _splitonwords() _startblock() _startdiff() _strip_newlines() " +
        "_stripform() _striplinks() _striptext() _tag_row() _term_rows() _transition_post_status() " +
        "_unhtmlentities() _unzip_file_pclzip() _unzip_file_ziparchive() _update_post_term_count() _upgrade_cron_array() _usort_terms_by_id() " +
        "_usort_terms_by_name() _utfutf() _walk_bookmarks() _weak_escape() _wp_ajax_add_hierarchical_term() _wp_ajax_delete_comment_response() " +
        "_wp_ajax_menu_quick_search() _wp_auto_add_pages_to_menu() _wp_call_all_hook() _wp_comment_row() _wp_dashboard_control_callback() _wp_dashboard_recent_comments_row() " +
        "_wp_delete_orphaned_draft_menu_items() _wp_delete_post_menu_item() _wp_delete_tax_menu_item() _wp_dependency() _wp_filter_build_unique_id() _wp_filter_taxonomy_base() " +
        "_wp_get_comment_list() _wp_get_post_autosave_hack() _wp_get_user_contactmethods() _wp_http_get_object() _wp_kses_decode_entities_chr() _wp_kses_decode_entities_chr_hexdec() " +
        "_wp_menu_item_classes_by_context() _wp_menu_output() _wp_nav_menu_meta_box_object() _wp_oembed_get_object() _wp_post_revision_fields() _wp_post_thumbnail_class_filter() " +
        "_wp_post_thumbnail_class_filter_add() _wp_post_thumbnail_class_filter_remove() _wp_post_thumbnail_html() _wp_put_post_revision() _wp_relative_upload_path() _wp_specialchars() " +
        "_wp_translate_postdata() _wptexturize_pushpop_element() _x() abort() absolutize() absolutize_url() " +
        "abspath() accept_encoding() activate_plugin() activate_plugins() activate_sitewide_plugin() activatehandlers() " +
        "add() add_action() add_blog_option() add_callback() add_cap() add_clean_index() " +
        "add_comment_meta() add_comment_to_entry() add_comments_page() add_contextual_help() add_cssclass() add_custom_background() " +
        "add_custom_image_header() add_dashboard_page() add_data() add_editor_style() add_enclosure_if_new() add_endpoint() " +
        "add_entry() add_existing_user_to_blog() add_external_rule() add_feed() add_filter() add_global_groups() " +
        "add_image_size() add_js() add_link() add_links_page() add_magic_quotes() add_management_page() " +
        "add_media_page() add_menu_classes() add_menu_page() add_meta() add_meta_box() add_metadata() " +
        "add_new_user_to_blog() add_object_page() add_option() add_option_update_handler() add_option_whitelist() add_options_page() " +
        "add_pages_page() add_permastruct() add_ping() add_plugins_page() add_post_meta() add_post_type_support() " +
        "add_posts_page() add_query_arg() add_query_var() add_rewrite_endpoint() add_rewrite_rule() add_rewrite_tag() " +
        "add_role() add_rule() add_settings_error() add_settings_field() add_settings_section() add_shortcode() " +
        "add_strings() add_submenu_page() add_theme_page() add_theme_support() add_thickbox() add_to_blinklist() " +
        "add_to_blogmarks() add_to_delicious() add_to_digg() add_to_furl() add_to_magnolia() add_to_myweb() " +
        "add_to_newsvine() add_to_reddit() add_to_segnalo() add_to_service() add_to_simpy() add_to_spurl() " +
        "add_to_wists() add_user() add_user_meta() add_user_to_blog() add_users_page() add_utility_page() " +
        "addaddress() addarray() addattachment() addbcc() addcall() addcallback() " +
        "addcc() addclassestolist() addcustomheader() addedline() addembeddedimage() addmethods() " +
        "addrappend() addreplyto() addrformat() addselectvalue() addslashes_gpc() addstringattachment() " +
        "addtext() addtocache() addtwonumbers() adjacent_image_link() adjacent_post_link() adjacent_posts_rel_link() " +
        "adjacent_posts_rel_link_wp_head() adjust() admin_color_scheme_picker() admin_created_user_email() admin_created_user_subject() admin_load() " +
        "admin_notice_feed() admin_page() admin_url() after() akismet_admin_init() akismet_admin_warnings() " +
        "akismet_auto_check_comment() akismet_caught() akismet_check_db_comment() akismet_check_for_spam_button() akismet_check_server_connectivity() akismet_conf() " +
        "akismet_config_page() akismet_counter() akismet_delete_old() akismet_get_host() akismet_get_key() akismet_get_server_connectivity() " +
        "akismet_get_user_roles() akismet_http_post() akismet_init() akismet_kill_proxy_check() akismet_manage_page() akismet_nonce_field() " +
        "akismet_recheck_button() akismet_recheck_queue() akismet_result_spam() akismet_rightnow() akismet_server_connectivity_ok() akismet_set_comment_status() " +
        "akismet_spam_comments() akismet_spam_count() akismet_spam_totals() akismet_spamtoham() akismet_stats() akismet_stats_display() " +
        "akismet_stats_page() akismet_stats_script() akismet_submit_nonspam_comment() akismet_submit_spam_comment() akismet_transition_comment_status() akismet_verify_key() " +
        "akismet_warning() all() all_deps() allow_subdirectory_install() allow_subdomain_install() allowed_tags() " +
        "anchorposition_getpageoffsetleft() anchorposition_getpageoffsettop() anchorposition_getwindowoffsetleft() anchorposition_getwindowoffsettop() animatestart() animateto() " +
        "animmode() antispambot() any() apop() append() append_content() " +
        "append_editor() apply() apply_filters() apply_filters_ref_array() areamousedown() areamousemove() " +
        "argumentnames() array_unique_noempty() aspectratioxy() aspectratioyx() atime() atom__construct_type() " +
        "atom__construct_type() atom__content_construct_type() atom_enclosure() atomparser() atomserver() attach_uploads() " +
        "attachall() attachwhendone() attribute_escape() auth_redirect() auth_required() authenticate() " +
        "authentication() authentication_header() author_can() autodiscovery() autoembed() autoembed_callback() " +
        "automatic_feed_links() autosave_disable_buttons() autosave_enable_buttons() autosave_loading() autosave_parse_response() autosave_saved() " +
        "autosave_saved_new() autosave_update_slug() avoid_blog_page_permalink_collision() background_color() background_image() backslashit() " +
        "bad_request() bail() balancetags() baseencodewrapmb() before() before_last_bar() " +
        "before_version_name() bind() bindaseventlistener() blank() block_request() blogger_deletepost() " +
        "blogger_editpost() blogger_getpost() blogger_getrecentposts() blogger_gettemplate() blogger_getuserinfo() blogger_getusersblogs() " +
        "blogger_newpost() blogger_settemplate() bloginfo() bloginfo_rss() blurry() body() " +
        "body_class() bool_from_yn() build_query() build_query_string() buildcookieheader() bulk_edit_posts() " +
        "bulk_footer() bulk_header() bulk_upgrade() bulk_upgrader_skin() bump_request_timeout() cache_javascript_headers() " +
        "cache_oembed() cache_users() calculatetype() calendar_week_mod() call() callback() " +
        "camelize() cancel_comment_reply_link() cancelcrop() cancelselection() cancelupload() capital_p_dangit() " +
        "capitalize() cat_is_ancestor_of() category_description() category_exists() cb() cdata() " +
        "cdup() change_encoding() changedtype() changefinalcolor() check_admin_referer() check_ajax_referer() " +
        "check_and_publish_future_post() check_cache() check_column() check_comment() check_comment_flood_db() check_database_version() " +
        "check_import_new_users() check_pass_strength() check_server_timer() check_upload_mimes() check_upload_size() checkcache() " +
        "checkdeficiency() checked() checkipv() checkpassword() checkreadystate() checkwords() " +
        "choose_primary_blog() chunktransferdecode() clean_attachment_cache() clean_bookmark_cache() clean_category_cache() clean_comment_cache() " +
        "clean_object_term_cache() clean_page_cache() clean_post_cache() clean_pre() clean_term_cache() clean_url() " +
        "clean_user_cache() clear() clear_global_post_cache() clearaddresses() clearallrecipients() clearattachments() " +
        "clearbccs() clearccs() clearcustomheaders() clearreplytos() clickhandler() client_error() " +
        "clone() close() closefullscreen() cmpr_strlen() codepoint_to_utf() codepress_footer_js() " +
        "codepress_get_lang() collect() colname() colorpicker() colorpicker_highlightcolor() colorpicker_pickcolor() " +
        "colorpicker_select() colorpicker_show() colorpicker_writediv() comment_author() comment_author_email() comment_author_email_link() " +
        "comment_author_ip() comment_author_link() comment_author_rss() comment_author_url() comment_author_url_link() comment_block() " +
        "comment_class() comment_date() comment_excerpt() comment_exists() comment_footer_die() comment_form() " +
        "comment_form_title() comment_guid() comment_id() comment_id_fields() comment_link() comment_reply_link() " +
        "comment_text() comment_text_rss() comment_time() comment_type() comments_link() comments_link_feed() " +
        "comments_number() comments_open() comments_popup_link() comments_popup_script() comments_rss() comments_rss_link() " +
        "comments_template() compatible_gzinflate() compress() compress_parse_url() compression_test() compute_string_distance() " +
        "computecolor() concat() confirm_another_blog_signup() confirm_blog_signup() confirm_delete_users() confirm_user_signup() " +
        "connect() connected() consume() consume_range() content_encoding() content_url() " +
        "contextline() convert_chars() convert_smilies() convert_to_screen() convertentities() converthextorgb() " +
        "convertrgbtohex() convertversionstring() copy_dir() core_update_footer() core_upgrade_preamble() count_imported_posts() " +
        "count_many_users_posts() count_user_posts() count_users() countaddedlines() countdeletedlines() create() " +
        "create_attachment() create_empty_blog() create_initial_post_types() create_initial_taxonomies() create_post() create_user() " +
        "createbody() created() createdragger() createhandles() createheader() createmover() " +
        "crypt_private() css_includes() cssclass() current_after() current_before() current_filter() " +
        "current_theme_info() current_theme_supports() current_time() current_user_can() current_user_can_for_blog() curry() " +
        "custom_background() custom_image_header() cwd() d() dashboard_quota() dashboardtotals() " +
        "dasherize() data() datahtml() date_asctime() date_in() date_rfc() " +
        "date_rfc() date_strtotime() date_wcdtf() db_connect() db_version() dbdelta() " +
        "deactivate_plugin_before_upgrade() deactivate_plugins() deactivate_sitewide_plugin() debug() debug_fclose() debug_fopen() " +
        "debug_fwrite() decode() decompress() default_password_nag() default_password_nag_edit_user() default_password_nag_handler() " +
        "default_topic_count_scale() default_topic_count_text() defer() delay() delayed_autosave() delete() " +
        "delete_all_user_settings() delete_attachment() delete_blog_option() delete_comment_meta() delete_get_calendar_cache() delete_meta() " +
        "delete_metadata() delete_oembed_caches() delete_old_plugin() delete_old_theme() delete_option() delete_plugins() " +
        "delete_post() delete_post_meta() delete_post_meta_by_key() delete_theme() delete_transient() delete_user_meta() " +
        "delete_user_option() delete_user_setting() delete_usermeta() deletebyindex() deletedline() deleteerror() " +
        "deletesuccess() deleteusersetting() dequeue() deslash() destroy() detect() " +
        "did_action() diff() difference() dirlist() disablecrop() disabled() " +
        "disablehandles() discover() discover_pingback_server_uri() dismiss_core_update() dismissed_updates() dispatch() " +
        "display_cached_file() display_callback() display_element() display_header() display_page_row() display_plugins_table() " +
        "display_setup_form() display_space_usage() display_theme() display_themes() displayitems() div() " +
        "do_action() do_action_ref_array() do_activate_header() do_all_pings() do_core_upgrade() do_dismiss_core_update() " +
        "do_enclose() do_feed() do_feed_atom() do_feed_rdf() do_feed_rss() do_feed_rss() " +
        "do_footer_items() do_head_items() do_item() do_items() do_meta_boxes() do_paging() " +
        "do_robots() do_settings_fields() do_settings_sections() do_shortcode() do_shortcode_tag() do_signup_header() " +
        "do_strip_htmltags() do_trackbacks() do_undismiss_core_update() docmouseup() documentation_link() dolly_css() " +
        "domain_exists() domove() done() doneselect() donudge() doparentsubmit() " +
        "doresize() doupdate() download_package() download_url() drag_drop_help() dragdiv() " +
        "dragmodehandler() drop_index() dropdown_categories() dropdown_cats() dropdown_link_categories() duplicate() " +
        "dvortr() dynamic_sidebar() eachslice() echo_entry() edaddtag() edbutton() " +
        "edcheckopentags() edclosealltags() edinsertcontent() edinsertimage() edinsertlink() edinserttag() " +
        "edit_bookmark_link() edit_comment() edit_comment_link() edit_link() edit_post() edit_post_link() " +
        "edit_tag_link() edit_user() edlink() edquicklink() edremovetag() edshowbutton() " +
        "edshowlinks() edspell() edtoolbar() element() element_implode() email_exists() " +
        "embed() embed_flash() embed_flv() embed_odeo() embed_quicktime() embed_wmedia() " +
        "empty() emptyline() enable_cache() enable_order_by_date() enable_xml_dump() enablecrop() " +
        "enablehandles() encode() encode() encode_instead_of_strip() encodefile() encodeheader() " +
        "encodeq() encodeq_callback() encodeqp() encodestring() encodeunsafe() encoding() " +
        "encoding_equals() encoding_name() encoding_value() end_el() end_element() end_lvl() " +
        "end_ns() endboundary() endelement() endswith() enqueue() enqueue_comment_hotkeys_js() " +
        "entncr() entities_decode() entity() error() error_handler() errorcode() " +
        "errorinfo() errorname() esc_attr() esc_attr__() esc_attr_e() esc_attr_x() " +
        "esc_html() esc_html__() esc_html_e() esc_html_x() esc_js() esc_sql() " +
        "esc_url() esc_url_raw() escape() escape_by_ref() escapehtml() evaljson() " +
        "evalscripts() evx() evy() exists() expand() export() " +
        "export_entries() export_entry() export_headers() export_original() export_to_file() export_translations() " +
        "export_wp() extend() extendelementwith() extension() extract_from_markers() extractbyindex() " +
        "extractscripts() f() fallback() fatal() favorite_actions() features() " +
        "feed_cdata() feed_content_type() feed_end_element() feed_links() feed_links_extra() feed_or_html() " +
        "feed_start_element() feedback() fetch() fetch_feed() fetch_rss() fetchform() " +
        "fetchlinks() fetchtext() fget() file_is_displayable_image() file_is_valid_image() file_name() " +
        "file_upload_upgrader() filedialogcomplete() filedialogstart() filequeued() filequeueerror() fileupload() " +
        "fill_query_vars() filter_ssl() find() find_base_dir() find_core_update() find_folder() " +
        "find_posts_div() findall() finddomclass() findelement() finished() fire() " +
        "firecontentloadedevent() first() fix_import_form_size() fix_phpmailer_messageid() fix_protocol() fixeol() " +
        "flatten() flipcoords() fliptab() floated_admin_avatar() flush_output() flush_rewrite_rules() " +
        "flush_rules() flush_widget_cache() footer() for_blog() forbidden() force_balance_tags() " +
        "force_feed() force_fsockopen() force_ssl_content() form() form_callback() form_option() " +
        "format_code_lang() format_to_edit() format_to_post() fput() fs_connect() ftp() " +
        "ftp_base() funky_javascript_callback() funky_javascript_fix() g() gallery_shortcode() gd_edit_image_support() " +
        "generate_random_password() generate_rewrite_rule() generate_rewrite_rules() generatenamedcolors() generatepicker() generatepreview() " +
        "generatewebcolors() generic_ping() generic_strings() gensalt_blowfish() gensalt_extended() gensalt_private() " +
        "get() get__template() get_accepted_content_type() get_active_blog_for_user() get_adjacent_post() get_adjacent_post_rel_link() " +
        "get_admin_page_parent() get_admin_page_title() get_admin_url() get_admin_users_for_domain() get_all_category_ids() get_all_discovered_feeds() " +
        "get_all_page_ids() get_all_user_settings() get_alloptions() get_alloptions_() get_allowed_mime_types() get_allowed_themes() " +
        "get_approved_comments() get_archive_template() get_archives() get_archives_link() get_attached_file() get_attachment() " +
        "get_attachment_fields_to_edit() get_attachment_icon() get_attachment_icon_src() get_attachment_innerhtml() get_attachment_link() get_attachment_taxonomies() " +
        "get_attachment_template() get_attachments() get_attachments_url() get_attribution() get_author() get_author_feed_link() " +
        "get_author_link() get_author_name() get_author_permastruct() get_author_posts_url() get_author_rss_link() get_author_template() " +
        "get_author_user_ids() get_authority() get_authors() get_autotoggle() get_available_languages() get_available_post_mime_types() " +
        "get_available_post_statuses() get_avatar() get_background_color() get_background_image() get_base() get_base_dir() " +
        "get_bitrate() get_blog_count() get_blog_details() get_blog_id_from_url() get_blog_list() get_blog_option() " +
        "get_blog_permalink() get_blog_post() get_blog_prefix() get_blog_status() get_blogaddress_by_domain() get_blogaddress_by_id() " +
        "get_blogaddress_by_name() get_bloginfo() get_bloginfo_rss() get_blogs_of_user() get_body_class() get_bookmark() " +
        "get_bookmark_field() get_bookmarks() get_boundary_post() get_boundary_post_rel_link() get_broken_themes() get_byteorder() " +
        "get_calendar() get_caller() get_cancel_comment_reply_link() get_caption() get_captions() get_cat_id() " +
        "get_cat_name() get_categories() get_categories_url() get_categories_xml() get_category() get_category_by_path() " +
        "get_category_by_slug() get_category_children() get_category_feed_link() get_category_link() get_category_parents() get_category_permastruct() " +
        "get_category_rss_link() get_category_template() get_category_to_edit() get_catname() get_channel_tags() get_channels() " +
        "get_children() get_clean_basedomain() get_cli_args() get_col() get_col_info() get_column_headers() " +
        "get_comment() get_comment_author() get_comment_author_email() get_comment_author_email_link() get_comment_author_ip() get_comment_author_link() " +
        "get_comment_author_rss() get_comment_author_url() get_comment_author_url_link() get_comment_class() get_comment_count() get_comment_date() " +
        "get_comment_excerpt() get_comment_feed_permastruct() get_comment_guid() get_comment_id() get_comment_id_fields() get_comment_link() " +
        "get_comment_meta() get_comment_pages_count() get_comment_reply_link() get_comment_statuses() get_comment_text() get_comment_time() " +
        "get_comment_to_edit() get_comment_type() get_commentdata() get_comments() get_comments_link() get_comments_number() " +
        "get_comments_pagenum_link() get_comments_popup_template() get_content() get_contents() get_contents_array() get_contributor() " +
        "get_contributors() get_copyright() get_core_updates() get_credit() get_credits() get_curl_version() " +
        "get_current_byte() get_current_column() get_current_line() get_current_site() get_current_site_name() get_current_theme() " +
        "get_current_user_id() get_currentuserinfo() get_custom_fields() get_dashboard_blog() get_data() get_date() " +
        "get_date_from_gmt() get_date_permastruct() get_date_template() get_day_link() get_day_permastruct() get_default_feed() " +
        "get_default_link_to_edit() get_default_page_to_edit() get_default_post_to_edit() get_delete_post_link() get_description() get_dirsize() " +
        "get_dropins() get_duration() get_edit_bookmark_link() get_edit_comment_link() get_edit_post_link() get_edit_tag_link() " +
        "get_editable_authors() get_editable_roles() get_editable_user_ids() get_element() get_email() get_enclosed() " +
        "get_enclosure() get_enclosures() get_encoding() get_endtime() get_entries_url() get_entry() " +
        "get_entry_url() get_error_code() get_error_codes() get_error_data() get_error_message() get_error_messages() " +
        "get_error_string() get_expression() get_extended() get_extension() get_extra_permastruct() get_favicon() " +
        "get_feed() get_feed_link() get_feed_permastruct() get_feed_tags() get_field_id() get_field_name() " +
        "get_file() get_file_description() get_filesystem_method() get_footer() get_fragment() get_framerate() " +
        "get_front_page_template() get_gmt_from_date() get_handler() get_hash() get_hashes() get_header() " +
        "get_header_image() get_header_textcolor() get_height() get_hidden_columns() get_hidden_meta_boxes() get_home_path() " +
        "get_home_template() get_home_url() get_host() get_html() get_id() get_id_from_blogname() " +
        "get_image_height() get_image_link() get_image_send_to_editor() get_image_tag() get_image_tags() get_image_title() " +
        "get_image_url() get_image_width() get_images_from_uri() get_imported_comments() get_imported_posts() get_importers() " +
        "get_index_rel_link() get_index_template() get_inline_data() get_intermediate_image_sizes() get_iri() get_item() " +
        "get_item_quantity() get_item_tags() get_items() get_keyword() get_keywords() get_label() " +
        "get_language() get_last_updated() get_lastcommentmodified() get_lastpostdate() get_lastpostmodified() get_latitude() " +
        "get_length() get_lines() get_link() get_link_to_edit() get_linkcatname() get_linkobjects() " +
        "get_linkobjectsbyname() get_linkrating() get_links() get_links_list() get_links_withrating() get_linksbyname() " +
        "get_linksbyname_withrating() get_local_date() get_locale() get_locale_stylesheet_uri() get_longitude() get_manifest() " +
        "get_media_item() get_media_items() get_media_url() get_medium() get_meridiem() get_meta_keys() " +
        "get_metadata() get_month() get_month_abbrev() get_month_link() get_month_permastruct() get_most_active_blogs() " +
        "get_most_recent_post_of_user() get_mu_plugins() get_name() get_names() get_nav_menu_locations() get_next_comments_link() " +
        "get_next_post() get_next_posts_link() get_next_posts_page_link() get_nonauthor_user_ids() get_num_queries() get_number_of_root_elements() " +
        "get_object_taxonomies() get_object_term_cache() get_objects_in_term() get_option() get_others_drafts() get_others_pending() " +
        "get_others_unpublished_posts() get_page() get_page_by_path() get_page_by_title() get_page_children() get_page_hierarchy() " +
        "get_page_link() get_page_of_comment() get_page_permastruct() get_page_statuses() get_page_template() get_page_templates() " +
        "get_page_uri() get_paged_template() get_pagenum_link() get_pages() get_parent_post_rel_link() get_path() " +
        "get_pending_comments_num() get_permalink() get_player() get_plugin_data() get_plugin_files() get_plugin_page_hook() " +
        "get_plugin_page_hookname() get_plugin_updates() get_plugins() get_plural_forms_count() get_port() get_post() " +
        "get_post_ancestors() get_post_class() get_post_comments_feed_link() get_post_custom() get_post_custom_keys() get_post_custom_values() " +
        "get_post_field() get_post_meta() get_post_meta_by_id() get_post_mime_type() get_post_mime_types() get_post_modified_time() " +
        "get_post_permalink() get_post_reply_link() get_post_stati() get_post_status() get_post_status_object() get_post_statuses() " +
        "get_post_taxonomies() get_post_thumbnail_id() get_post_time() get_post_to_edit() get_post_type() get_post_type_capabilities() " +
        "get_post_type_labels() get_post_type_object() get_post_types() get_postdata() get_posts() get_posts_by_author_sql() " +
        "get_posts_nav_link() get_preferred_from_update_core() get_previous_comments_link() get_previous_post() get_previous_posts_link() get_previous_posts_page_link() " +
        "get_private_posts_cap_sql() get_profile() get_publish_time() get_pung() get_queried_object() get_queried_object_id() " +
        "get_query() get_query_template() get_query_var() get_random_bytes() get_rating() get_ratings() " +
        "get_real_file_to_edit() get_real_type() get_registered_nav_menus() get_relationship() get_restriction() get_restrictions() " +
        "get_results() get_role() get_role_caps() get_row() get_rss() get_sample_permalink() " +
        "get_sample_permalink_html() get_sampling_rate() get_scheme() get_search_comments_feed_link() get_search_feed_link() get_search_form() " +
        "get_search_link() get_search_permastruct() get_search_query() get_search_template() get_service() get_service_url() " +
        "get_settings() get_settings_errors() get_shortcode_regex() get_shortcut_link() get_sidebar() get_single_template() " +
        "get_site_allowed_themes() get_site_url() get_sitestats() get_size() get_source() get_source_tags() " +
        "get_space_allowed() get_starttime() get_status_header_desc() get_stylesheet() get_stylesheet_directory() get_stylesheet_directory_uri() " +
        "get_stylesheet_uri() get_super_admins() get_tag() get_tag_feed_link() get_tag_link() get_tag_permastruct() " +
        "get_tag_template() get_tags() get_tags_to_edit() get_taxonomies() get_taxonomy() get_taxonomy_labels() " +
        "get_taxonomy_template() get_temp_dir() get_template() get_template_directory() get_template_directory_uri() get_template_part() " +
        "get_term() get_term_by() get_term_children() get_term_feed_link() get_term_field() get_term_link() " +
        "get_term_to_edit() get_terms() get_terms_to_edit() get_text() get_the_attachment_link() get_the_author() " +
        "get_the_author_aim() get_the_author_description() get_the_author_email() get_the_author_firstname() get_the_author_icq() get_the_author_id() " +
        "get_the_author_lastname() get_the_author_link() get_the_author_login() get_the_author_meta() get_the_author_msn() get_the_author_nickname() " +
        "get_the_author_posts() get_the_author_url() get_the_author_yim() get_the_category() get_the_category_by_id() get_the_category_list() " +
        "get_the_category_rss() get_the_content() get_the_content_feed() get_the_date() get_the_excerpt() get_the_generator() " +
        "get_the_guid() get_the_id() get_the_modified_author() get_the_modified_date() get_the_modified_time() get_the_password_form() " +
        "get_the_post_thumbnail() get_the_tag_list() get_the_tags() get_the_taxonomies() get_the_term_list() get_the_terms() " +
        "get_the_time() get_the_title() get_the_title_rss() get_theme() get_theme_data() get_theme_mod() " +
        "get_theme_root() get_theme_root_uri() get_theme_roots() get_theme_updates() get_themes() get_thumbnail() " +
        "get_thumbnails() get_title() get_to_ping() get_trackback_url() get_transient() get_translations_for_domain() " +
        "get_type() get_udims() get_upload_iframe_src() get_upload_space_available() get_url() get_user_by() " +
        "get_user_by_email() get_user_count() get_user_details() get_user_id_from_string() get_user_meta() get_user_metavalues() " +
        "get_user_option() get_user_setting() get_user_to_edit() get_userdata() get_userdatabylogin() get_userinfo() " +
        "get_usermeta() get_usernumposts() get_users_drafts() get_users_of_blog() get_value() get_var() " +
        "get_weekday() get_weekday_abbrev() get_weekday_initial() get_weekstartend() get_width() get_wp_title_rss() " +
        "get_year_link() get_year_permastruct() getallusersettings() getanchorposition() getanchorwindowposition() getattr() " +
        "getbool() getboundary() getbrowserhtml() getcapabilities() getchmod() getcolor() " +
        "getcolorpickerhtml() getcorner() getcount() getcsssize() getcurrentresult() getdelim() " +
        "getdiff() getelementswithclassname() geterrorcode() geterrormessage() getfile() getfilename() " +
        "getfinal() getfixed() getformat() getfullheader() gethchmod() getheadervalue() " +
        "getint() getiso() getlength() getlevel() getlocation() getlogger() " +
        "getmailmime() getmaxfiles() getmaxsize() getmedialisthtml() getnumchmodfromh() getoffset() " +
        "getoriginal() getparams() getpath() getpos() getrect() getrequestparam() " +
        "getresponse() getrgb() getrootelement() getselection() getselectvalue() getstr() " +
        "getstyle() getsuggestions() gettext_select_plural_form() gettimestamp() gettoken() gettokenname() " +
        "getupdate() getusersetting() getvalue() getxml() glob_pattern_match() glob_regexp() " +
        "global_terms() gonext() goprev() got_mod_rewrite() graceful_fail() grant_super_admin() " +
        "grep() group() gsub() gzip_compression() handle_() handle_content_type() " +
        "handle_request() handle_upload() has_action() has_cap() has_data() has_excerpt() " +
        "has_filter() has_meta() has_nav_menu() has_post_thumbnail() has_tag() hash_hmac() " +
        "hashpassword() hasmethod() hasmultibytes() have_comments() have_posts() head() " +
        "header_image() header_text() header_textcolor() headerline() hello() hello_dolly() " +
        "hello_dolly_get_lyric() help() hide() hide_errors() home_url() host() " +
        "html_type_rss() htmlentities() htmlspecialchars_decode() http_version() human_time_diff() iframe_footer() " +
        "iframe_header() iis_add_rewrite_rule() iis_delete_rewrite_rule() iis_rewrite_rule_exists() iis_save_url_rewrite_rules() iis_supports_permalinks() " +
        "iis_url_rewrite_rules() image() image_add_caption() image_align_input_fields() image_attachment_fields_to_edit() image_attachment_fields_to_save() " +
        "image_constrain_size_for_editor() image_downsize() image_edit_apply_changes() image_get_intermediate_size() image_hwstring() image_link_input_fields() " +
        "image_make_intermediate_size() image_media_send_to_editor() image_resize() image_resize_dimensions() image_selector() image_size_input_fields() " +
        "img_caption_shortcode() imgload() imgmousedown() import_from_file() import_from_reader() in_category() " +
        "in_default_dir() in_the_loop() include() includes_url() index() index_rel_link() " +
        "indexof() info() ingroupsof() init() init_query_flags() initialise_blog_option_info() " +
        "initialize() initialmenumaxdepth() inject() inline_edit_row() inline_edit_term_row() inlineimageexists() " +
        "insert() insert_blog() insert_editor() insert_plain_editor() insert_with_markers() insertaction() " +
        "insertborder() insertchar() insertdragbar() inserthandle() inserthelpiframe() insertmedia() " +
        "inspect() install() install_blog() install_blog_defaults() install_dashboard() install_featured() " +
        "install_global_terms() install_network() install_new() install_package() install_plugin_information() install_plugin_install_status() " +
        "install_plugins_upload() install_popular() install_popular_tags() install_search() install_search_form() install_strings() " +
        "install_theme_information() install_theme_search() install_theme_search_form() install_themes_dashboard() install_themes_feature_list() install_themes_featured() " +
        "install_themes_new() install_themes_updated() install_themes_upload() install_updated() interfaceupdate() interleave_changed_lines() " +
        "internal_error() interpolate() intersect() invalid_media() invoke() is_() " +
        "is_active_sidebar() is_active_widget() is_admin() is_archive() is_archived() is_atom() " +
        "is_attachment() is_author() is_available() is_binary() is_blog_installed() is_blog_user() " +
        "is_category() is_child_theme() is_client_error() is_comment_feed() is_comments_popup() is_date() " +
        "is_day() is_declared_content_ns() is_dynamic_sidebar() is_email() is_email_address_unsafe() is_enabled() " +
        "is_error() is_exists() is_feed() is_front_page() is_home() is_info() " +
        "is_isegment_nz_nc() is_lighttpd_before_() is_linear_whitespace() is_local_attachment() is_main_blog() is_month() " +
        "is_multisite() is_nav_menu() is_nav_menu_item() is_network_only_plugin() is_new_day() is_object_in_taxonomy() " +
        "is_object_in_term() is_ok() is_page() is_page_template() is_paged() is_plugin_active() " +
        "is_plugin_active_for_network() is_plugin_page() is_post_type_hierarchical() is_preview() is_redirect() is_robots() " +
        "is_role() is_rss() is_rtl() is_search() is_serialized() is_serialized_string() " +
        "is_server_error() is_single() is_singular() is_site_admin() is_sticky() is_subdomain_install() " +
        "is_success() is_super_admin() is_tag() is_tax() is_taxonomy() is_taxonomy_hierarchical() " +
        "is_term() is_textdomain_loaded() is_time() is_trackback() is_uninstallable_plugin() is_upload_space_available() " +
        "is_user_logged_in() is_user_member_of_blog() is_user_option_local() is_user_over_quota() is_user_spammy() is_valid() " +
        "is_wp_error() is_wpmu_sitewide_plugin() is_year() isarray() isdebugenabled() iselement() " +
        "isempty() iserror() iserrorenabled() isfatalenabled() isfunction() ishash() " +
        "ishtml() isinfoenabled() isjson() isleftclick() ismail() ismiddleclick() " +
        "isnumber() iso_timezone_to_offset() iso_to_datetime() isqmail() isrightclick() issendmail() " +
        "issmtp() isstring() isstruct() isundefined() isvisible() iswarnenabled() " +
        "itemajaxerror() iter() ixr_base() ixr_client() ixr_clientmulticall() ixr_date() " +
        "ixr_error() ixr_introspectionserver() ixr_message() ixr_request() ixr_server() ixr_value() " +
        "js() js_() js_() js_escape() js_includes() jsencode() " +
        "json_decode() json_encode() keys() klass() kses_init() kses_init_filters() " +
        "kses_remove_filters() lang() language_attributes() last() lastindexof() lcs() " +
        "length() length_required() level_reduction() like_escape() linear_whitespace() link_advanced_meta_box() " +
        "link_cat_row() link_categories_meta_box() link_pages() link_submit_meta_box() link_target_meta_box() link_xfn_meta_box() " +
        "links_add_base_url() links_add_target() links_popup_script() list_authors() list_cats() list_core_update() " +
        "list_files() list_meta() list_plugin_updates() list_theme_updates() listcontent() listmethods() " +
        "load() load_child_theme_textdomain() load_default_textdomain() load_image_to_edit() load_muplugin_textdomain() load_plugin_textdomain() " +
        "load_template() load_textdomain() load_theme_textdomain() locale_stylesheet() localize() locate_template() " +
        "log_app() login() login_header() login_pass_ok() logio() loopback() " +
        "lowercase_octets() magpierss() mailsend() main() maintenance_mode() maintenance_nag() " +
        "make_clickable() make_db_current() make_db_current_silent() make_entry() make_headers() make_plural_form_function() " +
        "make_site_theme() make_site_theme_from_default() make_site_theme_from_oldschool() make_url_footnote() makeobj() manage_columns_prefs() " +
        "map_attrs() map_meta_cap() maybe_add_column() maybe_add_existing_user_to_blog() maybe_create_table() maybe_disable_automattic_widgets() " +
        "maybe_drop_column() maybe_make_link() maybe_redirect_() maybe_run_ajax_cache() maybe_serialize() maybe_unserialize() " +
        "mce_escape() mce_put_file() mctabs() mdel() mdtm() media_buttons() " +
        "media_handle_sideload() media_handle_upload() media_post_single_attachment_fields_to_edit() media_send_to_editor() media_sideload_image() media_single_attachment_fields_to_edit() " +
        "media_upload_audio() media_upload_bypass_url() media_upload_file() media_upload_flash_bypass() media_upload_form() media_upload_form_handler() " +
        "media_upload_gallery() media_upload_gallery_form() media_upload_header() media_upload_html_bypass() media_upload_image() media_upload_library() " +
        "media_upload_library_form() media_upload_tabs() media_upload_type_form() media_upload_type_url_form() media_upload_use_flash() media_upload_video() " +
        "menu_page_url() merge() merge_items() merge_with() meta_box_prefs() meta_form() " +
        "methodhelp() methodize() methodsignature() mget() min_whitespace() mmkdir() " +
        "mod_rewrite_rules() mouseabs() move() movecontent() movehandles() moveoffset() " +
        "moveto() movingmousemove() moxiecode_json() moxiecode_jsonreader() moxiecode_logger() mput() " +
        "ms_cookie_constants() ms_deprecated_blogs_file() ms_file_constants() ms_not_installed() ms_site_check() ms_subdomain_constants() " +
        "ms_upload_constants() msghtml() mt_getcategorylist() mt_getpostcategories() mt_getrecentposttitles() mt_gettrackbackpings() " +
        "mt_publishpost() mt_setpostcategories() mt_supportedmethods() mt_supportedtextfilters() mtime() mu_dropdown_languages() " +
        "mu_options() multicall() mw_editpost() mw_getcategories() mw_getpost() mw_getrecentposts() " +
        "mw_newmediaobject() mw_newpost() mycursor() mysqldate() name_value() native_embed() " +
        "network_admin_url() network_domain_check() network_home_url() network_site_url() network_step() network_step() " +
        "new_line() new_user_email_admin_notice() newblog_notify_siteadmin() newselection() newtracker() newuser_notify_siteadmin() " +
        "next_comment() next_comments_link() next_image_link() next_post() next_post_link() next_post_rel_link() " +
        "next_posts() next_posts_link() next_widget_id_number() nextpage() nextresult() nfinal() " +
        "nlist() no_content() no_update_actions() nocache_headers() noindex() noop() " +
        "norig() normalize() normalize_url() normalize_whitespace() not_allowed() not_found() " +
        "nplurals_and_expression_from_header() ns_to_prefix() number_format_in() observe() ok() onblur() " +
        "oncatchange() onendcrop() onloadinit() openbrowser() opplockcorner() option_update_filter() " +
        "output() output_javascript() owner() page_attributes_meta_box() page_links() page_rewrite_rules() " +
        "page_rows() page_template_dropdown() page_uri_index() paged_walk() paginate_comments_links() paginate_links() " +
        "parent_dropdown() parent_post_rel_link() parenthesize_plural_exression() parentscroll() parse() parse_banner() " +
        "parse_date() parse_iri() parse_mime() parse_query() parse_query_vars() parse_request() " +
        "parse_wcdtf() parsecolor() parsecontextdiff() parseiso() parsekey() parselisting() " +
        "parsetimestamp() parsetxt() parseunifieddiff() partition() pass() pass_cache_data() " +
        "pass_file_data() passive() password() passwordhash() passwordstrength() patchcallback() " +
        "path_is_absolute() path_join() pathinfo() pclzip() pclziputilcopyblock() pclziputiloptiontext() " +
        "pclziputilpathinclusion() pclziputilpathreduction() pclziputilrename() pclziputiltranslatewinpath() pct() peek() " +
        "percent_encoding_normalization() permalink_anchor() permalink_link() permalink_single_rss() pick() pickcolor() " +
        "pingback() pingback_extensions_getpingbacks() pingback_ping() pings_open() pluck() plugin_basename() " +
        "plugin_dir_path() plugin_dir_url() plugin_info() plugin_installer_skin() plugin_sandbox_scrape() plugin_upgrader_skin() " +
        "plugins_api() plugins_search_help() plugins_url() poify() pointer() pointerx() " +
        "pointery() polldoscroll() pomo_cachedfilereader() pomo_cachedintfilereader() pomo_filereader() pomo_reader() " +
        "pomo_stringreader() pop() pop_list() poperror() popstat() populate_network() " +
        "populate_options() populate_roles() populate_roles_() populate_roles_() populate_roles_() populate_roles_() " +
        "populate_roles_() populate_roles_() populate_roles_() populate_roles_() popuplinks() popupwindow() " +
        "popupwindow_attachlistener() popupwindow_autohide() popupwindow_getxyposition() popupwindow_hideifnotclicked() popupwindow_hidepopup() popupwindow_hidepopupwindows() " +
        "popupwindow_isclicked() popupwindow_populate() popupwindow_refresh() popupwindow_setsize() popupwindow_seturl() popupwindow_setwindowproperties() " +
        "popupwindow_showpopup() port() pos() post() post_author_meta_box() post_categories_meta_box() " +
        "post_class() post_comment_meta_box() post_comment_meta_box_thead() post_comment_status_meta_box() post_comments_feed_link() post_custom() " +
        "post_custom_meta_box() post_excerpt_meta_box() post_exists() post_password_required() post_permalink() post_preview() " +
        "post_reply_link() post_revisions_meta_box() post_rows() post_slug_meta_box() post_submit_meta_box() post_tags_meta_box() " +
        "post_thumbnail_meta_box() post_trackback_meta_box() post_type_exists() post_type_supports() postbox_classes() posts_nav_link() " +
        "pre_schema_upgrade() preg_index() prep_atom_text_construct() prepare() prepare_query() prepare_simplepie_object_for_cache() " +
        "prepare_vars_for_template_usage() preparemediaitem() preparemediaiteminit() preparereplacement() prepend_attachment() prepend_each_line() " +
        "presize() press_it() prev_post_rel_link() preview_theme() preview_theme_ob_filter() preview_theme_ob_filter_callback() " +
        "previewchar() previous_comments_link() previous_image_link() previous_post() previous_post_link() previous_posts() " +
        "previous_posts_link() prevresult() print_admin_styles() print_column_headers() print_error() print_footer_scripts() " +
        "print_head_scripts() print_plugin_actions() print_plugins_table() print_scripts() print_scripts_ln() privacy_ping_filter() " +
        "privadd() privaddfile() privaddfilelist() privaddfileusingtempfile() privaddlist() privcalculatestoredfilename() " +
        "privcheckfileheaders() privcheckformat() privclosefd() privconvertheaderfileinfo() privcreate() privdeletebyrule() " +
        "privdircheck() privdisablemagicquotes() privduplicate() priverrorlog() priverrorreset() privextractbyrule() " +
        "privextractfile() privextractfileasstring() privextractfileinoutput() privextractfileusingtempfile() privfiledescrexpand() privfiledescrparseatt() " +
        "privlist() privmerge() privopenfd() privoptiondefaultthreshold() privparseoptions() privreadcentralfileheader() " +
        "privreadendcentraldir() privreadfileheader() privswapbackmagicquotes() privwritecentralfileheader() privwritecentralheader() privwritefileheader() " +
        "process_conditionals() process_default_headers() processheaders() processkey() processresponse() properties() " +
        "pusherror() put() put_attachment() put_contents() put_file() put_post() " +
        "pwd() px() query() query_posts() quit() quote() " +
        "quote_char() quote_escaped() rawlist() read() read_all() read_entry() " +
        "read_line() readaway() readint() readintarray() readtoken() readvalue() " +
        "reason() rebound() recent_comments_style() recipient() recurse_dirsize() redirect() " +
        "redirect_canonical() redirect_guess__permalink() redirect_mu_dashboard() redirect_post() redirect_this_site() redirect_user_to_blog() " +
        "reduce_string() refresh() refresh_blog_details() refresh_user_details() register() register_activation_hook() " +
        "register_admin_color_schemes() register_column_headers() register_deactivation_hook() register_default_headers() register_globals() register_handler() " +
        "register_importer() register_nav_menu() register_nav_menus() register_new_user() register_post_status() register_post_type() " +
        "register_setting() register_sidebar() register_sidebar_widget() register_sidebars() register_taxonomy() register_taxonomy_for_object_type() " +
        "register_theme_directory() register_uninstall_hook() register_widget() register_widget_control() reject() rel_canonical() " +
        "release() remove() remove_accents() remove_action() remove_all_actions() remove_all_caps() " +
        "remove_all_filters() remove_all_shortcodes() remove_cap() remove_div() remove_dot_segments() remove_filter() " +
        "remove_meta_box() remove_option_update_handler() remove_option_whitelist() remove_post_type_support() remove_query_arg() remove_rfc_comments() " +
        "remove_role() remove_shortcode() remove_theme_mod() remove_theme_mods() remove_theme_support() remove_user_from_blog() " +
        "removenetmaskspec() render() rendercharmaphtml() replace() replace_invalid_with_pct_encoding() replace_urls() " +
        "request() request_filesystem_credentials() require_if_theme_supports() reset_password() resetposition() resize() " +
        "resizeiframe() resizeiframeinit() resizeinputs() restore() restore_current_blog() results_are_paged() " +
        "retrieve_password() retrieve_widgets() reverse() revoke_super_admin() rewind_comments() rewind_posts() " +
        "rewrite_rules() rfc_strtime() rfcdate() rich_edit_exists() rsd_link() rss_enclosure() " +
        "rsscache() run() run_command() run_shortcode() s() sack() " +
        "safecss_filter_attr() sanitize() sanitize_bookmark() sanitize_bookmark_field() sanitize_category() sanitize_category_field() " +
        "sanitize_comment_cookies() sanitize_email() sanitize_file_name() sanitize_html_class() sanitize_key() sanitize_option() " +
        "sanitize_post() sanitize_post_field() sanitize_sql_orderby() sanitize_term() sanitize_term_field() sanitize_text_field() " +
        "sanitize_title() sanitize_title_with_dashes() sanitize_url() sanitize_user() sanitize_user_field() sanitize_user_object() " +
        "save() save_mod_rewrite_rules() save_settings() savecontent() savedomdocument() sayhello() " +
        "scan() screen_icon() screen_layout() screen_meta() screen_options() script_concat_settings() " +
        "search_for_folder() search_technorati() search_theme_directories() secret_salt_warning() secureheader() seekto() " +
        "seems_utf() select() select_plural_form() selectbyvalue() selectcurrentresult() selectdrag() " +
        "selected() selectingmousemove() self_link() selx() sely() send() " +
        "send_cmd() send_confirmation_on_profile_email() send_headers() send_through_proxy() send_to_editor() sendandmail() " +
        "sendhello() sendmailsend() sendmsg() sendormail() separate_comments() serializeparameters() " +
        "serve() serve_request() serverhostname() servervar() services_json() services_json_error() " +
        "set() set_() set_author_class() set_authority() set_autodiscovery_cache_duration() set_autodiscovery_level() " +
        "set_blog() set_blog_id() set_cache_class() set_cache_duration() set_cache_location() set_cache_name_function() " +
        "set_caption_class() set_category_base() set_category_class() set_content_type_sniffer_class() set_copyright_class() set_credit_class() " +
        "set_current_entry() set_current_screen() set_current_user() set_custom_fields() set_editor() set_enclosure_class() " +
        "set_favicon_handler() set_feed_url() set_file() set_file_class() set_fragment() set_group() " +
        "set_header() set_headers() set_host() set_image_handler() set_input_encoding() set_item_class() " +
        "set_item_limit() set_javascript() set_locator_class() set_max_checked_feeds() set_output_encoding() set_parser_class() " +
        "set_path() set_permalink_structure() set_port() set_post_thumbnail_size() set_post_type() set_prefix() " +
        "set_query() set_query_var() set_rating_class() set_raw_data() set_restriction_class() set_result() " +
        "set_role() set_sanitize_class() set_scheme() set_screen_options() set_source_class() set_stupidly_fast() " +
        "set_submit_multipart() set_submit_normal() set_tag_base() set_theme_mod() set_timeout() set_transient() " +
        "set_upgrader() set_url_replacements() set_user() set_user_setting() set_useragent() set_userinfo() " +
        "setbool() setbrowserdisabled() setcallbacks() setcapabilities() setcol() setcookies() " +
        "setcurrent() setcursor() setendian() seterror() setfilename() setformat() " +
        "setlanguage() setlevel() setmaxfiles() setmaxsize() setmessagetype() setoptions() " +
        "setoptionsnew() setpath() setpressed() setselect() setselection() setselectraw() " +
        "setserver() setstr() settimeout() settings_errors() settings_fields() setumask() " +
        "setup_photo_actions() setup_postdata() setup_userdata() setusersetting() setwordwrap() setwrap() " +
        "shake() shortcode() shortcode_atts() shortcode_parse_atts() shortcode_unautop() should_decode() " +
        "show() show_blog_form() show_default_header_selector() show_errors() show_message() show_post_thumbnail_warning() " +
        "show_user_form() showcolor() showhandles() shutdown_action_hook() sign() signup_another_blog() " +
        "signup_blog() signup_nonce_check() signup_nonce_fields() signup_user() signuppageheaders() simplepie() " +
        "simplepie_author() simplepie_cache() simplepie_cache_file() simplepie_cache_mysql() simplepie_caption() simplepie_category() " +
        "simplepie_content_type_sniffer() simplepie_copyright() simplepie_credit() simplepie_decode_html_entities() simplepie_enclosure() simplepie_file() " +
        "simplepie_gzdecode() simplepie_http_parser() simplepie_iri() simplepie_item() simplepie_locator() simplepie_parse_date() " +
        "simplepie_rating() simplepie_restriction() simplepie_source() simplepie_xml_declaration_parser() single_cat_title() single_month_title() " +
        "single_post_title() single_tag_title() site() site_admin_notice() site_url() size() " +
        "size_format() skip() skip_whitespace() smtp() smtpclose() smtpconnect() " +
        "smtpsend() sort_items() sort_menu() sortby() space_seperated_tokens() spawn_cron() " +
        "spellchecker() split_ns() splitv() standalone_equals() standalone_name() standalone_value() " +
        "start_el() start_element() start_lvl() start_ns() start_post_rel_link() start_wp() " +
        "startdragmode() startelement() startselection() startswith() stats() status() " +
        "status_header() step() step_() step_() step_() stick_post() " +
        "sticky_class() stop() stop_the_insanity() stopobserving() str() stream_preview_image() " +
        "strip() strip_attributes() strip_clf() strip_comments() strip_htmltags() strip_shortcodes() " +
        "stripalpha() stripscripts() stripslashes_deep() striptags() strlen() styleoptions() " +
        "sub() subclass() submit() submithandler() submitlinks() submittext() " +
        "subscribe_aol() subscribe_bloglines() subscribe_eskobo() subscribe_feed() subscribe_feedfeeds() subscribe_feedster() " +
        "subscribe_google() subscribe_gritwire() subscribe_itunes() subscribe_msn() subscribe_netvibes() subscribe_newsburst() " +
        "subscribe_newsgator() subscribe_odeo() subscribe_outlook() subscribe_podcast() subscribe_podnova() subscribe_rojo() " +
        "subscribe_service() subscribe_url() subscribe_yahoo() succ() suggest() supports_collation() " +
        "suppress_errors() swfuploadloadfailed() swfuploadpreload() switch_theme() switch_to_blog() switchtype() " +
        "switchuploader() sync_category_tag_slugs() systype() tables() tag_close() tag_description() " +
        "tag_escape() tag_exists() tag_open() tag_rows() take_action() taxonomy_exists() " +
        "tb_click() tb_close() tb_detectmacxff() tb_getpagesize() tb_init() tb_parsequery() " +
        "tb_position() tb_remove() tb_show() tb_showiframe() tellscaled() tellselect() " +
        "term_description() term_exists() test() text_diff() text_diff_op_add() text_diff_op_change() " +
        "text_diff_op_copy() text_diff_op_delete() text_diff_renderer() text_diff_renderer_table() text_mappeddiff() text_or_binary() " +
        "textline() the_attachment_link() the_attachment_links() the_attachments_url() the_author() the_author_aim() " +
        "the_author_description() the_author_email() the_author_firstname() the_author_icq() the_author_id() the_author_lastname() " +
        "the_author_link() the_author_login() the_author_meta() the_author_msn() the_author_nickname() the_author_posts() " +
        "the_author_posts_link() the_author_url() the_author_yim() the_categories_url() the_category() the_category_head() " +
        "the_category_id() the_category_rss() the_comment() the_content() the_content_feed() the_content_rss() " +
        "the_date() the_date_xml() the_editor() the_entries_url() the_entry_url() the_excerpt() " +
        "the_excerpt_rss() the_feed_link() the_generator() the_guid() the_id() the_media_upload_tabs() " +
        "the_media_url() the_meta() the_modified_author() the_modified_date() the_modified_time() the_permalink() " +
        "the_permalink_rss() the_post() the_post_password() the_post_thumbnail() the_search_query() the_shortlink() " +
        "the_tags() the_taxonomies() the_terms() the_time() the_title() the_title_attribute() " +
        "the_title_rss() the_weekday() the_weekday_date() the_widget() theme_info() theme_installer_skin() " +
        "theme_update_available() theme_upgrader_skin() themes_api() throwerror() time_hms() timer_start() " +
        "timer_stop() times() tinymce_include() toarray() toback() tocolorpart() " +
        "tofront() toggle_text() togglewordwrap() tohtml() tojson() toobject() " +
        "toospath() top() topaddedstring() toquerypair() toqueryparams() toquerystring() " +
        "touch_time() toxml() trackback() trackback_rdf() trackback_response() trackback_url() " +
        "trackback_url_list() trackmove() trackup() trailingslashit() translate() translate_entry() " +
        "translate_level_to_cap() translate_level_to_role() translate_plural() translate_smiley() translate_user_role() translate_with_context() " +
        "translate_with_gettext_context() translation_entry() trim_quotes() trimnewlines() trimsize() truncate() " +
        "turn() twentyten_admin_header_style() twentyten_auto_excerpt_more() twentyten_comment() twentyten_continue_reading_link() twentyten_custom_excerpt_more() " +
        "twentyten_excerpt_length() twentyten_page_menu_args() twentyten_posted_in() twentyten_posted_on() twentyten_remove_gallery_css() twentyten_remove_recent_comments_style() " +
        "twentyten_setup() twentyten_widgets_init() type_url_form_audio() type_url_form_file() type_url_form_image() type_url_form_video() " +
        "uidl() uncomment_rfc() uncompress() unconsume() underscore() undismiss_core_update() " +
        "unescapehtml() unfilterjson() uninstall_plugin() uniq() unknown() unload_textdomain() " +
        "unloadhandler() unpack_package() unpoify() unregister() unregister_default_headers() unregister_handler() " +
        "unregister_nav_menu() unregister_setting() unregister_sidebar() unregister_sidebar_widget() unregister_widget() unregister_widget_control() " +
        "unscale() unset() unset_children() unstick_post() untrailingslashit() unzip_file() " +
        "update() update_archived() update_attached_file() update_blog_details() update_blog_option() update_blog_public() " +
        "update_blog_status() update_callback() update_category_cache() update_comment_cache() update_comment_meta() update_core() " +
        "update_gallery_tab() update_home_siteurl() update_meta() update_meta_cache() update_metadata() update_nag() " +
        "update_object_term_cache() update_option() update_option_new_admin_email() update_page_cache() update_post_cache() update_post_caches() " +
        "update_post_meta() update_postmeta_cache() update_posts_count() update_recently_edited() update_right_now_message() update_term_cache() " +
        "update_timer() update_user_caches() update_user_level_from_caps() update_user_meta() update_user_option() update_user_status() " +
        "update_usermeta() updatecolor() updatecount() updatecurrentdepth() updatelight() updatemediaform() " +
        "updatemenumaxdepth() updatepreview() updatesharedvars() updatetext() updatevisibility() updatevisible() " +
        "upgrade() upgrade_() upgrade_() upgrade_() upgrade_() upgrade_() " +
        "upgrade_() upgrade_() upgrade__old_tables() upgrade__options_table() upgrade_() upgrade_() " +
        "upgrade_() upgrade_() upgrade_() upgrade_() upgrade_() upgrade_all() " +
        "upgrade_network() upgrade_old_slugs() upgrade_strings() upit() upload_is_file_too_big() upload_is_user_over_quota() " +
        "upload_size_limit_filter() upload_space_setting() uploadcomplete() uploaderror() uploadprogress() uploadstart() " +
        "uploadsuccess() url_shorten() url_to_postid() urlencode_deep() use_authentication() use_codepress() " +
        "use_ssl_preference() user() user_can_access_admin_page() user_can_create_draft() user_can_create_post() user_can_delete_post() " +
        "user_can_delete_post_comments() user_can_edit_post() user_can_edit_post_comments() user_can_edit_post_date() user_can_edit_user() user_can_richedit() " +
        "user_can_set_post_date() user_pass_ok() user_row() user_trailingslashit() username() username_exists() " +
        "users_can_register_signup_filter() using_index_permalinks() using_mod_rewrite_permalinks() using_permalinks() utfutf() utfutf() " +
        "utf_bad_replace() utf_uri_encode() utfcharboundary() valid_unicode() validate_active_plugins() validate_another_blog_signup() " +
        "validate_blog_form() validate_blog_signup() validate_current_theme() validate_email() validate_file_to_edit() validate_plugin() " +
        "validate_user_form() validate_user_signup() validate_username() value() value_char() values() " +
        "verify() version_equals() version_name() version_value() viewx() viewy() " +
        "wa_posts_where_include_drafts_filter() walk() walk_category_dropdown_tree() walk_category_tree() walk_nav_menu_tree() walk_page_dropdown_tree() " +
        "walk_page_tree() warn() watchkeys() weblog_ping() welcome_user_msg_filter() widget() " +
        "widget_akismet() widget_akismet_control() widget_akismet_register() widget_akismet_style() win_is_writable() windows__to_utf() " +
        "without() wlwmanifest_link() wordpressmu_wp_mail_from() wp() wp_add_dashboard_widget() wp_add_post_tags() " +
        "wp_admin_css() wp_admin_css_color() wp_admin_css_uri() wp_ajax_response() wp_allow_comment() wp_attachment_is_image() " +
        "wp_attempt_focus() wp_authenticate() wp_authenticate_cookie() wp_authenticate_username_password() wp_blacklist_check() wp_cache_add() " +
        "wp_cache_add_global_groups() wp_cache_add_non_persistent_groups() wp_cache_close() wp_cache_delete() wp_cache_flush() wp_cache_get() " +
        "wp_cache_init() wp_cache_replace() wp_cache_reset() wp_cache_set() wp_category_checklist() wp_check_filetype() " +
        "wp_check_filetype_and_ext() wp_check_for_changed_slugs() wp_check_invalid_utf() wp_check_mysql_version() wp_check_password() wp_check_php_mysql_versions() " +
        "wp_check_post_lock() wp_clear_auth_cookie() wp_clear_scheduled_hook() wp_clearcookie() wp_clone() wp_comment_form_unfiltered_html_nonce() " +
        "wp_comment_reply() wp_comment_trashnotice() wp_constrain_dimensions() wp_content_dir() wp_convert_bytes_to_hr() wp_convert_hr_to_bytes() " +
        "wp_convert_widget_settings() wp_cookie_constants() wp_count_attachments() wp_count_comments() wp_count_posts() wp_count_terms() " +
        "wp_create_categories() wp_create_category() wp_create_nav_menu() wp_create_nonce() wp_create_post_autosave() wp_create_tag() " +
        "wp_create_term() wp_create_thumbnail() wp_create_user() wp_cron() wp_crop_image() wp_dashboard() " +
        "wp_dashboard_cached_rss_widget() wp_dashboard_empty() wp_dashboard_incoming_links() wp_dashboard_incoming_links_control() wp_dashboard_incoming_links_output() wp_dashboard_plugins() " +
        "wp_dashboard_plugins_output() wp_dashboard_primary() wp_dashboard_primary_control() wp_dashboard_quick_press() wp_dashboard_quick_press_output() wp_dashboard_recent_comments() " +
        "wp_dashboard_recent_comments_control() wp_dashboard_recent_drafts() wp_dashboard_right_now() wp_dashboard_rss_control() wp_dashboard_rss_output() wp_dashboard_secondary() " +
        "wp_dashboard_secondary_control() wp_dashboard_secondary_output() wp_dashboard_setup() wp_dashboard_trigger_widget_control() wp_debug_mode() wp_default_editor() " +
        "wp_default_scripts() wp_default_styles() wp_defer_comment_counting() wp_defer_term_counting() wp_delete_attachment() wp_delete_category() " +
        "wp_delete_comment() wp_delete_link() wp_delete_nav_menu() wp_delete_object_term_relationships() wp_delete_post() wp_delete_post_revision() " +
        "wp_delete_term() wp_delete_user() wp_deletecategory() wp_deletecomment() wp_deletepage() wp_dependencies() " +
        "wp_deregister_script() wp_deregister_style() wp_die() wp_doc_link_parse() wp_dropdown_categories() wp_dropdown_cats() " +
        "wp_dropdown_pages() wp_dropdown_roles() wp_dropdown_users() wp_edit_attachments_query() wp_edit_posts_query() wp_editcomment() " +
        "wp_editpage() wp_embed() wp_embed_defaults() wp_embed_handler_googlevideo() wp_embed_register_handler() wp_embed_unregister_handler() " +
        "wp_enqueue_script() wp_enqueue_scripts() wp_enqueue_style() wp_error() wp_exif_datets() wp_exif_fracdec() " +
        "wp_expand_dimensions() wp_explain_nonce() wp_exttype() wp_favicon_request() wp_feed_cache() wp_feed_cache_transient() " +
        "wp_filesystem() wp_filesystem_direct() wp_filesystem_ftpext() wp_filesystem_ftpsockets() wp_filesystem_ssh() wp_filter_comment() " +
        "wp_filter_kses() wp_filter_nohtml_kses() wp_filter_post_kses() wp_fix_server_vars() wp_footer() wp_functionality_constants() " +
        "wp_generate_attachment_metadata() wp_generate_auth_cookie() wp_generate_password() wp_generate_tag_cloud() wp_generator() wp_get_active_and_valid_plugins() " +
        "wp_get_archives() wp_get_associated_nav_menu_items() wp_get_attachment_image() wp_get_attachment_image_src() wp_get_attachment_link() wp_get_attachment_metadata() " +
        "wp_get_attachment_thumb_file() wp_get_attachment_thumb_url() wp_get_attachment_url() wp_get_comment_status() wp_get_cookie_login() wp_get_current_commenter() " +
        "wp_get_current_user() wp_get_http() wp_get_http_headers() wp_get_link_cats() wp_get_links() wp_get_linksbyname() " +
        "wp_get_mu_plugins() wp_get_nav_menu_items() wp_get_nav_menu_object() wp_get_nav_menu_to_edit() wp_get_nav_menus() wp_get_nocache_headers() " +
        "wp_get_object_terms() wp_get_original_referer() wp_get_post_autosave() wp_get_post_categories() wp_get_post_cats() wp_get_post_revision() " +
        "wp_get_post_revisions() wp_get_post_tags() wp_get_post_terms() wp_get_recent_posts() wp_get_referer() wp_get_schedule() " +
        "wp_get_schedules() wp_get_shortlink() wp_get_sidebars_widgets() wp_get_single_post() wp_get_widget_defaults() wp_getauthors() " +
        "wp_getcomment() wp_getcommentcount() wp_getcomments() wp_getcommentstatuslist() wp_getoptions() wp_getpage() " +
        "wp_getpagelist() wp_getpages() wp_getpagestatuslist() wp_getpagetemplates() wp_getpoststatuslist() wp_gettags() " +
        "wp_getusersblogs() wp_guess_url() wp_handle_sideload() wp_handle_upload() wp_handle_upload_error() wp_hash() " +
        "wp_hash_password() wp_head() wp_html_excerpt() wp_htmledit_pre() wp_http() wp_http_cookie() " +
        "wp_iframe() wp_image_editor() wp_imagecreatetruecolor() wp_import_cleanup() wp_import_handle_upload() wp_import_upload_form() " +
        "wp_importer() wp_initial_constants() wp_initial_nav_menu_meta_boxes() wp_insert_attachment() wp_insert_category() wp_insert_comment() " +
        "wp_insert_link() wp_insert_post() wp_insert_term() wp_insert_user() wp_install() wp_install_defaults() " +
        "wp_is_post_autosave() wp_is_post_revision() wp_iso_descrambler() wp_just_in_time_script_localization() wp_kses() wp_kses_array_lc() " +
        "wp_kses_attr() wp_kses_bad_protocol() wp_kses_bad_protocol_once() wp_kses_bad_protocol_once() wp_kses_check_attr_val() wp_kses_data() " +
        "wp_kses_decode_entities() wp_kses_hair() wp_kses_hook() wp_kses_html_error() wp_kses_js_entities() wp_kses_named_entities() " +
        "wp_kses_no_null() wp_kses_normalize_entities() wp_kses_normalize_entities() wp_kses_normalize_entities() wp_kses_post() wp_kses_split() " +
        "wp_kses_split() wp_kses_stripslashes() wp_kses_version() wp_link_category_checklist() wp_link_pages() wp_list_authors() " +
        "wp_list_bookmarks() wp_list_categories() wp_list_cats() wp_list_comments() wp_list_pages() wp_list_post_revisions() " +
        "wp_list_widget_controls() wp_list_widget_controls_dynamic_sidebar() wp_list_widgets() wp_load_alloptions() wp_load_core_site_options() wp_load_image() " +
        "wp_locale() wp_localize_script() wp_login() wp_login_form() wp_login_url() wp_loginout() " +
        "wp_logout() wp_logout_url() wp_lostpassword_url() wp_magic_quotes() wp_mail() wp_maintenance() " +
        "wp_make_link_relative() wp_manage_media_columns() wp_manage_pages_columns() wp_manage_posts_columns() wp_match_mime_types() wp_matchesmapregex() " +
        "wp_max_upload_size() wp_menu_unfold() wp_meta() wp_mime_type_icon() wp_mkdir_p() wp_nav_menu() " +
        "wp_nav_menu_item_link_meta_box() wp_nav_menu_item_post_type_meta_box() wp_nav_menu_item_taxonomy_meta_box() wp_nav_menu_locations_meta_box() wp_nav_menu_manage_columns() wp_nav_menu_max_depth() " +
        "wp_nav_menu_post_type_meta_boxes() wp_nav_menu_setup() wp_nav_menu_taxonomy_meta_boxes() wp_nav_menu_widget() wp_new_blog_notification() wp_new_comment() " +
        "wp_new_user_notification() wp_newcategory() wp_newcomment() wp_newpage() wp_next_scheduled() wp_nonce_ays() " +
        "wp_nonce_field() wp_nonce_tick() wp_nonce_url() wp_not_installed() wp_notify_moderator() wp_notify_postauthor() " +
        "wp_object_cache() wp_oembed() wp_oembed_add_provider() wp_oembed_get() wp_old_slug_redirect() wp_original_referer_field() " +
        "wp_page_menu() wp_parse_auth_cookie() wp_parse_str() wp_password_change_notification() wp_plugin_directory_constants() wp_plugin_update_row() " +
        "wp_plugin_update_rows() wp_plugins_dir() wp_popular_terms_checklist() wp_post_mime_type_where() wp_post_revision_title() wp_pre_kses_less_than() " +
        "wp_pre_kses_less_than_callback() wp_print_footer_scripts() wp_print_head_scripts() wp_print_scripts() wp_print_styles() wp_protect_special_option() " +
        "wp_prototype_before_jquery() wp_publish_post() wp_query() wp_rand() wp_read_image_metadata() wp_redirect() " +
        "wp_referer_field() wp_register() wp_register_script() wp_register_sidebar_widget() wp_register_style() wp_register_widget_control() " +
        "wp_rel_nofollow() wp_rel_nofollow_callback() wp_remote_fopen() wp_remote_get() wp_remote_head() wp_remote_post() " +
        "wp_remote_request() wp_remote_retrieve_body() wp_remote_retrieve_header() wp_remote_retrieve_headers() wp_remote_retrieve_response_code() wp_remote_retrieve_response_message() " +
        "wp_reschedule_event() wp_reset_postdata() wp_reset_query() wp_reset_vars() wp_restore_image() wp_restore_post_revision() " +
        "wp_revoke_user() wp_rewrite() wp_rewrite_rules() wp_richedit_pre() wp_role() wp_roles() " +
        "wp_rss() wp_safe_redirect() wp_salt() wp_sanitize_redirect() wp_save_image() wp_save_image_file() " +
        "wp_save_nav_menu_items() wp_save_post_revision() wp_schedule_event() wp_schedule_single_event() wp_script_is() wp_set_all_user_settings() " +
        "wp_set_auth_cookie() wp_set_comment_status() wp_set_current_user() wp_set_internal_encoding() wp_set_lang_dir() wp_set_link_cats() " +
        "wp_set_object_terms() wp_set_password() wp_set_post_categories() wp_set_post_cats() wp_set_post_lock() wp_set_post_tags() " +
        "wp_set_post_terms() wp_set_sidebars_widgets() wp_set_wpdb_vars() wp_setcookie() wp_setoptions() wp_setup_nav_menu_item() " +
        "wp_shake_js() wp_shortlink_header() wp_shortlink_wp_head() wp_shrink_dimensions() wp_sidebar_description() wp_signon() " +
        "wp_simplepie_file() wp_spam_comment() wp_specialchars() wp_specialchars_decode() wp_sprintf() wp_sprintf_l() " +
        "wp_ssl_constants() wp_start_object_cache() wp_stream_image() wp_strip_all_tags() wp_style_is() wp_style_loader_src() " +
        "wp_suggestcategories() wp_tag_cloud() wp_templating_constants() wp_tempnam() wp_terms_checklist() wp_text_diff() " +
        "wp_themes_dir() wp_throttle_comment_flood() wp_tiny_mce() wp_title() wp_title_rss() wp_transition_comment_status() " +
        "wp_transition_post_status() wp_trash_comment() wp_trash_post() wp_trash_post_comments() wp_trim_excerpt() wp_unique_filename() " +
        "wp_unique_post_slug() wp_unique_term_slug() wp_unregister_globals() wp_unregister_sidebar_widget() wp_unregister_widget_control() wp_unschedule_event() " +
        "wp_unspam_comment() wp_untrash_comment() wp_untrash_post() wp_untrash_post_comments() wp_update_attachment_metadata() wp_update_category() " +
        "wp_update_comment() wp_update_comment_count() wp_update_comment_count_now() wp_update_core() wp_update_link() wp_update_nav_menu_item() " +
        "wp_update_nav_menu_object() wp_update_plugin() wp_update_plugins() wp_update_post() wp_update_term() wp_update_term_count() " +
        "wp_update_term_count_now() wp_update_theme() wp_update_themes() wp_update_user() wp_upgrade() wp_upgrader() " +
        "wp_upgrader_skin() wp_upload_bits() wp_upload_dir() wp_user() wp_user_search() wp_user_settings() " +
        "wp_validate_auth_cookie() wp_validate_redirect() wp_verify_nonce() wp_version_check() wp_widget() wp_widget_archives() " +
        "wp_widget_calendar() wp_widget_categories() wp_widget_control() wp_widget_description() wp_widget_factory() wp_widget_links() " +
        "wp_widget_meta() wp_widget_pages() wp_widget_recent_comments() wp_widget_recent_posts() wp_widget_rss() wp_widget_rss_form() " +
        "wp_widget_rss_output() wp_widget_rss_process() wp_widget_search() wp_widget_tag_cloud() wp_widget_text() wp_widgets_init() " +
        "wp_write_post() wp_xmlrpc_server() wpautop() wpdb() wpfileerror() wpmu_activate_signup() " +
        "wpmu_activate_stylesheet() wpmu_admin_do_redirect() wpmu_admin_redirect_add_updated_param() wpmu_checkavailablespace() wpmu_create_blog() wpmu_create_user() " +
        "wpmu_current_site() wpmu_delete_blog() wpmu_delete_user() wpmu_get_blog_allowedthemes() wpmu_log_new_registrations() wpmu_menu() " +
        "wpmu_signup_blog() wpmu_signup_blog_notification() wpmu_signup_stylesheet() wpmu_signup_user() wpmu_signup_user_notification() wpmu_update_blogs_date() " +
        "wpmu_validate_blog_signup() wpmu_validate_user_signup() wpmu_welcome_notification() wpmu_welcome_user_notification() wpqueueerror() wpsetasthumbnail() " +
        "wptexturize() wrap() wraptext() write_post() writeembed() writeflash() " +
        "writequicktime() writerealmedia() writeshockwave() writewindowsmedia() wxr_cat_name() wxr_category_description() " +
        "wxr_cdata() wxr_missing_parents() wxr_post_taxonomy() wxr_site_url() wxr_tag_description() wxr_tag_name() " +
        "wxr_term_description() wxr_term_name() xfn_check() xml_encoding() xml_escape() xmlrpc_getpostcategory() " +
        "xmlrpc_getposttitle() xmlrpc_removepostdata() zeroise() zip() " +
        "PHPfunctionsusedonthesite abs() addcslashes() addslashes() array_change_key_case() " +
        "array_diff() array_fill() array_filter() array_flip() array_intersect() array_key_exists() " +
        "array_keys() array_map() array_merge() array_merge_recursive() array_pop() array_push() " +
        "array_rand() array_reduce() array_reverse() array_search() array_shift() array_slice() " +
        "array_splice() array_sum() array_unique() array_unshift() array_values() array_walk() " +
        "arsort() asort() assert() atan() base_decode() base_encode() " +
        "base_convert() basename() binhex() call_user_func() call_user_func_array() ceil() " +
        "chdir() chgrp() chmod() chown() chr() chunk_split() " +
        "class_exists() clearstatcache() closedir() compact() constant() copy() " +
        "cos() count() count_chars() create_function() crypt() curl_close() " +
        "curl_errno() curl_error() curl_exec() curl_getinfo() curl_init() curl_setopt() " +
        "curl_version() current() date() debug_backtrace() dechex() decoct() " +
        "define() defined() dirname() dl() each() end() " +
        "ereg() ereg_replace() eregi() error_log() error_reporting() escapeshellarg() " +
        "escapeshellcmd() exec() exif_read_data() exp() explode() extension_loaded() " +
        "extract() fclose() feof() fflush() fgets() file() " +
        "file_exists() file_get_contents() file_put_contents() fileatime() filegroup() filemtime() " +
        "fileowner() fileperms() filesize() floatval() floor() flush() " +
        "fread() fseek() fsockopen() ftell() ftp_chdir() ftp_chmod() " +
        "ftp_close() ftp_connect() ftp_delete() ftp_fget() ftp_fput() ftp_get_option() " +
        "ftp_login() ftp_mdtm() ftp_mkdir() ftp_nlist() ftp_pasv() ftp_pwd() " +
        "ftp_rawlist() ftp_rename() ftp_rmdir() ftp_set_option() ftp_site() ftp_size() " +
        "ftp_ssl_connect() ftp_systype() func_get_arg() func_get_args() func_num_args() function_exists() " +
        "fwrite() get_class() get_class_methods() get_defined_constants() get_html_translation_table() get_magic_quotes_gpc() " +
        "get_magic_quotes_runtime() get_object_vars() get_parent_class() getcwd() getdate() getenv() " +
        "gethostbyaddr() gethostbyname() gethostbynamel() getimagesize() getmyuid() gettext() " +
        "gettype() glob() gmdate() gmmktime() gzdeflate() gzencode() " +
        "gzinflate() gzopen() gzuncompress() header() headers_sent() hexdec() " +
        "html_entity_decode() htmlentities() htmlspecialchars() http_build_query() iconv_mime_decode() ignore_user_abort() " +
        "imagealphablending() imageantialias() imagecolorstotal() imagecopy() imagecopyresampled() imagecreatefromgif() " +
        "imagecreatefromjpeg() imagecreatefrompng() imagecreatefromstring() imagecreatetruecolor() imagedestroy() imagegif() " +
        "imageistruecolor() imagejpeg() imagepng() imagerotate() imagesavealpha() imagesx() " +
        "imagesy() imagetruecolortopalette() imagetypes() implode() in_array() ini_get() " +
        "ini_set() intval() iplong() iptcparse() is_a() is_array() " +
        "is_bool() is_callable() is_dir() is_executable() is_file() is_float() " +
        "is_link() is_long() is_null() is_numeric() is_object() is_readable() " +
        "is_resource() is_scalar() is_string() is_subclass_of() is_uploaded_file() is_writable() " +
        "key() ksort() link() localtime() log() log() " +
        "longip() ltrim() mail() max() mb_convert_encoding() mb_detect_encoding() " +
        "mb_internal_encoding() mb_strlen() mb_strtolower() mb_substr() method_exists() microtime() " +
        "mime_content_type() min() mkdir() mktime() move_uploaded_file() mt_rand() " +
        "mysql_affected_rows() mysql_connect() mysql_error() mysql_fetch_field() mysql_fetch_object() mysql_fetch_row() " +
        "mysql_free_result() mysql_get_server_info() mysql_insert_id() mysql_num_fields() mysql_num_rows() mysql_query() " +
        "mysql_real_escape_string() mysql_select_db() mysql_unbuffered_query() name() natcasesort() next() " +
        "nlbr() number_format() ob_end_clean() ob_end_flush() ob_get_clean() ob_get_contents() " +
        "ob_get_flush() ob_get_length() ob_start() opendir() openssl_error_string() openssl_pkcs_sign() " +
        "ord() pack() parse_str() parse_url() pathinfo() pclose() " +
        "php_sapi_name() php_uname() phpversion() popen() posix_getgrgid() posix_getpwuid() " +
        "pow() preg_match() preg_match_all() preg_quote() preg_replace() preg_replace_callback() " +
        "preg_split() prev() print_r() pspell_check() pspell_config_create() pspell_new() " +
        "pspell_new_config() pspell_suggest() quoted_printable_decode() rand() range() rawurldecode() " +
        "rawurlencode() readfile() realpath() register_shutdown_function() rename() reset() " +
        "restore_error_handler() rewind() rmdir() round() rtrim() serialize() " +
        "set_error_handler() set_magic_quotes_runtime() set_time_limit() setcookie() settype() sha() " +
        "shell_exec() shuffle() simplexml_load_string() sin() sleep() socket_accept() " +
        "socket_bind() socket_close() socket_connect() socket_create() socket_getsockname() socket_last_error() " +
        "socket_listen() socket_read() socket_set_option() socket_strerror() socket_write() sort() " +
        "split() sqrt() srand() sscanf() str_pad() str_repeat() " +
        "str_replace() str_split() strcasecmp() strcmp() strcspn() stream_context_create() " +
        "stream_get_contents() stream_get_meta_data() stream_set_blocking() stream_set_timeout() strftime() strip_tags() " +
        "stripcslashes() stripos() stripslashes() stristr() strnatcasecmp() strncmp() " +
        "strpos() strrchr() strrev() strrpos() strspn() strstr() " +
        "strtolower() strtotime() strtoupper() strtr() strval() substr() " +
        "substr_count() substr_replace() tempnam() time() token_get_all() touch() " +
        "trigger_error() trim() uasort() ucfirst() ucwords() uksort() " +
        "umask() uniqid() unlink() unpack() unserialize() urldecode() " +
        "urlencode() usort() utf_encode() var_export() version_compare() vsprintf() " +
        "wordwrap() xml_error_string() xml_get_current_byte_index() xml_get_current_column_number() xml_get_current_line_number() xml_get_error_code() " +
        "xml_parse() xml_parse_into_struct() xml_parser_create() xml_parser_create_ns() xml_parser_free() xml_parser_set_option() " +
        "xml_set_character_data_handler() xml_set_default_handler() xml_set_element_handler() xml_set_end_namespace_decl_handler() xml_set_object() xml_set_start_namespace_decl_handler() " +
        "zend_version() ").split(" ");
    var phpKeywords = ("and or xor __FILE__ exception" +
        "__LINE__ array() as break case" +
        "class const continue declare default" +
        "die do echo else elseif" +
        "empty() enddeclare endfor endforeach endif" +
        "endswitch endwhile eval() exit() extends" +
        "for foreach function global if" +
        "include() include_once() isset() list() new" +
        "print() require() require_once() return() static" +
        "switch unset() use var while" +
        "__FUNCTION__ __CLASS__ __METHOD__ final php_user_filter" +
        "interface implements instanceof public private" +
        "protected abstract clone try catch" +
        "throw this final __NAMESPACE__ namespace __DIR__").split(" ");
    
    function getCompletions(token, context) {
        var found = [], start = token.string;
        function maybeAdd(str) {
            if (str.indexOf(start) == 0) found.push(str);
        }
        function gatherCompletions(obj) {
            if (typeof obj == "string") forEach(stringProps, maybeAdd);
            else if (obj instanceof Array) forEach(arrayProps, maybeAdd);
            else if (obj instanceof Function) forEach(funcProps, maybeAdd);
            for (var name in obj) maybeAdd(name);
        }

        if (context) {
            // If this is a property, see if it belongs to some object we can
            // find in the current environment.
            var obj = context.pop(), base;
            if (obj.className == "cm-variable")
                base = window[obj.string];
            else if (obj.className == "cm-string")
                base = "";
            else if (obj.className == "cm-atom")
                base = 1;
            while (base != null && context.length)
                base = base[context.pop().string];
            if (base != null) gatherCompletions(base);
        }
        else {
            // If not, just look in the window object and any local scope
            // (reading into JS mode internals to get at the local variables)
            for (var v = token.state.localVars; v; v = v.next) maybeAdd(v.name);
            forEach(funcProps, maybeAdd);
            forEach(phpKeywords, maybeAdd);
        }
        return found;
    }

    
})();