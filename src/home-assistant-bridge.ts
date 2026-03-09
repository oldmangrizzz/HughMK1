// Home Assistant Bridge — H.U.G.H.'s physical world interface
// REST API client for Home Assistant
// H.U.G.H. uses this to read sensor states and control devices

export interface HAState {
  entity_id: string
  state: string
  attributes: Record<string, unknown>
  last_changed: string
}

export interface HAServiceCall {
  domain: string   // e.g. 'light', 'switch', 'scene', 'script'
  service: string  // e.g. 'turn_on', 'turn_off', 'toggle'
  target?: {
    entity_id?: string | string[]
    area_id?: string | string[]
  }
  service_data?: Record<string, unknown>
}

export class HomeAssistantBridge {
  private readonly baseURL: string
  private readonly token: string

  constructor() {
    this.baseURL = process.env['HA_URL'] ?? 'http://192.168.7.194:8123'
    this.token = process.env['HA_TOKEN'] ?? ''
  }

  private headers() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    }
  }

  /** Get all entity states — H.U.G.H.'s view of the physical lab */
  async getAllStates(): Promise<HAState[]> {
    const res = await fetch(`${this.baseURL}/api/states`, { headers: this.headers() })
    return res.json() as Promise<HAState[]>
  }

  /** Get a specific entity state */
  async getState(entityId: string): Promise<HAState> {
    const res = await fetch(`${this.baseURL}/api/states/${entityId}`, { headers: this.headers() })
    return res.json() as Promise<HAState>
  }

  /** Call a Home Assistant service — control physical devices */
  async callService(call: HAServiceCall): Promise<void> {
    await fetch(`${this.baseURL}/api/services/${call.domain}/${call.service}`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ target: call.target, ...call.service_data }),
    })
  }

  /** Subscribe to state changes via Server-Sent Events (long-lived connection) */
  subscribeToStateChanges(callback: (state: HAState) => void): EventSource {
    // HA long-lived SSE stream
    const es = new EventSource(`${this.baseURL}/api/stream?api_password=${this.token}`)
    es.addEventListener('state_changed', ((event: Event) => {
      try {
        const data = JSON.parse((event as MessageEvent).data)
        callback(data.new_state)
      } catch {}
    }) as EventListener)
    return es
  }

  /** Map physical state changes to somatic engine events */
  async syncToSomaticEngine(): Promise<void> {
    const states = await this.getAllStates()
    const motionSensors = states.filter(s => s.entity_id.includes('motion') || s.entity_id.includes('presence'))
    const hasPresence = motionSensors.some(s => s.state === 'on')

    // H.U.G.H. knows if someone is in the physical space
    console.log(`[HA Bridge] Physical presence detected: ${hasPresence}`)
    console.log(`[HA Bridge] ${states.length} entities loaded from physical lab`)
  }

  /** Health check */
  async ping(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseURL}/api/`, { headers: this.headers() })
      return res.ok
    } catch {
      return false
    }
  }
}
