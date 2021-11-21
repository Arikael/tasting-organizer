import {Db} from 'mongodb'
import {Service, MongoDBServiceOptions} from 'feathers-mongodb'
import {Application} from '../../declarations'
import {Id, Paginated, Params} from '@feathersjs/feathers'

export class Tasting extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MongoDBServiceOptions>, app: Application) {
    super(options)

    const client: Promise<Db> = app.get('mongoClient')
    client.then(db => {
      this.Model = db.collection('tasting-organizer')
    })
  }

  get(id: Id, params?: Params): Promise<any> {
    console.log(id)
    const tastings = super.find({
      query: {
        $limit: 1,
        publicId: id
      }
    })
console.log('asdg')
    return tastings.then((results: any) => {
      return results.length === 1 ? results[0] : null
    })
  }
}
