import { UsersRepository } from './users.repository';
import { NotFoundError } from '../../utils/errors';

export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async getOwnProfile(userId: string) {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found', 'USER_NOT_FOUND');
    }

    const { passwordHash, ...userWithoutPassword } = user;
    
    return {
      ...userWithoutPassword,
      badges: [],
      topicRatings: [],
      recentDebates: [],
    };
  }
}
