import { AppDataSource } from '../../src/config/data-source';
import { groupService } from '../../src/features/groups/group.service';
import { GroupRepository } from '../../src/features/groups/group.repository';

async function test() {
  await AppDataSource.initialize();
  console.log('DB Initialized');
  
  const centerId = 1; // Assuming center 1 exists
  const groups = await GroupRepository.find({ where: { centerId }, relations: ['students'] });
  
  if (groups.length === 0) {
    console.log('No groups found for center 1');
    return;
  }
  
  const group = groups[0];
  console.log(`Testing with Group: ${group.name} (ID: ${group.id}), Students: ${group.students.length}`);
  
  // 1. Test Remove Student if any
  if (group.students.length > 0) {
    const studentId = group.students[0].id;
    console.log(`Attempting to remove student ID: ${studentId}`);
    try {
      await groupService.removeStudent(group.id, centerId, studentId);
      console.log('Student removed successfully');
    } catch (err) {
      console.error('Error removing student:', err);
    }
  } else {
    console.log('No students to remove');
  }
  
  // 2. Test Delete Group
  console.log(`Attempting to delete group ID: ${group.id}`);
  try {
    await groupService.delete(group.id, centerId);
    console.log('Group deleted successfully');
  } catch (err) {
    console.error('Error deleting group:', err);
  }
  
  process.exit(0);
}

test();
