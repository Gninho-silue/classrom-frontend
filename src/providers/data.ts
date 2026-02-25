import { MOCK_COURSES } from "@/constants";
import { BaseRecord, DataProvider, GetListParams, GetListResponse } from "@refinedev/core";


export const dataProvider: DataProvider = {
  getList: async <TData extends BaseRecord = BaseRecord> ({ resource }:
  GetListParams): Promise<GetListResponse<TData>> => {
    if (resource !== 'subjects') return {data: [] as TData[], total: 0, }
    
    return {
      data: MOCK_COURSES as unknown as TData[],
      total: MOCK_COURSES.length,
    }
  },
  getOne: async () => { throw new Error('Method not present in mock data provider.'); },
  create: async () => { throw new Error('Method not present in mock data provider.'); },
  update: async () => { throw new Error('Method not present in mock data provider.'); },
  deleteOne: async () => { throw new Error('Method not present in mock data provider.'); },
  getApiUrl: () => ''
}