/**
 * Prompt to Copilot Chat inline (Cmd+I) that generated this code:
/tests
Use supertest and Jest to test the following routes:
- GET /superheroes/all - verify 200OK and number of returned items in response matches superheros.json
- GET /superheroes/:id - verify 200OK and actual id of item is what was requested
- GET /superheroes/:id/powerstats - verify 200OK, and intelligence property matches item in superheros.json
 */

const request = require('supertest');
const app = require('../server');

describe('GET /superheroes/all', () => {
    it('should return 200 OK and number of returned items matches superheros.json', async () => {
        const response = await request(app).get('/superheroes/all');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(require('../superheroes.json').length);
    });
});

describe('GET /superheroes/:id', () => {
    it('should return 200 OK and actual id of item is what was requested', async () => {
        const id = 1; // Replace with the desired superhero id
        const response = await request(app).get(`/superheroes/${id}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(id);
    });
});

describe('GET /superheroes/:id/powerstats', () => {
    it('should return 200 OK and intelligence property matches item in superheros.json', async () => {
        const id = 1; // Replace with the desired superhero id
        const response = await request(app).get(`/superheroes/${id}/powerstats`);
        expect(response.status).toBe(200);
        expect(response.body.intelligence).toBe(require('../superheroes.json')[id - 1].powerstats.intelligence);
    });
});
