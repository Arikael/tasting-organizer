import {ParseResult} from "papaparse";

export class ResultSet {
    headers: string[] = []
    items: RowItem[] = []
    highScores: Scores = {}
    lowScores: Scores = {}
}

export interface Scores {
    [key: string]: number
}

export interface RowItem {
    [key: string]: any
}

export function transformDataSet(results: ParseResult<unknown>): ResultSet {
    const resultSet = new ResultSet()
    resultSet.headers = getHeadersFromData(results.data)

    const separatorIndex = findSeparatorIndex(results.data[0] as unknown[])
    const headerBreakpoint = findHeaderBreakpoint(results.data[0] as unknown[])
    const skeletonRow = createSkeletonRow(resultSet.headers)

    let id = 0
    const highScoreCalcIndex = (resultSet.headers).length - separatorIndex

    for (const data of results.data.slice(1)) {
        const rowData = transformResultRow(data as unknown[], headerBreakpoint, separatorIndex)
        const row = Object.assign({}, skeletonRow)

        for (let i = 0; i  < rowData.length; i++) {
            row[resultSet.headers[i]] = rowData[i]

            if (i >= highScoreCalcIndex && rowData[i] !== null && !Number.isNaN(rowData[i])) {
                const currentKey = resultSet.headers[i]
                const number = rowData[i] as number

                if (resultSet.highScores[currentKey] == undefined) {
                    resultSet.highScores[currentKey] = number
                }

                if (resultSet.lowScores[currentKey] == undefined) {
                    resultSet.lowScores[currentKey] = number
                }

                if(resultSet.highScores[currentKey] < number) {
                    resultSet.highScores[currentKey] = number
                }
                else if(resultSet.lowScores[currentKey] > number) {
                    resultSet.lowScores[currentKey] = number
                }
            }
        }

        row.individualScores = []
        row.id = id
        row.individualScores = appendIndividualScoresAsArray(data as unknown[], headerBreakpoint)
        resultSet.items.push(row)
        id++
    }

    return resultSet
}

function getHeadersFromData(data: unknown[]): string[] {
    const headerRow = data[0] as unknown[]
    const headerBreakpoint = findHeaderBreakpoint(headerRow)
    const separatorIndex = findSeparatorIndex(headerRow)

    return transformResultRow(headerRow, headerBreakpoint, separatorIndex) as string[]
}

function createSkeletonRow(headers: any): RowItem {
    const skeletonRow: RowItem = {}

    for (const header of headers) {
        skeletonRow[header] = undefined
    }

    return skeletonRow
}

function findHeaderBreakpoint(data: unknown[]): number {
    return data.findIndex((item) => !item)
}

function findSeparatorIndex(data: unknown[]): number {
    return data.findIndex((item) => item === '###')
}

function appendIndividualScoresAsArray(data: unknown[], headerBreakpoint: number): number[] {
    return (data.filter((score: unknown) => score) as number[]).slice(headerBreakpoint)
        .sort((a: number, b: number) => a - b)
}

function transformResultRow(data: unknown[], headerBreakpoint: number, separatorIndex: number): unknown[] {
    const transformedResults = data.slice(0, headerBreakpoint)

    return [
        ...transformedResults.slice(separatorIndex + 1),
        ...transformedResults.slice(0, separatorIndex)
    ]
}