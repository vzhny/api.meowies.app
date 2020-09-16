import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtStrategy } from '@framework/auth/strategy/jwt.strategy';
import { UserRepository } from '@framework/auth/models/repositories/user.repository';
import { User } from '@framework/auth/models/entities/user.entity';

const mockUserRepo = () => ({
  findOne: jest.fn(),
});

describe('JWT Strategy', () => {
  const payload = { username: 'test-user' };
  let jwtStrategy: JwtStrategy;
  let userRepo;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [JwtStrategy, { provide: UserRepository, useFactory: mockUserRepo }],
    }).compile();

    jwtStrategy = await module.get<JwtStrategy>(JwtStrategy);
    userRepo = await module.get<UserRepository>(UserRepository);
  });

  describe('validate', () => {
    it('validates and returns the user based on JWT payload', async () => {
      const user = new User();
      user.username = 'test-user';

      userRepo.findOne.mockResolvedValue(user);

      const result = await jwtStrategy.validate(payload);
      expect(userRepo.findOne).toHaveBeenCalledWith(payload);
      expect(result).toEqual(user);
    });

    it('throws an unauthorized exception if the user cannot be found', async () => {
      userRepo.findOne.mockResolvedValue(null);

      expect(jwtStrategy.validate(payload)).rejects.toThrow(UnauthorizedException);
    });
  });
});
