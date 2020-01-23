const request = require('supertest');
const app = require('./app');


test('Post Call',  () => {
     request(app).post("/").send({
        name: 'Data Structure',
        author_name: 'M.Sharma',
        price: '980'
    }).expect(200);
});

// test('Post Call',  () => {
//     request(app).post("/").send({
//         name:'',
//         author_name: '',
//         price: ''
//    }).expect(200);
// });

test('Get Call',  () => {
    request(app).get("/C").expect(200);
});

test('Put Call',  () => {
    request(app).put("/C").send({
       price: '200'
   }).expect(200);
});

test('Delete Call',  () => {
    request(app).delete("/C")
       .expect(200);
});

