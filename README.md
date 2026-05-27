```
bot-craft/
├── 📁 .github/
│   └── 📁 workflows/
│       └── ci-cd.yml             # GitHub Actions for automated linting/testing
├── 📁 core/
│   ├── 📁 src/
│   │   ├── 📁 models/        # Database models (User, Bot, Server)
│   │   └── 📁 engine/        # Mineflayer OOP bot wrappers & state machines
│   └── package.json          # Named "@omnibot/core"
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 assets/        # CSS, Minecraft icons, dashboard designs
│   │   └── 📁 components/    # 3D Viewer canvas and bot action controllers
│   └── index.html            # Universal dashboard entry point
├── 📁 web/
│   ├── 📁 src/
│   │   ├── 📁 controllers/   # MVC Controllers handling requests
│   │   └── server.js         # Express/Fastify app entry point
│   ├── Dockerfile            # Container definition for web deployment
│   └── package.json          # Named "@omnibot/web"
├── 📁 electron/
│   ├── main.js               # Electron main process
│   ├── preload.js            # Secure IPC bridge context definition
│   ├── electron-builder.yml  # .exe and installer build settings
│   └── package.json          # Named "@omnibot/desktop"
├── .env.example                  # Template for local environment configs
├── .gitignore                    # Prevents tracking node_modules, .env, secrets
├── docker-compose.yml            # Spins up Node web-backend & MySQL container
└── package.json                  # Root configurations orchestrating workspaces
```
