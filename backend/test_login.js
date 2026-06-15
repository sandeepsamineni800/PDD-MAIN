const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

async function testLogin() {
  try {
    const email = 'test@example.com';
    const password = 'password123';
    
    console.log('Finding user...');
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log('User not found');
      return;
    }
    
    console.log('Comparing password...');
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('isValidPassword:', isValidPassword);
    
    console.log('Signing token...');
    const token = jwt.sign({ id: user.id, email: user.email }, 'test');
    
    console.log('Done!');
  } catch (error) {
    console.error('Login error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
