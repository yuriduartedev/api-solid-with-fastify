import { beforeEach, describe, expect, it } from "vitest";
import { GetUserProfileUseCase } from "@/use-cases/get-user-profile";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcryptjs";
import { ResourceNotFoundError } from "@/errors/resource-not-found";

let usersRepository: InMemoryUsersRepository;
let getUserProfileUseCase: GetUserProfileUseCase;

describe("Get User Profile Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    getUserProfileUseCase = new GetUserProfileUseCase(usersRepository);
  });

  it("should be able to get user profile", async () => {
    const currentUser = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("abc123", 6),
    });

    const { user } = await getUserProfileUseCase.execute({
      id: currentUser.id,
    });

    expect(user.name).toEqual("John Doe");
    expect(user.email).toEqual("johndoe@example.com");
  });

  it("should not be able to get user profile if user does not exists", () => {
    expect(
      getUserProfileUseCase.execute({
        id: "no-existing-user-id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
