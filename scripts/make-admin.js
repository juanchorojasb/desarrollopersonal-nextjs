import { clerkClient } from '@clerk/nextjs/server';

// Reemplaza con tu email
const adminEmail = 'juanchorojasb@gmail.com';

async function makeAdmin() {
  try {
    const users = await (await clerkClient()).users.getUserList({
      emailAddress: [adminEmail]
    });
    
    if (users.length > 0) {
      const user = users[0];
      await (await clerkClient()).users.updateUser(user.id, {
        publicMetadata: {
          ...user.publicMetadata,
          role: 'admin'
        }
      });
      console.log('Usuario convertido en admin exitosamente');
    } else {
      console.log('Usuario no encontrado');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

makeAdmin();
