"use strict";

function Good(id, title, price ) {
    Container.call(this, id);
    this.title = title;
    this.price = price;
}

Good.prototype = Object.create(Container.prototype);
Good.prototype.constructor = Good;

Good.prototype.render = function(jsSelector) {
    var selector = document.getElementById(jsSelector);

    var goodContainer = document.createElement('div');
    goodContainer.className = 'good';

    var goodTitle = document.createElement('h3');
    goodTitle.className = 'good-title';
    goodTitle.textContent = this.title;

    var goodPrice = document.createElement('p');
    goodPrice.textContent = 'Цена: ';

    var goodPriceSpan = document.createElement('span');
    goodPriceSpan.className = 'good-price';
    goodPriceSpan.textContent = this.price + ' ₽';

    var goodBtn = document.createElement('button');
    goodBtn.className = 'good-btn';
    goodBtn.setAttribute('data-id', this.id);
    goodBtn.textContent = 'Купить';

    goodContainer.appendChild(goodTitle);
    goodContainer.appendChild(goodPrice);
    goodPrice.appendChild(goodPriceSpan);
    goodContainer.appendChild(goodBtn);
    selector.appendChild(goodContainer);
};