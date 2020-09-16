import * as bcrypt from 'bcryptjs';
import { mocked } from 'ts-jest/utils';
import { User } from '@framework/auth/models/entities/user.entity';

const mockBcrypt = mocked(bcrypt, true);

describe('User Entity', () => {
  let user: User;

  beforeEach(async () => {
    user = new User();
    user.password = 'password';
  });

  describe('validatePassword', () => {
    it('returns true if the password is valid', async () => {
      mockBcrypt.compare = jest.fn().mockResolvedValue(true);

      expect(mockBcrypt.compare).not.toHaveBeenCalled();

      const result = await user.validatePassword('password');

      expect(mockBcrypt.compare).toHaveBeenCalledWith('password', 'password');
      expect(result).toEqual(true);
    });

    it('returns false if the password is invalid', async () => {
      mockBcrypt.compare = jest.fn().mockResolvedValue(false);

      expect(mockBcrypt.compare).not.toHaveBeenCalled();

      const result = await user.validatePassword('wrong-password');

      expect(mockBcrypt.compare).toHaveBeenCalledWith('wrong-password', 'password');
      expect(result).toEqual(false);
    });
  });
});
