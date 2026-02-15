
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AuthController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('/auth/login (POST) - Success for Artifact Admin', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .set('x-tenant-id', 'artifact') // Assuming header-based or we need to find how tenant is passed
            .send({
                email: 'artifact@artifact.cl',
                password: 'Artifact!2025',
            })
            .expect(201) // or 200 depending on implementation
            .then((response) => {
                console.log('Login Response:', response.body);
                expect(response.body).toHaveProperty('access_token');
                expect(response.body.user).toHaveProperty('email', 'artifact@artifact.cl');
            });
    });
});
