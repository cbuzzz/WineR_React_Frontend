export interface User {
    _id?: string,
    username: string;
    name: string;
    mail: string;
    password: string;
    tipo: 'admin' | 'wineLover' | 'wineMaker';
    habilitado: boolean;
};

export type PublicUserInfo = Pick<User, 'name'>;

export type PrivateUserInfo = Pick<User, 'username' | 'password'>;

export type NewUser = Omit<User, '_id'>;