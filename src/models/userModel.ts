export interface User {
    _id?: string,
    username: string;
    name: string;
    mail: string;
    password: string;
    tipo: 'admin' | 'wineLover' | 'wineMaker';
    habilitado: boolean;
    experiences: string[];
    amigos: string[]; // Lista de amigos
    solicitudes: string[]; // Lista de solicitudes de amistad
};

export type PublicUserInfo = Pick<User, 'name'>;

export type PrivateUserInfo = Pick<User, 'username' | 'password'>;

export type NewUser = Omit<User, '_id'>;