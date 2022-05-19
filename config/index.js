const config = {
    APP_NAME: "demo",
    role: {
        ADMIN:["admin"],
        USER: ["user", "admin"],
    },
    JWT_SECRET: process.env.JWT_SECRET || "demo-secret",
};

module.exports = config;
