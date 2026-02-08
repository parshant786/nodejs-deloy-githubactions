module.exports = {
    apps: [
        {
            name: 'app',
            script: 'index.js',
            instances: 1,
            exec_mode: 'fork',
            env: {
                NODE_ENV: 'development'
            },
            env_production: {
                NODE_ENV: 'production'
            }
        },
        {
            name: 'cron',
            script: 'cron.js',
            instances: 1,
            exec_mode: 'fork',
            env: {
                NODE_ENV: 'development'
            },
            env_production: {
                NODE_ENV: 'production'
            }
        }
    ]
};
