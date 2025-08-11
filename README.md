
## 🧑‍💻 Developer Setup Guide (with Docker)

This project uses **Docker** to simplify development and ensure consistency across environments. No need to install Node.js, MongoDB, or any dependencies manually.

### 📦 Prerequisites

- **Install Docker Desktop**: [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
- Make sure Docker is running before continuing.

### 🛠️ Getting Started

#### 2. Start the Project

Make sure you're in the root directory of the project (where `docker-compose.yml` is located), then run:

```bash
docker-compose up --build

```

This command will:
- Build the Docker images for the frontend and backend.
- Start the containers.
- Install all necessary dependencies inside the containers.

After the build, the app should be the frontend will be available at: [http://localhost:3000] and the admin will be available at: [http://localhost:3001]

#### 3. Stopping the App

To stop the containers, press `Ctrl+C` in the terminal or run:

```bash
docker-compose down
```

This will shut down all running containers.

---

## 🧪 Running Tests

You can run tests inside the container like this:

```bash
docker-compose exec <service_name> npm test
```

Replace `<service_name>` with the appropriate service name (e.g., `frontend`, `backend`) defined in `docker-compose.yml`.

---

## 🧾 Common Docker Commands

| Action                     | Command                               |
|---------------------------|----------------------------------------|
| View running containers   | `docker ps`                            |
| Enter container shell     | `docker exec -it <container> sh`       |
| View logs                 | `docker-compose logs -f`               |
| Stop all containers       | `docker-compose down`                  |


---

## 📄 License

This project is licensed under the [MIT License](LICENSE).