import { RequestHandler } from "express";
import z from "zod";
import { createUser, verifyUser } from "../services/user";
import { createToken } from "../services/auth";
import { error } from "console";

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

  const token = createToken(newUser);

  res.status(201).json({
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    },
    token,
  });
};

export const SignIn: RequestHandler = async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const data = schema.safeParse(req.body);

  // trata o erro do zod
  if (!data.success) {
    res.status(400).json({ error: data.error.flatten().fieldErrors });
    return;
  }

  const user = await verifyUser(data.data);

  if (!user) {
    res.status(401).json({ error: "Acesso negado" });
    return;
  }

  const token = createToken(user);

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  });
};

export const Validate: RequestHandler = (req, res) => {};
