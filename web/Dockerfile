# Use the official Node 20 Slim image
FROM node:20-slim

# Set the working directory inside the container
WORKDIR /app

# Install Linux graphical dependencies required for canvas and 3D rendering
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Set a default port (8000) but allow it to be overridden
ARG PORT=8000
ENV PORT=${PORT}

# Expose the web server port
EXPOSE ${PORT}

# Start the application
CMD ["npm", "start"]