# Použití Node.js image
FROM node:18

# Nastavení pracovního adresáře v kontejneru
WORKDIR /usr/src/app

# Kopírování balíčků a instalace závislostí
COPY package.json package-lock.json ./
RUN npm install

# Kopírování zdrojových kódů
COPY . .

# Nastavení proměnných prostředí (volitelně)
ENV PORT=5000
ENV NODE_ENV=production

# Kompilace TypeScriptu
RUN npm run build

# Exponování portu
EXPOSE 5000

# Spuštění serveru
CMD ["npm", "run", "start"]
