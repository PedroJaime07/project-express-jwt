import type { Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client.js";
import { usersRepository } from "../repository/users-repository.js";
import { error } from "node:console";

type IdParams = { id: string };

function parseId(value: string) {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

function isNotError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  );
}

async function getAllUsers( req: Request, res: Response) {
  const users = await usersRepository.getAllUsers();
  return res.status(200).json(users);
}

async function getUserById(req: Request<IdParams>, res: Response) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const user = await usersRepository.getUserById(id);

  if (isNotError(user)) {
    return res.status(400).json({ error: "User not found" });
  }

  return res.status(200).json(user);
}

async function createUser(req: Request, res: Response) {
  const { name, email, password, role } = req.body ?? {};
  if (typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ error: "Name is required" });
  }

  if (typeof email !== "string" || email.trim() === "") {
    return res.status(400).json({ error: "Email is required" });
  }

  if (typeof password !== "string" || password.trim() === "") {
    return res.status(400).json({ error: "Password is required" });
  }

  if (
    typeof role !== "string" ||
    !["admin", "user", "manager"].includes(role)
  ) {
    return res.status(400).json({ error: "Invalid role" });
  }

  const user = await usersRepository.createUser({
    name,
    email,
    password,
    role,
  });
  return res.status(201).json(user);
}

async function createManyUsers(req: Request, res: Response) {
  const { users } = req.body ?? {};

  if (!Array.isArray(users) || users.length === 0) {
    return res.status(400).json({ menssage: "Sem usuários" });
  }

  for (const user of users) {
    if (typeof user.name !== "string" || user.name.trim() === "") {
      return res.status(400).json({ error: "Name is required" });
    }

    if (typeof user.email !== "string" || user.email.trim() === "") {
      return res.status(400).json({ error: "Email is required" });
    }

    if (typeof user.password !== "string" || user.password.trim() === "") {
      return res.status(400).json({ error: "Password is required" });
    }

    if (
      typeof user.role !== "string" ||
      !["admin", "user", "manager"].includes(user.role)
    ) {
      return res.status(400).json({ error: "Invalid role" });
    }
  }

  await usersRepository.createManyUsers({users})
  return res.status(200).json(users)
}

async function updateUser(req: Request<IdParams>, res: Response) {
  const id = parseId(req.params.id);

  if (id === null) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  const { name, email, password, role } = req.body ?? {};

  if (name !== undefined && (typeof name !== "string" || name.trim() === "")) {
    return res.status(400).json({ message: "name deve ser um texto" });
  }

  if (
    email !== undefined &&
    (typeof email !== "string" || email.trim() === "")
  ) {
    return res.status(400).json({ message: "email inválido" });
  }

  if (
    password !== undefined &&
    (typeof password !== "string" || password.trim() === "")
  ) {
    return res.status(400).json({ message: "password inválido" });
  }

  if (
    email !== undefined &&
    (typeof email !== "string" || email.trim() === "")
  ) {
    return res.status(400).json({ message: "email inválido" });
  }

  if (role !== undefined && (typeof role !== "string" || role.trim() === "")) {
    return res.status(400).json({ message: "role inválido" });
  }

  try {
    const user = await usersRepository.updateUser(id, {
      name,
      email,
      password,
      role,
    });
    return res.status(200).json(user);
  } catch (error) {
    if (isNotError(error)) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    throw error;
  }
}

async function deleteUser(req: Request<IdParams>, res: Response) {
  const id = parseId(req.params.id);

  if (id === null) {
    return res.status(400).json({ message: "ID inválido" });
  }

  try {
    const user = await usersRepository.deleteUser(id);
    return res.status(200).json({ message: `Usuário ${user.name} deletado` });
  } catch (error) {
    if (isNotError(error)) {
      return res.status(400).json({ message: "Usuário não encontrado" });
    }
  }
}

export const usersController = {
  getAllUsers,
  getUserById,
  createUser,
  createManyUsers,
  updateUser,
  deleteUser,
};
