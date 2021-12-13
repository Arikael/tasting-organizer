import {Db} from 'mongodb'
import {Service, MongoDBServiceOptions} from 'feathers-mongodb'
import {Application} from '../../declarations'
import {Id, Params} from '@feathersjs/feathers'
import {BaseWineDto, TastingDto} from '../../types'
import {NotFound} from '@feathersjs/errors'

export class Tasting extends Service<TastingDto> {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MongoDBServiceOptions>, app: Application) {
    super(options)

    const client: Promise<Db> = app.get('mongoClient')
    client.then(db => {
      this.Model = db.collection('tasting-organizer')
    })
  }

  get(id: Id, params?: Params): Promise<TastingDto> {
    const tastings = super.find({
      query: {
        $limit: 1,
        publicId: id
      }
    })

    return tastings.then((results: any) => {
      if(results.length === 0) {
        // TODO doesn't return 404
        return Promise.reject(new NotFound())
      }
      return results
    }).then((results: any) => {
      return this.changeWineNamesForFlightReveal(results[0])
    })
  }

  private changeWineNamesForFlightReveal(tasting: TastingDto): TastingDto {
    if (tasting.revealAfter === 'always') {
      return tasting
    }

    for (let i = 0; i < tasting.flights.length; i++) {
      tasting.flights[i].wines.map((x: BaseWineDto, wineIndex: number) => x.name = `${i}.${wineIndex}`)
    }

    return tasting
  }
}
