/**
 * Cross-chain settlement types
 * 
 * Generic types for cross-chain settlement intents, Hedera targets,
 * and depository credit structures.
 */

/**
 * Hedera staking/restaking target configuration
 */
export interface HederaTarget {
  accountId: string
  strategy: string
  expectedApy: number
  name: string
  description: string
}

/**
 * Settlement token information
 */
export interface SettlementToken {
  symbol: string
  address: string
  decimals: number
  chainId: number
  icon?: string
}

/**
 * Depository credit representation
 */
export interface DepositoryCredit {
  token_address: string
  token_id?: string
  amount: string
}

/**
 * Cross-chain settlement intent
 */
export interface SettlementIntent {
  sourceChainId: number
  sourceSender: string
  sellToken: SettlementToken
  buyToken: SettlementToken
  sellAmount: string
  targetChainId: number
  targetRecipient: string
  hederaTarget?: HederaTarget
  depositoryCredit?: DepositoryCredit
  minSlippageBps?: number
  deadline?: number
}

/**
 * Settlement execution result
 */
export interface SettlementResult {
  success: boolean
  txHash?: string
  error?: string
  actualAmount?: string
  gasUsed?: string
}

/**
 * Settlement status
 */
export enum SettlementStatus {
  Pending = "pending",
  Executing = "executing",
  Completed = "completed",
  Failed = "failed",
  Cancelled = "cancelled"
}

/**
 * Settlement state
 */
export interface SettlementState {
  intent: SettlementIntent
  status: SettlementStatus
  result?: SettlementResult
  createdAt: number
  updatedAt: number
}

/**
 * Hedera staking strategy types
 */
export enum HederaStakingStrategy {
  NativeStaking = "native_staking",
  LiquidStaking = "liquid_staking",
  DexLpV1 = "dex_lp_v1",
  DexLpV2 = "dex_lp_v2"
}

/**
 * Preset Hedera targets for common staking destinations
 */
export interface PresetHederaTarget extends HederaTarget {
  chain: "mainnet" | "testnet"
}

/**
 * Create a settlement intent with defaults
 */
export function createSettlementIntent(
  params: Partial<SettlementIntent>
): SettlementIntent {
  return {
    sourceChainId: params.sourceChainId || 1,
    sourceSender: params.sourceSender || "",
    sellToken: params.sellToken || { symbol: "", address: "", decimals: 18, chainId: 1 },
    buyToken: params.buyToken || { symbol: "", address: "", decimals: 18, chainId: 1 },
    sellAmount: params.sellAmount || "0",
    targetChainId: params.targetChainId || 1,
    targetRecipient: params.targetRecipient || "",
    minSlippageBps: params.minSlippageBps || 50,
    deadline: params.deadline || Math.floor(Date.now() / 1000) + 3600,
    ...params
  }
}

/**
 * Validate a settlement intent
 */
export function validateSettlementIntent(intent: SettlementIntent): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!intent.sourceSender) {
    errors.push("sourceSender is required")
  }

  if (!intent.targetRecipient) {
    errors.push("targetRecipient is required")
  }

  if (BigInt(intent.sellAmount) <= 0n) {
    errors.push("sellAmount must be positive")
  }

  if (intent.minSlippageBps && intent.minSlippageBps < 0) {
    errors.push("minSlippageBps cannot be negative")
  }

  if (intent.minSlippageBps && intent.minSlippageBps > 10000) {
    errors.push("minSlippageBps cannot exceed 10000 (100%)")
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Format amount with decimals
 */
export function formatAmount(amount: string, decimals: number): string {
  const value = BigInt(amount)
  const divisor = BigInt(10 ** decimals)
  const whole = value / divisor
  const fraction = value % divisor
  
  if (fraction === 0n) {
    return whole.toString()
  }
  
  const fractionStr = fraction.toString().padStart(decimals, '0').replace(/0+$/, '')
  return `${whole}.${fractionStr}`
}

/**
 * Parse amount to bigint
 */
export function parseAmount(amount: string, decimals: number): string {
  const [whole, fraction] = amount.split('.')
  const wholeValue = BigInt(whole || '0')
  const fractionValue = BigInt((fraction || '').padEnd(decimals, '0').slice(0, decimals))
  const divisor = BigInt(10 ** decimals)
  
  return (wholeValue * divisor + fractionValue).toString()
}
