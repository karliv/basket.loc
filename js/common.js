"use strict";

window.onload = function() {
    var SG = renderGoods.bind(this);

    var xhr = new XMLHttpRequest();
    xhr.open('GET', './json/getGoodById.json', true); //Асинхронный запрос

    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) {
            return;
        }

        if(xhr.status === 200){
            SG(JSON.parse(xhr.responseText));
        } else {
            console.log('Error', xhr.status, xhr.statusText);
        }
    };

    xhr.send();

    function renderGoods(items) {
        for (var itemGoods in items) {
            if (items.hasOwnProperty(itemGoods)) {
                new Good(items[itemGoods].product_id, items[itemGoods].product_name, items[itemGoods].product_price).render('goods');
            }
        }
    }

    // Отрисовка корзины
    var basket = new Basket('basket');
    basket.render('basket');

    var goodBtn = document.querySelector('#goods');
    goodBtn.addEventListener('click', function(event) {addGoods(event)});

    // Функция добавления товара по клику
    function addGoods(event) {
        if (event.target.tagName !== 'BUTTON') {
            return;
        }

        var idProduct = parseInt(event.target.getAttribute('data-id'));
        var price = parseInt(event.target.parentNode.querySelector('.good-price').textContent);
        var title = event.target.parentNode.querySelector('.good-title').textContent;
        basket.add(idProduct, price, title);
        console.log(basket.basketItems);
    }

    // Объявление обработчика событий по клику для кнопки в карзине
    var basketBtn = document.querySelector('.basket');
    basketBtn.addEventListener('click', function(event) {changeBasket(event)});

    // Функция добавления/убавления кол-во товара на 1, по клику или же полное его удаление
    function changeBasket(event) {
        if (event.target.tagName === 'SPAN' || event.target.tagName === 'BUTTON') {
            var getID = parseInt(event.target.parentNode.parentNode.getAttribute('data-id-item'));
            var quantity = parseInt(event.target.parentNode.parentNode.querySelector('td.item-count .count').textContent);
            var price = parseInt(event.target.parentNode.parentNode.querySelector('.item-price').textContent);

            if (event.target.className == 'basket-btn') {
                basket.remove(getID, quantity, price);
            } else if (event.target.className == 'minus') {
                basket.countMinus(getID, quantity, price);
            } else if (event.target.className == 'plus') {
                basket.countPlus(getID, quantity, price);
            }
        } else {
            return;
        }
    }

    //$('#show_basket').click(function() {
    //    if ($(this).text() === 'Показать корзину') {
    //        $(this).text('Скрыть корзину');
    //    } else {
    //        $(this).text('Показать корзину');
    //    }
    //    //console.log($(this).text());
    //    $('#basket').fadeToggle(800);
    //});
};