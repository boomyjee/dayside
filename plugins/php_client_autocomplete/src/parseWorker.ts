'use strict';

import { TreeBuilder } from "./hvy/treeBuilder";
var treeBuilder = new TreeBuilder();

module.exports = function (self) {
    self.addEventListener('message',function (e){
        var fileData = e.data;
        treeBuilder.Parse(fileData.text, fileData.path).then(result => {
            fileData.node = result.tree;
            self.postMessage(fileData);
        });
    });
}


