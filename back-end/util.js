const shipping = 5;

const getItemsAmount = function(items) {
    if (!items.length) {
        return shipping;
    }

    let price = items.reduce((prev, curr) => {
        return prev += curr.total;
    }, 0);

    price += shipping;

    return price;
}

const copy = function(obj) {
    return JSON.parse(JSON.stringify(obj));
}

module.exports = {
    getItemsAmount,
    shipping,
    copy
}