import { Address } from '@solana/addresses';
import { AccountRole, IInstruction } from '@solana/instructions';
import type { Blockhash } from '@solana/rpc-types';
import { CompilableTransactionMessage } from '@solana/transaction-messages';
import {
    appendTransactionMessageInstruction,
    createTransactionMessage,
    setTransactionMessageFeePayer,
    setTransactionMessageLifetimeUsingBlockhash,
} from '@solana/transaction-messages';

import { IAccountSignerMeta, IInstructionWithSigners, ITransactionMessageWithSigners } from '../account-signer-meta';
import { MessageModifyingSigner } from '../message-modifying-signer';
import { MessagePartialSigner } from '../message-partial-signer';
import { TransactionModifyingSigner } from '../transaction-modifying-signer';
import { TransactionPartialSigner } from '../transaction-partial-signer';
import { TransactionSendingSigner } from '../transaction-sending-signer';
import { TransactionSigner } from '../transaction-signer';

export function createMockInstructionWithSigners(signers: TransactionSigner[]): IInstruction & IInstructionWithSigners {
    return {
        accounts: signers.map(
            (signer): IAccountSignerMeta => ({ address: signer.address, role: AccountRole.READONLY_SIGNER, signer }),
        ),
        data: new Uint8Array([]),
        programAddress: '11111111111111111111111111111111' as Address,
    };
}

export function createMockTransactionMessageWithSigners(
    signers: TransactionSigner[],
): CompilableTransactionMessage & ITransactionMessageWithSigners {
    const transaction = createTransactionMessage({ version: 0 });
    const transactionWithFeePayer = setTransactionMessageFeePayer(signers[0]?.address ?? '1111', transaction);
    const compilableTransaction = setTransactionMessageLifetimeUsingBlockhash(
        { blockhash: 'dummy_blockhash' as Blockhash, lastValidBlockHeight: 42n },
        transactionWithFeePayer,
    );
    return appendTransactionMessageInstruction(createMockInstructionWithSigners(signers), compilableTransaction);
}

export function createMockMessagePartialSigner(address: Address): MessagePartialSigner & { signMessages: jest.Mock } {
    return { address, signMessages: jest.fn() };
}

export function createMockMessageModifyingSigner(
    address: Address,
): MessageModifyingSigner & { modifyAndSignMessages: jest.Mock } {
    return { address, modifyAndSignMessages: jest.fn() };
}

export function createMockTransactionPartialSigner(
    address: Address,
): TransactionPartialSigner & { signTransactions: jest.Mock } {
    return { address, signTransactions: jest.fn() };
}

export function createMockTransactionModifyingSigner(
    address: Address,
): TransactionModifyingSigner & { modifyAndSignTransactions: jest.Mock } {
    return { address, modifyAndSignTransactions: jest.fn() };
}

export function createMockTransactionSendingSigner(
    address: Address,
): TransactionSendingSigner & { signAndSendTransactions: jest.Mock } {
    return { address, signAndSendTransactions: jest.fn() };
}

export function createMockTransactionCompositeSigner(address: Address) {
    return {
        ...createMockTransactionPartialSigner(address),
        ...createMockTransactionModifyingSigner(address),
        ...createMockTransactionSendingSigner(address),
    };
}
