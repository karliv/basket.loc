"use strict";




$(document).ready(function() {
    var good1 = new Good(125, 'Клавиатура для ПК', 1000);
    good1.render('goods');

    var good2 = new Good(126, 'Коврик для мыши', 400);
    good2.render('goods');

    var good3 = new Good(127, 'Колонки', 1762);
    good3.render('goods');

    var good4 = new Good(128, 'Микрофон', 150);
    good4.render('goods');

    var basket = new Basket('basket');
    basket.render('basket');

    $('.good-btn').click(function () {
        var idProduct = parseInt($(this).attr('data-id'));
        var price = parseInt($(this).parent().find('.good-price').text());
        var title = $(this).parent().find('.good-title').text();
        basket.add(idProduct, price, title, this.dataset.index);
        console.log(basket.basketItems);
    });

    function delItem(elem) {
        $('.basket').on('click', elem, function () {
            var getID = parseInt($(this).parent().parent().attr('data-id-item'));
            var quantity = parseInt($(this).parent().parent().find('td.item-count .count').text());
            var price = parseInt($(this).parent().parent().find('.item-price').text());
            var title = $(this).parent().parent().find('.item-title').text();

            //console.log(this.dataset.index);
            if (elem == '.basket-btn') {
                basket.remove(getID, quantity, price);
            } else if (elem == 'span.minus') {
                basket.countMinus(getID, quantity, price);
            } else if (elem == 'span.plus') {
                basket.countPlus(getID, quantity, price, title);
            }
            //basket.remove(getID, quantity, price, this.dataset.index);
        });
    }

    delItem('.basket-btn');
    delItem('span.minus');
    delItem('span.plus');

    //$('#show_basket').click(function() {
    //    if ($(this).text() === 'Показать корзину') {
    //        $(this).text('Скрыть корзину');
    //    } else {
    //        $(this).text('Показать корзину');
    //    }
    //    //console.log($(this).text());
    //    $('#basket').fadeToggle(800);
    //});
});