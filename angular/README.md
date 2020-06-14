# DmePortalAngular5 documentation structure

**Modules** folder contains `ElementsMarkupsModule` which includes separate UI elements with markups  
**Components** folder contains all logical `Components` inside project

# DmePortalAngular5

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.4.

# NGINX installation

**WINDOWS installation**

1. configure `hosts` settings (c:\Windows\System32\Drivers\etc\hosts): `127.0.0.1 niko.loc` `127.0.0.1 v2.niko.loc`
2. install [nginx](http://nginx.org/ru/download.html)
3. add config to /nginx/conf/nginx.conf
4. start nginx

**Mac OS installation**

1. configure `hosts` settings (nano /etc/hosts/): `127.0.0.1 niko.loc` `127.0.0.1 v2.niko.loc`
2. install nginx (brew install nginx)
3. create niko.conf file (touch /usr/local/etc/nginx/servers/niko.conf)
4. add config to niko.conf
5. sudo nginx -s stop
6. sudo nginx -s reload
7. sudo nginx    




`nginx config`:

```
server {
listen 8082;
server_name niko.loc;

    location ~* ^/v2 {
        rewrite /v2/(.*) /$1 break;
        proxy_pass http://127.0.0.1:4200;
        #proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location ~* (\/\S+\.module.chunk.js|\/styles.bundle.js|\/polyfills.bundle.js|\/inline.bundle.js|\/global-app-config.js|\/main.bundle.js|\/vendor.bundle.js) {
        proxy_pass http://127.0.0.1:4200;
        #proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Real-IP $remote_addr;
    }


    location ~ ^(\/\S+\/|config\.js|\/config\.route\.js) {
        proxy_pass http://127.0.0.1:3000;
        #proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Real-IP $remote_addr;
    }


    location / {
        proxy_pass http://127.0.0.1:3000;
        #proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
