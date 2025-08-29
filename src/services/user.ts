import bcrypt from "bcryptjs";
import { prisma } from "../libs/prisma";

type CreateUserProps = {
  name: string;
  email: string;
  password: string;
};
export const createUser = async ({
  email,
  name,
  password,
}: CreateUserProps) => {
  email = email.toLowerCase();

  //aqui ele vai pesquisar se tem um usuario com esse email
  const user = await prisma.user.findFirst({ where: { email } });

  //Se ja tiver retorna falso para a chamada
  if (user) return false;

  //aqui para nao ter que jogar a senha direto no banco
  //voce usa o bcrypt para poder gerar um hash
  const newPassword = bcrypt.hashSync(password, 10);

  return await prisma.user.create({
    data: { name, email, password: newPassword },
  });
};
