import User, { UserPrivate } from "../interfaces/user.interface";
import Response from "../types/response.type";
declare const create: (user: UserPrivate) => Response<User>;
declare const getUsers: (skip?: number, limit?: number) => Response<User[]>;
declare const getUser: (idQuery: string) => Response<User>;
declare const getUserByEmail: (password: boolean, emailQuery: string) => Promise<{
    ok: false;
} | {
    ok: true;
    data: User | UserPrivate;
}>;
declare const getUserByOauth: (oauthQuery: string) => Promise<{
    ok: false;
} | {
    ok: true;
    data: User | UserPrivate;
}>;
declare const updateUser: (id: string, dataToUpdate: object) => Response<User>;
declare const addBalance: (id: string, amount: number) => Response<User>;
declare const deleteUser: (id: string) => Response<null>;
declare const updatePassword: (email: string, password: string) => Response<null>;
export { create, getUser, getUsers, getUserByEmail, updateUser, deleteUser, getUserByOauth, updatePassword, addBalance };
