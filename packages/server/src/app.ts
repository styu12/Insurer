import fastify from 'fastify'
import fastifyEnv from '@fastify/env'
import postgresConnector from './plugins/postgres'
import fastifySwagger from './plugins/swagger'
import routes from './routes'

const server = fastify({
  logger: true,
})

const envSchema = {
  type: 'object',
  required: [
    'PORT',
    'POSTGRES_URL',
    'NAVER_USER',
    'NAVER_PASS',
    'NAVER_EMAIL',
    'NAVER_SMTP_HOST',
    'NAVER_SMTP_PORT',
  ],
  properties: {
    PORT: { type: 'string', default: '5000' },
    POSTGRES_URL: { type: 'string' },
    NAVER_USER: { type: 'string' },
    NAVER_PASS: { type: 'string' },
    NAVER_EMAIL: { type: 'string' },
    NAVER_SMTP_HOST: { type: 'string' },
    NAVER_SMTP_PORT: { type: 'string', default: '587' },
  },
}

server
  .register(fastifyEnv, {
    schema: envSchema,
    dotenv: true,
  })
  .ready((err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log('Environment variables loaded successfully')
  })

server.register(postgresConnector)
server.register(fastifySwagger)
server.register(routes)

export default server
