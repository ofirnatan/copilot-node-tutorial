// Use supertest and Jest to test the following routes:
// GET /superheroes/all
// GET /superheroes/:id
// GET /superheroes/:id/powerstats

const app = require('../server');
const request = require('supertest');

/** RUN */

// add functional test for GET /superheroes/all route using Jest
describe('GET /superheroes/all', () => {
  it('should return all superheroes', async () => {
    const res = await request(app).get('/superheroes/all');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(3);
  });
});

// add functional test for GET /superheroes/:id route using Jest
describe('GET /superheroes/:id', () => {
  it('should return superhero by id', async () => {
    const res = await request(app).get('/superheroes/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(1);
  });
});

// add functional test for GET /superheroes/:id/powerstats route using Jest
describe('GET /superheroes/:id/powerstats', () => {
  it('should return superhero powerstats by id', async () => {
    const res = await request(app).get('/superheroes/1/powerstats');
    expect(res.statusCode).toEqual(200);
    expect(res.body.intelligence).toEqual(38);
  });
});



