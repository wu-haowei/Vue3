# 使用官方 Node 鏡像作為基礎鏡像
FROM node:20

# 设置工作目录
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./
EXPOSE 3000
# 安装依赖
RUN npm install

# 複製所有檔案到工作目錄
COPY . .

# 運行開發伺服器
CMD ["npm", "run", "dev"]
