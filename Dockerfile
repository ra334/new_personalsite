FROM node:20-slim AS deps

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN npm ci

FROM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN apt-get update && apt-get install -y libexpat1 && rm -rf /var/lib/apt/lists/*

RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"

COPY --from=builder /app ./

COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/db ./db
COPY --from=builder /app/drizzle ./drizzle

COPY --chown=nextjs:nodejs entrypoint.sh .

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]

EXPOSE 3000

CMD ["npm", "start"]