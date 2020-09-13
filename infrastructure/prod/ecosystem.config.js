module.exports = {
  apps: [
    {
      name: "app",
      script: "npm",
      args: "run prod:start --max_old_space_size=4096",
      cwd: "./packages/app",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "server",
      script: "npm",
      args: "run prod:start --max_old_space_size=4096",
      cwd: "./packages/server",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
  deploy: {
    staging: {
      user: "ubuntu",
      host: "128.31.24.252",
      ref: "origin/master",
      repo: "https://github.com/sandboxnu/office-hours.git",
      path: "/var/www",
      "pre-deploy-local": "",
      "post-deploy":
        "yarn && yarn build && yarn typeorm migration:run && yarn prod:start",
      "pre-setup": "",
    },
    production: {
      user: "ubuntu",
      host: "128.31.25.65",
      ref: "origin/master",
      repo: "https://github.com/sandboxnu/office-hours.git",
      path: "/var/www",
      "pre-deploy-local": "",
      "post-deploy":
        "yarn && yarn build && yarn typeorm migration:run && yarn prod:start",
      "pre-setup": "",
    },
  },
};
