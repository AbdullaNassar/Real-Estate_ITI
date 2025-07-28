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
    { name: 'Users', description: 'User management (authentication, profile, and security)' },
    { name: 'Lists', description: 'Manage property listings (houses/rooms)' },
    { name: 'Ratings', description: 'Rate and review bookings/listings' },
    { name: 'Categories', description: 'Manage property categories (admin only)' },
    { name: 'Amenities', description: 'Manage amenities (admin only)' },
    { name: 'Bookings', description: 'Create, update, and manage guest bookings' },
    ],
    paths: {
        // ------------------- USERS -------------------
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
                        required: ['userName', 'email', 'password', 'confirmPassword'],
                        properties: {
                        userName: { type: 'string', example: 'JohnDoe' },
                        email: { type: 'string', example: 'john@example.com' },
                        password: { type: 'string', example: 'Password123!' },
                        confirmPassword: { type: 'string', example: 'Password123!' },
                        gender: { type: 'string', enum: ['male', 'female'], example: 'male' },
                        role: { type: 'string', enum: ['user', 'host', 'admin'], example: 'user' },
                        dateOfBirth: { type: 'string', format: 'date', example: '1990-01-01' },
                        phoneNumber: { type: 'string', example: '+201234567890' },
                        },
                    },
                    },
                },
                },
                responses: {
                201: { description: 'User created successfully, OTP sent to email' },
                400: { description: 'Missing fields or password mismatch' },
                409: { description: 'User already exists' },
                500: { description: 'Internal server error' },
                },
            },
        },
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
                    required: ['email', 'password'],
                    properties: {
                    email: { type: 'string', example: 'john@example.com' },
                    password: { type: 'string', example: 'Password123!' },
                    },
                },
                },
            },
            },
            responses: {
            200: { description: 'User logged in successfully (JWT returned)' },
            400: { description: 'Missing email or password' },
            401: { description: 'Invalid email or password' },
            403: { description: 'Email not verified (OTP pending)' },
            404: { description: 'User not found' },
            500: { description: 'Internal server error' },
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
            404: { description: 'No users found' },
            500: { description: 'Internal server error' },
            },
        },
        delete: {
            summary: 'Delete all users except admin (admin only)',
            security: [{ bearerAuth: [] }],
            tags: ['Users'],
            responses: {
            200: { description: 'All non-admin users deleted' },
            500: { description: 'Internal server error' },
            },
        },
        },
        '/users/me': {
            get: {
                summary: 'Get logged-in user data',
                description: 'Returns data of the currently authenticated user',
                security: [{ bearerAuth: [] }],
                tags: ['Users'],
                responses: {
                    200: {
                        description: 'User data retrieved successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: { type: 'string' },
                                        data: {
                                            type: 'object',
                                            example: {
                                                name: 'John Doe',
                                                email: 'john@example.com'
                                                // other user fields except password, _id, role, __v
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    404: { description: 'No user found' },
                    500: { description: 'Internal server error' },
                },
            },
        },
        '/users': {
        patch: {
            summary: 'Update logged-in user profile',
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
            500: { description: 'Internal server error' },
            },
        },
        delete: {
            summary: 'Delete logged-in user',
            security: [{ bearerAuth: [] }],
            tags: ['Users'],
            responses: {
            200: { description: 'User deleted' },
            500: { description: 'Internal server error' },
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
            404: { description: 'User not found' },
            },
        },
        },
        '/users/resend-otp': {
        post: {
            summary: 'Resend OTP for email verification',
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
            200: { description: 'New OTP sent to email' },
            404: { description: 'User not found' },
            },
        },
        },
        '/users/request-password-reset': {
        post: {
            summary: 'Request OTP for password reset',
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
            200: { description: 'OTP sent for password reset' },
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
                    newPassword: { type: 'string' },
                    },
                },
                },
            },
            },
            responses: {
            200: { description: 'Password reset successful' },
            400: { description: 'Invalid or expired OTP' },
            404: { description: 'User not found' },
            },
        },
        },
        '/users/change-password': {
        post: {
            summary: 'Change password for logged-in user',
            security: [{ bearerAuth: [] }],
            tags: ['Users'],
            requestBody: {
            required: true,
            content: {
                'application/json': {
                schema: {
                    type: 'object',
                    required: ['currentPassword', 'newPassword', 'confirmPassword'],
                    properties: {
                    currentPassword: { type: 'string' },
                    newPassword: { type: 'string' },
                    confirmPassword: { type: 'string' },
                    },
                },
                },
            },
            },
            responses: {
            200: { description: 'Password changed successfully' },
            400: { description: 'Invalid request or password mismatch' },
            404: { description: 'User not found' },
            },
        },
        },
        // ------------------- LISTS -------------------
        '/lists': {
            post: {
                summary: 'Create a new list (host only)',
                security: [{ bearerAuth: [] }],
                tags: ['Lists'],
                requestBody: {
                required: true,
                content: {
                    'multipart/form-data': {   // <-- Important for file uploads
                    schema: {
                        type: 'object',
                        properties: {
                        title: { type: 'string' },
                        description: { type: 'string' },
                        pricePerNight: { type: 'number' },
                        location: { type: 'string' },
                        categoryId: { type: 'string' },
                        amenitiesId: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'Array of amenity IDs'
                        },
                        width: { type: 'integer', example: 800, description: 'Image resize width' },
                        height: { type: 'integer', example: 600, description: 'Image resize height' },
                        quality: { type: 'integer', example: 80, description: 'Image quality (1-100)' },
                        images: {
                            type: 'array',
                            items: {
                            type: 'string',
                            format: 'binary'   // <-- Required for file uploads
                            },
                            description: 'List of images to upload'
                        }
                        },
                        required: ['title', 'pricePerNight', 'location', 'categoryId']
                    }
                    }
                }
                },
                responses: {
                201: { description: 'List created successfully' },
                500: { description: 'Internal server error' }
                }
            },
            get: {
                summary: 'Get all approved lists with filtering',
                tags: ['Lists'],
                parameters: [
                { name: 'sort', in: 'query', schema: { type: 'string' } },
                { name: 'page', in: 'query', schema: { type: 'integer' } },
                { name: 'limit', in: 'query', schema: { type: 'integer' } },
                { name: 'field', in: 'query', schema: { type: 'string' } }
                ],
                responses: {
                200: { description: 'List of approved listings' },
                500: { description: 'Internal server error' }
                }
            }
        },
        '/lists/{id}': {
        get: {
            summary: 'Get list by ID',
            tags: ['Lists'],
            parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
            ],
            responses: {
            200: { description: 'List retrieved successfully' },
            404: { description: 'List not found' },
            500: { description: 'Internal server error' },
            },
        },
        patch: {
            summary: 'Update a list (only by host)',
            security: [{ bearerAuth: [] }],
            tags: ['Lists'],
            parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
            ],
            requestBody: {
            required: true,
            content: {
                'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    pricePerNight: { type: 'number' },
                    location: { type: 'string' },
                    },
                },
                },
            },
            },
            responses: {
            200: { description: 'List updated successfully' },
            403: { description: 'Cannot update this list' },
            404: { description: 'List not found' },
            500: { description: 'Internal server error' },
            },
        },
        delete: {
            summary: 'Delete a list (only by host)',
            security: [{ bearerAuth: [] }],
            tags: ['Lists'],
            parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
            ],
            responses: {
            200: { description: 'List deleted successfully' },
            403: { description: 'Cannot delete this list' },
            404: { description: 'List not found' },
            500: { description: 'Internal server error' },
            },
        },
        },
        '/lists/search': {
        get: {
            summary: 'Search lists by title, description, price, date, location, or amenities',
            tags: ['Lists'],
            parameters: [
            { name: 'title', in: 'query', schema: { type: 'string' } },
            { name: 'description', in: 'query', schema: { type: 'string' } },
            { name: 'price', in: 'query', schema: { type: 'string' } },
            { name: 'date', in: 'query', schema: { type: 'string', format: 'date' } },
            { name: 'location', in: 'query', schema: { type: 'string' } },
            { name: 'amenities', in: 'query', schema: { type: 'string' } },
            ],
            responses: {
            200: { description: 'Search results returned successfully' },
            500: { description: 'Internal server error' },
            },
        },
        },
        '/lists/{id}/approve': {
        patch: {
            summary: 'Approve a listing (admin only)',
            security: [{ bearerAuth: [] }],
            tags: ['Lists'],
            parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
            ],
            responses: {
            200: { description: 'Listing approved successfully' },
            500: { description: 'Internal server error' },
            },
        },
        },
        // ------------------- RATINGS -------------------
        '/ratings/{bookingId}': {
        post: {
            summary: 'Submit a rating for a booking (guest only, after checkout)',
            security: [{ bearerAuth: [] }],
            tags: ['Ratings'],
            parameters: [
            { name: 'bookingId', in: 'path', required: true, schema: { type: 'string' } },
            ],
            requestBody: {
            required: true,
            content: {
                'application/json': {
                schema: {
                    type: 'object',
                    required: ['rating'],
                    properties: {
                    rating: { type: 'number', minimum: 1, maximum: 5 },
                    comment: { type: 'string' },
                    },
                },
                },
            },
            },
            responses: {
            201: { description: 'Rating submitted successfully' },
            400: { description: 'Already rated or not checked out' },
            403: { description: 'Unauthorized or booking not found' },
            500: { description: 'Internal server error' },
            },
        },
        },
        '/ratings/listings/{listingId}': {
        get: {
            summary: 'Get all ratings for a specific listing (admin and host)',
            security: [{ bearerAuth: [] }],
            tags: ['Ratings'],
            parameters: [
            { name: 'listingId', in: 'path', required: true, schema: { type: 'string' } },
            ],
            responses: {
            200: { description: 'List of ratings for the listing' },
            500: { description: 'Internal server error' },
            },
        },
        },
        // ------------------- CATEGORIES -------------------
        '/categories': {
        post: {
            summary: 'Create a new category (admin only)',
            security: [{ bearerAuth: [] }],
            tags: ['Categories'],
            requestBody: {
            required: true,
            content: {
                'application/json': {
                schema: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                    name: { type: 'string' },
                    },
                },
                },
            },
            },
            responses: {
            201: { description: 'Category created successfully' },
            400: { description: 'Validation error' },
            },
        },
        get: {
            summary: 'Get all categories (admin only)',
            security: [{ bearerAuth: [] }],
            tags: ['Categories'],
            responses: {
            200: { description: 'List of categories' },
            500: { description: 'Internal server error' },
            },
        },
        },
        '/categories/{id}': {
        patch: {
            summary: 'Update a category (admin only)',
            security: [{ bearerAuth: [] }],
            tags: ['Categories'],
            parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
            ],
            requestBody: {
            required: true,
            content: {
                'application/json': {
                schema: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                    name: { type: 'string' },
                    },
                },
                },
            },
            },
            responses: {
            200: { description: 'Category updated successfully' },
            404: { description: 'Category not found' },
            500: { description: 'Internal server error' },
            },
        },
        delete: {
            summary: 'Delete a category (admin only)',
            security: [{ bearerAuth: [] }],
            tags: ['Categories'],
            parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
            ],
            responses: {
            200: { description: 'Category deleted successfully' },
            404: { description: 'Category not found' },
            500: { description: 'Internal server error' },
            },
        },
        },
        
        // ------------------- Booking -------------------
        '/bookings/{id}': {
            post: {
            summary: 'Create a booking for a listing',
            security: [{ bearerAuth: [] }],
            tags: ['Bookings'],
            parameters: [
                {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string' },
                description: 'Listing ID',
                },
            ],
            requestBody: {
                required: true,
                content: {
                'application/json': {
                    schema: {
                    type: 'object',
                    required: ['checkIn', 'checkOut', 'paymentMethod'],
                    properties: {
                        checkIn: { type: 'string', format: 'date' },
                        checkOut: { type: 'string', format: 'date' },
                        paymentMethod: {
                        type: 'string',
                        enum: ['card', 'cash', 'paypal'],
                        },
                    },
                    },
                },
                },
            },
            responses: {
                201: { description: 'Booking created successfully' },
                400: { description: 'Invalid dates or data' },
                404: { description: 'Listing not found' },
                500: { description: 'Internal server error' },
            },
            },
            patch: {
            summary: 'Update a booking',
            security: [{ bearerAuth: [] }],
            tags: ['Bookings'],
            parameters: [
                {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string' },
                description: 'Booking ID',
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
                        paymentMethod: {
                        type: 'string',
                        enum: ['card', 'cash', 'paypal'],
                        },
                    },
                    },
                },
                },
            },
            responses: {
                200: { description: 'Booking updated successfully' },
                400: { description: 'Invalid dates or data' },
                403: { description: 'Unauthorized update' },
                404: { description: 'Booking not found' },
                500: { description: 'Internal server error' },
            },
            },
            delete: {
            summary: 'Delete a booking',
            security: [{ bearerAuth: [] }],
            tags: ['Bookings'],
            parameters: [
                {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string' },
                description: 'Booking ID',
                },
            ],
            responses: {
                200: { description: 'Booking deleted successfully' },
                403: { description: 'Unauthorized delete' },
                404: { description: 'Booking not found' },
                500: { description: 'Internal server error' },
            },
            },
            get: {
            summary: 'Get booking by ID',
            security: [{ bearerAuth: [] }],
            tags: ['Bookings'],
            parameters: [
                {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string' },
                description: 'Booking ID',
                },
            ],
            responses: {
                200: { description: 'Booking retrieved successfully' },
                403: { description: 'Unauthorized access' },
                404: { description: 'Booking not found' },
                500: { description: 'Internal server error' },
            },
        },
        },
        '/bookings/guest': {
            get: {
            summary: 'Get all bookings for logged-in guest',
            security: [{ bearerAuth: [] }],
            tags: ['Bookings'],
            responses: {
                200: { description: 'List of guest bookings' },
                500: { description: 'Internal server error' },
            },
            },
        },
        '/bookings/host': {
            get: {
            summary: 'Get all bookings for listings hosted by logged-in user',
            security: [{ bearerAuth: [] }],
            tags: ['Bookings'],
            responses: {
                200: { description: 'List of bookings for host listings' },
                500: { description: 'Internal server error' },
            },
            },
        },
        // ------------------- Amenities -------------------
        '/amenities': {
            post: {
                summary: 'Create a new amenity (admin only)',
                security: [{ bearerAuth: [] }],
                tags: ['Amenities'],
                requestBody: {
                required: true,
                content: {
                    'application/json': {
                    schema: {
                        type: 'object',
                        required: ['name', 'icon'],
                        properties: {
                        name: { type: 'string' },
                        icon: { type: 'string' },
                        },
                    },
                    },
                },
                },
                responses: {
                201: { description: 'Amenity created successfully' },
                400: { description: 'Validation error' },
                500: { description: 'Internal server error' },
                },
            },
            get: {
                summary: 'Get all amenities (admin only)',
                security: [{ bearerAuth: [] }],
                tags: ['Amenities'],
                responses: {
                200: { description: 'List of amenities' },
                500: { description: 'Internal server error' },
                },
            },
            },
        '/amenities/{id}': {
        patch: {
            summary: 'Update an amenity (admin only)',
            security: [{ bearerAuth: [] }],
            tags: ['Amenities'],
            parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Amenity ID' },
            ],
            requestBody: {
            required: true,
            content: {
                'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                    name: { type: 'string' },
                    icon: { type: 'string' },
                    },
                },
                },
            },
            },
            responses: {
            200: { description: 'Amenity updated successfully' },
            404: { description: 'Amenity not found' },
            500: { description: 'Internal server error' },
            },
        },
        delete: {
            summary: 'Delete an amenity (admin only)',
            security: [{ bearerAuth: [] }],
            tags: ['Amenities'],
            parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Amenity ID' },
            ],
            responses: {
            200: { description: 'Amenity deleted successfully' },
            404: { description: 'Amenity not found' },
            500: { description: 'Internal server error' },
            },
        },
        },
    },
}

const options = {
    definition: swaggerDefinition,
    apis: [path.resolve(__dirname, '../routes/*.js')]
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};