import { prisma } from '../config/database';

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error('❌ Error: Please provide an email address.');
    console.log('Usage: npm run make-admin -- <email>');
    console.log('Example: npm run make-admin -- rishn@example.com');
    process.exit(1);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      console.error(`❌ User with email "${email}" not found in the database.`);
      console.log('💡 Make sure you have registered an account on the platform first!');
      process.exit(1);
    }

    const updated = await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { role: 'ADMIN' },
    });

    console.log('\n🎉 SUCCESS! Account Promoted to ADMIN:');
    console.log('-------------------------------------------');
    console.log(`ID:    ${updated.id}`);
    console.log(`Name:  ${updated.name}`);
    console.log(`Email: ${updated.email}`);
    console.log(`Role:  ${updated.role}`);
    console.log('-------------------------------------------');
    console.log('\n👉 Next Steps to Login to Admin Side:');
    console.log(
      '1. Log out of your current session on the frontend if you are currently logged in.',
    );
    console.log('2. Log back in with this email and your password.');
    console.log('3. Your new JWT token will now include the "ADMIN" role.');
    console.log(
      '4. You will see the "Admin Area" option appear at the bottom of the Left Sidebar, or you can directly navigate to /admin!',
    );
  } catch (error) {
    console.error('❌ Error promoting user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
