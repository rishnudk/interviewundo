import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterUser } from './RegisterUser';
import { ConflictError } from '../../../domain/errors';
import type { IUserRepository } from '../../../domain/ports/repositories/IUserRepository';
import type { IPasswordService } from '../../../domain/ports/services/IPasswordService';
import type { IAuthTokenService } from '../../../domain/ports/services/IAuthTokenService';
import type { User, UserRole } from '@interviewprep/shared-types';

describe('RegisterUser Use Case', () => {
  let userRepository: IUserRepository;
  let passwordService: IPasswordService;
  let authTokenService: IAuthTokenService;
  let useCase: RegisterUser;

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

    useCase = new RegisterUser(userRepository, passwordService, authTokenService);
  });

  it('should register a new user successfully', async () => {
    const input = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'SecurePassword123!',
    };

    vi.mocked(userRepository.findByEmail).mockResolvedValue(null);
    vi.mocked(passwordService.hash).mockResolvedValue('hashed-password');
    vi.mocked(userRepository.create).mockResolvedValue(mockUser);
    vi.mocked(authTokenService.generateAccessToken).mockResolvedValue('access-token-abc');
    vi.mocked(authTokenService.generateRefreshToken).mockResolvedValue('refresh-token-xyz');

    const result = await useCase.execute(input);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(passwordService.hash).toHaveBeenCalledWith(input.password);
    expect(userRepository.create).toHaveBeenCalledWith({
      name: input.name,
      email: input.email,
      password: 'hashed-password',
      role: 'STUDENT',
    });
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

  it('should throw ConflictError if user email already exists', async () => {
    const input = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'SecurePassword123!',
    };

    vi.mocked(userRepository.findByEmail).mockResolvedValue({
      ...mockUser,
      password: 'hashed-password-existing',
    });

    await expect(useCase.execute(input)).rejects.toThrow(ConflictError);
    await expect(useCase.execute(input)).rejects.toThrow('A user with this email already exists');

    expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(passwordService.hash).not.toHaveBeenCalled();
    expect(userRepository.create).not.toHaveBeenCalled();
  });
});
