import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Airbnb',
        version: '1.0.0',
        description: 'API documentation for Airbnb project',
    },
    servers: [
        {
        url: process.env.SWAGGER_URL ,
        description: 'Development server',
        },
    ],
    components: {
        securitySchemes: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
        },
        },
    },
    tags: [
        {
        name: 'Users',
        description: 'User management',
        },
        { 
        name: 'Lists',
        description: 'Manage listings (houses/rooms)' 
        },

    ],
    paths: {
        '/users/login': {
        post: {
            summary: 'Log in a user',
            tags: ['Users'],
            requestBody: {
            required: true,
            content: {
                'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                    email: { type: 'string' },
                    password: { type: 'string' },
                    },
                },
                },
            },
            },
            responses: {
            200: { description: 'User logged in successfully' },
            401: { description: 'Invalid credentials' },
            },
        },
        },
        '/users/signup': {
        post: {
            summary: 'Sign up a new user',
            tags: ['Users'],
            requestBody: {
            required: true,
            content: {
                'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                    name: { type: 'string' },
                    email: { type: 'string' },
                    password: { type: 'string' },
                    },
                },
                },
            },
            },
            responses: {
            201: { description: 'User created' },
            },
        },
        },
        '/users/all': {
        get: {
            summary: 'Get all users (admin only)',
            security: [{ bearerAuth: [] }],
            tags: ['Users'],
            responses: {
            200: { description: 'List of users' },
            403: { description: 'Admin access only' },
            },
        },
        delete: {
            summary: 'Delete all users (admin only)',
            security: [{ bearerAuth: [] }],
            tags: ['Users'],
            responses: {
            200: { description: 'All users deleted' },
            403: { description: 'Admin access only' },
            },
        },
        },
        '/users': {
        patch: {
            summary: 'Update logged-in user',
            security: [{ bearerAuth: [] }],
            tags: ['Users'],
            requestBody: {
            required: true,
            content: {
                'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                    name: { type: 'string' },
                    email: { type: 'string' },
                    },
                },
                },
            },
            },
            responses: {
            200: { description: 'User updated' },
            },
        },
        delete: {
            summary: 'Delete logged-in user',
            security: [{ bearerAuth: [] }],
            tags: ['Users'],
            responses: {
            200: { description: 'User deleted' },
            },
        },
        },
        '/users/verify-otp': {
            post: {
                summary: 'Verify OTP for email verification',
                tags: ['Users'],
                requestBody: {
                required: true,
                content: {
                    'application/json': {
                    schema: {
                        type: 'object',
                        required: ['email', 'otp'],
                        properties: {
                        email: { type: 'string' },
                        otp: { type: 'string' },
                        },
                    },
                    },
                },
                },
                responses: {
                200: { description: 'Email verified successfully' },
                400: { description: 'Invalid or expired OTP' },
                },
            },
            },

            '/users/resend-otp': {
            post: {
                summary: 'Resend OTP to the user\'s email',
                tags: ['Users'],
                requestBody: {
                required: true,
                content: {
                    'application/json': {
                    schema: {
                        type: 'object',
                        required: ['email'],
                        properties: {
                        email: { type: 'string' },
                        },
                    },
                    },
                },
                },
                responses: {
                200: { description: 'OTP resent to email' },
                404: { description: 'User not found' },
                },
            },
            },

            '/users/request-password-reset': {
            post: {
                summary: 'Request password reset OTP',
                tags: ['Users'],
                requestBody: {
                required: true,
                content: {
                    'application/json': {
                    schema: {
                        type: 'object',
                        required: ['email'],
                        properties: {
                        email: { type: 'string' },
                        },
                    },
                    },
                },
                },
                responses: {
                200: { description: 'OTP sent to email for password reset' },
                404: { description: 'User not found' },
                },
            },
            },

            '/users/reset-password': {
            post: {
                summary: 'Reset password using OTP',
                tags: ['Users'],
                requestBody: {
                required: true,
                content: {
                    'application/json': {
                    schema: {
                        type: 'object',
                        required: ['email', 'otp', 'newPassword'],
                        properties: {
                        email: { type: 'string' },
                        otp: { type: 'string' },
                        newPassword: { type: 'string', format: 'password' },
                        },
                    },
                    },
                },
                },
                responses: {
                200: { description: 'Password reset successful' },
                400: { description: 'Invalid or expired OTP' },
                },
            },
            },
            '/users/change-password': {
                patch: {
                    summary: 'Change password for authenticated user',
                    tags: ['Users'],
                    security: [
                    {
                        bearerAuth: []  // Requires JWT token
                    }
                    ],
                    requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                        schema: {
                            type: 'object',
                            required: ['currentPassword', 'newPassword', 'confirmPassword'],
                            properties: {
                            currentPassword: {
                                type: 'string',
                                example: 'oldPassword123'
                            },
                            newPassword: {
                                type: 'string',
                                example: 'newPassword123'
                            },
                            confirmPassword: {
                                type: 'string',
                                example: 'newPassword123'
                            }
                            }
                        }
                        }
                    }
                    },
                    responses: {
                    200: { description: 'Password changed successfully' },
                    400: { description: 'Current password is incorrect or passwords do not match' },
                    401: { description: 'Unauthorized – missing or invalid token' },
                    404: { description: 'User not found' },
                    500: { description: 'Internal server error' }
                    }
                }
                },
        '/lists': {
            post: {
                summary: 'Create a new listing (host only)',
                tags: ['Lists'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                required: true,
                content: {
                    'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                        title: { type: 'string' },
                        price: { type: 'number' },
                        location: { type: 'string' },
                        },
                    },
                    },
                },
                },
                responses: {
                201: { description: 'Listing created successfully' },
                403: { description: 'Only hosts can create listings' },
                },
            },
            get: {
                summary: 'Get all listings (admin, host, guest)',
                tags: ['Lists'],
                security: [{ bearerAuth: [] }],
                responses: {
                200: { description: 'A list of all listings' },
                },
            },
            },

            '/lists/search': {
            get: {
                summary: 'Search listings',
                tags: ['Lists'],
                security: [{ bearerAuth: [] }],
                parameters: [
                {
                    in: 'query',
                    name: 'location',
                    schema: { type: 'string' },
                    description: 'Filter by location',
                },
                ],
                responses: {
                200: { description: 'List of matched results' },
                },
            },
            },

            '/lists/{id}': {
            get: {
                summary: 'Get listing by ID',
                tags: ['Lists'],
                parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: { type: 'string' },
                },
                ],
                responses: {
                200: { description: 'Listing data' },
                404: { description: 'Listing not found' },
                },
            },
            patch: {
                summary: 'Update a listing (admin or host only)',
                tags: ['Lists'],
                security: [{ bearerAuth: [] }],
                parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: { type: 'string' },
                },
                ],
                requestBody: {
                required: true,
                content: {
                    'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                        title: { type: 'string' },
                        price: { type: 'number' },
                        },
                    },
                    },
                },
                },
                responses: {
                200: { description: 'Listing updated' },
                403: { description: 'Unauthorized' },
                },
            },
            delete: {
                summary: 'Delete a listing (admin or host only)',
                tags: ['Lists'],
                security: [{ bearerAuth: [] }],
                parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: { type: 'string' },
                },
                ],
                responses: {
                200: { description: 'Listing deleted' },
                403: { description: 'Unauthorized' },
                },
            },
        },
        '/bookings/guest': {
            get: {
                summary: 'Get all bookings made by guests (admin/guest only)',
                tags: ['Bookings'],
                security: [{ bearerAuth: [] }],
                responses: {
                200: { description: 'List of guest bookings' },
                403: { description: 'Access denied' },
                },
            },
            },

            '/bookings/host': {
            get: {
                summary: 'Get all bookings for listings owned by host (admin/host only)',
                tags: ['Bookings'],
                security: [{ bearerAuth: [] }],
                responses: {
                200: { description: 'List of host bookings' },
                403: { description: 'Access denied' },
                },
            },
            },

            '/bookings/{id}': {
            post: {
                summary: 'Create a new booking (admin/guest only)',
                tags: ['Bookings'],
                security: [{ bearerAuth: [] }],
                parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    description: 'Listing ID to book',
                    schema: { type: 'string' },
                },
                ],
                requestBody: {
                required: true,
                content: {
                    'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                        checkIn: { type: 'string', format: 'date' },
                        checkOut: { type: 'string', format: 'date' },
                        },
                    },
                    },
                },
                },
                responses: {
                201: { description: 'Booking created' },
                403: { description: 'Access denied' },
                },
            },

            get: {
                summary: 'Get a booking by ID (admin/guest only)',
                tags: ['Bookings'],
                security: [{ bearerAuth: [] }],
                parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    description: 'Booking ID',
                    schema: { type: 'string' },
                },
                ],
                responses: {
                200: { description: 'Booking details' },
                404: { description: 'Booking not found' },
                },
            },

            patch: {
                summary: 'Update a booking (admin/guest only)',
                tags: ['Bookings'],
                security: [{ bearerAuth: [] }],
                parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    description: 'Booking ID',
                    schema: { type: 'string' },
                },
                ],
                requestBody: {
                required: true,
                content: {
                    'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                        checkIn: { type: 'string', format: 'date' },
                        checkOut: { type: 'string', format: 'date' },
                        },
                    },
                    },
                },
                },
                responses: {
                200: { description: 'Booking updated' },
                404: { description: 'Booking not found' },
                },
            },

            delete: {
                summary: 'Delete a booking (admin/guest only)',
                tags: ['Bookings'],
                security: [{ bearerAuth: [] }],
                parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    description: 'Booking ID',
                    schema: { type: 'string' },
                },
                ],
                responses: {
                200: { description: 'Booking deleted' },
                404: { description: 'Booking not found' },
                },
            },
        },
        '/ratings/{bookingId}': {
            post: {
                summary: 'Create a rating for a booking (guest only after checkout)',
                tags: ['Ratings'],
                security: [{ bearerAuth: [] }],
                parameters: [
                {
                    in: 'path',
                    name: 'bookingId',
                    required: true,
                    schema: { type: 'string' },
                    description: 'The ID of the booking to rate',
                },
                ],
                requestBody: {
                required: true,
                content: {
                    'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                        rating: { type: 'number', minimum: 1, maximum: 5 },
                        comment: { type: 'string' },
                        },
                        required: ['rating'],
                    },
                    },
                },
                },
                responses: {
                201: { description: 'Rating created successfully' },
                400: { description: 'You can only rate after checkout or rating already exists' },
                403: { description: 'Unauthorized or booking not found' },
                500: { description: 'Internal Server Error' },
                },
            },
            },
            '/ratings/listing/{listingId}': {
            get: {
                summary: 'Get all ratings for a listing',
                tags: ['Ratings'],
                parameters: [
                {
                    in: 'path',
                    name: 'listingId',
                    required: true,
                    schema: { type: 'string' },
                    description: 'The ID of the listing to get ratings for',
                },
                ],
                responses: {
                200: {
                    description: 'List of ratings for the listing',
                    content: {
                    'application/json': {
                        schema: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                            _id: { type: 'string' },
                            bookingId: { type: 'string' },
                            guestId: { type: 'string' },
                            rating: { type: 'number' },
                            comment: { type: 'string' },
                            createdAt: { type: 'string', format: 'date-time' },
                            },
                        },
                        },
                    },
                    },
                },
                404: { description: 'Listing not found' },
                500: { description: 'Internal Server Error' },
                },
            },
            },
    },
};

const options = {
    definition: swaggerDefinition,
    apis: [path.resolve(__dirname, '../routes/*.js')]
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};