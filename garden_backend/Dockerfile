# Použití Node.js image
FROM node:18

# Nastavení pracovního adresáře v kontejneru
WORKDIR /usr/src/app

# Kopírování package.json a package-lock.json pro instalaci závislostí
COPY package.json package-lock.json ./
RUN npm install

# Kopírování zdrojového kódu do kontejneru
COPY . .

# Nastavení proměnných prostředí (volitelné)
ENV PORT=5000
ENV NODE_ENV=production

# Kompilace TypeScriptu
RUN npm run build

# Exponování portu, na kterém běží server
EXPOSE 5000

# Spuštění serveru
CMD ["npm", "run", "start"]
