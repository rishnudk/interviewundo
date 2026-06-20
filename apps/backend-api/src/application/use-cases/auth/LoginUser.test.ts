import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginUser } from './LoginUser';
import { AuthenticationError } from '../../../domain/errors';
import type { IUserRepository } from '../../../domain/ports/repositories/IUserRepository';
import type { IPasswordService } from '../../../domain/ports/services/IPasswordService';
import type { IAuthTokenService } from '../../../domain/ports/services/IAuthTokenService';
import type { User, UserRole } from '@interviewprep/shared-types';

describe('LoginUser Use Case', () => {
  let userRepository: IUserRepository;
  let passwordService: IPasswordService;
  let authTokenService: IAuthTokenService;
  let useCase: LoginUser;

  const mockUser: User = {
    id: 'user-id-123',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'STUDENT' as UserRole,
    streak: 0,
    lastActiveAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    userRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      findByGithubId: vi.fn(),
      updateStreak: vi.fn(),
    };

    passwordService = {
      hash: vi.fn(),
      compare: vi.fn(),
    };

    authTokenService = {
      generateAccessToken: vi.fn(),
      generateRefreshToken: vi.fn(),
      verifyAccessToken: vi.fn(),
      verifyRefreshToken: vi.fn(),
    };

    useCase = new LoginUser(userRepository, passwordService, authTokenService);
  });

  it('should authenticate user successfully with valid credentials', async () => {
    const input = {
      email: 'john@example.com',
      password: 'SecurePassword123!',
    };

    vi.mocked(userRepository.findByEmail).mockResolvedValue({
      ...mockUser,
      password: 'hashed-password-123',
    });
    vi.mocked(passwordService.compare).mockResolvedValue(true);
    vi.mocked(authTokenService.generateAccessToken).mockResolvedValue('access-token-abc');
    vi.mocked(authTokenService.generateRefreshToken).mockResolvedValue('refresh-token-xyz');

    const result = await useCase.execute(input);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(passwordService.compare).toHaveBeenCalledWith(input.password, 'hashed-password-123');
    expect(authTokenService.generateAccessToken).toHaveBeenCalledWith(mockUser.id, mockUser.role);
    expect(authTokenService.generateRefreshToken).toHaveBeenCalledWith(mockUser.id);

    expect(result).toEqual({
      user: {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        image: mockUser.image,
      },
      accessToken: 'access-token-abc',
      refreshToken: 'refresh-token-xyz',
    });
  });

  it('should throw AuthenticationError if user is not found', async () => {
    const input = {
      email: 'john@example.com',
      password: 'SecurePassword123!',
    };

    vi.mocked(userRepository.findByEmail).mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(AuthenticationError);
    await expect(useCase.execute(input)).rejects.toThrow('Invalid email or password');

    expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(passwordService.compare).not.toHaveBeenCalled();
    expect(authTokenService.generateAccessToken).not.toHaveBeenCalled();
  });

  it('should throw AuthenticationError if user has no password', async () => {
    const input = {
      email: 'john@example.com',
      password: 'SecurePassword123!',
    };

    vi.mocked(userRepository.findByEmail).mockResolvedValue({
      ...mockUser,
      password: null,
    });

    await expect(useCase.execute(input)).rejects.toThrow(AuthenticationError);
    await expect(useCase.execute(input)).rejects.toThrow('Invalid email or password');

    expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(passwordService.compare).not.toHaveBeenCalled();
  });

  it('should throw AuthenticationError if password compare returns false', async () => {
    const input = {
      email: 'john@example.com',
      password: 'WrongPassword!',
    };

    vi.mocked(userRepository.findByEmail).mockResolvedValue({
      ...mockUser,
      password: 'hashed-password-123',
    });
    vi.mocked(passwordService.compare).mockResolvedValue(false);

    await expect(useCase.execute(input)).rejects.toThrow(AuthenticationError);
    await expect(useCase.execute(input)).rejects.toThrow('Invalid email or password');

    expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(passwordService.compare).toHaveBeenCalledWith(input.password, 'hashed-password-123');
    expect(authTokenService.generateAccessToken).not.toHaveBeenCalled();
  });
});
