import { User } from "@prisma/client";

import { ResourceNotFoundError } from "@/errors/resource-not-found";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";

interface GetUserProfileUseCaseRequest {
  id: string;
}

interface GetUserProfileUseCaseResponse {
  user: User;
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: PrismaUsersRepository) {}

  async execute({ id }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    return { user };
  }
}
