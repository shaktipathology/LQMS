export default () => ({
  port: parseInt(process.env.API_PORT || '4000', 10),
  database: {
    host: process.env.POSTGRES_HOST || 'postgres',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    username: process.env.POSTGRES_USER || 'labqms',
    password: process.env.POSTGRES_PASSWORD || 'labqms',
    database: process.env.POSTGRES_DB || 'labqms',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret',
    expiresIn: '1h',
  },
  minio: {
    endPoint: process.env.MINIO_ENDPOINT || 'minio',
    port: parseInt(process.env.MINIO_PORT || '9000', 10),
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY || 'minio',
    secretKey: process.env.MINIO_SECRET_KEY || 'minio123',
    bucket: process.env.MINIO_BUCKET || 'labqms-docs',
  },
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },
  organisation: {
    name: process.env.ORG_NAME || 'AIIMS Bhopal',
    lab: process.env.LAB_NAME || 'Department of Pathology & Lab Medicine',
    timezone: process.env.DEFAULT_TIMEZONE || 'Asia/Kolkata',
  },
});
