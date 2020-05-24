var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/example';
var ObjectID = require('mongodb').ObjectID;

var db;

MongoClient.connect(url, { useUnifiedTopology: true }, function (err, database) {
    if (err) {
        console.error('MongoDB 연결 실패', err);
        return;
    }
    // connection을 할 때에 database명을 명시해야함
    db = database.db('example');
});

class Food {}

// Read (전체 조회)
Food.getFoodList = async () => {
    return await db.collection('food').find({}).toArray();
}

// Read Detail (id값 별 상세 조회)
Food.getFoodDetail = async (foodId) => {
    return await db.collection('food').findOne({ _id: new ObjectID(foodId) });
}

// Add
Food.addFood = async (food, kind, explanation) => {
    const data = { food, kind, explanation };
    try {
        const returnValue = await dataOneAdd(data);
        return returnValue;
    } catch (error) {
        console.error(error);
    }
}

// Add 
async function dataOneAdd(food) {
    try {
        let foodData = await db.collection('food').insertOne({
            food: food.food,
            kind: food.kind,
            explanation: food.explanation
        }, { logging: false });
        const newFood = foodData;
        console.log('입력된 데이터 : ', newFood);
        return newFood;
    } catch (error) {
        console.log(error);
    }
}

// Delete
Food.deleteFood = async (foodId) => {
    try {
        let result = await db.collection('food').deleteOne({ _id: new ObjectID(foodId) });
        console.log('삭제한 id : ', _id);
    } catch (error) {
        console.log(error);
    }
}

// Update
Food.updateFood = async (foodId, food, kind, explanation) => {
    try {
        let ret = await db.collection('food').updateOne({_id: new ObjectID(foodId)}, {$set : {food: food, kind: kind, explanation: explanation}});
        console.log('ret 값 : ', ret);
        return ret;
    } catch (error) {
        console.log(error);
    }
}

module.exports = new Food();