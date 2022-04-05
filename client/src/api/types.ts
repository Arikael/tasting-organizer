import {
    ServiceTypes,
    UserScoresDto,
    TastingDto,
    BaseWineDto,
    FlightDto,
    ScoreDto,
    TastingResultDto,
    SingleTastingResultDto,
    ResultWineDto
} from '../../../server/src/types'

declare module '../../../server/src/types' {
    interface ResultWineDto {
        wineNr: string
    }
}


Object.defineProperty(ResultWineDto.prototype, 'wineNr', {
    get() {
        return 'Wine'
    }
})


export {ServiceTypes, UserScoresDto, TastingDto, BaseWineDto, FlightDto, ScoreDto, TastingResultDto, SingleTastingResultDto}