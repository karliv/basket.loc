"use strict";

function Basket(idBasket) {
    Container.call(this, idBasket);

    this.countGoods = 0;
    this.amount = 0;
    this.basketItems = [];

    this.loadBasketItems();
}

Basket.prototype = Object.create(Container.prototype);
Basket.prototype.constructor = Basket;

Basket.prototype.render = function(root) {
    var basketRoot = document.getElementById(root);

    // Отрисовываем div с заголовком и таблицей в нутри
    var basketDiv = document.createElement('div');
    basketDiv.className = 'basket';

    var basketTitle = document.createElement('h3');
    basketTitle.className = 'basket__title';
    basketTitle.textContent = 'Корзина';

    basketDiv.appendChild(basketTitle);

    // Отрисовываем таблицу
    var basketTable = document.createElement('table');
    basketTable.innerHTML = '<table><thead><tr><td class="item-title">Наименование</td>' +
        '<td class="item-price">Цена</td><td class="item-count">Кол-во</td></tr></thead>' +
        '<tbody id="basket_items"></tbody></table>';

    basketDiv.appendChild(basketTable);
    basketRoot.appendChild(basketDiv);
};

Basket.prototype.loadBasketItems = function() {
    var appendClassItem = document.getElementsByClassName('basket');

    var SBI = showBasketItems.bind(this);

    var xhr = new XMLHttpRequest();
    xhr.open('GET', './json/basket.json', true); //Асинхронный запрос

    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) {
            return;
        }

        if(xhr.status === 200){
            SBI(JSON.parse(xhr.responseText));
        } else {
            console.log('Error', xhr.status, xhr.statusText);
        }
    };

    xhr.send();

    function showBasketItems(items) {
        var basketData = document.createElement('div');
        basketData.id = 'basket-data';

        this.countGoods = items.basket.length;
        this.amount = items.amount;

        var allProducts = document.createElement('p');
        allProducts.innerText = 'Всего товаров: ' + this.countGoods;

        var totalAmount = document.createElement('p');
        totalAmount.innerText = 'Общая сумма: ' + this.amount;

        basketData.appendChild(allProducts);
        basketData.appendChild(totalAmount);
        appendClassItem[0].appendChild(basketData);

        for (var itemKey in items.basket) {
            if (items.basket.hasOwnProperty(itemKey)) {
                this.basketItems.push(items.basket[itemKey]);
            }
        }

        //Отабразить уже имеющиеся предметы в корзине
        this.release();
    }
};

Basket.prototype.release = function() {
    var basketItemsDiv = document.getElementById('basket_items');
    basketItemsDiv.innerHTML = '';

    for (var i in this.basketItems) {
        if (this.basketItems.hasOwnProperty(i)) {
            var itemList = document.createElement('tr');
            itemList.setAttribute('data-id-item', this.basketItems[i].id_product);

            itemList.innerHTML = '<td class="item-title">' + this.basketItems[i].title + '</td>' +
                '<td class="item-price">' + this.basketItems[i].price +'</td>' +
                '<td class="item-count"><span class="minus"> - </span><span class="count">1</span>' +
                    '<span class="plus"> + </span></td>' +
                '<td><button class="basket-btn">x</button></td>';

            basketItemsDiv.appendChild(itemList);
        }
    }
};

Basket.prototype.add = function (idProduct, price, title) {
    var basketItem = {
        "id_product": idProduct,
        "price": price,
        "title": title
    };

    this.countGoods++;
    this.amount += price;
    this.basketItems.push(basketItem);
    this.addItem(idProduct, price, title);
    this.refresh(); //Перерисовываем корзину
};

Basket.prototype.addItem = function(idProduct, price, title) {
    var basketItemsDiv = document.getElementById('basket_items');

    var flag = false;

    for (var i = 0; i < basketItemsDiv.childNodes.length; i++) {

        var getID = basketItemsDiv.childNodes[i].getAttribute('data-id-item');

        if( getID == idProduct){
            flag = true;
            break;
        }
    }

    if (flag === true){
        var findItemById = basketItemsDiv.querySelector('tr[data-id-item="' + idProduct + '"]');
        var parseIntCount = findItemById.querySelector('td.item-count .count');

        parseInt(parseIntCount.textContent++);
    }

    if (flag === false) {
        var itemList = document.createElement('tr');
        itemList.setAttribute('data-id-item', idProduct);

        itemList.innerHTML = '<td class="item-title">' + title + '</td>' +
            '<td class="item-price">' + price +'</td>' +
            '<td class="item-count"><span class="minus"> - </span><span class="count">1</span>' +
                '<span class="plus"> + </span></td>' +
            '<td><button class="basket-btn">x</button></td>';

        basketItemsDiv.appendChild(itemList);
    }

    console.log(basketItemsDiv.childNodes);
};

Basket.prototype.countPlus = function(idProduct, quantity, price, title){
    var basketItem = {
        "id_product": idProduct,
        "price": price,
        "title": title
    };

    var findItemById = $('#basket_items').find('[data-id-item="' + idProduct + '"]');

    $(findItemById).find('td.item-count .count').text(++quantity);

    this.countGoods++;
    this.amount += price;

    this.basketItems.push(basketItem);
    console.log(this.basketItems);
    this.refresh(); //Перерисовываем корзину
};

Basket.prototype.countMinus = function(idProduct, quantity, price){

    var findItemById = $('#basket_items').find('[data-id-item="' + idProduct + '"]');

    if(quantity == 1){
        $(findItemById).remove();
    }
    if(quantity > 1){
        $(findItemById).find('td.item-count .count').text(--quantity);
    }

    this.countGoods--;
    this.amount -= price;

    //this.basketItems.splice(index, 1);
    var j = 0;
    while (j < this.basketItems.length) {
        if (this.basketItems[j].id_product === idProduct) {
            this.basketItems.splice(j, 1);

            break;
        } else {
            j++;
        }
    }

    console.log(this.basketItems);

    this.refresh();
};

Basket.prototype.refresh = function () {
    var $basketData = $('#basket-data');

    $basketData.empty(); //Очищаем содержимое контейнера
    $basketData.append('<p>Всего товаров: ' + this.countGoods + '</p>');
    $basketData.append('<p>Общая сумма: ' + this.amount + '</p>');
};

Basket.prototype.remove = function(idProduct, quantity, price) {
    var getAllPriceThisProduct = quantity * price;

    this.countGoods -= quantity;
    this.amount -= getAllPriceThisProduct;

    //this.basketItems.splice(index, quantity);
    var j = 0;
    while (j < this.basketItems.length) {
        if (this.basketItems[j].id_product === idProduct) {
            this.basketItems.splice(j, 1);
        } else {
            j++;
        }
    }

    $('#basket_items').find('[data-id-item="' + idProduct + '"]').remove();
    console.log(this.basketItems);

    this.refresh();
};