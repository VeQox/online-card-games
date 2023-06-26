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

<details>
<summary>Deploy with http</summary>

```nginx
# /etc/nginx/conf.d/reverse-proxy.conf

server {
    # HTTP Port: 80
    listen 80;
    # External IP Adress
    server_name xxx.xxx.xxx.xxx;

    location / {
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_connect_timeout 300;
        proxy_set_header Connection "";

        # http://127.0.0.1:8080
        proxy_pass <internal-node-server-ip>;
    }
}
```
</details>

<details>
<summary>Deploy with self signed ssl-certificate</summary>


### [create a self signed ssl-certificate](https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-in-ubuntu-20-04-1)

For this to work you need to open port 443 with [firewalld](#deployment)

```nginx
# /etc/nginx/conf.d/reverse-proxy.conf

server {
    listen 80;

    # External IP Adress
    server_name xxx.xxx.xxx.xxx;

    # Redirect to https
    return 302 https://$server_name$request_uri;
}

server {
    # HTTPS Port: 443
    listen 443 ssl;

    # include conf files
    include snippets/self-signed.conf;
    include snippets/ssl-params.conf;

    # External IP Adress
    server_name xxx.xxx.xxx.xxx;

    location / {
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_connect_timeout 300;
        proxy_set_header Connection "";

        # http://127.0.0.1:8080
        proxy_pass <internal-node-server-ip>;
    }
}
```

</details>

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

DEV=<false/true>
# use for secure cookies and console outputs

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
