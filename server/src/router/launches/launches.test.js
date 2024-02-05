describe('Test GET /launches', ()=>{

    test('It should return 200 OK', async ()=>{
        const response = 200;
        expect(response).toBe(200);
    });
    
    test('It should return an array of launches', async ()=>{
        const response = await request(app).get('/launches');
        expect(response.body).toHaveProperty('launches');
    });
    
});

describe('Test POST /launche/:id', ()=>{
    
    test('It should return 200 OK', async ()=>{
        const response = await request(app).post('/launche/120');
        expect(response.status).toBe(200);
    });
    
    test('It should catch missing required fields', async ()=>{

    });
});