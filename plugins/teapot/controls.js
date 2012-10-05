ui = teacss.ui;
$ = teacss.jQuery;
require("./paddingControl.js");

dayside.plugins.teapot.ui = {
    css_color: teapot.property({
        key: 'color',
        control: teacss.ui.colorPicker,
        options: { width: 30, height: 12, margin: 0 },
    }),
    
    var_color: teapot.variable({
        key: 'color',
        control: teacss.ui.colorPicker,
        options: { width: 30, height: 12, margin: 0 }
    }),

    var_padding: teapot.variable({
        key: 'padding',
        control: teacss.ui.paddingControl,
        options: { max: 10, label: "padding", margin: 0 }
    }),
    
    fieldset: teapot.fieldset()
};
