import { hash } from "bcryptjs";
import { UserRepository } from "@/repositories/users-repository";
import { UserAlreadyExists } from "@/errors/user-already-exists";
import { User } from "@prisma/client";

interface RegisterUseCaseProps {
  name: string;
  email: string;
  password: string;
}

// SOLID
// S - Single Responsability Principle  ❌ (Princípio da responsabilidade única)
// O - Open Closed Principle            ❌ (Aberto para extensão, fechado para modificação)
// L - Liskov Substitution Principle    ❌ (Substituição de Liskov)
// I - Interface Segregation Principle  ❌ (Segregação de interfaces)
// D - Dependency Inversion Principle   ✅ (Inversão de dependência)

interface RegisterUseCaseResponse {
  user: User;
}

export class RegisterUseCase {
  constructor(private usersRepository: UserRepository) {}

  async execute({ name, email, password }: RegisterUseCaseProps): Promise<RegisterUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExists();
    }

    const passwordHash = await hash(password, 6);

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHash,
    });

    return { user };
  }
}
