export interface VaccineData {
    id: string
    name: string
    low: string // 考虑如果总是数字的话，使用number类型
    high: string // 考虑如果总是数字的话，使用number类型
}
