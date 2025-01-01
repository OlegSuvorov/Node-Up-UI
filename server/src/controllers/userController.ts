import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';

const userRepository = AppDataSource.getRepository(User);

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    const skip = (page - 1) * limit;

    const queryBuilder = userRepository.createQueryBuilder('user');

    if (search) {
      queryBuilder.where(
        '(LOWER(user.email) LIKE LOWER(:search) OR LOWER(user.first_name) LIKE LOWER(:search) OR LOWER(user.last_name) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const [users, total] = await queryBuilder
      .select([
        'user.id',
        'user.email',
        'user.firstName',
        'user.lastName',
        'user.isActive',
        'user.createdAt',
        'user.updatedAt',
      ])
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    res.json({
      items: users,
      total,
      page,
      limit,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await userRepository.findOne({
      where: { id: parseInt(req.params.id) },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'isActive',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, isActive } = req.body;
    const user = await userRepository.findOne({
      where: { id: parseInt(req.params.id) },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await userRepository.save({
      ...user,
      firstName,
      lastName,
      email,
      isActive,
    });
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await userRepository.findOne({
      where: { id: parseInt(req.params.id) },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await userRepository.remove(user);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};
