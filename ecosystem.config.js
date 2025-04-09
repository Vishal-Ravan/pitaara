module.exports = {
    apps: [
      {
        name: "pittara-frontend",
        script: "sh",
        args: "-c 'npm run build && npm start'",
        watch: true, // Disable watch in production
        env: {
          NODE_ENV: "production",
          PORT: 3000
        }
      }
    ]
  };