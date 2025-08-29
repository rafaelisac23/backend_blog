import { error } from "console";
import { RequestHandler } from "express";
import z, { email } from "zod";
import { createUser } from "../services/user";

export const SignUp: RequestHandler = async (req, res) => {
  //schema para validação
  const schema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
  });

  const data = schema.safeParse(req.body);

  if (!data.success) {
    res.status(400).json({ error: data.error.flatten().fieldErrors });
    return;
  }

  const newUser = await createUser(data.data);

  if (!newUser) {
    res.status(400).json({ error: "Erro ao criar usuario" });
    return;
  }

  const token = "123"; //TODO: Criar token de acesso

  res.status(201).json({
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    },
    token,
  });
};

export const SignIn: RequestHandler = (req, res) => {};

export const Validate: RequestHandler = (req, res) => {};
