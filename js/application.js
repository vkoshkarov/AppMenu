var APP = {
    errorHandler: function (request, textStatus, errorThrown) {
        console.warn("Error: " + textStatus);
        console.error(errorThrown);
    },
    block: function () {
        var container = $('body');
        container.append('<div class="block-overlay"></div><div class="block-message"></div>');
    },
    unblock: function () {
        var container = $('body');
        container.find('.block-overlay, .block-message').remove();
    },
    init: function (user) {
//        APP.log(user);

        $.ajax({
            success: function (result) {
                console.log(result);
                if (result) {
                    if (!!result.orders) {
                        APP.loadOrders(result.orders);
                    }
                }
            }
        });

        $('div#orderModal').on('show.bs.modal', APP.orderDetails);
        
        $('div.modal-content').on('click','button[data-success]',function(e){
            var modal = $('div#orderModal');
            APP.orderSucces(modal.find('#orderId').text());
        });


    },
    loadOrders: function (orders) {
        for (var key in orders) {
            var btn = $("<button/>").addClass("list-group-item")
                    .attr("type", "button")
                    .attr("data-order", orders[key].order)
                    .attr("data-toggle", "modal")
                    .attr("data-target", "#orderModal")
                    .text(orders[key].title);
            $("div#orders").append(btn);
        }
        $("h3.panel-title span.badge").text(orders.length);
    },
    orderDetails: function (event) {
        var button = $(event.relatedTarget),
            orderId = button.data('order'),
            modal = $(this);

            $.ajax({
                async: false,
                success: function (result) {
                    if (!!result.orders) {
                        for (var key in result.orders) {
                            if(result.orders[key].order == orderId){
                                APP.orderView(result.orders[key], modal);
                                break;
                            }
                        }
                    }
                }
            });
    },
    orderView: function (order, modal){
        var dishes = order.dishes,
            modalBody = modal.find(".modal-body"),
            text='';
        for (var key in dishes) {
            if(dishes[key].count == 1){
                text += '<h3>' + dishes[key].title + '</h3>'
                    + 'Вес: ' + dishes[key].weight 
                    + '<br>Цена: '+ dishes[key].totalprice;
            }else{
                text += '<h3>' + dishes[key].title + '</h3>'
                    + 'Количество: ' + dishes[key].count
                    + '<br>Цена за порцию: ' + dishes[key].price
                    + '<br>Вес: ' + dishes[key].weight 
                    + '<br>Цена: '+ dishes[key].totalprice;
            }
        }

        modalBody.find("#orderId").text(order.order);
        modalBody.find("#price").text(order.price);
        modalBody.find("#time").text(order.time);
        modalBody.find("#content").html(text);
        modal.find('.modal-title').text(order.title);
    },
    orderSucces: function (orderId) {
        var label = $("<span/>").addClass("label label-success").text("обработан");
        var ord = $("div#orders").find("button[data-order = " + orderId + "]"); 
        if(ord.has("span.label-success").length < 1){
            ord.append('&nbsp;&nbsp;').append(label);
        }
    },
    log: function (message) {
        if (typeof console !== 'undefined') {
            console.log(message);
        }
    }
};

$.ajaxSetup({
    url: 'orders.json',
    type: 'post',
    dataType: 'json',
    error: APP.errorHandler,
    beforeSend: function () {
        APP.block();
    },
    complete: function () {
        APP.unblock();
    }
});

var app = APP;
