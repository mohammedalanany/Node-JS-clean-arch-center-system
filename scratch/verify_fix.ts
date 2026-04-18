import { AppDataSource } from './src/config/data-source';
import { groupService } from './src/features/groups/group.service';
import { GroupRepository } from './src/features/groups/group.repository';
import { Student } from './src/features/students/student.entity';
import { GroupType } from './src/features/groups/group.entity';

async function test() {
  await AppDataSource.initialize();
  console.log('DB Initialized');
  
  const centerId = 1;
  const studentRepo = AppDataSource.getRepository(Student);
  const students = await studentRepo.find({ where: { centerId }, take: 1 });
  
  if (students.length === 0) {
    console.log('No students found to test with');
    process.exit(0);
  }
  
  // 1. Create a temp group
  const group = await groupService.create({
    name: 'Test Delete Group',
    type: GroupType.PUBLIC,
  }, centerId);
  console.log(`Created Group ID: ${group.id}`);
  
  // 2. Add Student
  await groupService.enrollStudent(group.id, centerId, students[0].id);
  console.log(`Enrolled student ID: ${students[0].id}`);
  
  // 3. Remove Student
  console.log('Attempting to remove student...');
  await groupService.removeStudent(group.id, centerId, students[0].id);
  console.log('Student removed successfully');
  
  // 4. Delete Group
  console.log('Attempting to delete group...');
  await groupService.delete(group.id, centerId);
  console.log('Group deleted successfully');
  
  process.exit(0);
}

test().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
