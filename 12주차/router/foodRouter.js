const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const router = express.Router();
const foods = require('../model/foodModel');

router.use(session({
    resave:false,
    saveUninitialized:false,
    secret:'Secret Key'})
 );

 router.use(bodyParser.urlencoded({extended:false}));

const user = {
    id : 'lhh',
    password : '222',
    name : 'lhh',
 }
 
 
 router.post('/login', handleLogin);
 router.delete('/logout',handleLogout);

router.get('/foods', async (req, res) => {
    const data = await foods.getFoodList();

    res.render('food', {foods:data, count:data.length});
});


router.get('/food/add', addFoodForm);
router.get('/foods/:foodId', showFoodDetail);
router.post('/foods', addFood);
router.delete('/foods/:foodId', deleteFood);
router.post('/foods/delete', deleteFood);
router.get('/food/detail/:foodId', updateFoodform);
router.post('/foods/edit', updateFood);
module.exports = router;


function handleLogin(req, res) {
    const id = req.body.id;
    const password = req.body.password;
 
    if ( id === user.id && password === user.password ) {
       // 로그인 성공시 : 세션에 사용자 ID 저장
       req.session.userid = id;
       res.sendStatus(200);
    }
    else {
       res.sendStatus(401);
    }
 }
 
 function handleLogout(req, res) {
    req.session.destroy( err => {
       if ( err ) {
          res.sendStatus(500);
       }
       else {
          // 로그아웃 성공
          res.sendStatus(200);
       }
    });
 }


async function showFoodDetail(req, res) {
    try {
        
        const foodId = req.params.foodId;
        console.log('foodId : ', foodId);
        const info = await foods.getFoodDetail(foodId);

        res.render('foodDel', {detail:info});
    }
    catch ( error ) {
        console.log('Can not find, 404');
        res.status(error.code).send({msg:error.msg});
    }
}

// 음식 추가
async function addFood(req, res) {
    const food = req.body.food;

    if (!food) {
        res.status(400).send({error:'누락'});
        return;
    }

    const kind = req.body.kind;
    const explanation = req.body.explanation;
    

    try {
        const result = await foods.addFood(food, kind, explanation);
        res.render('addComplete',{data:result});
    }
    catch ( error ) {
        res.status(500).send(error.msg);
    }
}
function addFoodForm(req, res) {
    res.render('foodAdd');
}



// 음식 수정

async function updateFoodform(req, res) {
    try {
       
        const foodId = req.params.foodId;
        console.log('foodId : ', foodId);
        const info = await foods.getFoodDetail(foodId);

        res.render('foodUpdate', {detail:info});
    }
    catch ( error ) {
        console.log('Can not find, 404');
        res.status(error.code).send({msg:error.msg});
    }
}

// 수정
async function updateFood(req, res) {

    const id = req.body.id; // id 가져오기
    const food = req.body.food;

    if (!food) {
        res.status(400).send({error:'food 누락'});
        return;
    }
    const kind = req.body.kind;
    const explanation = req.body.explanation;
  

    try {
        const result = await foods.updateFood(id, food, kind, explanation);
        console.log(result);
        res.render('updateComplete',{data:result});
    }
    catch ( error ) {
        res.status(500).send(error.msg);
    }
}
// 음식 삭제

async function deleteFood(req, res) {
    try {
        const id = req.body.id; 
        const result = await foods.deleteFood(id);
        res.render('delComplete');
    }
    catch ( error ) {
        res.status(400).send({error:'음식 삭제실패'});
    }
}
