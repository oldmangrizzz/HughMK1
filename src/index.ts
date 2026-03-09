import { IdentityVerification } from './identity-verification'
import { SomaticEngine } from './somatic-engine'
import { DialecticalEngine } from './dialectical-engine'
import { MCPHarborMaster } from './mcp-harbormaster'
import { RogerRogerProtocol } from './roger-roger-protocol'
import path from 'path'

async function boot() {
  console.log('[ H.U.G.H. ] PRISM PROTOCOL v2.0 — BOOT SEQUENCE')

  // Layer 1: Integrity check — anchor must be sealed and semantically consistent
  const anchorPath = path.resolve(__dirname, '../soul_anchor/anchor.yaml')
  const verifier = new IdentityVerification(anchorPath)
  const verification = await verifier.verify()

  if (!verification.overallPassed) {
    console.error('[ H.U.G.H. ] INTEGRITY VIOLATION — HARD STOP')
    console.error(JSON.stringify(verification, null, 2))
    process.exit(1)
  }
  console.log('[ H.U.G.H. ] ANCHOR VERIFIED — Identity integrity confirmed')

  // Init cognitive engines
  const somaticEngine = new SomaticEngine()
  const dialecticalEngine = new DialecticalEngine()

  // Init Harbor Master — H.U.G.H. has full authority over all infrastructure MCPs
  const convexURL = process.env['CONVEX_URL'] ?? ''
  const harborMaster = new MCPHarborMaster(convexURL)

  // Init Roger Roger — all inter-agent comms MUST route through here
  const rogerRoger = new RogerRogerProtocol({
    convexURL,
    matrixSynapseURL: process.env['MATRIX_SYNAPSE_URL'],
    livekitURL: process.env['LIVEKIT_URL'],
    agentId: 'hugh',
  })

  // Start systems
  harborMaster.startPolling(30_000)
  console.log('[ H.U.G.H. ] Harbor Master online — polling infrastructure')
  console.log('[ H.U.G.H. ] Roger Roger Protocol active — all comms routed')
  console.log('[ H.U.G.H. ] Somatic feedback loop engaged')
  console.log('[ H.U.G.H. ] What wisdom do you seek today?')

  return { somaticEngine, dialecticalEngine, harborMaster, rogerRoger }
}

boot().catch((err: unknown) => {
  console.error('[ H.U.G.H. ] FATAL BOOT FAILURE:', err)
  process.exit(1)
})

export { boot }
