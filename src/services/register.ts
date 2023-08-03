import { hash } from "bcryptjs";
import { UserRepository } from "@/repositories/users-repository";

interface RegisterServiceProps {
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

export class RegisterService {
  constructor(private usersRepository: UserRepository) {}

  async execute({ name, email, password }: RegisterServiceProps) {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new Error("Email already exists");
    }

    const passwordHash = await hash(password, 6);

    await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHash,
    });
  }
}
