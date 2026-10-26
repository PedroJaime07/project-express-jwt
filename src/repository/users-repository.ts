import prisma from "../database/prisma.js"

type CreateUserParams = {
    name: string;
    email: string;
    password: string;
    role: string;
}

type CreateManyUsersParams = {
    users: CreateUserParams[]
}

type UpdateUserParams = Partial<CreateUserParams>

async function getAllUsers() {
    return await prisma.users.findMany({
        orderBy: {id: 'asc'}
    })
}

async function getUserById(id: number) {
    return await prisma.users.findUnique({
        where: {id}
    })
}

async function findUserByEmail(email: string) {
    return await prisma.users.findUnique({
        where: {email}
    })
}




async function createUser(data: CreateUserParams) {
    return await prisma.users.create({
        data
    })
}

async function createManyUsers({users}: CreateManyUsersParams) {
    return await prisma.users.createMany({
        data: users
    })
}

async function updateUser(id: number, data: UpdateUserParams) {
    return await prisma.users.update({
        where: {id},
        data
    })
}

async function deleteUser(id: number) {
    return await prisma.users.delete({
        where: {id}
    })
}

export const usersRepository = { getAllUsers, getUserById, findUserByEmail, createUser, createManyUsers, updateUser, deleteUser }
