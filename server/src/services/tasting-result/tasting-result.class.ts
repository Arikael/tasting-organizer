import {Db} from 'mongodb'
import {Service, MongoDBServiceOptions} from 'feathers-mongodb'
import {Application} from '../../declarations'
import {Id, Params} from '@feathersjs/feathers'
import {plainToInstance} from 'class-transformer'
import {TastingResultDto} from '../../types'

export class TastingResult extends Service<TastingResultDto> {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MongoDBServiceOptions>, app: Application) {
    super(options)

    const client: Promise<Db> = app.get('mongoClient')

    client.then(db => {
      this.Model = db.collection('tasting-organizer')
    })
  }

  async get(id: Id, params?: Params): Promise<TastingResultDto> {
    const result = await this.Model.aggregate(
      [
        {
          '$match': {
            'publicId': id
          }
        },
        {
          '$project': {
            'scores': '$scores',
            'tasting': {
              'title': '$title',
              'publicId': '$publicId',
            }
          }
        },
        {
          '$unwind': '$scores'
        },
        {
          '$unwind': '$scores.scores'
        },
        {
          $lookup: {
            from: 'collection',
            let: {
              wineId: '$scores.scores.wineId',
              'tastingId': '$_id'
            },
            pipeline: [
              {
                '$unwind': '$flights'
              },
              {
                '$unwind': {
                  'path': '$flights.wines',
                  'includeArrayIndex': 'index'
                }
              },
              {
                $match: {
                  $expr: {
                    '$and': [
                      {
                        '$eq': [
                          '$flights.wines.id',
                          '$$wineId'
                        ]
                      },
                      {
                        '$eq': [
                          '$_id',
                          '$$tastingId'
                        ]
                      }
                    ]
                  },
                }
              },
              {
                $project: {
                  _id: 0,
                  'name': '$flights.wines.name',
                  'flight': '$flights.name',
                  'wineId': '$flights.wines.id',
                  'index': '$index'
                }
              }
            ],
            as: 'wine'
          }
        },
        {
          '$replaceRoot': {
            'newRoot': {
              '$mergeObjects': [
                {
                  '_id': '$_id',
                  'tasting': '$tasting',
                  'scores': '$scores'
                },
                {
                  'wine': {
                    '$arrayElemAt': [
                      '$wine',
                      0
                    ]
                  }
                }
              ]
            }
          }
        },
        {
          '$group': {
            '_id': '$wine',
            'avg': {
              '$avg': '$scores.scores.score'
            },
            'min': {
              '$min': '$scores.scores.score'
            },
            'max': {
              '$max': '$scores.scores.score'
            },
            'stddev': {
              '$stdDevPop': '$scores.scores.score'
            },
            'tasting': {
              '$first': '$tasting'
            },
            'scores': {
              '$addToSet': '$scores'
            }
          }
        },
        {
          '$group': {
            '_id': '$tasting',
            'wineResults': {
              '$addToSet': '$$ROOT'
            }
          }
        }
      ]
    ).toArray()
    console.log(result)
    if (result.length === 0) {
      return Promise.resolve( new TastingResultDto())
    }

    return Promise.resolve(plainToInstance(TastingResultDto, result[0]))
  }
}
