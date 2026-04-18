import { AppDataSource } from './src/config/data-source';
import { User } from './src/entities/User';
import * as bcrypt from 'bcrypt';

async function updatePassword() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(User);
  const user = await repo.findOne({ where: { email: 'admin@future.com' } });
  
  if (user) {
    user.password = await bcrypt.hash('123456', 10);
    await repo.save(user);
    console.log('✅ Password updated successfully! New password: 123456');
  } else {
    console.log('User not found.');
  }

  process.exit(0);
}

updatePassword().catch(err => {
  console.error(err);
  process.exit(1);
});
