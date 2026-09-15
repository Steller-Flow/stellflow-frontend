/**
 * A stand-in for the Freighter browser extension. @stellar/freighter-api v6
 * talks to the extension over window.postMessage:
 *   page -> { source: "FREIGHTER_EXTERNAL_MSG_REQUEST", messageId, type }
 *   ext  -> { source: "FREIGHTER_EXTERNAL_MSG_RESPONSE", messagedId, ...data }
 * (the response key really is spelled `messagedId` in the API). isConnected()
 * short-circuits on `window.freighter`, so setting that is enough for the
 * modal to enable the Freighter row.
 */
export const TEST_ADDRESS = "GBXGHABC123DEF456GHIJKL789MNOPQRSTUVWXYZ1234567890ABCDEFGH";

export function fakeFreighterScript(mode: "approve" | "reject"): string {
  return `
    window.__freighterCalls = [];
    window.freighter = true;
    window.addEventListener("message", (ev) => {
      const d = ev.data;
      if (!d || d.source !== "FREIGHTER_EXTERNAL_MSG_REQUEST") return;
      window.__freighterCalls.push(d.type);
      const reply = (p) => window.postMessage({ source: "FREIGHTER_EXTERNAL_MSG_RESPONSE", messagedId: d.messageId, ...p }, "*");
      if (d.type === "REQUEST_CONNECTION_STATUS") return reply({ isConnected: true });
      if (d.type === "REQUEST_ACCESS") {
        return ${JSON.stringify(mode)} === "reject"
          ? reply({ publicKey: "", apiError: { code: -3, message: "User declined access" } })
          : reply({ publicKey: ${JSON.stringify(TEST_ADDRESS)} });
      }
      if (d.type === "REQUEST_NETWORK_DETAILS") {
        return reply({ networkDetails: { network: "TESTNET", networkPassphrase: "Test SDF Network ; September 2015" } });
      }
    });
  `;
}
