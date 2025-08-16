import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Airbnb",
    version: "1.0.0",
    description: "API documentation for Airbnb project",
  },
  servers: [
    {
      url: process.env.SWAGGER_URL,
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  tags: [
    {
      name: "Users",
      description: "User management (authentication, profile, and security)",
    },
    { name: "Lists", description: "Manage property listings (houses/rooms)" },
    { name: "Ratings", description: "Rate and review bookings/listings" },
    {
      name: "Categories",
      description: "Manage property categories (admin only)",
    },
    { name: "Amenities", description: "Manage amenities (admin only)" },
    {
      name: "Bookings",
      description: "Create, update, and manage guest bookings",
    },
  ],
  paths: {
    // ------------------- USERS -------------------
    "/users/signup": {
      post: {
        summary: "Sign up a new user",
        tags: ["Users"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["userName", "email", "password", "confirmPassword"],
                properties: {
                  userName: { type: "string", example: "JohnDoe" },
                  email: { type: "string", example: "john@example.com" },
                  password: { type: "string", example: "Password123!" },
                  confirmPassword: { type: "string", example: "Password123!" },
                  role: {
                    type: "string",
                    enum: ["guest", "host"],
                    example: "guest Or host",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "User created successfully, OTP sent to email" },
          400: { description: "Missing fields or password mismatch" },
          409: { description: "User already exists" },
          500: { description: "Internal server error" },
        },
      },
    },
    "/users/login": {
      post: {
        summary: "Log in a user",
        tags: ["Users"],
        description: "Logs in a registered and verified user. Sets a token cookie and returns user data.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: {
                    type: "string",
                    example: "john@example.com"
                  },
                  password: {
                    type: "string",
                    example: "Password123!"
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "User logged in successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Success" },
                    message: { type: "string", example: "User Logged In Successfully" },
                    token: { type: "string", example: "JWT_TOKEN_HERE" }
                  }
                }
              }
            }
          },
          400: {
            description: "Missing or invalid credentials",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Failed" },
                    message: { type: "string", example: "Invalid Email Or Password" }
                  }
                }
              }
            }
          },
          403: {
            description: "Email not verified",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Failed" },
                    message: {
                      type: "string",
                      example: "Please verify your email via OTP first"
                    }
                  }
                }
              }
            }
          },
          404: {
            description: "User not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "failed" },
                    message: {
                      type: "string",
                      example: "User Must Register First"
                    }
                  }
                }
              }
            }
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "failed" },
                    message: { type: "string", example: "internal Server Error" },
                  }
                }
              }
            }
          }
        }
      }
    },
    "/users/logout": {
      get: {
        summary: "Log out a user",
        tags: ["Users"],
        description: "Clears the authentication token cookie and logs out the user.",
        responses: {
          200: {
            description: "User logged out successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: { type: "string", example: "User logged out succssfully" }
                  }
                }
              }
            }
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Failed" },
                    message: { type: "string", example: "Internal Server Error" },
                  }
                }
              }
            }
          }
        }
      }
    },
    "/users/all": {
      get: {
        summary: "Get all users (admin only)",
        security: [{ bearerAuth: [] }],
        tags: ["Users"],
        responses: {
          200: {
            description: "List of users",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Success" },
                    user_length: { type: "number", example: 3 },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          _id: { type: "string", example: "64ff0a8c2f1b1a4d9a7c1f45" },
                          userName: { type: "string", example: "JohnDoe" },
                          email: { type: "string", example: "johndoe@example.com" },
                          role: { type: "string", example: "user" },
                          createdAt: { type: "string", example: "2025-08-16T10:00:00.000Z" }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          404: {
            description: "No users found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Fail" },
                    message: { type: "string", example: "No users found" }
                  }
                }
              }
            }
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Error" },
                    message: { type: "string", example: "Internal server error" }
                  }
                }
              }
            }
          }
        }
      },

      delete: {
        summary: "Delete all users except admin (admin only)",
        security: [{ bearerAuth: [] }],
        tags: ["Users"],
        responses: {
          200: {
            description: "All non-admin users deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Success" },
                    message: {
                      type: "string",
                      example: "5 users deleted successfully"
                    }
                  }
                }
              }
            }
          },
          404: {
            description: "No non-admin users found to delete",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Fail" },
                    message: {
                      type: "string",
                      example: "No non-admin users found to delete"
                    }
                  }
                }
              }
            }
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Error" },
                    message: { type: "string", example: "Internal server error" }
                  }
                }
              }
            }
          }
        }
      }
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
                                  status: { type: 'string' ,example: "Success"  },
                                  user: {
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
    "/users": {
      patch: {
        summary: "Update logged-in user profile",
        security: [{ bearerAuth: [] }],
        tags: ["Users"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "John Doe" },
                  email: { type: "string", example: "johndoe@example.com" },
                  phoneNumber: { type: "string", example: "+201234567890" },
                  profilePic: { type: "string", example: "https://cdn.example.com/images/john.jpg" },
                  gender: { type: "string", example: "male" },
                  dateOfBirth: { type: "string", example: "1995-08-16" }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "User updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Success" },
                    message: { type: "string", example: "Profile updated successfully" },
                    data: {
                      type: "object",
                      properties: {
                        _id: { type: "string", example: "64ff0a8c2f1b1a4d9a7c1f45" },
                        name: { type: "string", example: "John Doe" },
                        email: { type: "string", example: "johndoe@example.com" },
                        phoneNumber: { type: "string", example: "+201234567890" },
                        profilePic: { type: "string", example: "https://cdn.example.com/images/john.jpg" },
                        gender: { type: "string", example: "male" },
                        dateOfBirth: { type: "string", example: "1995-08-16" },
                        role: { type: "string", example: "user" },
                        updatedAt: { type: "string", example: "2025-08-16T14:00:00.000Z" }
                      }
                    }
                  }
                }
              }
            }
          },
          400: {
            description: "Bad Request – No fields provided for update",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Fail" },
                    message: { type: "string", example: "At least one field must be provided to update" }
                  }
                }
              }
            }
          },
          404: {
            description: "User not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Fail" },
                    message: { type: "string", example: "User not found" }
                  }
                }
              }
            }
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Error" },
                    message: { type: "string", example: "Internal server error" }
                  }
                }
              }
            }
          }
        }
      },

      delete: {
        summary: "Delete logged-in user",
        security: [{ bearerAuth: [] }],
        tags: ["Users"],
        responses: {
          200: {
            description: "User deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Success" },
                    message: { type: "string", example: "User account deleted successfully" }
                  }
                }
              }
            }
          },
          404: {
            description: "User not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Fail" },
                    message: { type: "string", example: "User not found" }
                  }
                }
              }
            }
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Error" },
                    message: { type: "string", example: "Internal server error" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/users/verify-otp": {
        post: {
          summary: "Verify OTP for email verification",
          tags: ["Users"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "otp"],
                  properties: {
                    email: { type: "string", example: "johndoe@example.com" },
                    otp: { type: "string", example: "123456" }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: "Email verified successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "Success" },
                      message: { type: "string", example: "Email verified successfully" }
                    }
                  }
                }
              }
            },
            400: {
              description: "Bad request (Invalid / expired OTP, missing fields, or already verified)",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "Fail" },
                      message: {
                        type: "string",
                        example: "Invalid or expired OTP"
                      }
                    }
                  },
                  examples: {
                    missingFields: {
                      summary: "Missing email or otp",
                      value: { status: "Fail", message: "Provide all fields" }
                    },
                    alreadyVerified: {
                      summary: "User already verified",
                      value: { status: "Fail", message: "User already verified" }
                    },
                    invalidOtp: {
                      summary: "Invalid or expired OTP",
                      value: { status: "Fail", message: "Invalid or expired OTP" }
                    }
                  }
                }
              }
            },
            404: {
              description: "User not found",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "Fail" },
                      message: { type: "string", example: "User not found" }
                    }
                  }
                }
              }
            },
            500: {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "Error" },
                      message: { type: "string", example: "Internal server error" }
                    }
                  }
                }
              }
            }
          }
        }
      },
    "/users/resend-otp": {
      post: {
        summary: "Resend OTP for email verification",
        tags: ["Users"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: { type: "string", example: "johndoe@example.com" }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "New OTP sent to email",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Success" },
                    message: { type: "string", example: "New OTP sent to email" }
                  }
                }
              }
            }
          },
          400: {
            description: "Bad request (missing email or already verified)",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Fail" },
                    message: { type: "string" }
                  }
                },
                examples: {
                  missingEmail: {
                    summary: "Missing email",
                    value: { status: "Fail", message: "Email is required" }
                  },
                  alreadyVerified: {
                    summary: "User already verified",
                    value: { status: "Fail", message: "User is already verified" }
                  }
                }
              }
            }
          },
          404: {
            description: "User not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Fail" },
                    message: { type: "string", example: "User not found" }
                  }
                }
              }
            }
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Error" },
                    message: { type: "string", example: "Internal server error" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/users/request-password-reset": {
      post: {
        summary: "Request OTP for password reset",
        tags: ["Users"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: { type: "string", example: "johndoe@example.com" }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "OTP sent for password reset",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Success" },
                    message: {
                      type: "string",
                      example: "OTP sent to email for password reset"
                    }
                  }
                }
              }
            }
          },
          400: {
            description: "Bad request (missing email)",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Fail" },
                    message: { type: "string", example: "Email is required" }
                  }
                }
              }
            }
          },
          404: {
            description: "User not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Fail" },
                    message: { type: "string", example: "User not found" }
                  }
                }
              }
            }
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Error" },
                    message: { type: "string", example: "Internal server error" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/users/reset-password": {
      post: {
        summary: "Reset password using OTP",
        tags: ["Users"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "otp", "newPassword"],
                properties: {
                  email: { type: "string", example: "johndoe@example.com" },
                  otp: { type: "string", example: "123456" },
                  newPassword: { type: "string", example: "NewStrongPassword123!" }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Password reset successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Success" },
                    message: { type: "string", example: "Password reset successfully" }
                  }
                }
              }
            }
          },
          400: {
            description: "Bad request (missing fields or invalid/expired OTP)",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Fail" },
                    message: { type: "string" }
                  }
                },
                examples: {
                  missingFields: {
                    summary: "Missing fields",
                    value: { status: "Fail", message: "Provide all fields" }
                  },
                  invalidOtp: {
                    summary: "Invalid or expired OTP",
                    value: { status: "Fail", message: "Invalid or expired OTP" }
                  }
                }
              }
            }
          },
          404: {
            description: "User not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Fail" },
                    message: { type: "string", example: "User not found" }
                  }
                }
              }
            }
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Error" },
                    message: { type: "string", example: "Internal server error" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/users/change-password": {
      post: {
        summary: "Change password for logged-in user",
        security: [{ bearerAuth: [] }],
        tags: ["Users"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["currentPassword", "newPassword", "confirmPassword"],
                properties: {
                  currentPassword: { type: "string" },
                  newPassword: { type: "string" },
                  confirmPassword: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Password changed successfully, new JWT issued"
          },
          400: {
            description:
              "Validation error (missing fields, mismatch, or incorrect current password)"
          },
          404: {
            description: "User not found"
          },
          401: {
            description: "Unauthorized (missing or invalid JWT)"
          }
        }
      }
    },
    "/users/toggle/{listingId}": {
      post: {
        summary: "Toggle favorite for a listing",
        tags: ["Users"],
        security: [{ "bearerAuth": [] }],
        parameters: [
          {
            in: "path",
            name: "listingId",
            required: true,
            schema: { "type": "string", "example": "66a8fbb83b62c40356a55c92" },
            description: "The ID of the listing to add or remove from favorites"
          }
        ],
        responses: {
          200: {
            description: "Successfully toggled favorite",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { "type": "string", "example": "Success" },
                    message: { "type": "string", "example": "Favorite toggled successfully" },
                    data: {
                      type: "object",
                      properties: {
                        favorites: {
                          type: "array",
                          items: { "type": "string", "example": "66a8fbb83b62c40356a55c92" }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          401: { "description": "Unauthorized / Not logged in" },
          403: { "description": "Forbidden / Insufficient permissions" },
          404: { "description": "Listing not found" }
        }
      }
    },
    "/users/favorites": {
      get: {
        summary: "Get all user favorites",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "List of user's favorite listings",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    favorites: {
                      type: "array",
                      items: { $ref: "#/components/schemas/List" },
                    },
                  },
                },
              },
            },
          },
          401: { description: "Unauthorized / Not logged in" },
          403: { description: "Forbidden / Insufficient permissions" },
          404: { description: "No favorites found" },
        },
      },
    },
    // ------------------- LISTS -------------------
    "/lists": {
      "get": {
        "summary": "Get listings with filters, search, sorting, and pagination",
        "tags": ["Lists"],
        "parameters": [
          {
            "name": "listings",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": ["approved", "notApproved"],
              "example": "approved"
            },
            "description": "Filter by approval status. If omitted, returns all listings."
          },
          {
            "name": "governorate",
            "in": "query",
            "schema": { "type": "string", "example": "Cairo" },
            "description": "Filter by governorate"
          },
          {
            "name": "categoryId",
            "in": "query",
            "schema": { "type": "string", "example": "64d29f..." },
            "description": "Filter by category ID"
          },
          {
            "name": "price",
            "in": "query",
            "schema": { "type": "number", "example": 150 },
            "description": "Maximum price per night"
          },
          {
            "name": "startDate",
            "in": "query",
            "schema": { "type": "string", "format": "date", "example": "2025-08-20" },
            "description": "Filter listings available from this date"
          },
          {
            "name": "endDate",
            "in": "query",
            "schema": { "type": "string", "format": "date", "example": "2025-08-25" },
            "description": "Filter listings available until this date"
          },
          {
            "name": "sort",
            "in": "query",
            "schema": { "type": "string", "example": "pricePerNight,-createdAt" },
            "description": "Sort fields (e.g., 'pricePerNight,-createdAt')"
          },
          {
            "name": "page",
            "in": "query",
            "schema": { "type": "integer", "example": 1 },
            "description": "Page number for pagination"
          },
          {
            "name": "limit",
            "in": "query",
            "schema": { "type": "integer", "example": 10 },
            "description": "Number of results per page"
          },
          {
            "name": "query",
            "in": "query",
            "schema": { "type": "string", "example": "apartment" },
            "description": "Search in title, description, or governorate"
          }
        ],
        "responses": {
          "200": {
            "description": "List of filtered listings",
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "total": 50,
                  "results": 2,
                  "data": [
                    {
                      "_id": "66ab23...",
                      "title": "Luxury Villa in Alexandria",
                      "descrption": "Spacious villa with sea view.",
                      "pricePerNight": 300,
                      "governorate": "Alexandria",
                      "categoryId": {
                        "_id": "64d29f...",
                        "name": "Villa"
                      },
                      "amenitiesId": [
                        { "_id": "64d2af...", "name": "WiFi" },
                        { "_id": "64d2b0...", "name": "Pool" }
                      ],
                      "maxGustes": 8,
                      "photos": [
                        "https://cdn.app.com/villa1.jpg",
                        "https://cdn.app.com/villa2.jpg",
                        "https://cdn.app.com/villa3.jpg",
                        "https://cdn.app.com/villa4.jpg",
                        "https://cdn.app.com/villa5.jpg"
                      ]
                    },
                    {
                      "_id": "66ab24...",
                      "title": "Budget Apartment in Giza",
                      "descrption": "Affordable stay near the pyramids.",
                      "pricePerNight": 80,
                      "governorate": "Giza",
                      "categoryId": {
                        "_id": "64d29g...",
                        "name": "Apartment"
                      },
                      "amenitiesId": [
                        { "_id": "64d2c1...", "name": "AC" }
                      ],
                      "maxGustes": 2,
                      "photos": [
                        "https://cdn.app.com/apt1.jpg",
                        "https://cdn.app.com/apt2.jpg",
                        "https://cdn.app.com/apt3.jpg",
                        "https://cdn.app.com/apt4.jpg",
                        "https://cdn.app.com/apt5.jpg"
                      ]
                    }
                  ]
                }
              }
            }
          },
          "400": {
            "description": "Invalid filter or date format",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "Invalid date format for startDate or endDate"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": "Something went wrong on the server"
                }
              }
            }
          }
        }
      },
      "post": {
        "summary": "Create a new listing",
        "tags": ["Lists"],
        "security": [{ "bearerAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "title",
                  "descrption",
                  "pricePerNight",
                  "address",
                  "longitude",
                  "latitude",
                  "maxGustes",
                  "photos",
                  "governorate"
                ],
                "properties": {
                  "title": { "type": "string", "example": "Luxury Villa in Alexandria" },
                  "descrption": { "type": "string", "example": "Spacious villa with sea view." },
                  "pricePerNight": { "type": "number", "example": 300 },
                  "categoryId": { "type": "string", "example": "64d29f..." },
                  "locationType": { "type": "string", "example": "Apartment" },
                  "address": { "type": "string", "example": "123 Nile St, Alexandria" },
                  "longitude": { "type": "number", "example": 29.9187 },
                  "latitude": { "type": "number", "example": 31.2001 },
                  "governorate": { "type": "string", "example": "Alexandria" },
                  "amenitiesId": {
                    "type": "array",
                    "items": { "type": "string", "example": "64d2af..." }
                  },
                  "maxGustes": { "type": "integer", "example": 8 },
                  "photos": {
                    "type": "array",
                    "items": { "type": "string", "example": "https://cdn.app.com/villa1.jpg" },
                    "minItems": 5,
                    "maxItems": 5
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Listing created successfully",
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "message": "Listing created successfully",
                  "data": {
                    "_id": "66ab45...",
                    "host": "64c12f...",
                    "title": "Luxury Villa in Alexandria",
                    "descrption": "Spacious villa with sea view.",
                    "pricePerNight": 300,
                    "categoryId": "64d29f...",
                    "locationType": "Apartment",
                    "location": {
                      "address": "123 Nile St, Alexandria",
                      "coordinates": {
                        "coordinates": [29.9187, 31.2001]
                      }
                    },
                    "governorate": "Alexandria",
                    "amenitiesId": ["64d2af...", "64d2b0..."],
                    "maxGustes": 8,
                    "photos": [
                      "https://cdn.app.com/villa1.jpg",
                      "https://cdn.app.com/villa2.jpg",
                      "https://cdn.app.com/villa3.jpg",
                      "https://cdn.app.com/villa4.jpg",
                      "https://cdn.app.com/villa5.jpg"
                    ],
                    "createdAt": "2025-08-16T15:30:00.000Z"
                  }
                }
              }
            }
          },
          "400": {
            "description": "Validation error",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "All required fields must be provided"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": "Something went wrong on the server"
                }
              }
            }
          }
        }
      }
    },
    "/lists/governorate/{governorate}": {
      "get": {
        "summary": "Get listings by governorate",
        "tags": ["Lists"],
        "parameters": [
          {
            "name": "governorate",
            "in": "path",
            "required": true,
            "schema": { "type": "string" },
            "description": "Name of the Egyptian governorate to filter listings by",
            "example": "Cairo"
          }
        ],
        "responses": {
          "200": {
            "description": "Listings retrieved successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": { "type": "string", "example": "success" },
                    "results": { "type": "integer", "example": 2 },
                    "data": {
                      "type": "array",
                      "items": { "$ref": "#/components/schemas/Listing" }
                    }
                  }
                },
                "example": {
                  "status": "success",
                  "results": 2,
                  "data": [
                    {
                      "_id": "66ab23...",
                      "title": "Cozy Apartment in Cairo",
                      "descrption": "A nice place near the Nile River.",
                      "pricePerNight": 120,
                      "governorate": "Cairo",
                      "categoryId": {
                        "_id": "64d29f...",
                        "name": "Apartment"
                      },
                      "amenitiesId": [
                        { "_id": "64d2af...", "name": "WiFi" },
                        { "_id": "64d2b0...", "name": "Air Conditioning" }
                      ],
                      "maxGustes": 3,
                      "photos": [
                        "https://cdn.app.com/cairo1.jpg",
                        "https://cdn.app.com/cairo2.jpg",
                        "https://cdn.app.com/cairo3.jpg",
                        "https://cdn.app.com/cairo4.jpg",
                        "https://cdn.app.com/cairo5.jpg"
                      ]
                    },
                    {
                      "_id": "66ab24...",
                      "title": "Modern Studio in Cairo",
                      "descrption": "Stylish studio apartment in downtown Cairo.",
                      "pricePerNight": 90,
                      "governorate": "Cairo",
                      "categoryId": {
                        "_id": "64d29g...",
                        "name": "Studio"
                      },
                      "amenitiesId": [
                        { "_id": "64d2c1...", "name": "Elevator" }
                      ],
                      "maxGustes": 2,
                      "photos": [
                        "https://cdn.app.com/studio1.jpg",
                        "https://cdn.app.com/studio2.jpg",
                        "https://cdn.app.com/studio3.jpg",
                        "https://cdn.app.com/studio4.jpg",
                        "https://cdn.app.com/studio5.jpg"
                      ]
                    }
                  ]
                }
              }
            }
          },
          "404": {
            "description": "No listings found for this governorate",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "No listings found for governorate Cairo"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": "Something went wrong on the server"
                }
              }
            }
          }
        }
      }
    },
    "/lists/{id}": {
      "get": {
        "summary": "Get list by ID",
        "tags": ["Lists"],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": { "type": "string" }
          }
        ],
        "responses": {
          "200": {
            "description": "List retrieved successfully",
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "data": {
                    "_id": "66ab23...",
                    "title": "Cozy Apartment in Cairo",
                    "descrption": "A nice place near the Nile River.",
                    "pricePerNight": 120,
                    "governorate": "Cairo",
                    "categoryId": {
                      "_id": "64d29f...",
                      "name": "Apartment"
                    },
                    "amenitiesId": [
                      { "_id": "64d2af...", "name": "WiFi" },
                      { "_id": "64d2b0...", "name": "Air Conditioning" }
                    ],
                    "maxGustes": 3,
                    "photos": [
                      "https://cdn.app.com/cairo1.jpg",
                      "https://cdn.app.com/cairo2.jpg",
                      "https://cdn.app.com/cairo3.jpg",
                      "https://cdn.app.com/cairo4.jpg",
                      "https://cdn.app.com/cairo5.jpg"
                    ]
                  }
                }
              }
            }
          },
          "404": {
            "description": "List not found",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "List with ID 66ab99... not found"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": "Something went wrong on the server"
                }
              }
            }
          }
        }
      },
      "patch": {
        "summary": "Update a list (only by host)",
        "security": [{ "bearerAuth": [] }],
        "tags": ["Lists"],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": { "type": "string" }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "multipart/form-data": {
              "schema": {
                "type": "object",
                "properties": {
                  "title": { "type": "string" },
                  "descrption": { "type": "string" },
                  "pricePerNight": { "type": "number" },
                  "categoryId": { "type": "string" },
                  "locationType": { "type": "string" },
                  "address": { "type": "string", "description": "Address of the listing" },
                  "longitude": { "type": "number", "format": "float", "description": "Longitude for location" },
                  "latitude": { "type": "number", "format": "float", "description": "Latitude for location" },
                  "maxGustes": { "type": "integer", "description": "Maximum guests allowed" },
                  "amenitiesId": {
                    "type": "array",
                    "items": { "type": "string" },
                    "description": "Array of amenity IDs"
                  },
                  "photos": {
                    "type": "array",
                    "items": { "type": "string", "format": "binary" },
                    "description": "Optional new photo uploads"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Listing updated successfully",
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "message": "Listing updated successfully",
                  "data": {
                    "_id": "66ab23...",
                    "title": "Updated Apartment Title",
                    "descrption": "Updated description",
                    "pricePerNight": 150,
                    "governorate": "Cairo",
                    "maxGustes": 4
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad request or empty body",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "Request body cannot be empty"
                }
              }
            }
          },
          "403": {
            "description": "User not authorized to update this listing",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "You are not authorized to update this listing"
                }
              }
            }
          },
          "404": {
            "description": "List not found",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "List with ID 66ab99... not found"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": "Something went wrong on the server"
                }
              }
            }
          }
        }
      },
      "delete": {
        "summary": "Delete a list (only by host)",
        "security": [{ "bearerAuth": [] }],
        "tags": ["Lists"],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": { "type": "string" }
          }
        ],
        "responses": {
          "200": {
            "description": "List deleted successfully",
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "message": "Listing deleted successfully"
                }
              }
            }
          },
          "403": {
            "description": "Cannot delete this list",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "You are not authorized to delete this listing"
                }
              }
            }
          },
          "404": {
            "description": "List not found",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "List with ID 66ab99... not found"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": "Something went wrong on the server"
                }
              }
            }
          }
        }
      }
    },
    "/lists/search": {
      "get": {
        "summary": "Search lists by keyword (title, description, governorate)",
        "tags": ["Lists"],
        "parameters": [
          {
            "name": "query",
            "in": "query",
            "required": true,
            "schema": { "type": "string", "minLength": 3 },
            "description": "Search keyword (min 3 characters)"
          },
          {
            "name": "page",
            "in": "query",
            "schema": { "type": "integer", "default": 1 },
            "description": "Page number for pagination"
          },
          {
            "name": "limit",
            "in": "query",
            "schema": { "type": "integer", "default": 10 },
            "description": "Number of items per page"
          }
        ],
        "responses": {
          "200": {
            "description": "Search results returned successfully",
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "results": 2,
                  "page": 1,
                  "limit": 10,
                  "data": [
                    {
                      "_id": "66ab23...",
                      "title": "Cozy Apartment in Cairo",
                      "description": "Beautiful 2-bedroom apartment near downtown",
                      "pricePerNight": 100,
                      "governorate": "Cairo",
                      "maxGustes": 3
                    },
                    {
                      "_id": "66ab24...",
                      "title": "Luxury Villa in Giza",
                      "description": "Spacious villa with pool and garden",
                      "pricePerNight": 400,
                      "governorate": "Giza",
                      "maxGustes": 8
                    }
                  ]
                }
              }
            }
          },
          "400": {
            "description": "Invalid query (too short or missing)",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "You must enter at least 3 characters"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": "Something went wrong on the server"
                }
              }
            }
          }
        }
      }
    },
    "/lists/{id}/approve": {
      "patch": {
        "summary": "Approve a listing (admin only)",
        "security": [{ "bearerAuth": [] }],
        "tags": ["Lists"],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": { "type": "string" },
            "description": "The ID of the listing to approve"
          }
        ],
        "responses": {
          "200": {
            "description": "Listing approved successfully",
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "message": "Listing approved successfully",
                  "data": {
                    "_id": "66ac12...",
                    "title": "Modern Apartment in Cairo",
                    "description": "2-bedroom furnished apartment near metro",
                    "pricePerNight": 120,
                    "governorate": "Cairo",
                    "isApproved": true,
                    "host": "66aa99..."
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad request (ID missing)",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "Listing ID is required"
                }
              }
            }
          },
          "404": {
            "description": "Listing not found",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "Listing not found"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "Internal Server Error"
                }
              }
            }
          }
        }
      }
    },
    "/hostlists": {
      "get": {
        "summary": "Get all listings for the logged-in host",
        "tags": ["Lists"],
        "security": [{ "bearerAuth": [] }],
        "responses": {
          "200": {
            "description": "Listings retrieved successfully",
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "results": 2,
                  "lists": [
                    {
                      "_id": "66ac12...",
                      "title": "Modern Apartment in Cairo",
                      "description": "2-bedroom furnished apartment near metro",
                      "pricePerNight": 120,
                      "categoryId": {
                        "_id": "66ab11...",
                        "name": "Apartments"
                      },
                      "host": "66aa99..."
                    }
                  ]
                }
              }
            }
          },
          "404": {
            "description": "No listings found for this host",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "No listings found for this host"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized (not logged in)",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "Authentication required"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "Internal Server Error"
                }
              }
            }
          }
        }
      }
    },
    // ------------------- RATINGS -------------------
    "/ratings": {
      "get": {
        "summary": "Get all ratings submitted by the current user",
        "security": [{ "bearerAuth": [] }],
        "tags": ["Ratings"],
        "parameters": [],
        "responses": {
          "200": {
            "description": "List of ratings for the user",
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "results": 2,
                  "data": [
                    {
                      "_id": "66ad12...",
                      "listingId": {
                        "_id": "66ac34...",
                        "title": "Modern Apartment in Cairo"
                      },
                      "guestId": {
                        "_id": "66aa99...",
                        "userName": "JohnDoe"
                      },
                      "rating": 4.5,
                      "comment": "Very clean and convenient location",
                      "createdAt": "2025-08-16T12:00:00.000Z"
                    },
                    {
                      "_id": "66ad13...",
                      "listingId": {
                        "_id": "66ac35...",
                        "title": "Luxury Villa in Giza"
                      },
                      "guestId": {
                        "_id": "66aa99...",
                        "userName": "JohnDoe"
                      },
                      "rating": 5,
                      "comment": "Amazing stay with a beautiful pool",
                      "createdAt": "2025-08-15T15:30:00.000Z"
                    }
                  ]
                }
              }
            }
          },
          "404": {
            "description": "User has no ratings",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "No ratings found for this user"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": "Something went wrong on the server"
                }
              }
            }
          }
        }
      }
    },
    "/ratings/{bookingId}": {
      "post": {
        "summary": "Submit a rating for a booking (guest only, after checkout)",
        "security": [{ "bearerAuth": [] }],
        "tags": ["Ratings"],
        "parameters": [
          {
            "name": "bookingId",
            "in": "path",
            "required": true,
            "schema": { "type": "string" },
            "description": "ID of the booking to rate"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["rating"],
                "properties": {
                  "rating": { "type": "number", "minimum": 1, "maximum": 5 },
                  "comment": { "type": "string" }
                }
              },
              "example": {
                "rating": 5,
                "comment": "Amazing stay, highly recommended!"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Rating submitted successfully",
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "message": "Rating submitted successfully",
                  "data": {
                    "_id": "66ad45...",
                    "bookingId": "66ac99...",
                    "guestId": "66aa99...",
                    "rating": 5,
                    "comment": "Amazing stay, highly recommended!",
                    "createdAt": "2025-08-16T12:30:00.000Z"
                  }
                }
              }
            }
          },
          "400": {
            "description": "Already rated, missing fields, or guest hasn’t checked out yet",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "You have already rated this booking"
                }
              }
            }
          },
          "403": {
            "description": "Unauthorized or booking not associated with user",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "You are not allowed to rate this booking"
                }
              }
            }
          },
          "404": {
            "description": "Booking not found",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "Booking with ID 66ac99... not found"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": "Something went wrong on the server"
                }
              }
            }
          }
        }
      }
    },
    "/ratings/listing/{listingId}": {
      "get": {
        "summary": "Get all ratings for a specific listing",
        "security": [{ "bearerAuth": [] }],
        "tags": ["Ratings"],
        "parameters": [
          {
            "name": "listingId",
            "in": "path",
            "required": true,
            "schema": { "type": "string" },
            "description": "ID of the listing to fetch ratings for"
          }
        ],
        "responses": {
          "200": {
            "description": "List of ratings for the listing",
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "results": 3,
                  "data": [
                    {
                      "_id": "66ad45...",
                      "bookingId": "66ac99...",
                      "guestId": {
                        "_id": "66aa99...",
                        "userName": "JohnDoe"
                      },
                      "rating": 5,
                      "comment": "Amazing stay!",
                      "createdAt": "2025-08-16T12:30:00.000Z"
                    },
                    {
                      "_id": "66ad46...",
                      "bookingId": "66ac98...",
                      "guestId": {
                        "_id": "66aa98...",
                        "userName": "JaneSmith"
                      },
                      "rating": 4,
                      "comment": "Very clean and convenient",
                      "createdAt": "2025-08-15T14:20:00.000Z"
                    },
                    {
                      "_id": "66ad47...",
                      "bookingId": "66ac97...",
                      "guestId": {
                        "_id": "66aa97...",
                        "userName": "AliceW"
                      },
                      "rating": 3,
                      "comment": "Good but noisy neighborhood",
                      "createdAt": "2025-08-14T09:15:00.000Z"
                    }
                  ]
                }
              }
            }
          },
          "400": {
            "description": "Missing listingId",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "Listing ID is required"
                }
              }
            }
          },
          "404": {
            "description": "Listing not found or no ratings",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "No ratings found for this listing"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": "Something went wrong on the server"
                }
              }
            }
          }
        }
      }
    },
    "/ratings/{ratingId}": {
      "patch": {
        "summary": "Edit an existing rating",
        "security": [{ "bearerAuth": [] }],
        "tags": ["Ratings"],
        "parameters": [
          {
            "name": "ratingId",
            "in": "path",
            "required": true,
            "schema": { "type": "string" },
            "description": "ID of the rating to update"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "rating": { "type": "number", "minimum": 1, "maximum": 5 },
                  "comment": { "type": "string" }
                }
              },
              "example": {
                "rating": 4,
                "comment": "Updated comment: Very clean and convenient location"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Rating updated successfully",
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "message": "Rating updated successfully",
                  "data": {
                    "_id": "66ad45...",
                    "bookingId": "66ac99...",
                    "guestId": "66aa99...",
                    "rating": 4,
                    "comment": "Updated comment: Very clean and convenient location",
                    "updatedAt": "2025-08-16T15:00:00.000Z"
                  }
                }
              }
            }
          },
          "400": {
            "description": "Missing ratingId or no update data",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "No update data provided"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "Internal Server Error"
                }
              }
            }
          }
        }
      },
      "delete": {
        "summary": "Delete an existing rating",
        "security": [{ "bearerAuth": [] }],
        "tags": ["Ratings"],
        "parameters": [
          {
            "name": "ratingId",
            "in": "path",
            "required": true,
            "schema": { "type": "string" },
            "description": "ID of the rating to delete"
          }
        ],
        "responses": {
          "200": {
            "description": "Rating deleted successfully",
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "message": "Rating deleted successfully"
                }
              }
            }
          },
          "400": {
            "description": "Missing ratingId",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "Rating ID is required"
                }
              }
            }
          },
          "404": {
            "description": "Rating or listing not found",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "Rating not found"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "Internal Server Error"
                }
              }
            }
          }
        }
      }
    },
    // ------------------- CATEGORIES -------------------
    "/categories": {
      "post": {
        "summary": "Create a new category (admin only)",
        "security": [{ "bearerAuth": [] }],
        "tags": ["Categories"],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["name"],
                "properties": {
                  "name": { "type": "string", "example": "Villa" }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Category created successfully",
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "message": "Category created successfully",
                  "data": {
                    "_id": "64d29fabc123...",
                    "name": "Villa",
                    "createdAt": "2025-08-16T15:30:00.000Z",
                    "updatedAt": "2025-08-16T15:30:00.000Z"
                  }
                }
              }
            }
          },
          "400": {
            "description": "Validation error",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "Category name is required or already exists"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": "Something went wrong on the server"
                }
              }
            }
          }
        }
      },
      "get": {
        "summary": "Get all categories (admin only)",
        "security": [{ "bearerAuth": [] }],
        "tags": ["Categories"],
        "responses": {
          "200": {
            "description": "List of categories",
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "results": 3,
                  "data": [
                    { "_id": "64d29fabc123...", "name": "Villa" },
                    { "_id": "64d2a0def456...", "name": "Apartment" },
                    { "_id": "64d2a1ghi789...", "name": "Studio" }
                  ]
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": "Something went wrong on the server"
                }
              }
            }
          }
        }
      }
    },
    "/categories/{id}": {
      "patch": {
        "summary": "Update a category (admin only)",
        "security": [{ "bearerAuth": [] }],
        "tags": ["Categories"],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": { "type": "string" },
            "description": "ID of the category to update"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["name"],
                "properties": {
                  "name": { "type": "string", "example": "Luxury Villa" }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Category updated successfully",
            "content": {
              "application/json": {
                "example": {
                  "status": "Success",
                  "message": "Category Updated Successfully",
                  "category": {
                    "_id": "64d29fabc123...",
                    "name": "Luxury Villa",
                    "updatedAt": "2025-08-16T16:00:00.000Z"
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad request",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "Id of Category Is Required"
                }
              }
            }
          },
          "404": {
            "description": "Category not found",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "Category Not Found"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": "Something went wrong on the server"
                }
              }
            }
          }
        }
      },
      "delete": {
        "summary": "Delete a category (admin only)",
        "security": [{ "bearerAuth": [] }],
        "tags": ["Categories"],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": { "type": "string" },
            "description": "ID of the category to delete"
          }
        ],
        "responses": {
          "200": {
            "description": "Category deleted successfully",
            "content": {
              "application/json": {
                "example": {
                  "status": "Success",
                  "message": "Category Deleted Successfully"
                }
              }
            }
          },
          "400": {
            "description": "Bad request",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "Id of Category Is Required"
                }
              }
            }
          },
          "404": {
            "description": "Category not found",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "Category Not Found"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": "Something went wrong on the server"
                }
              }
            }
          }
        }
      }
    },
    // ------------------- Booking -------------------
    "/checkout-session/{listId}": {
      "post": {
        "summary": "Create a Stripe checkout session for a listing",
        "tags": ["Bookings"],
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          {
            "name": "listId",
            "in": "path",
            "required": true,
            "schema": { "type": "string" },
            "description": "ID of the listing to book"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["checkIn", "checkOut"],
                "properties": {
                  "checkIn": { "type": "string", "format": "date", "example": "2025-09-01" },
                  "checkOut": { "type": "string", "format": "date", "example": "2025-09-05" }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Stripe checkout session created successfully",
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "session": {
                    "id": "cs_test_1234567890",
                    "object": "checkout.session",
                    "client_reference_id": "64d29f123456...",
                    "customer_email": "guest@example.com",
                    "line_items": [
                      {
                        "price_data": {
                          "currency": "usd",
                          "unit_amount": 50000,
                          "product_data": {
                            "name": "Luxury Villa in Alexandria",
                            "description": "Spacious villa with sea view.",
                            "images": ["https://cdn.app.com/villa1.jpg"]
                          }
                        },
                        "quantity": 1
                      }
                    ],
                    "metadata": {
                      "checkIn": "2025-09-01T00:00:00.000Z",
                      "checkOut": "2025-09-05T23:59:59.999Z",
                      "totalPrice": 500
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad request, invalid dates or incomplete booking details",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "Check-in and check-out dates are required"
                }
              }
            }
          },
          "403": {
            "description": "Unauthorized user role",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "You must be a guest to book a list"
                }
              }
            }
          },
          "404": {
            "description": "Listing not found",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "Can't find list"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": "Failed to create checkout session"
                }
              }
            }
          }
        }
      }
    },
    "/guest": {
      "get": {
        "summary": "Get all bookings for the current guest (or by admin for a guest)",
        "tags": ["Bookings"],
        "security": [{ "bearerAuth": [] }],
        "parameters": [],
        "responses": {
          "200": {
            "description": "List of bookings for the guest",
            "content": {
              "application/json": {
                "example": {
                  "status": "Success",
                  "results": 2,
                  "data": [
                    {
                      "_id": "64f9a123abc456def7890123",
                      "guest": "64f9a456def7890123456789",
                      "listing": {
                        "_id": "66ab23f7890abcd123456789",
                        "title": "Luxury Villa in Alexandria",
                        "descrption": "Spacious villa with sea view.",
                        "pricePerNight": 300,
                        "governorate": "Alexandria",
                        "photos": [
                          "https://cdn.app.com/villa1.jpg",
                          "https://cdn.app.com/villa2.jpg"
                        ]
                      },
                      "checkIn": "2025-09-01T00:00:00.000Z",
                      "checkOut": "2025-09-05T23:59:59.999Z",
                      "totalPrice": 1200,
                      "createdAt": "2025-08-16T15:30:00.000Z",
                      "updatedAt": "2025-08-16T15:30:00.000Z"
                    },
                    {
                      "_id": "64f9a234abc456def7890124",
                      "guest": "64f9a456def7890123456789",
                      "listing": {
                        "_id": "66ab24f7890abcd123456780",
                        "title": "Budget Apartment in Giza",
                        "descrption": "Affordable stay near the pyramids.",
                        "pricePerNight": 80,
                        "governorate": "Giza",
                        "photos": [
                          "https://cdn.app.com/apt1.jpg",
                          "https://cdn.app.com/apt2.jpg"
                        ]
                      },
                      "checkIn": "2025-09-10T00:00:00.000Z",
                      "checkOut": "2025-09-12T23:59:59.999Z",
                      "totalPrice": 160,
                      "createdAt": "2025-08-16T15:32:00.000Z",
                      "updatedAt": "2025-08-16T15:32:00.000Z"
                    }
                  ]
                }
              }
            }
          },
          "403": {
            "description": "User not authorized",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "You are not authorized to view these bookings"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": "Something went wrong on the server"
                }
              }
            }
          }
        }
      }
    },
    "/host": {
      "get": {
        "summary": "Get all bookings for listings owned by the current host (or by admin for a host)",
        "tags": ["Bookings"],
        "security": [{ "bearerAuth": [] }],
        "parameters": [],
        "responses": {
          "200": {
            "description": "List of bookings for the host's listings",
            "content": {
              "application/json": {
                "example": {
                  "status": "Success",
                  "results": 2,
                  "data": [
                    {
                      "_id": "64f9b123abc456def7890123",
                      "guest": {
                        "_id": "64f9a456def7890123456789",
                        "name": "John Doe",
                        "email": "johndoe@example.com"
                      },
                      "listing": {
                        "_id": "66ab23f7890abcd123456789",
                        "title": "Luxury Villa in Alexandria",
                        "location": "Alexandria"
                      },
                      "checkIn": "2025-09-01T00:00:00.000Z",
                      "checkOut": "2025-09-05T23:59:59.999Z",
                      "totalPrice": 1200,
                      "createdAt": "2025-08-16T15:30:00.000Z",
                      "updatedAt": "2025-08-16T15:30:00.000Z"
                    },
                    {
                      "_id": "64f9b234abc456def7890124",
                      "guest": {
                        "_id": "64f9a457def7890123456790",
                        "name": "Jane Smith",
                        "email": "janesmith@example.com"
                      },
                      "listing": {
                        "_id": "66ab24f7890abcd123456780",
                        "title": "Budget Apartment in Giza",
                        "location": "Giza"
                      },
                      "checkIn": "2025-09-10T00:00:00.000Z",
                      "checkOut": "2025-09-12T23:59:59.999Z",
                      "totalPrice": 160,
                      "createdAt": "2025-08-16T15:32:00.000Z",
                      "updatedAt": "2025-08-16T15:32:00.000Z"
                    }
                  ]
                }
              }
            }
          },
          "403": {
            "description": "User not authorized",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "You are not authorized to view these bookings"
                }
              }
            }
          },
          "404": {
            "description": "No bookings found for the host",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "You do not have any bookings"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": "Something went wrong on the server"
                }
              }
            }
          }
        }
      }
    },
    "/host/{listingId}": {
      "get": {
        "summary": "Get all bookings for a specific listing (host or admin only)",
        "tags": ["Bookings"],
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          {
            "name": "listingId",
            "in": "path",
            "required": true,
            "schema": { "type": "string" },
            "description": "ID of the listing to fetch bookings for"
          }
        ],
        "responses": {
          "200": {
            "description": "List of bookings for the specified listing",
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "results": 2,
                  "bookings": [
                    {
                      "_id": "64f9b123abc456def7890123",
                      "guest": {
                        "_id": "64f9a456def7890123456789",
                        "name": "John Doe",
                        "email": "johndoe@example.com"
                      },
                      "listing": {
                        "_id": "66ab23f7890abcd123456789",
                        "title": "Luxury Villa in Alexandria",
                        "location": "Alexandria"
                      },
                      "checkIn": "2025-09-01T00:00:00.000Z",
                      "checkOut": "2025-09-05T23:59:59.999Z",
                      "totalPrice": 1200,
                      "createdAt": "2025-08-16T15:30:00.000Z",
                      "updatedAt": "2025-08-16T15:30:00.000Z"
                    },
                    {
                      "_id": "64f9b234abc456def7890124",
                      "guest": {
                        "_id": "64f9a457def7890123456790",
                        "name": "Jane Smith",
                        "email": "janesmith@example.com"
                      },
                      "listing": {
                        "_id": "66ab23f7890abcd123456789",
                        "title": "Luxury Villa in Alexandria",
                        "location": "Alexandria"
                      },
                      "checkIn": "2025-09-10T00:00:00.000Z",
                      "checkOut": "2025-09-12T23:59:59.999Z",
                      "totalPrice": 160,
                      "createdAt": "2025-08-16T15:32:00.000Z",
                      "updatedAt": "2025-08-16T15:32:00.000Z"
                    }
                  ]
                }
              }
            }
          },
          "400": {
            "description": "Missing listingId",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "Listing ID is required"
                }
              }
            }
          },
          "403": {
            "description": "Unauthorized access",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "You are not authorized to view these bookings"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": "Something went wrong on the server"
                }
              }
            }
          }
        }
      }
    },
    "/bookings/{listingId}": {
      "post": {
        "summary": "Create a new booking for a listing (guest or admin only)",
        "tags": ["Bookings"],
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          {
            "name": "listingId",
            "in": "path",
            "required": true,
            "schema": { "type": "string" },
            "description": "ID of the listing to book"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["checkIn", "checkOut", "paymentMethod"],
                "properties": {
                  "checkIn": { "type": "string", "format": "date", "example": "2025-09-01" },
                  "checkOut": { "type": "string", "format": "date", "example": "2025-09-05" },
                  "paymentMethod": { "type": "string", "example": "stripe" }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Booking created successfully",
            "content": {
              "application/json": {
                "example": {
                  "status": "Success",
                  "message": "Booking Created",
                  "data": {
                    "_id": "64f9b123abc456def7890123",
                    "guest": "64f9a456def7890123456789",
                    "listing": "66ab23f7890abcd123456789",
                    "checkIn": "2025-09-01T00:00:00.000Z",
                    "checkOut": "2025-09-05T23:59:59.999Z",
                    "totalPrice": 1200,
                    "paymentMethod": "stripe",
                    "createdAt": "2025-08-16T16:00:00.000Z",
                    "updatedAt": "2025-08-16T16:00:00.000Z"
                  }
                }
              }
            }
          },
          "400": {
            "description": "Missing fields or date conflict",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "Provide all required fields"
                }
              }
            }
          },
          "403": {
            "description": "Unauthorized access (not a guest)",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "You must be a guest to book a list"
                }
              }
            }
          },
          "404": {
            "description": "Listing not found",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "Listing not found"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": "Something went wrong on the server"
                }
              }
            }
          }
        }
      }
    },
    "/bookings/{bookingId}": {
      "get": {
        "summary": "Get booking by ID (guest or admin only)",
        "tags": ["Bookings"],
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          {
            "name": "bookingId",
            "in": "path",
            "required": true,
            "schema": { "type": "string" },
            "description": "ID of the booking"
          }
        ],
        "responses": {
          "200": {
            "description": "Booking retrieved successfully",
            "content": {
              "application/json": {
                "example": {
                  "status": "Success",
                  "data": {
                    "_id": "64f9b123abc456def7890123",
                    "guest": "64f9a456def7890123456789",
                    "listing": "66ab23f7890abcd123456789",
                    "checkIn": "2025-09-01T00:00:00.000Z",
                    "checkOut": "2025-09-05T23:59:59.999Z",
                    "totalPrice": 1200,
                    "paymentMethod": "stripe",
                    "createdAt": "2025-08-16T16:00:00.000Z",
                    "updatedAt": "2025-08-16T16:00:00.000Z"
                  }
                }
              }
            }
          },
          "400": { "description": "Booking ID is missing" },
          "403": { "description": "Unauthorized access" },
          "404": { "description": "Booking not found" },
          "500": { "description": "Internal server error" }
        }
      },
      "patch": {
        "summary": "Update booking details (guest or admin only)",
        "tags": ["Bookings"],
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          {
            "name": "bookingId",
            "in": "path",
            "required": true,
            "schema": { "type": "string" },
            "description": "ID of the booking to update"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "checkIn": { "type": "string", "format": "date" },
                  "checkOut": { "type": "string", "format": "date" },
                  "paymentMethod": { "type": "string" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Booking updated successfully" },
          "400": { "description": "Missing bookingId or invalid dates" },
          "403": { "description": "Unauthorized update attempt" },
          "404": { "description": "Booking or listing not found" },
          "500": { "description": "Internal server error" }
        }
      },
      "delete": {
        "summary": "Delete a booking (guest or admin only)",
        "tags": ["Bookings"],
        "security": [{ "bearerAuth": [] }],
        "parameters": [
          {
            "name": "bookingId",
            "in": "path",
            "required": true,
            "schema": { "type": "string" },
            "description": "ID of the booking to delete"
          }
        ],
        "responses": {
          "200": {
            "description": "Booking deleted successfully",
            "content": {
              "application/json": {
                "example": {
                  "status": "Success",
                  "message": "Booking and related dates removed successfully"
                }
              }
            }
          },
          "400": { "description": "Booking ID is missing" },
          "403": { "description": "Unauthorized delete attempt" },
          "404": { "description": "Booking not found" },
          "500": { "description": "Internal server error" }
        }
      }
    },
    // ------------------- Amenities -------------------
    "/amenities": {
      "post": {
        "summary": "Create a new amenity (admin only)",
        "security": [{ "bearerAuth": [] }],
        "tags": ["Amenities"],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["name", "icon"],
                "properties": {
                  "name": { "type": "string", "example": "WiFi" },
                  "icon": { "type": "string", "example": "wifi-icon.png" }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Amenity created successfully",
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "message": "Amenity created successfully",
                  "data": {
                    "_id": "64d2af123456...",
                    "name": "WiFi",
                    "icon": "wifi-icon.png",
                    "createdAt": "2025-08-16T16:00:00.000Z",
                    "updatedAt": "2025-08-16T16:00:00.000Z"
                  }
                }
              }
            }
          },
          "400": {
            "description": "Validation error",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "Amenity name is required"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "Internal Server Error"
                }
              }
            }
          }
        }
      },
      "get": {
        "summary": "Get all amenities (admin only)",
        "security": [{ "bearerAuth": [] }],
        "tags": ["Amenities"],
        "responses": {
          "200": {
            "description": "List of amenities",
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "data": [
                    {
                      "_id": "64d2af123456...",
                      "name": "WiFi",
                      "icon": "wifi-icon.png"
                    },
                    {
                      "_id": "64d2b0123456...",
                      "name": "Pool",
                      "icon": "pool-icon.png"
                    }
                  ]
                }
              }
            }
          },
          "404": {
            "description": "No amenities found",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "No amenities found"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "Internal Server Error"
                }
              }
            }
          }
        }
      }
    },
    "/amenities/{id}": {
      "patch": {
        "summary": "Update an amenity (admin only)",
        "security": [{ "bearerAuth": [] }],
        "tags": ["Amenities"],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": { "type": "string" },
            "description": "Amenity ID"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": { "type": "string", "example": "WiFi" },
                  "icon": { "type": "string", "example": "wifi-icon.png" }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Amenity updated successfully",
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "message": "Amenity updated successfully",
                  "data": {
                    "_id": "64d2af123456...",
                    "name": "WiFi",
                    "icon": "wifi-icon-updated.png",
                    "createdAt": "2025-08-16T16:00:00.000Z",
                    "updatedAt": "2025-08-16T17:00:00.000Z"
                  }
                }
              }
            }
          },
          "400": {
            "description": "Missing amenity ID",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "Amenity ID is required"
                }
              }
            }
          },
          "404": {
            "description": "Amenity not found",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "Amenity not found"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "Internal Server Error"
                }
              }
            }
          }
        }
      },
      "delete": {
        "summary": "Delete an amenity (admin only)",
        "security": [{ "bearerAuth": [] }],
        "tags": ["Amenities"],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": { "type": "string" },
            "description": "Amenity ID"
          }
        ],
        "responses": {
          "200": {
            "description": "Amenity deleted successfully",
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "message": "Amenity deleted successfully"
                }
              }
            }
          },
          "400": {
            "description": "Missing amenity ID",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "Amenity ID is required"
                }
              }
            }
          },
          "404": {
            "description": "Amenity not found",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "Amenity not found"
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "Internal Server Error"
                }
              }
            }
          }
        }
      }
    },
    // ------------------- RAG Chatbot -------------------
    "/chat-model/upload": {
      "post": {
        "summary": "Upload documents for embedding and storage",
        "tags": ["RAG Chatbot"],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["documents"],
                "properties": {
                  "documents": {
                    "type": "array",
                    "items": { "type": "string" },
                    "example": [
                      "Maskan is a web app for booking rental properties in Egypt.",
                      "It allows hosts to list their properties and guests to book them."
                    ]
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Documents uploaded and indexed successfully",
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "message": "2 documents uploaded and indexed successfully"
                }
              }
            }
          },
          "400": {
            "description": "Invalid input",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "documents must be an array"
                }
              }
            }
          },
          "500": {
            "description": "Failed to upload documents",
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": "Failed to upload documents"
                }
              }
            }
          }
        }
      }
    },
    "/chat-model/query": {
      "post": {
        "summary": "Ask a question using the RAG assistant",
        "tags": ["RAG Chatbot"],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["question"],
                "properties": {
                  "question": {
                    "type": "string",
                    "example": "What does Maskan app do?"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "AI-generated answer",
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "answer": "Maskan is a web application that allows users to book rental properties in Egypt, where hosts can list properties and guests can make bookings."
                }
              }
            }
          },
          "400": {
            "description": "Missing question",
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": "question is required"
                }
              }
            }
          },
          "500": {
            "description": "Failed to process query",
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": "Failed to process query"
                }
              }
            }
          }
        }
      }
    }
  },
};

const options = {
  definition: swaggerDefinition,
  apis: [path.resolve(__dirname, "../routes/*.js")],
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
