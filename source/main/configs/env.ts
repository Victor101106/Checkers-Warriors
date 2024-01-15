export const env = {
    accessTokenSecretKey: process.env.ACCESS_TOKEN_SECRET_KEY ?? '',
    port: Number(process.env.PORT) ?? 3030,
}