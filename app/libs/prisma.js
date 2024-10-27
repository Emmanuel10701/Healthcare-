// lib/prisma.js
const { PrismaClient } = require('@prisma/client');

let prisma;

if (process.env.NODE_ENV !== 'production') {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
} else {
  prisma = new PrismaClient();
}

module.exports = prisma;
