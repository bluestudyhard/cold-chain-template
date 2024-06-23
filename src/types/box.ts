export interface BoxMessages {
  id?: string
  boxId?: string
  createdAt?: string // ISO 8601 format date-time string
  temperature: string // Consider using number if temperature is always numeric
  battery: string // Consider using number if battery percentage is always numeric
  longitude: string // Consider using number for geographical coordinates
  latitude: string // Consider using number for geographical coordinates
}

export interface BoxPatchData {
  id: string
  patchId: string
  vaccineId: string
  departureTime: string // ISO 8601 format date-time string
  arrivalTime: string | null
  departureLocation: {
    latitude: string
    longitude: string
  }
  arrivalLocation: {
    latitude: string
    longitude: string
  }
  departureCity: string
  arrivalCity: string
}
