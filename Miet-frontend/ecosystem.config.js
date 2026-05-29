module.exports = {
  apps: [
    {
      name: "miet-frontend",
      script: "npm",
      args: "start",
      cwd: "/var/www/frontend",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        NEXT_PUBLIC_API_URL: "https://miet.life"
      }
    }
  ]
}
