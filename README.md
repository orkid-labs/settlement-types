# Settlement Types

TypeScript types for cross-chain settlement intents and Hedera targets.

## Features

- Generic cross-chain settlement intent types
- Hedera staking/restaking target configuration
- Depository credit structures
- Settlement state management
- Utility functions for validation and formatting

## Usage

```typescript
import {
  createSettlementIntent,
  validateSettlementIntent,
  HederaTarget,
  SettlementIntent
} from '@orkid-labs/settlement-types'

const intent = createSettlementIntent({
  sourceChainId: 1,
  sourceSender: '0x123...',
  sellToken: { symbol: 'USDC', address: '0x...', decimals: 6, chainId: 1 },
  buyToken: { symbol: 'HBAR', address: '0x...', decimals: 8, chainId: 295 },
  sellAmount: '1000000', // 1 USDC
  targetChainId: 295,
  targetRecipient: '0.0.12345',
  hederaTarget: {
    accountId: '0.0.42',
    strategy: 'native_staking',
    expectedApy: 0.0078,
    name: 'Native Hedera Staking',
    description: 'Stake HBAR directly with a consensus node.'
  }
})

const validation = validateSettlementIntent(intent)
if (!validation.valid) {
  console.error('Invalid intent:', validation.errors)
}
```

## License

MIT
