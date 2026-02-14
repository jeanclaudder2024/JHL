module.exports = {
    apps: [
        {
            name: 'jhl-backend',
            script: './backend/dist/index.js',
            env: {
                NODE_ENV: 'production',
                PORT: 5000
            },
            watch: false,
            instances: 1,
            autorestart: true,
            max_memory_restart: '1G',
        },
    ],
};
