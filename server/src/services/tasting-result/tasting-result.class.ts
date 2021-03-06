import {Db} from 'mongodb'
import {Service, MongoDBServiceOptions} from 'feathers-mongodb'
import {Application} from '../../declarations'
import {Id, Params} from '@feathersjs/feathers'
import {plainToInstance} from 'class-transformer'
import {TastingResultDto} from '../../types'

export class TastingResult extends Service<TastingResultDto> {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  collectionName = 'tasting-organizer'
  constructor(options: Partial<MongoDBServiceOptions>, app: Application) {
    super(options)

    const client: Promise<Db> = app.get('mongoClient')

    client.then(db => {
      this.Model = db.collection(this.collectionName)
    })
  }

  async get(id: Id, params?: Params): Promise<TastingResultDto> {
    // TODO the query does more or less what it should. It contains some extraneous values and wrongly named properties.
    // it should be refactored

    const pipeline: any[] = [
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
            'date': '$date'
          }
        }
      },
      {
        '$unwind': '$scores'
      },
      {
        '$unwind': '$scores.scores'
      },
    ]

    if(params?.query?.userId) {
      pipeline.push( {
        '$match': {
          'scores.userId': params?.query?.userId
        }
      })
    }

    pipeline.push(
      {
        $lookup: {
          from: this.collectionName,
          let: {
            wineId: '$scores.scores.wineId',
            'tastingId': '$_id'
          },
          pipeline: [
            {
              '$unwind': {
                'path': '$flights',
                'includeArrayIndex': 'flightIndex'
              }
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
                'id': '$flights.wines.id',
                'price': '$flights.wines.price',
                'wineNr': { $concat: [{$toString: {$add: ['$flightIndex', 1]}}, '.', {$toString: {$add: ['$index', 1]}}]}
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
                'score': {
                  'userId': '$scores.userId',
                  'userName': '$scores.userName',
                  'score': '$scores.scores.score',
                  'wineId': '$scores.scores.wineId',
                  'scores': 0
                }
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
            '$avg': '$score.score'
          },
          'min': {
            '$min': '$score.score'
          },
          'max': {
            '$max': '$score.score'
          },
          'stddev': {
            '$stdDevPop': '$score.score'
          },
          'tasting': {
            '$first': '$tasting'
          },
          'scores': {
            '$addToSet': '$score'
          }
        }
      },
      {
        '$group': {
          '_id': '$tasting',
          'wineResults': {
            '$addToSet': '$$ROOT'
          },
          'highMax': {
            '$max': '$max'
          },
          'lowMax': {
            '$min': '$max'
          },
          'highMin': {
            '$max': '$min'
          },
          'lowMin': {
            '$min': '$min'
          },
          'highAvg': {
            '$max': '$avg'
          },
          'lowAvg': {
            '$min': '$avg'
          },
          'lowStddev': {
            '$min': '$stddev'
          },
          'highStddev': {
            '$max': '$stddev'
          }
        }
      },
      {
        '$project': {
          'tasting': '$_id',
          'wineResults': '$wineResults',
          '_id': 0,
          'highAndLowScores': {
            'highMax': '$highMax',
            'lowMax': '$lowMax',
            'highMin': '$highMin',
            'lowMin': '$lowMin',
            'highAvg': '$highAvg',
            'lowAvg': '$lowAvg',
            'highStddev': '$highStddev',
            'lowStddev': '$lowStddev'
          }
        }
      }
    )

    const result = await this.Model.aggregate(pipeline).toArray()

    if (result.length === 0) {
      return Promise.resolve( new TastingResultDto())
    }

    return Promise.resolve(plainToInstance(TastingResultDto, result[0]))
  }
}
