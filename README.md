# Cron Job Management Guide

This project includes a separate cron service that can be managed independently without redeploying the main application.

## Architecture
- **Service**: Dedicated `cron` container in Docker Compose.
- **Engine**: `node-cron` in Node.js.
- **Isolation**: Primary web app and cron run in separate processes/containers, sharing the same code base and image.

## MongoDB Integration

This project is now integrated with MongoDB using Mongoose.

### Configuration
Environmental variables in `.env`:
- `MONGODB_URI`: The connection string for your MongoDB instance.
- `NODE_ENV`: Set to `dev`, `stage`, or `main` to control environment-specific behavior (e.g., indexing).

### CRUD API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/users` | Create a new user (requires `name` and `email` in body) |
| **GET** | `/users` | List all users |
| **GET** | `/users/:id` | Get a specific user by ID |
| **PUT** | `/users/:id` | Update a user by ID |
| **DELETE** | `/users/:id` | Delete a user by ID |

## Control Commands (SSH on EC2)

Navigate to the project directory on your EC2 instance and run these commands:

### Start Cron
```bash
docker compose start cron
```
*Note: If the service hasn't been created yet, use `docker compose up -d cron`.*

### Stop Cron
```bash
docker compose stop cron
```

### Check Status
```bash
docker compose ps cron
```

### View Logs
```bash
docker compose logs -f cron
```

## Production Safety & Best Practices

1. **Separation of Concerns**: Keep the cron logic slim. If a job is heavy, consider having the cron job just trigger an internal API or a queue worker.
2. **Idempotency**: Ensure your jobs can run multiple times or fail halfway without corrupting data.
3. **Graceful Shutdown**: The service is configured to handle `SIGTERM`. Docker Compose uses this to stop containers safely.
4. **Duplicate Execution**: By using a single `cron` service in `docker-compose.yml`, we ensure only one instance runs even if the web app Scales.
5. **Persistence**: The "stopped" state of a container is persisted by Docker. If you `docker compose stop cron`, it will NOT start automatically when the Docker daemon restarts (e.g., after an EC2 reboot), unless you've set it to `always` restart and then it might depend on the specific Docker version/config. To be safe, always verify status after maintenance.

## Common Mistakes to Avoid
- **Running Cron in App Code**: Don't initialize `node-cron` inside your `index.js` (web server). This causes duplicate executions if you scale the web server to multiple instances.
- **Missing Error Handling**: Always wrap your job logic in `try-catch` blocks and log errors.
- **Long-Running Jobs**: If a job takes longer than its interval (e.g., a 2-minute job running every minute), `node-cron` will start a second instance. Use "locking" or check task status if this is a risk.
