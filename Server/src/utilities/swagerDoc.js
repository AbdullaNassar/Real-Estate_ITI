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
    title: "Maskan",
    version: "1.0.0",
    description: "API documentation for Maskan project",
  },
  servers: [
    {
      url: process.env.SWAGGER_URL,
      description: "Deployment server",
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
      "name": "Auth",
      "description": "User management including authentication, profile, and security operations"
    },
    {
      "name": "Users",
      "description": "Operations related to user accounts and profiles"
    },
    {
      "name": "Lists",
      "description": "Manage property listings including creation, update, and approval"
    },
    {
      "name": "Ratings",
      "description": "Submit, edit, and view ratings and reviews for bookings and listings"
    },
    {
      "name": "Categories",
      "description": "Manage property categories (admin only)"
    },
    {
      "name": "Amenities",
      "description": "Manage amenities available for listings (admin only)"
    },
    {
      "name": "Bookings",
      "description": "Create, update, and manage guest bookings for listings"
    },
    {
      "name": "RAG Chatbot",
      "description": "Upload documents and query the AI-powered RAG assistant"
    }
  ],
  paths: {
    //-------------------- AUTH --------------------
    "/users/signup": {
      "post": {
        "summary": "Sign up a new user",
        "tags": ["Auth"],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["userName", "email", "password", "confirmPassword"],
                "properties": {
                  "userName": { "type": "string", "example": "JohnDoe" },
                  "email": { "type": "string", "example": "john@example.com" },
                  "password": { "type": "string", "example": "Password123!" },
                  "confirmPassword": { "type": "string", "example": "Password123!" },
                  "role": {
                    "type": "string",
                    "enum": ["guest", "host"],
                    "example": "guest"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": { "en": "User created successfully, OTP sent to email", "ar": "تم إنشاء المستخدم بنجاح، تم إرسال رمز التحقق إلى البريد الإلكتروني" },
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "message": {
                    "en": "User created successfully, OTP sent to email",
                    "ar": "تم إنشاء المستخدم بنجاح، تم إرسال رمز التحقق إلى البريد الإلكتروني"
                  },
                  "data": {
                    "userName": "JohnDoe",
                    "email": "john@example.com",
                    "role": "guest"
                  }
                }
              }
            }
          },
          "400": {
            "description": { "en": "Missing fields or password mismatch", "ar": "الحقول مفقودة أو كلمات المرور غير متطابقة" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": {
                    "en": "Missing fields or password mismatch",
                    "ar": "الحقول مفقودة أو كلمات المرور غير متطابقة"
                  }
                }
              }
            }
          },
          "409": {
            "description": { "en": "User already exists", "ar": "المستخدم موجود مسبقًا" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": {
                    "en": "User already exists",
                    "ar": "المستخدم موجود مسبقًا"
                  }
                }
              }
            }
          },
          "500": {
            "description": { "en": "Internal server error", "ar": "خطأ داخلي في الخادم" },
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": {
                    "en": "Internal server error",
                    "ar": "خطأ داخلي في الخادم"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/users/login": {
      post: {
        summary: "Log in a user",
        tags: ["Auth"],
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
            description: { 
              en: "User logged in successfully", 
              ar: "تم تسجيل دخول المستخدم بنجاح" 
            },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Success" },
                    message: { 
                      type: "object",
                      example: { 
                        en: "User logged in successfully", 
                        ar: "تم تسجيل دخول المستخدم بنجاح" 
                      }
                    },
                    token: { type: "string", example: "JWT_TOKEN_HERE" }
                  }
                }
              }
            }
          },
          400: {
            description: { 
              en: "Missing or invalid credentials", 
              ar: "بيانات الاعتماد مفقودة أو غير صحيحة" 
            },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Failed" },
                    message: { 
                      type: "object",
                      example: { 
                        en: "Invalid email or password", 
                        ar: "البريد الإلكتروني أو كلمة المرور غير صحيحة" 
                      }
                    }
                  }
                }
              }
            }
          },
          403: {
            description: { 
              en: "Email not verified", 
              ar: "البريد الإلكتروني غير مُحقق" 
            },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Failed" },
                    message: { 
                      type: "object",
                      example: { 
                        en: "Please verify your email via OTP first", 
                        ar: "يرجى التحقق من بريدك الإلكتروني عبر رمز التحقق أولاً" 
                      }
                    }
                  }
                }
              }
            }
          },
          404: {
            description: { 
              en: "User not found", 
              ar: "المستخدم غير موجود" 
            },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Failed" },
                    message: { 
                      type: "object",
                      example: { 
                        en: "User must register first", 
                        ar: "يجب على المستخدم التسجيل أولاً" 
                      }
                    }
                  }
                }
              }
            }
          },
          500: {
            description: { 
              en: "Internal server error", 
              ar: "خطأ داخلي في الخادم" 
            },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Failed" },
                    message: { 
                      type: "object",
                      example: { 
                        en: "Internal server error", 
                        ar: "خطأ داخلي في الخادم" 
                      }
                    }
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
        tags: ["Auth"],
        description: "Clears the authentication token cookie and logs out the user.",
        responses: {
          200: {
            description: { 
              en: "User logged out successfully", 
              ar: "تم تسجيل خروج المستخدم بنجاح" 
            },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "success" },
                    message: { 
                      type: "object",
                      example: { 
                        en: "User logged out successfully", 
                        ar: "تم تسجيل خروج المستخدم بنجاح" 
                      }
                    }
                  }
                }
              }
            }
          },
          500: {
            description: { 
              en: "Internal server error", 
              ar: "خطأ داخلي في الخادم" 
            },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Failed" },
                    message: { 
                      type: "object",
                      example: { 
                        en: "Internal server error", 
                        ar: "خطأ داخلي في الخادم" 
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    // ------------------- USERS -------------------
    "/users/all": {
      get: {
        summary: "Get all users (admin only)",
        security: [{ bearerAuth: [] }],
        tags: ["Users"],
        responses: {
          200: {
            description: { 
              en: "List of users", 
              ar: "قائمة المستخدمين" 
            },
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
            description: { 
              en: "No users found", 
              ar: "لا يوجد مستخدمون" 
            },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Fail" },
                    message: { 
                      type: "object",
                      example: { 
                        en: "No users found", 
                        ar: "لا يوجد مستخدمون" 
                      }
                    }
                  }
                }
              }
            }
          },
          500: {
            description: { 
              en: "Internal server error", 
              ar: "خطأ داخلي في الخادم" 
            },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Error" },
                    message: { 
                      type: "object",
                      example: { 
                        en: "Internal server error", 
                        ar: "خطأ داخلي في الخادم" 
                      }
                    }
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
            description: { 
              en: "All non-admin users deleted", 
              ar: "تم حذف جميع المستخدمين غير الإداريين" 
            },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Success" },
                    message: { 
                      type: "object",
                      example: { 
                        en: "5 users deleted successfully", 
                        ar: "تم حذف 5 مستخدمين بنجاح" 
                      }
                    }
                  }
                }
              }
            }
          },
          404: {
            description: { 
              en: "No non-admin users found to delete", 
              ar: "لا يوجد مستخدمون غير إداريين للحذف" 
            },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Fail" },
                    message: { 
                      type: "object",
                      example: { 
                        en: "No non-admin users found to delete", 
                        ar: "لا يوجد مستخدمون غير إداريين للحذف" 
                      }
                    }
                  }
                }
              }
            }
          },
          500: {
            description: { 
              en: "Internal server error", 
              ar: "خطأ داخلي في الخادم" 
            },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Error" },
                    message: { 
                      type: "object",
                      example: { 
                        en: "Internal server error", 
                        ar: "خطأ داخلي في الخادم" 
                      }
                    }
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
              description: { 
                en: "User data retrieved successfully", 
                ar: "تم استرجاع بيانات المستخدم بنجاح" 
              },
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "Success" },
                      user: {
                        type: "object",
                        example: {
                          name: "John Doe",
                          email: "john@example.com"
                          // other user fields except password, _id, role, __v
                        },
                      },
                    },
                  },
                },
              },
            },
            404: {
              description: { 
                en: "No user found", 
                ar: "المستخدم غير موجود" 
              },
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "Fail" },
                      message: { 
                        type: "object",
                        example: { 
                          en: "No user found", 
                          ar: "المستخدم غير موجود" 
                        }
                      },
                    },
                  },
                },
              },
            },
            500: {
              description: { 
                en: "Internal server error", 
                ar: "خطأ داخلي في الخادم" 
              },
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "Error" },
                      message: { 
                        type: "object",
                        example: { 
                          en: "Internal server error", 
                          ar: "خطأ داخلي في الخادم" 
                        }
                      },
                    },
                  },
                },
              },
            },
          }
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
            description: { 
              en: "User updated successfully", 
              ar: "تم تحديث بيانات المستخدم بنجاح" 
            },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Success" },
                    message: { 
                      type: "object",
                      example: { 
                        en: "Profile updated successfully", 
                        ar: "تم تحديث الملف الشخصي بنجاح" 
                      }
                    },
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
            description: { 
              en: "Bad Request – No fields provided for update", 
              ar: "طلب غير صالح – لم يتم تقديم أي حقول للتحديث" 
            },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Fail" },
                    message: { 
                      type: "object",
                      example: { 
                        en: "At least one field must be provided to update", 
                        ar: "يجب تقديم حقل واحد على الأقل للتحديث" 
                      }
                    }
                  }
                }
              }
            }
          },
          404: {
            description: { 
              en: "User not found", 
              ar: "المستخدم غير موجود" 
            },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Fail" },
                    message: { 
                      type: "object",
                      example: { 
                        en: "User not found", 
                        ar: "المستخدم غير موجود" 
                      }
                    }
                  }
                }
              }
            }
          },
          500: {
            description: { 
              en: "Internal server error", 
              ar: "خطأ داخلي في الخادم" 
            },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Error" },
                    message: { 
                      type: "object",
                      example: { 
                        en: "Internal server error", 
                        ar: "خطأ داخلي في الخادم" 
                      }
                    }
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
            description: { 
              en: "User deleted successfully", 
              ar: "تم حذف المستخدم بنجاح" 
            },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Success" },
                    message: { 
                      type: "object",
                      example: { 
                        en: "User account deleted successfully", 
                        ar: "تم حذف حساب المستخدم بنجاح" 
                      }
                    }
                  }
                }
              }
            }
          },
          404: {
            description: { 
              en: "User not found", 
              ar: "المستخدم غير موجود" 
            },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Fail" },
                    message: { 
                      type: "object",
                      example: { 
                        en: "User not found", 
                        ar: "المستخدم غير موجود" 
                      }
                    }
                  }
                }
              }
            }
          },
          500: {
            description: { 
              en: "Internal server error", 
              ar: "خطأ داخلي في الخادم" 
            },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Error" },
                    message: { 
                      type: "object",
                      example: { 
                        en: "Internal server error", 
                        ar: "خطأ داخلي في الخادم" 
                      }
                    }
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
              description: { en: "Email verified successfully", ar: "تم التحقق من البريد الإلكتروني بنجاح" },
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "Success" },
                      message: { 
                        type: "object",
                        example: { 
                          en: "Email verified successfully", 
                          ar: "تم التحقق من البريد الإلكتروني بنجاح" 
                        }
                      }
                    }
                  }
                }
              }
            },
            400: {
              description: { 
                en: "Bad request (Invalid / expired OTP, missing fields, or already verified)", 
                ar: "طلب غير صالح (رمز OTP غير صالح / منتهي الصلاحية، أو الحقول مفقودة، أو تم التحقق مسبقًا)" 
              },
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "Fail" },
                      message: { type: "object", example: { en: "Invalid or expired OTP", ar: "رمز OTP غير صالح أو منتهي الصلاحية" } }
                    }
                  },
                  examples: {
                    missingFields: {
                      summary: "Missing email or otp",
                      value: { status: "Fail", message: { en: "Provide all fields", ar: "يرجى تقديم جميع الحقول" } }
                    },
                    alreadyVerified: {
                      summary: "User already verified",
                      value: { status: "Fail", message: { en: "User already verified", ar: "المستخدم تم التحقق منه مسبقًا" } }
                    },
                    invalidOtp: {
                      summary: "Invalid or expired OTP",
                      value: { status: "Fail", message: { en: "Invalid or expired OTP", ar: "رمز OTP غير صالح أو منتهي الصلاحية" } }
                    }
                  }
                }
              }
            },
            404: {
              description: { en: "User not found", ar: "المستخدم غير موجود" },
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "Fail" },
                      message: { type: "object", example: { en: "User not found", ar: "المستخدم غير موجود" } }
                    }
                  }
                }
              }
            },
            500: {
              description: { en: "Internal server error", ar: "خطأ داخلي في الخادم" },
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "Error" },
                      message: { type: "object", example: { en: "Internal server error", ar: "خطأ داخلي في الخادم" } }
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
            description: { en: "New OTP sent to email", ar: "تم إرسال رمز OTP جديد إلى البريد الإلكتروني" },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Success" },
                    message: { type: "object", example: { en: "New OTP sent to email", ar: "تم إرسال رمز OTP جديد إلى البريد الإلكتروني" } }
                  }
                }
              }
            }
          },
          400: {
            description: { en: "Bad request (missing email or already verified)", ar: "طلب غير صالح (البريد الإلكتروني مفقود أو المستخدم تم التحقق منه مسبقًا)" },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Fail" },
                    message: { type: "object" }
                  }
                },
                examples: {
                  missingEmail: {
                    summary: "Missing email",
                    value: { status: "Fail", message: { en: "Email is required", ar: "البريد الإلكتروني مطلوب" } }
                  },
                  alreadyVerified: {
                    summary: "User already verified",
                    value: { status: "Fail", message: { en: "User is already verified", ar: "المستخدم تم التحقق منه مسبقًا" } }
                  }
                }
              }
            }
          },
          404: {
            description: { en: "User not found", ar: "المستخدم غير موجود" },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Fail" },
                    message: { type: "object", example: { en: "User not found", ar: "المستخدم غير موجود" } }
                  }
                }
              }
            }
          },
          500: {
            description: { en: "Internal server error", ar: "خطأ داخلي في الخادم" },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Error" },
                    message: { type: "object", example: { en: "Internal server error", ar: "خطأ داخلي في الخادم" } }
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
            description: { en: "OTP sent for password reset", ar: "تم إرسال رمز OTP لإعادة تعيين كلمة المرور" },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Success" },
                    message: { type: "object", example: { en: "OTP sent to email for password reset", ar: "تم إرسال رمز OTP إلى البريد الإلكتروني لإعادة تعيين كلمة المرور" } }
                  }
                }
              }
            }
          },
          400: {
            description: { en: "Bad request (missing email)", ar: "طلب غير صالح (البريد الإلكتروني مفقود)" },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Fail" },
                    message: { type: "object", example: { en: "Email is required", ar: "البريد الإلكتروني مطلوب" } }
                  }
                }
              }
            }
          },
          404: {
            description: { en: "User not found", ar: "المستخدم غير موجود" },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Fail" },
                    message: { type: "object", example: { en: "User not found", ar: "المستخدم غير موجود" } }
                  }
                }
              }
            }
          },
          500: {
            description: { en: "Internal server error", ar: "خطأ داخلي في الخادم" },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Error" },
                    message: { type: "object", example: { en: "Internal server error", ar: "خطأ داخلي في الخادم" } }
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
            description: { en: "Password reset successful", ar: "تم إعادة تعيين كلمة المرور بنجاح" },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Success" },
                    message: { type: "object", example: { en: "Password reset successfully", ar: "تم إعادة تعيين كلمة المرور بنجاح" } }
                  }
                }
              }
            }
          },
          400: {
            description: { en: "Bad request (missing fields or invalid/expired OTP)", ar: "طلب غير صالح (حقول مفقودة أو OTP غير صالح/منتهي الصلاحية)" },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Fail" },
                    message: { type: "object" }
                  }
                },
                examples: {
                  missingFields: {
                    summary: "Missing fields",
                    value: { status: "Fail", message: { en: "Provide all fields", ar: "يرجى توفير جميع الحقول" } }
                  },
                  invalidOtp: {
                    summary: "Invalid or expired OTP",
                    value: { status: "Fail", message: { en: "Invalid or expired OTP", ar: "OTP غير صالح أو منتهي الصلاحية" } }
                  }
                }
              }
            }
          },
          404: {
            description: { en: "User not found", ar: "المستخدم غير موجود" },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Fail" },
                    message: { type: "object", example: { en: "User not found", ar: "المستخدم غير موجود" } }
                  }
                }
              }
            }
          },
          500: {
            description: { en: "Internal server error", ar: "خطأ داخلي في الخادم" },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Error" },
                    message: { type: "object", example: { en: "Internal server error", ar: "خطأ داخلي في الخادم" } }
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
            description: { en: "Password changed successfully, new JWT issued", ar: "تم تغيير كلمة المرور بنجاح، وتم إصدار JWT جديد" },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Success" },
                    message: { type: "object", example: { en: "Password changed successfully, new JWT issued", ar: "تم تغيير كلمة المرور بنجاح، وتم إصدار JWT جديد" } }
                  }
                }
              }
            }
          },
          400: {
            description: { en: "Validation error (missing fields, mismatch, or incorrect current password)", ar: "خطأ في التحقق (حقول مفقودة، عدم التطابق، أو كلمة المرور الحالية غير صحيحة)" },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Fail" },
                    message: { type: "object", example: { en: "Validation error (missing fields, mismatch, or incorrect current password)", ar: "خطأ في التحقق (حقول مفقودة، عدم التطابق، أو كلمة المرور الحالية غير صحيحة)" } }
                  }
                }
              }
            }
          },
          404: {
            description: { en: "User not found", ar: "المستخدم غير موجود" },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Fail" },
                    message: { type: "object", example: { en: "User not found", ar: "المستخدم غير موجود" } }
                  }
                }
              }
            }
          },
          401: {
            description: { en: "Unauthorized (missing or invalid JWT)", ar: "غير مصرح (JWT مفقود أو غير صالح)" },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Fail" },
                    message: { type: "object", example: { en: "Unauthorized (missing or invalid JWT)", ar: "غير مصرح (JWT مفقود أو غير صالح)" } }
                  }
                }
              }
            }
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
            description: { en: "Successfully toggled favorite", ar: "تم تبديل المفضلة بنجاح" },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Success" },
                    message: { 
                      type: "object", 
                      example: { en: "Favorite toggled successfully", ar: "تم تبديل المفضلة بنجاح" } 
                    },
                    data: {
                      type: "object",
                      properties: {
                        favorites: {
                          type: "array",
                          items: { type: "string", example: "66a8fbb83b62c40356a55c92" }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          401: {
            description: { en: "Unauthorized / Not logged in", ar: "غير مصرح / لم يتم تسجيل الدخول" },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Fail" },
                    message: { type: "object", example: { en: "Unauthorized / Not logged in", ar: "غير مصرح / لم يتم تسجيل الدخول" } }
                  }
                }
              }
            }
          },
          403: {
            description: { en: "Forbidden / Insufficient permissions", ar: "ممنوع / صلاحيات غير كافية" },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Fail" },
                    message: { type: "object", example: { en: "Forbidden / Insufficient permissions", ar: "ممنوع / صلاحيات غير كافية" } }
                  }
                }
              }
            }
          },
          404: {
            description: { en: "Listing not found", ar: "القائمة غير موجودة" },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Fail" },
                    message: { type: "object", example: { en: "Listing not found", ar: "القائمة غير موجودة" } }
                  }
                }
              }
            }
          }
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
            description: { en: "List of user's favorite listings", ar: "قائمة الإعلانات المفضلة للمستخدم" },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    favorites: {
                      type: "array",
                      items: { $ref: "#/components/schemas/List" },
                    },
                    message: { 
                      type: "object", 
                      example: { en: "Favorites retrieved successfully", ar: "تم استرجاع المفضلة بنجاح" } 
                    }
                  },
                },
              },
            },
          },
          401: {
            description: { en: "Unauthorized / Not logged in", ar: "غير مصرح / لم يتم تسجيل الدخول" },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Fail" },
                    message: { type: "object", example: { en: "Unauthorized / Not logged in", ar: "غير مصرح / لم يتم تسجيل الدخول" } }
                  }
                }
              }
            }
          },
          403: {
            description: { en: "Forbidden / Insufficient permissions", ar: "ممنوع / صلاحيات غير كافية" },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Fail" },
                    message: { type: "object", example: { en: "Forbidden / Insufficient permissions", ar: "ممنوع / صلاحيات غير كافية" } }
                  }
                }
              }
            }
          },
          404: {
            description: { en: "No favorites found", ar: "لا توجد مفضلات" },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "Fail" },
                    message: { type: "object", example: { en: "No favorites found", ar: "لا توجد مفضلات" } }
                  }
                }
              }
            }
          }
        }
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
            "description": { "en": "List of filtered listings", "ar": "قائمة الإعلانات المفلترة" },
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "total": 50,
                  "results": 2,
                  "message": { "en": "Filtered listings retrieved successfully", "ar": "تم استرجاع الإعلانات المفلترة بنجاح" },
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
            "description": { "en": "Invalid filter or date format", "ar": "تصفية أو تنسيق تاريخ غير صالح" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "Invalid date format for startDate or endDate", "ar": "تنسيق التاريخ للبداية أو النهاية غير صالح" }
                }
              }
            }
          },
          "500": {
            "description": { "en": "Internal server error", "ar": "خطأ داخلي في الخادم" },
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": { "en": "Something went wrong on the server", "ar": "حدث خطأ في الخادم" }
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
                  "arTitle",
                  "description",
                  "arDescription",
                  "pricePerNight",
                  "address",
                  "longitude",
                  "latitude",
                  "maxGuests",
                  "photos",
                  "governorate"
                ],
                "properties": {
                  "title": { "type": "string", "example": "Luxury Villa in Alexandria" },
                  "arTitle": { "type": "string", "example": "فيلا فاخرة في الإسكندرية" },
                  "description": { "type": "string", "example": "Spacious villa with sea view." },
                  "arDescription": { "type": "string", "example": "فيلا واسعة بإطلالة على البحر." },
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
                  "maxGuests": { "type": "integer", "example": 8 },
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
            "description": { "en": "Listing created successfully", "ar": "تم إنشاء الإعلان بنجاح" },
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "message": { "en": "Listing created successfully", "ar": "تم إنشاء الإعلان بنجاح" },
                  "data": {
                    "_id": "66ab45...",
                    "host": "64c12f...",
                    "title": "Luxury Villa in Alexandria",
                    "arTitle": "فيلا فاخرة في الإسكندرية",
                    "description": "Spacious villa with sea view.",
                    "arDescription": "فيلا واسعة بإطلالة على البحر.",
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
                    "maxGuests": 8,
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
            "description": { "en": "Validation error", "ar": "خطأ في التحقق من البيانات" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "All required fields must be provided", "ar": "يجب تقديم جميع الحقول المطلوبة" }
                }
              }
            }
          },
          "500": {
            "description": { "en": "Internal server error", "ar": "خطأ داخلي في الخادم" },
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": { "en": "Something went wrong on the server", "ar": "حدث خطأ في الخادم" }
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
            "description": { "en": "Listings retrieved successfully", "ar": "تم استرجاع الإعلانات بنجاح" },
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
                      "arTitle": "شقة مريحة في القاهرة",
                      "descrption": "A nice place near the Nile River.",
                      "arDescrption": "مكان جميل بالقرب من نهر النيل",
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
                      "arTitle": "استوديو حديث في القاهرة",
                      "descrption": "Stylish studio apartment in downtown Cairo.",
                      "arDescrption": "استوديو أنيق في وسط القاهرة",
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
            "description": { "en": "No listings found for this governorate", "ar": "لا توجد إعلانات لهذه المحافظة" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "No listings found for governorate Cairo", "ar": "لا توجد إعلانات لمحافظة القاهرة" }
                }
              }
            }
          },
          "500": {
            "description": { "en": "Internal server error", "ar": "خطأ داخلي في الخادم" },
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": { "en": "Something went wrong on the server", "ar": "حدث خطأ في الخادم" }
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
            "description": { "en": "List retrieved successfully", "ar": "تم استرجاع الإعلان بنجاح" },
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "data": {
                    "_id": "66ab23...",
                    "title": "Cozy Apartment in Cairo",
                    "arTitle": "شقة مريحة في القاهرة",
                    "descrption": "A nice place near the Nile River.",
                    "arDescrption": "مكان جميل بالقرب من نهر النيل",
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
            "description": { "en": "List not found", "ar": "الإعلان غير موجود" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "List with ID 66ab99... not found", "ar": "الإعلان بالمعرف 66ab99... غير موجود" }
                }
              }
            }
          },
          "500": {
            "description": { "en": "Internal server error", "ar": "خطأ داخلي في الخادم" },
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": { "en": "Something went wrong on the server", "ar": "حدث خطأ في الخادم" }
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
            "description": { "en": "Listing updated successfully", "ar": "تم تحديث الإعلان بنجاح" },
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "message": { "en": "Listing updated successfully", "ar": "تم تحديث الإعلان بنجاح" },
                  "data": {
                    "_id": "66ab23...",
                    "title": "Updated Apartment Title",
                    "arTitle": "تم تحديث عنوان الشقة",
                    "descrption": "Updated description",
                    "arDescrption": "تم تحديث الوصف",
                    "pricePerNight": 150,
                    "governorate": "Cairo",
                    "maxGustes": 4
                  }
                }
              }
            }
          },
          "400": {
            "description": { "en": "Bad request or empty body", "ar": "طلب خاطئ أو جسم الطلب فارغ" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "Request body cannot be empty", "ar": "جسم الطلب لا يمكن أن يكون فارغًا" }
                }
              }
            }
          },
          "403": {
            "description": { "en": "User not authorized to update this listing", "ar": "المستخدم غير مخوّل لتحديث هذا الإعلان" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "You are not authorized to update this listing", "ar": "أنت غير مخوّل لتحديث هذا الإعلان" }
                }
              }
            }
          },
          "404": {
            "description": { "en": "List not found", "ar": "الإعلان غير موجود" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "List with ID 66ab99... not found", "ar": "الإعلان بالمعرف 66ab99... غير موجود" }
                }
              }
            }
          },
          "500": {
            "description": { "en": "Internal server error", "ar": "خطأ داخلي في الخادم" },
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": { "en": "Something went wrong on the server", "ar": "حدث خطأ في الخادم" }
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
            "description": { "en": "List deleted successfully", "ar": "تم حذف الإعلان بنجاح" },
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "message": { "en": "Listing deleted successfully", "ar": "تم حذف الإعلان بنجاح" }
                }
              }
            }
          },
          "403": {
            "description": { "en": "Cannot delete this list", "ar": "لا يمكن حذف هذا الإعلان" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "You are not authorized to delete this listing", "ar": "أنت غير مخوّل لحذف هذا الإعلان" }
                }
              }
            }
          },
          "404": {
            "description": { "en": "List not found", "ar": "الإعلان غير موجود" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "List with ID 66ab99... not found", "ar": "الإعلان بالمعرف 66ab99... غير موجود" }
                }
              }
            }
          },
          "500": {
            "description": { "en": "Internal server error", "ar": "خطأ داخلي في الخادم" },
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": { "en": "Something went wrong on the server", "ar": "حدث خطأ في الخادم" }
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
            "description": { "en": "Search results returned successfully", "ar": "تم إرجاع نتائج البحث بنجاح" },
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
                      "title": { "en": "Cozy Apartment in Cairo", "ar": "شقة مريحة في القاهرة" },
                      "description": { "en": "Beautiful 2-bedroom apartment near downtown", "ar": "شقة جميلة بغرفتي نوم بالقرب من وسط المدينة" },
                      "pricePerNight": 100,
                      "governorate": "Cairo",
                      "maxGustes": 3
                    },
                    {
                      "_id": "66ab24...",
                      "title": { "en": "Luxury Villa in Giza", "ar": "فيلا فاخرة في الجيزة" },
                      "description": { "en": "Spacious villa with pool and garden", "ar": "فيلا واسعة مع حمام سباحة وحديقة" },
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
            "description": { "en": "Invalid query (too short or missing)", "ar": "استعلام غير صالح (قصير جدًا أو مفقود)" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "You must enter at least 3 characters", "ar": "يجب إدخال 3 أحرف على الأقل" }
                }
              }
            }
          },
          "500": {
            "description": { "en": "Internal server error", "ar": "خطأ داخلي في الخادم" },
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": { "en": "Something went wrong on the server", "ar": "حدث خطأ في الخادم" }
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
            "description": { 
              "en": "Listing approved successfully", 
              "ar": "تم الموافقة على القائمة بنجاح" 
            },
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "message": { 
                    "en": "Listing approved successfully", 
                    "ar": "تم الموافقة على القائمة بنجاح" 
                  },
                  "data": {
                    "_id": "66ac12...",
                    "title": { 
                      "en": "Modern Apartment in Cairo", 
                      "ar": "شقة حديثة في القاهرة" 
                    },
                    "description": { 
                      "en": "2-bedroom furnished apartment near metro", 
                      "ar": "شقة مفروشة بغرفتي نوم بالقرب من المترو" 
                    },
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
            "description": { 
              "en": "Bad request (ID missing)", 
              "ar": "طلب غير صالح (المعرف مفقود)" 
            },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { 
                    "en": "Listing ID is required", 
                    "ar": "مطلوب معرف القائمة" 
                  }
                }
              }
            }
          },
          "404": {
            "description": { 
              "en": "Listing not found", 
              "ar": "القائمة غير موجودة" 
            },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { 
                    "en": "Listing not found", 
                    "ar": "القائمة غير موجودة" 
                  }
                }
              }
            }
          },
          "500": {
            "description": { 
              "en": "Internal server error", 
              "ar": "خطأ داخلي في الخادم" 
            },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { 
                    "en": "Internal Server Error", 
                    "ar": "حدث خطأ في الخادم" 
                  }
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
            "description": { "en": "Listings retrieved successfully", "ar": "تم استرجاع القوائم بنجاح" },
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "results": 2,
                  "lists": [
                    {
                      "_id": "66ac12...",
                      "title": { "en": "Modern Apartment in Cairo", "ar": "شقة حديثة في القاهرة" },
                      "description": { "en": "2-bedroom furnished apartment near metro", "ar": "شقة مفروشة بغرفتي نوم بالقرب من المترو" },
                      "pricePerNight": 120,
                      "categoryId": {
                        "_id": "66ab11...",
                        "name": { "en": "Apartments", "ar": "شقق" }
                      },
                      "host": "66aa99..."
                    }
                  ]
                }
              }
            }
          },
          "404": {
            "description": { "en": "No listings found for this host", "ar": "لا توجد قوائم لهذا المضيف" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "No listings found for this host", "ar": "لا توجد قوائم لهذا المضيف" }
                }
              }
            }
          },
          "401": {
            "description": { "en": "Unauthorized (not logged in)", "ar": "غير مصرح (لم يتم تسجيل الدخول)" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "Authentication required", "ar": "مطلوب تسجيل الدخول" }
                }
              }
            }
          },
          "500": {
            "description": { "en": "Internal server error", "ar": "خطأ داخلي في الخادم" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "Internal Server Error", "ar": "حدث خطأ في الخادم" }
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
            "description": { "en": "List of ratings for the user", "ar": "قائمة التقييمات للمستخدم" },
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
                        "title": { "en": "Modern Apartment in Cairo", "ar": "شقة حديثة في القاهرة" }
                      },
                      "guestId": {
                        "_id": "66aa99...",
                        "userName": "JohnDoe"
                      },
                      "rating": 4.5,
                      "comment": { "en": "Very clean and convenient location", "ar": "نظيفة جدًا وموقع ملائم" },
                      "createdAt": "2025-08-16T12:00:00.000Z"
                    },
                    {
                      "_id": "66ad13...",
                      "listingId": {
                        "_id": "66ac35...",
                        "title": { "en": "Luxury Villa in Giza", "ar": "فيلا فاخرة في الجيزة" }
                      },
                      "guestId": {
                        "_id": "66aa99...",
                        "userName": "JohnDoe"
                      },
                      "rating": 5,
                      "comment": { "en": "Amazing stay with a beautiful pool", "ar": "إقامة رائعة مع مسبح جميل" },
                      "createdAt": "2025-08-15T15:30:00.000Z"
                    }
                  ]
                }
              }
            }
          },
          "404": {
            "description": { "en": "User has no ratings", "ar": "المستخدم لا يملك تقييمات" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "No ratings found for this user", "ar": "لم يتم العثور على تقييمات لهذا المستخدم" }
                }
              }
            }
          },
          "500": {
            "description": { "en": "Internal server error", "ar": "خطأ داخلي في الخادم" },
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": { "en": "Something went wrong on the server", "ar": "حدث خطأ في الخادم" }
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
            "description": { "en": "Rating submitted successfully", "ar": "تم تقديم التقييم بنجاح" },
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "message": { "en": "Rating submitted successfully", "ar": "تم تقديم التقييم بنجاح" },
                  "data": {
                    "_id": "66ad45...",
                    "bookingId": "66ac99...",
                    "guestId": "66aa99...",
                    "rating": 5,
                    "comment": { "en": "Amazing stay, highly recommended!", "ar": "إقامة رائعة، موصى بها بشدة!" },
                    "createdAt": "2025-08-16T12:30:00.000Z"
                  }
                }
              }
            }
          },
          "400": {
            "description": { "en": "Already rated, missing fields, or guest hasn’t checked out yet", "ar": "تم التقييم مسبقًا، أو الحقول مفقودة، أو لم يغادر الضيف بعد" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "You have already rated this booking", "ar": "لقد قمت بتقييم هذا الحجز مسبقًا" }
                }
              }
            }
          },
          "403": {
            "description": { "en": "Unauthorized or booking not associated with user", "ar": "غير مصرح أو الحجز غير مرتبط بالمستخدم" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "You are not allowed to rate this booking", "ar": "غير مسموح لك بتقييم هذا الحجز" }
                }
              }
            }
          },
          "404": {
            "description": { "en": "Booking not found", "ar": "الحجز غير موجود" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "Booking with ID 66ac99... not found", "ar": "الحجز بالمعرف 66ac99... غير موجود" }
                }
              }
            }
          },
          "500": {
            "description": { "en": "Internal server error", "ar": "خطأ داخلي في الخادم" },
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": { "en": "Something went wrong on the server", "ar": "حدث خطأ في الخادم" }
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
            "description": { "en": "List of ratings for the listing", "ar": "قائمة التقييمات لهذه القائمة" },
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
                      "comment": { "en": "Amazing stay!", "ar": "إقامة رائعة!" },
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
                      "comment": { "en": "Very clean and convenient", "ar": "نظيف جدًا ومريح" },
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
                      "comment": { "en": "Good but noisy neighborhood", "ar": "جيد ولكن الحي صاخب" },
                      "createdAt": "2025-08-14T09:15:00.000Z"
                    }
                  ]
                }
              }
            }
          },
          "400": {
            "description": { "en": "Missing listingId", "ar": "معرف القائمة مفقود" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "Listing ID is required", "ar": "معرف القائمة مطلوب" }
                }
              }
            }
          },
          "404": {
            "description": { "en": "Listing not found or no ratings", "ar": "القائمة غير موجودة أو لا توجد تقييمات" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "No ratings found for this listing", "ar": "لا توجد تقييمات لهذه القائمة" }
                }
              }
            }
          },
          "500": {
            "description": { "en": "Internal server error", "ar": "خطأ داخلي في الخادم" },
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": { "en": "Something went wrong on the server", "ar": "حدث خطأ في الخادم" }
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
            "description": { "en": "Rating updated successfully", "ar": "تم تحديث التقييم بنجاح" },
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "message": { "en": "Rating updated successfully", "ar": "تم تحديث التقييم بنجاح" },
                  "data": {
                    "_id": "66ad45...",
                    "bookingId": "66ac99...",
                    "guestId": "66aa99...",
                    "rating": 4,
                    "comment": { "en": "Updated comment: Very clean and convenient location", "ar": "تعليق محدث: نظيف جدًا ومريح" },
                    "updatedAt": "2025-08-16T15:00:00.000Z"
                  }
                }
              }
            }
          },
          "400": {
            "description": { "en": "Missing ratingId or no update data", "ar": "معرف التقييم مفقود أو لا توجد بيانات للتحديث" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "No update data provided", "ar": "لم يتم تقديم بيانات للتحديث" }
                }
              }
            }
          },
          "500": {
            "description": { "en": "Internal server error", "ar": "خطأ داخلي في الخادم" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "Internal Server Error", "ar": "حدث خطأ في الخادم" }
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
            "description": { "en": "Rating deleted successfully", "ar": "تم حذف التقييم بنجاح" },
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "message": { "en": "Rating deleted successfully", "ar": "تم حذف التقييم بنجاح" }
                }
              }
            }
          },
          "400": {
            "description": { "en": "Missing ratingId", "ar": "معرف التقييم مفقود" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "Rating ID is required", "ar": "مطلوب معرف التقييم" }
                }
              }
            }
          },
          "404": {
            "description": { "en": "Rating or listing not found", "ar": "التقييم أو القائمة غير موجود" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "Rating not found", "ar": "التقييم غير موجود" }
                }
              }
            }
          },
          "500": {
            "description": { "en": "Internal server error", "ar": "خطأ داخلي في الخادم" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "Internal Server Error", "ar": "حدث خطأ في الخادم" }
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
            "description": { "en": "Category created successfully", "ar": "تم إنشاء الفئة بنجاح" },
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "message": { "en": "Category created successfully", "ar": "تم إنشاء الفئة بنجاح" },
                  "data": {
                    "_id": "64d29fabc123...",
                    "name": { "en": "Villa", "ar": "فيلا" },
                    "createdAt": "2025-08-16T15:30:00.000Z",
                    "updatedAt": "2025-08-16T15:30:00.000Z"
                  }
                }
              }
            }
          },
          "400": {
            "description": { "en": "Validation error", "ar": "خطأ في التحقق من البيانات" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "Category name is required or already exists", "ar": "اسم الفئة مطلوب أو موجود مسبقًا" }
                }
              }
            }
          },
          "500": {
            "description": { "en": "Internal server error", "ar": "خطأ داخلي في الخادم" },
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": { "en": "Something went wrong on the server", "ar": "حدث خطأ في الخادم" }
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
            "description": { "en": "List of categories", "ar": "قائمة الفئات" },
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "results": 3,
                  "data": [
                    { "_id": "64d29fabc123...", "name": { "en": "Villa", "ar": "فيلا" } },
                    { "_id": "64d2a0def456...", "name": { "en": "Apartment", "ar": "شقة" } },
                    { "_id": "64d2a1ghi789...", "name": { "en": "Studio", "ar": "استوديو" } }
                  ]
                }
              }
            }
          },
          "500": {
            "description": { "en": "Internal server error", "ar": "خطأ داخلي في الخادم" },
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": { "en": "Something went wrong on the server", "ar": "حدث خطأ في الخادم" }
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
            "description": { "en": "Category updated successfully", "ar": "تم تحديث الفئة بنجاح" },
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "message": { "en": "Category updated successfully", "ar": "تم تحديث الفئة بنجاح" },
                  "category": {
                    "_id": "64d29fabc123...",
                    "name": { "en": "Luxury Villa", "ar": "فيلا فاخرة" },
                    "updatedAt": "2025-08-16T16:00:00.000Z"
                  }
                }
              }
            }
          },
          "400": {
            "description": { "en": "Bad request", "ar": "طلب غير صالح" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "Id of Category is required", "ar": "معرف الفئة مطلوب" }
                }
              }
            }
          },
          "404": {
            "description": { "en": "Category not found", "ar": "الفئة غير موجودة" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "Category not found", "ar": "الفئة غير موجودة" }
                }
              }
            }
          },
          "500": {
            "description": { "en": "Internal server error", "ar": "خطأ داخلي في الخادم" },
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": { "en": "Something went wrong on the server", "ar": "حدث خطأ في الخادم" }
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
            "description": { "en": "Category deleted successfully", "ar": "تم حذف الفئة بنجاح" },
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "message": { "en": "Category deleted successfully", "ar": "تم حذف الفئة بنجاح" }
                }
              }
            }
          },
          "400": {
            "description": { "en": "Bad request", "ar": "طلب غير صالح" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "Id of Category is required", "ar": "معرف الفئة مطلوب" }
                }
              }
            }
          },
          "404": {
            "description": { "en": "Category not found", "ar": "الفئة غير موجودة" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "Category not found", "ar": "الفئة غير موجودة" }
                }
              }
            }
          },
          "500": {
            "description": { "en": "Internal server error", "ar": "خطأ داخلي في الخادم" },
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": { "en": "Something went wrong on the server", "ar": "حدث خطأ في الخادم" }
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
            "description": { "en": "Stripe checkout session created successfully", "ar": "تم إنشاء جلسة الدفع بنجاح" },
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
                            "name": { "en": "Luxury Villa in Alexandria", "ar": "فيلا فاخرة في الإسكندرية" },
                            "description": { "en": "Spacious villa with sea view.", "ar": "فيلا واسعة مع إطلالة على البحر." },
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
            "description": { "en": "Bad request, invalid dates or incomplete booking details", "ar": "طلب غير صالح، تواريخ أو بيانات الحجز غير كاملة" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "Check-in and check-out dates are required", "ar": "تاريخ الوصول والمغادرة مطلوب" }
                }
              }
            }
          },
          "403": {
            "description": { "en": "Unauthorized user role", "ar": "دور المستخدم غير مصرح به" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "You must be a guest to book a list", "ar": "يجب أن تكون ضيفًا لحجز القائمة" }
                }
              }
            }
          },
          "404": {
            "description": { "en": "Listing not found", "ar": "القائمة غير موجودة" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "Can't find list", "ar": "لا يمكن العثور على القائمة" }
                }
              }
            }
          },
          "500": {
            "description": { "en": "Internal server error", "ar": "خطأ داخلي في الخادم" },
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": { "en": "Failed to create checkout session", "ar": "فشل في إنشاء جلسة الدفع" }
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
            "description": { "en": "List of bookings for the guest", "ar": "قائمة الحجوزات الخاصة بالضيف" },
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "results": 2,
                  "data": [
                    {
                      "_id": "64f9a123abc456def7890123",
                      "guest": "64f9a456def7890123456789",
                      "listing": {
                        "_id": "66ab23f7890abcd123456789",
                        "title": { "en": "Luxury Villa in Alexandria", "ar": "فيلا فاخرة في الإسكندرية" },
                        "description": { "en": "Spacious villa with sea view.", "ar": "فيلا واسعة مع إطلالة على البحر." },
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
                        "title": { "en": "Budget Apartment in Giza", "ar": "شقة اقتصادية في الجيزة" },
                        "description": { "en": "Affordable stay near the pyramids.", "ar": "إقامة ميسورة بالقرب من الأهرامات." },
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
            "description": { "en": "User not authorized", "ar": "المستخدم غير مصرح له" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "You are not authorized to view these bookings", "ar": "أنت غير مصرح لك بعرض هذه الحجوزات" }
                }
              }
            }
          },
          "500": {
            "description": { "en": "Internal server error", "ar": "خطأ داخلي في الخادم" },
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": { "en": "Something went wrong on the server", "ar": "حدث خطأ في الخادم" }
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
            "description": { "en": "List of bookings for the host's listings", "ar": "قائمة الحجوزات لعقارات المضيف" },
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
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
                        "title": { "en": "Luxury Villa in Alexandria", "ar": "فيلا فاخرة في الإسكندرية" },
                        "location": { "en": "Alexandria", "ar": "الإسكندرية" }
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
                        "title": { "en": "Budget Apartment in Giza", "ar": "شقة اقتصادية في الجيزة" },
                        "location": { "en": "Giza", "ar": "الجيزة" }
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
            "description": { "en": "User not authorized", "ar": "المستخدم غير مصرح له" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "You are not authorized to view these bookings", "ar": "أنت غير مصرح لك بعرض هذه الحجوزات" }
                }
              }
            }
          },
          "404": {
            "description": { "en": "No bookings found for the host", "ar": "لا توجد حجوزات لهذا المضيف" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "You do not have any bookings", "ar": "ليس لديك أي حجوزات" }
                }
              }
            }
          },
          "500": {
            "description": { "en": "Internal server error", "ar": "خطأ داخلي في الخادم" },
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": { "en": "Something went wrong on the server", "ar": "حدث خطأ في الخادم" }
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
            "description": { "en": "List of bookings for the specified listing", "ar": "قائمة الحجوزات للقائمة المحددة" },
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
                        "title": { "en": "Luxury Villa in Alexandria", "ar": "فيلا فاخرة في الإسكندرية" },
                        "location": { "en": "Alexandria", "ar": "الإسكندرية" }
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
                        "title": { "en": "Luxury Villa in Alexandria", "ar": "فيلا فاخرة في الإسكندرية" },
                        "location": { "en": "Alexandria", "ar": "الإسكندرية" }
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
            "description": { "en": "Missing listingId", "ar": "معرف القائمة مفقود" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "Listing ID is required", "ar": "معرف القائمة مطلوب" }
                }
              }
            }
          },
          "403": {
            "description": { "en": "Unauthorized access", "ar": "الوصول غير مصرح به" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "You are not authorized to view these bookings", "ar": "أنت غير مصرح لك بعرض هذه الحجوزات" }
                }
              }
            }
          },
          "500": {
            "description": { "en": "Internal server error", "ar": "خطأ داخلي في الخادم" },
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": { "en": "Something went wrong on the server", "ar": "حدث خطأ في الخادم" }
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
            "description": { "en": "Booking created successfully", "ar": "تم إنشاء الحجز بنجاح" },
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "message": { "en": "Booking created", "ar": "تم إنشاء الحجز" },
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
            "description": { "en": "Missing fields or date conflict", "ar": "حقول مفقودة أو تعارض في التواريخ" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "Provide all required fields", "ar": "يرجى إدخال جميع الحقول المطلوبة" }
                }
              }
            }
          },
          "403": {
            "description": { "en": "Unauthorized access (not a guest)", "ar": "الوصول غير مصرح به (ليست ضيفًا)" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "You must be a guest to book a list", "ar": "يجب أن تكون ضيفًا لحجز قائمة" }
                }
              }
            }
          },
          "404": {
            "description": { "en": "Listing not found", "ar": "القائمة غير موجودة" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "Listing not found", "ar": "القائمة غير موجودة" }
                }
              }
            }
          },
          "500": {
            "description": { "en": "Internal server error", "ar": "خطأ داخلي في الخادم" },
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": { "en": "Something went wrong on the server", "ar": "حدث خطأ في الخادم" }
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
            "description": { "en": "Booking retrieved successfully", "ar": "تم استرجاع الحجز بنجاح" },
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
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
            "description": { "en": "Booking ID is missing", "ar": "معرف الحجز مفقود" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "Booking ID is required", "ar": "مطلوب معرف الحجز" }
                }
              }
            }
          },
          "403": {
            "description": { "en": "Unauthorized access", "ar": "الوصول غير مصرح به" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "You are not authorized to view this booking", "ar": "غير مصرح لك بعرض هذا الحجز" }
                }
              }
            }
          },
          "404": {
            "description": { "en": "Booking not found", "ar": "الحجز غير موجود" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "Booking not found", "ar": "الحجز غير موجود" }
                }
              }
            }
          },
          "500": {
            "description": { "en": "Internal server error", "ar": "خطأ داخلي في الخادم" },
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": { "en": "Something went wrong on the server", "ar": "حدث خطأ في الخادم" }
                }
              }
            }
          }
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
          "200": {
            "description": { "en": "Booking updated successfully", "ar": "تم تحديث الحجز بنجاح" },
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "message": { "en": "Booking updated successfully", "ar": "تم تحديث الحجز بنجاح" }
                }
              }
            }
          },
          "400": {
            "description": { "en": "Missing bookingId or invalid dates", "ar": "معرف الحجز مفقود أو تواريخ غير صالحة" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "Booking ID and valid dates are required", "ar": "مطلوب معرف الحجز وتواريخ صالحة" }
                }
              }
            }
          },
          "403": {
            "description": { "en": "Unauthorized update attempt", "ar": "محاولة تحديث غير مصرح بها" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "You are not authorized to update this booking", "ar": "غير مصرح لك بتحديث هذا الحجز" }
                }
              }
            }
          },
          "404": {
            "description": { "en": "Booking or listing not found", "ar": "الحجز أو القائمة غير موجودة" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "Booking or listing not found", "ar": "الحجز أو القائمة غير موجودة" }
                }
              }
            }
          },
          "500": {
            "description": { "en": "Internal server error", "ar": "خطأ داخلي في الخادم" },
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": { "en": "Something went wrong on the server", "ar": "حدث خطأ في الخادم" }
                }
              }
            }
          }
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
            "description": { "en": "Booking deleted successfully", "ar": "تم حذف الحجز بنجاح" },
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "message": { "en": "Booking and related dates removed successfully", "ar": "تم حذف الحجز والتواريخ المرتبطة بنجاح" }
                }
              }
            }
          },
          "400": {
            "description": { "en": "Booking ID is missing", "ar": "معرف الحجز مفقود" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "Booking ID is required", "ar": "مطلوب معرف الحجز" }
                }
              }
            }
          },
          "403": {
            "description": { "en": "Unauthorized delete attempt", "ar": "محاولة حذف غير مصرح بها" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "You are not authorized to delete this booking", "ar": "غير مصرح لك بحذف هذا الحجز" }
                }
              }
            }
          },
          "404": {
            "description": { "en": "Booking not found", "ar": "الحجز غير موجود" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "Booking not found", "ar": "الحجز غير موجود" }
                }
              }
            }
          },
          "500": {
            "description": { "en": "Internal server error", "ar": "خطأ داخلي في الخادم" },
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": { "en": "Something went wrong on the server", "ar": "حدث خطأ في الخادم" }
                }
              }
            }
          }
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
            "description": { "en": "Amenity created successfully", "ar": "تم إنشاء الميزة بنجاح" },
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "message": { "en": "Amenity created successfully", "ar": "تم إنشاء الميزة بنجاح" },
                  "data": {
                    "_id": "64d2af123456...",
                    "name": { "en": "WiFi", "ar": "واي فاي" },
                    "icon": "wifi-icon.png",
                    "createdAt": "2025-08-16T16:00:00.000Z",
                    "updatedAt": "2025-08-16T16:00:00.000Z"
                  }
                }
              }
            }
          },
          "400": {
            "description": { "en": "Validation error", "ar": "خطأ في التحقق من الصحة" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "Amenity name is required", "ar": "اسم الميزة مطلوب" }
                }
              }
            }
          },
          "500": {
            "description": { "en": "Internal server error", "ar": "خطأ داخلي في الخادم" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "Internal Server Error", "ar": "حدث خطأ في الخادم" }
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
            "description": { "en": "List of amenities", "ar": "قائمة المميزات" },
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "data": [
                    {
                      "_id": "64d2af123456...",
                      "name": { "en": "WiFi", "ar": "واي فاي" },
                      "icon": "wifi-icon.png"
                    },
                    {
                      "_id": "64d2b0123456...",
                      "name": { "en": "Pool", "ar": "حمام سباحة" },
                      "icon": "pool-icon.png"
                    }
                  ]
                }
              }
            }
          },
          "404": {
            "description": { "en": "No amenities found", "ar": "لا توجد مميزات" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "No amenities found", "ar": "لا توجد مميزات" }
                }
              }
            }
          },
          "500": {
            "description": { "en": "Internal server error", "ar": "خطأ داخلي في الخادم" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "Internal Server Error", "ar": "حدث خطأ في الخادم" }
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
            "description": { "en": "Amenity updated successfully", "ar": "تم تحديث الميزة بنجاح" },
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "message": { "en": "Amenity updated successfully", "ar": "تم تحديث الميزة بنجاح" },
                  "data": {
                    "_id": "64d2af123456...",
                    "name": { "en": "WiFi", "ar": "واي فاي" },
                    "icon": "wifi-icon-updated.png",
                    "createdAt": "2025-08-16T16:00:00.000Z",
                    "updatedAt": "2025-08-16T17:00:00.000Z"
                  }
                }
              }
            }
          },
          "400": {
            "description": { "en": "Missing amenity ID", "ar": "معرف الميزة مفقود" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "Amenity ID is required", "ar": "مطلوب معرف الميزة" }
                }
              }
            }
          },
          "404": {
            "description": { "en": "Amenity not found", "ar": "الميزة غير موجودة" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "Amenity not found", "ar": "الميزة غير موجودة" }
                }
              }
            }
          },
          "500": {
            "description": { "en": "Internal server error", "ar": "خطأ داخلي في الخادم" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "Internal Server Error", "ar": "حدث خطأ في الخادم" }
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
            "description": { "en": "Amenity deleted successfully", "ar": "تم حذف الميزة بنجاح" },
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "message": { "en": "Amenity deleted successfully", "ar": "تم حذف الميزة بنجاح" }
                }
              }
            }
          },
          "400": {
            "description": { "en": "Missing amenity ID", "ar": "معرف الميزة مفقود" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "Amenity ID is required", "ar": "مطلوب معرف الميزة" }
                }
              }
            }
          },
          "404": {
            "description": { "en": "Amenity not found", "ar": "الميزة غير موجودة" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "Amenity not found", "ar": "الميزة غير موجودة" }
                }
              }
            }
          },
          "500": {
            "description": { "en": "Internal server error", "ar": "خطأ داخلي في الخادم" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "Internal Server Error", "ar": "حدث خطأ في الخادم" }
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
            "multipart/form-data": {
              "schema": {
                "type": "object",
                "required": ["documents"],
                "properties": {
                  "documents": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "format": "binary"
                    },
                    "description": "List of documents to upload (PDF, DOCX, TXT)"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": {
              "en": "Documents uploaded and indexed successfully",
              "ar": "تم رفع وفهرسة المستندات بنجاح"
            },
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "message": {
                    "en": "2 documents uploaded and indexed successfully",
                    "ar": "تم رفع وفهرسة مستندين بنجاح"
                  }
                }
              }
            }
          },
          "400": {
            "description": {
              "en": "Invalid input",
              "ar": "إدخال غير صالح"
            },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": {
                    "en": "documents must be an array of files",
                    "ar": "يجب أن تكون المستندات مصفوفة من الملفات"
                  }
                }
              }
            }
          },
          "500": {
            "description": {
              "en": "Failed to upload documents",
              "ar": "فشل في رفع المستندات"
            },
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": {
                    "en": "Failed to upload documents",
                    "ar": "فشل في رفع المستندات"
                  }
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
            "description": { "en": "AI-generated answer", "ar": "إجابة تم إنشاؤها بواسطة الذكاء الاصطناعي" },
            "content": {
              "application/json": {
                "example": {
                  "status": "success",
                  "answer": { 
                    "en": "Maskan is a web application that allows users to book rental properties in Egypt, where hosts can list properties and guests can make bookings.", 
                    "ar": "مسكن هو تطبيق ويب يسمح للمستخدمين بحجز العقارات للإيجار في مصر، حيث يمكن للمضيفين عرض عقاراتهم ويمكن للضيوف إجراء الحجوزات."
                  }
                }
              }
            }
          },
          "400": {
            "description": { "en": "Missing question", "ar": "السؤال مفقود" },
            "content": {
              "application/json": {
                "example": {
                  "status": "fail",
                  "message": { "en": "question is required", "ar": "حقل السؤال مطلوب" }
                }
              }
            }
          },
          "500": {
            "description": { "en": "Failed to process query", "ar": "فشل في معالجة الاستعلام" },
            "content": {
              "application/json": {
                "example": {
                  "status": "error",
                  "message": { "en": "Failed to process query", "ar": "فشل في معالجة الاستعلام" }
                }
              }
            }
          }
        }
      }
    },
    // --------------------Contact Us ---------------------
    "/contact": {
      "post": {
        "summary": "Create a new contact message",
        "tags": ["Contact"],
        "security": [
          { "bearerAuth": [] }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["name", "email", "subject", "message"],
                "properties": {
                  "name": {
                    "type": "string",
                    "example": "John Doe",
                    "description": { "en": "Name of the sender", "ar": "اسم المرسل" }
                  },
                  "email": {
                    "type": "string",
                    "example": "john@example.com",
                    "description": { "en": "Email address of the sender", "ar": "البريد الإلكتروني للمرسل" }
                  },
                  "subject": {
                    "type": "string",
                    "example": "Problem with booking",
                    "description": { "en": "Subject of the message", "ar": "موضوع الرسالة" }
                  },
                  "message": {
                    "type": "string",
                    "example": "I faced an issue while booking an apartment...",
                    "description": { "en": "Content of the message", "ar": "محتوى الرسالة" }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": { "en": "Message created successfully", "ar": "تم إنشاء الرسالة بنجاح" },
            "content": {
              "application/json": {
                "examples": {
                  "success": {
                    "summary": "Message created",
                    "value": {
                      "status": "success",
                      "message": {
                        "en": "Message created successfully",
                        "ar": "تم إنشاء الرسالة بنجاح"
                      },
                      "data": {
                        "id": "64c2f0d9f1a2c9e8d2e8b123",
                        "name": "John Doe",
                        "email": "john@example.com",
                        "subject": "Problem with booking",
                        "message": "I faced an issue while booking an apartment..."
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": { "en": "Validation error (missing fields)", "ar": "خطأ في التحقق (حقول ناقصة)" },
            "content": {
              "application/json": {
                "examples": {
                  "validationError": {
                    "summary": "Validation error",
                    "value": {
                      "status": "fail",
                      "message": {
                        "en": "Email and subject are required",
                        "ar": "البريد الإلكتروني والموضوع مطلوبان"
                      }
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": { "en": "Unauthorized (user not logged in)", "ar": "غير مصرح (المستخدم غير مسجل الدخول)" },
            "content": {
              "application/json": {
                "examples": {
                  "unauthorized": {
                    "summary": "Unauthorized",
                    "value": {
                      "status": "fail",
                      "message": {
                        "en": "Unauthorized access, please login first",
                        "ar": "دخول غير مصرح، يرجى تسجيل الدخول أولاً"
                      }
                    }
                  }
                }
              }
            }
          },
          "500": {
            "description": { "en": "Internal server error", "ar": "خطأ في الخادم الداخلي" },
            "content": {
              "application/json": {
                "examples": {
                  "serverError": {
                    "summary": "Server error",
                    "value": {
                      "status": "error",
                      "message": {
                        "en": "Something went wrong on the server",
                        "ar": "حدث خطأ في الخادم"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },

      "get": {
        "summary": "Get all contact messages (Admin only)",
        "tags": ["Contact"],
        "security": [
          { "bearerAuth": [] }
        ],
        "responses": {
          "200": {
            "description": { "en": "List of messages", "ar": "قائمة الرسائل" },
            "content": {
              "application/json": {
                "examples": {
                  "messagesList": {
                    "summary": "Messages list",
                    "value": {
                      "status": "success",
                      "message": {
                        "en": "List of contact messages",
                        "ar": "قائمة الرسائل"
                      },
                      "data": [
                        {
                          "id": "64c2f0d9f1a2c9e8d2e8b123",
                          "name": "John Doe",
                          "email": "john@example.com",
                          "subject": "Problem with booking",
                          "message": "I faced an issue while booking an apartment..."
                        },
                        {
                          "id": "64c2f0d9f1a2c9e8d2e8b124",
                          "name": "Jane Smith",
                          "email": "jane@example.com",
                          "subject": "Payment issue",
                          "message": "My payment did not go through"
                        }
                      ]
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": { "en": "Unauthorized (user not logged in)", "ar": "غير مصرح (المستخدم غير مسجل الدخول)" },
            "content": {
              "application/json": {
                "examples": {
                  "unauthorized": {
                    "summary": "Unauthorized",
                    "value": {
                      "status": "fail",
                      "message": {
                        "en": "Unauthorized access, please login first",
                        "ar": "دخول غير مصرح، يرجى تسجيل الدخول أولاً"
                      }
                    }
                  }
                }
              }
            }
          },
          "403": {
            "description": { "en": "Forbidden (not admin)", "ar": "ممنوع (ليس لديك صلاحية المدير)" },
            "content": {
              "application/json": {
                "examples": {
                  "forbidden": {
                    "summary": "Forbidden",
                    "value": {
                      "status": "fail",
                      "message": {
                        "en": "You do not have permission to access this resource",
                        "ar": "ليس لديك صلاحية للوصول إلى هذا المورد"
                      }
                    }
                  }
                }
              }
            }
          },
          "500": {
            "description": { "en": "Internal server error", "ar": "خطأ في الخادم الداخلي" },
            "content": {
              "application/json": {
                "examples": {
                  "serverError": {
                    "summary": "Server error",
                    "value": {
                      "status": "error",
                      "message": {
                        "en": "Something went wrong on the server",
                        "ar": "حدث خطأ في الخادم"
                      }
                    }
                  }
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
