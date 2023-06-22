# Card Game Client

## Prerequisites

```bash
# install dependecies
npm i
```

## Developing

```bash
npm run dev
```

## Building

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Deployment

For this to work either PORT `80`or `443` need to be forwarded

```bash
sudo apt install firewalld

# for http
sudo firewall-cmd --permanent --zone=public --add-port=80/tcp
# for https
sudo firewall-cmd --permanent --zone=public --add-port=443/tcp

# reload 
sudo firewall-cmd --reload
```

Is this safe? Is this recommended? Idk i aint a security specialist

### NGNIX

```bash
# install nginx
sudo apt install nginx

# verify version
sudo nginx -v
```

```nginx
# /etc/nginx/conf.d/reverse-proxy.conf

server {
    # HTTP Port: 80
    # HTTPS Port: 443
    listen 80;
    # External IP Adress
    server_name xxx.xxx.xxx.xxx;

    location / {
        # http://127.0.0.1:8080 / HOST
        proxy_pass <internal-node-server-ip>;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# test configuration
sudo nginx -t
# reload nginx
sudo systemctl reload nginx  
```

### Node Server

```bash
# build using @sveltejs/adapter-node
npm run build

# install dotenv
npm install dotenv
```

```bash
# .env

HOST=<internal-ip>
# 127.0.0.1
PORT=<internal-port>
# 8080

ORIGIN=<external-ip / domain> 
# http://127.0.0.1:8080

# https://kit.svelte.dev/docs/adapter-node
# PROTOCOL_HEADER=x-forwarded-proto 
# HOST_HEADER=x-forwarded-host
# ADDRESS_HEADER=True-Client-IP
```

```bash
# run the application
node -r dotenv/config build
```
