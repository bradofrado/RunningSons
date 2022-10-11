const shipping = 0;


const getShipping = function(items) {
    if (!items.length) return 0;

    if (items.some(x => x.itemType == 'Merchandise')) {
        return shipping;
    }

    return 0;
}


const getItemsAmount = function(items) {
    if (!items.length) {
        return shipping;
    }

    let price = items.reduce((prev, curr) => {
        return prev += curr.total;
    }, 0);

    price += getShipping(items);

    return price;
}

const copy = function(obj) {
    return JSON.parse(JSON.stringify(obj));
}

const sortItems = async function(items, model) {
    const allItems = await model.find();
    const toUpdate = [];

    //Loop twice. Once to error check, another to do the saving
    for (let i = 0; i < items.length; i++) {
        const id = items[i]._id;
        const order = items[i].order;
        const item = allItems.find(x => x._id.toString() == id.toString());

        if (!item) {
            throw new Error(id);
        }

        if (item.order != order) {
            toUpdate.push({item: item, order: order});
        }
    }

    for (let i = 0; i < toUpdate.length; i++) {
        const item = toUpdate[i].item;
        const order = toUpdate[i].order;

        item.order = order;
        await item.save();
    }

    return allItems;
}

module.exports = {
    getItemsAmount,
    getShipping,
    copy,
    sortItems,
}