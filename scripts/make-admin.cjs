const { clerkClient } = require('@clerk/nextjs/server');

// Email del administrador
const adminEmail = 'juanchorojasb@gmail.com';

async function makeAdmin() {
  try {
    const users = await clerkClient.users.getUserList({
      emailAddress: [adminEmail]
    });
    
    if (users.length > 0) {
      const user = users[0];
      await clerkClient.users.updateUser(user.id, {
        publicMetadata: {
          ...user.publicMetadata,
          role: 'admin'
        }
      });
      console.log('Usuario convertido en admin exitosamente');
      console.log('Email:', user.emailAddresses[0].emailAddress);
      console.log('ID:', user.id);
    } else {
      console.log('Usuario no encontrado con email:', adminEmail);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

makeAdmin();
