const { and } = require('ajv/dist/compile/codegen');
const { v4: uuidv4 } = require('uuid');
const users = require('./users');

//  Some fixed example data of item
let itemsData = {
    items: [
        {
            id: '25978153-bced-4ff4-ab54-a86517cafaee',
            title: 'LED TV',
            description: 'TV with no problems',
            category: 'TV',
            city: 'Tetouan',
            contryCode: 'MA',
            images: [],
            price: 620.99,
            postingDate: '2019-08-12',
            delivery: 'Pickup',
            sellerID: 'b9e16741-54c2-423e-9fd1-760a918a8800',
            created: '2021-02-17T17:18:55.327Z'
        },
        {
            id: "e51298e8-f811-4fa9-8386-05035144f00a",
            title: "iphone 10",
            description: "a new phone with no problems",
            category: "phone",
            city: "Helsinki",
            contryCode: "FI",
            images: [],
            price: 1199.99,
            postingDate: "2019-08-24",
            delivery: "Pickup",
            sellerID: "f1475893-f1a5-46aa-a952-3bf299d2a661",
            created: "2021-02-17T17:18:55.327Z"
        },
        {
            id: "a52fa527-33c8-400a-b8bf-4e734ca963b0",
            title: "Car",
            description: "new car, 200KM only",
            category: "cars",
            city: "Oulu",
            contryCode: "FI",
            images: [],
            price: 2199,
            postingDate: "2019-09-15",
            delivery: "Pickup",
            sellerID: "b9e16741-54c2-423e-9fd1-760a918a8800",
            created: "2021-02-20T14:18:40.091Z"
        }
    ]
}

module.exports = {
    addItem: (body, user) => {
        const newItem = {
            id: uuidv4(),
            title: body.title,
            description: body.description,
            category: body.category,
            city: body.city,
            contryCode: body.contryCode,
            images: [],
            price: body.price,
            postingDate: new Date().toISOString().substr(0,10),
            delivery: body.delivery,
            sellerID: user.id,
            created: new Date().toISOString()
        }
        itemsData.items.push(newItem);
        return {
            id: newItem.id,
            created: newItem.created
        }
    },
    getAllItems: () => {
        return itemsData.items;
    },
    getItemByID: (id) => {
        let item = itemsData.items.find(i => i.id == id);
        if(item != undefined)
        {
            item.seller = users.getContactInfo(item.sellerID);
        }
        return item;    //can return "undifined" if no item found
    },
    getAllItemsByUserID : (id) =>      //returns array
    {
        let tab = [];
        itemsData.items.forEach(i => {
            if(i.sellerID == id)
            {
                let newItem = JSON.parse(JSON.stringify(i));
                newItem.seller = users.getContactInfo(i.sellerID);
                delete newItem.sellerID;
                tab.push(newItem);  //add the item to return array
            }
        });
        return tab;
    },
    modifyItem: (body,item) => {
        item.title = body.title;
        item.description = body.description;
        item.category = body.category;
        item.city = body.city;
        item.contryCode = body.contryCode;
        item.price = body.price;
        item.delivery = body.delivery;
        item.modified = new Date().toISOString();
        return item;
    },
    deleteItem: (id) => {
        itemsData.items = itemsData.items.filter(i => i.id != id);
    },
    getAllByCat: (cat) => {
        let ret = itemsData.items.filter(i => i.category.toLowerCase() == cat.toLowerCase());
        ret.forEach(i => i.seller = users.getContactInfo(i.sellerID));
        return ret;
    },
    getAllByLocation: (contry,city) => {
        let ret = itemsData.items.filter(i => (i.contryCode.toUpperCase() == contry.toUpperCase() && i.city.toLowerCase() == city.toLowerCase()));
        ret.forEach(i => i.seller = users.getContactInfo(i.sellerID));
        return ret;
    },
    getAllByDate: (start,end) => {
        let ret = itemsData.items.filter(i => i.postingDate >= start && i.postingDate <= end );
        ret.forEach(i => i.seller = users.getContactInfo(i.sellerID));
        return ret;
    }
}