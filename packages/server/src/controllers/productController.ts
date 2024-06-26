import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { Product } from '../models/product'

export const productRoutes = async (
  server: FastifyInstance,
  options: FastifyPluginOptions
) => {
  server.get('/', async (request, reply) => {
    const { rows } = await server.pg.query('SELECT * FROM products')
    reply.send(rows)
  })

  server.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const { rows } = await server.pg.query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    )
    if (rows.length > 0) {
      return rows[0]
    } else {
      reply.status(404).send({ error: 'Product not found' })
    }
  })

  server.post('/', async (request, reply) => {
    const { name, description } = request.body as Product
    const { rows } = await server.pg.query(
      'INSERT INTO products (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    )
    return rows[0]
  })

  server.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const { name, description } = request.body as Product
    const { rows } = await server.pg.query(
      'UPDATE products SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description, id]
    )
    if (rows.length > 0) {
      return rows[0]
    } else {
      reply.status(404).send({ error: 'Product not found' })
    }
  })

  server.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    await server.pg.query('DELETE FROM products WHERE id = $1 RETURNING *', [
      id,
    ])
    reply.send({ message: 'Product deleted' })
  })
}
