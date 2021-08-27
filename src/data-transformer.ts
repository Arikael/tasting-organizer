import {ParseResult} from "papaparse";

export class ResultSet {
    headers: string[] = []
    items: RowItem[] = []
}

export interface RowItem {
    [key: string]: any
}

export function transformDataSet(results: ParseResult<unknown>): ResultSet {
    const resultSet = new ResultSet()
    resultSet.headers = getHeadersFromData(results.data)
    const headerBreakpoint = findHeaderBreakpoint(results.data[0] as unknown[])
    const skeletonRow = createSkeletonRow(resultSet.headers)

    let id = 0

    for (const data of results.data.slice(1)) {
        const rowData = transformResultRow(data as unknown[], headerBreakpoint)
        const row = Object.assign({}, skeletonRow)

        for (const i in rowData) {
            row[resultSet.headers[i]] = rowData[i]
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
    const headerBreakpoint = findHeaderBreakpoint(data[0] as unknown[])

    return transformResultRow(data[0] as unknown[], headerBreakpoint) as string[]
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

function appendIndividualScoresAsArray(data: unknown[], headerBreakpoint: number): number[] {
    return (data.filter((score: unknown) => score) as number[]).slice(headerBreakpoint + 1)
        .sort((a: number, b: number) => a - b)
}

function transformResultRow(data: unknown[], headerBreakpoint: number): unknown[] {
    let transformedResults = []
    transformedResults = data.slice(0, headerBreakpoint)
    const separatorIndex = transformedResults.findIndex((item) => item === '###')

    return [
        ...transformedResults.slice(separatorIndex + 1),
        ...transformedResults.slice(0, separatorIndex)
    ]
}