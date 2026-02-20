

export interface LocationValue {
  state: string | null
  city: string | null
  lga: string | null
  street?: string
}

export interface State {
  id: string
  name: string
}

export interface City {
  id: string
  name: string
}

export interface LGA {
  id: string
  name: string
}

export interface RawState {
  name: string
  state?: string
  lgas?: string[]
}
