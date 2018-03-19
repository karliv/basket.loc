"use strict";

function Container(id) {
    this.id= id;
    this.htmlCode = '';
}

Container.prototype.render = function() {
    return this.htmlCode;
};

//Container.prototype.remove = function () {
//
//};