import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from '@framework/auth/models/entities/user.entity';
import { UserRepository } from '@framework/auth/models/repositories/user.repository';

const mockCredentialsDto = { username: 'username', password: 'test@Password!' };

describe('UserRepository', () => {
  let userRepo;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepo = await module.get<UserRepository>(UserRepository);
  });

  describe('signUp', () => {
    let save;

    beforeEach(() => {
      save = jest.fn();
      userRepo.create = jest.fn().mockReturnValue({ save });
    });

    it('successfully signs up the user', async () => {
      save.mockResolvedValue(undefined);

      await expect(() => userRepo.signUp(mockCredentialsDto)).not.toThrow();
    });

    it('throws a conflict exception if a user already exists', async () => {
      save.mockRejectedValue({ code: '23505' });

      await expect(userRepo.signUp(mockCredentialsDto)).rejects.toThrow(ConflictException);
    });

    it('throws an internal server error exception if saving the user fails', async () => {
      save.mockRejectedValue({ code: '12921' });

      await expect(userRepo.signUp(mockCredentialsDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('validateUserPassword', () => {
    let user;

    beforeEach(() => {
      userRepo.findOne = jest.fn();

      user = new User();
      user.username = 'username';
      user.validatePassword = jest.fn();
    });

    it('returns the username if the validation is successful', async () => {
      userRepo.findOne.mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(true);

      const result = await userRepo.validateUserPassword(mockCredentialsDto);

      expect(result).toEqual('username');
    });

    it('returns null if the user cannot be found', async () => {
      userRepo.findOne.mockResolvedValue(null);

      const result = await userRepo.validateUserPassword(mockCredentialsDto);

      expect(user.validatePassword).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('returns null if the password is invalid', async () => {
      userRepo.findOne.mockResolvedValue(null);
      user.validatePassword.mockResolvedValue(false);
      const result = await userRepo.validateUserPassword(mockCredentialsDto);

      expect(user.validatePassword).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
