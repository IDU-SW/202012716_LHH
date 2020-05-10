var pool = require('./dbConnection');

const fs = require('fs');

class Food {
    constructor() {
        const data = fs.readFileSync('./model/data.json');
        this.foods = JSON.parse(data)
    }

    //리스트 조회
    getFoodList = async() => {   
        const sql = 'SELECT * from foods'
        let conn;
        try {
            conn = await pool.getConnection();
            const [rows, metadata] = await conn.query(sql);
            conn.release();
            return rows;
        } catch (error) {
            console.error(error);
        } finally {
            if ( conn ) conn.release();
        }
    }

    getFoodDetail = async(foodId) => {
        const sql = 'SELECT * from foods where id = ?';
        let conn;
        try {
            conn = await pool.getConnection();
            const [rows, metadata] = await conn.query(sql, foodId);
            conn.release();
            console.log(rows);
            return rows[0];
        } catch (error) {
            console.error(error);
        } finally {
            if ( conn ) conn.release();
        }
    }

    addFood = async(food, kind, explanation) => {

        console.log(food);
        console.log(kind);
        console.log(explanation);

        const data = [food, kind, explanation];
        const sql = 'insert into foods(food,kind,explanation) values(?, ?, ?)';
        let conn;
        try {
            conn = await pool.getConnection();
            const [rows, metadata] = await conn.query(sql, data);
            conn.release();
            console.log('rows',rows);
            return rows[0];
        } catch (error) {
            console.error(error);
            return -1;
        } finally {
            if ( conn ) conn.release();
        }
    }


    updateFood = async(foodId, food, kind, explanation) => {
        const data = [food, kind, explanation, foodId];
        const sql = 'update foods set food = ?, kind = ?, explanation = ? where id = ?';
        let conn;
        try {
            conn = await pool.getConnection();
            const [rows, metadata] = await conn.query(sql, data);
            conn.release();
            console.log('rows',rows);
            return rows[0];
        } catch (error) {
            console.error(error);
            return -1;
        } finally {
            if ( conn ) conn.release();
        }
    }

    deleteFood = async(id) => {
        
        const sql = 'delete from foods where id = ?';
        let conn;
        try {
            conn = await pool.getConnection();
            const [rows, metadata] = await conn.query(sql, id);
            conn.release();
            console.log('rows',rows);
            return rows[0];
        } catch (error) {
            console.error(error);
            return -1;
        } finally {
            if ( conn ) conn.release();
        }
    }
}


module.exports = new Food();



/*
var pool = require('./dbConnection');

const fs = require('fs');
Q
class Food {
    constructor() {
        const data = fs.readFileSync('./model/data.json');
        this.foods = JSON.parse(data)
    }

    getFoodList() {
        if (this.foods) {
            return this.foods;
        }
        else {
            return [];
        }
    }

    getFoodDetail(foodId) {
        return new Promise((resolve, reject) => {
            for (var food of this.foods ) {
                if ( food.id == foodId ) {
                    resolve(food);
                    return;
                }
            }
            reject({msg:'Can not find detail food', code:404});
        });
    }

    addFood(food, kind, explanation) {
        return new Promise((resolve, reject) => {
            let last = this.foods[this.foods.length - 1];
            let id = last.id + 1;
            let newFood = {id, food, kind, explanation};
            this.foods.push(newFood);

            resolve(newFood);
        });
    }

    updatefood(foodId, food, kind, explanation) {
        return new Promise((resolve, reject) => {
            let id = Number(foodId);
            let newFood = {id, food, kind, explanation};
            for (var food1 of this.foods ) {
                if ( food1.id == id ) {
                    this.foods.splice(id, 1, newFood); // 
                    resolve(newFood);
                    console.log(newFood);
                    return;
                }
            }
        });
    }

    deleteFood(foodId) {
        return new Promise((resolve, reject) => {
            for (var food of this.foods ) {
                if ( food.id == foodId ) {
                    this.foods.pop(food);
                    resolve(food);
                    return;
                }
            }
            reject({msg:'Can not find that named food', code:404});
        });
    }
}

module.exports = new Food();
*/
