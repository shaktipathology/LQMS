import crypto from 'crypto';

export interface HashChainPayload {
  actorId: string;
  action: string;
  timestamp: string;
  payload: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  previousHash?: string;
}

export const computeHash = (input: HashChainPayload): string => {
  const hash = crypto.createHash('sha256');
  hash.update(
    [
      input.actorId,
      input.action,
      input.timestamp,
      JSON.stringify(input.payload),
      input.ipAddress,
      input.userAgent,
      input.previousHash || '',
    ].join('|'),
  );
  return hash.digest('hex');
};
