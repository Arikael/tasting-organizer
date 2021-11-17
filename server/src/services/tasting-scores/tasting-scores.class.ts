import {Id, NullableId, Params, ServiceMethods} from '@feathersjs/feathers'

export class TastingScores implements ServiceMethods<any>{

  create(data: any, params: Params) {
    console.log('test')
    return Promise.resolve(3);
  }

  [key: string]: any;

  find(params?: Params): Promise<any> {
    return Promise.resolve(2);
  }

  get(id: Id, params?: Params): Promise<any> {
    return Promise.resolve(undefined);
  }

  patch(id: NullableId, data: Partial<any>, params?: Params): Promise<any> {
    return Promise.resolve(undefined);
  }

  remove(id: NullableId, params?: Params): Promise<any> {
    return Promise.resolve(undefined);
  }

  update(id: NullableId, data: any, params?: Params): Promise<any> {
    return Promise.resolve(undefined);
  }
}
