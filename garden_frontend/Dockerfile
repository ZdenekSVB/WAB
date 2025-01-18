# Použití Node.js image
FROM node:18

# Nastavení pracovního adresáře
WORKDIR /usr/src/app

# Kopírování balíčků a instalace závislostí
COPY package.json package-lock.json ./
RUN npm install

# Kopírování zdrojových kódů
COPY . .

# Sestavení aplikace
RUN npm run build

# Použití nginx pro servírování statických souborů
FROM nginx:latest
COPY --from=0 /usr/src/app/dist /usr/share/nginx/html

# Exponování portu
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
