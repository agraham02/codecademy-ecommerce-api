const items = {
    1: {
        productId: 1,
        quantity: 2
    },
    bunny: {
        productId: 2,
        quantity: 7
    }
}

let product = {
    id: 5, 
    name: "banana",
    quantity: 3
}

let newItemToAdd = {
    productId: product.id,
    quantity: product.quantity
}

items[product.name] = newItemToAdd;
console.log(items);

product = {
    id: 5, 
    name: "banana",
    quantity: 4
}

newItemToAdd = {
    productId: product.id,
    quantity: product.quantity
}

if (items[product.name]) {
    items[product.name].quantity += newItemToAdd.quantity;
} else {
    items[product.name] = newItemToAdd;
}

console.log(Object.keys(items))