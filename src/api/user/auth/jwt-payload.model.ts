export interface JwtPayload {
    id: string;
    role: string;
    iat?: Date;
    jit: string;
}
