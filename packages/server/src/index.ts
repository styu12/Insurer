import server from './app';
import path from 'path';
import fs from 'fs';

const start = async () => {
  let port = 3000
  if (process.env.PORT) {
    port = parseInt(process.env.PORT)
  }

  try {
    await server.listen({ port: port, host: '0.0.0.0' })
    const swaggerJson = server.swagger({ yaml: false });
    const swaggerPath = path.join(__dirname, '../../client/configs/openapi', 'swagger.json');
    fs.writeFileSync(swaggerPath, JSON.stringify(swaggerJson, null, 2));
    console.log('Server is running at http://localhost:3000')
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
