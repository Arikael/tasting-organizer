import { MongoClient } from 'mongodb'
import { Application } from './declarations'

export default function (app: Application): void {
  const connection = app.get('mongodb')
  const database = connection.substr(connection.lastIndexOf('/') + 1)

  const mongoClient = MongoClient.connect(connection, {
    retryWrites: true,
    w: 'majority'
  })
    .then(client => client.db(database))
    .catch(err => console.log(err))

  app.set('mongoClient', mongoClient)
}
