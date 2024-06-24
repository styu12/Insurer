import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { Customer } from '../models/customer'
import { Contract } from '../models/contract'

export const customerRoutes = async (
  server: FastifyInstance,
  options: FastifyPluginOptions
) => {
  server.get('/', async (request, reply) => {
    const { rows } = await server.pg.query('SELECT * FROM customers')
    reply.send(rows)
  })

  server.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const { rows } = await server.pg.query(
      'SELECT * FROM customers WHERE id = $1',
      [id]
    )
    if (rows.length > 0) {
      return rows[0]
    } else {
      reply.status(404).send({ error: 'Customer not found' })
    }
  })

  server.post('/', async (request, reply) => {
    const { name, email, phone, address } = request.body as Customer
    const { rows } = await server.pg.query(
      'INSERT INTO customers (name, email, phone, address) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, phone, address]
    )
    return rows[0]
  })

  server.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const { name, email, phone, address } = request.body as Customer
    const { rows } = await server.pg.query(
      'UPDATE customers SET name = $1, email = $2, phone = $3, address = $4 WHERE id = $5 RETURNING *',
      [name, email, phone, address, id]
    )
    if (rows.length > 0) {
      return rows[0]
    } else {
      reply.status(404).send({ error: 'Customer not found' })
    }
  })

  server.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    await server.pg.query('DELETE FROM customers WHERE id = $1 RETURNING *', [
      id,
    ])
    reply.send({ message: 'Customer deleted' })
  })

  server.post('/:id/contracts', async (request, reply) => {
    const { id } = request.params as { id: string }
    const { productId, startDate, renewalDate, claimDate } =
      request.body as Contract

    const customerCheck = await server.pg.query(
      'SELECT * FROM customers WHERE id = $1',
      [id]
    )
    if (customerCheck.rows.length === 0) {
      reply.status(404).send({ error: 'Customer not found' })
      return
    }
    const productCheck = await server.pg.query(
      'SELECT * FROM products WHERE id = $1',
      [productId]
    )
    if (productCheck.rows.length === 0) {
      reply.status(404).send({ error: 'Product not found' })
      return
    }

    const { rows } = await server.pg.query(
      'INSERT INTO contracts (customer_id, product_id, start_date, renewal_date, claim_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id, productId, startDate, renewalDate, claimDate]
    )
    return rows[0]
  })
}
