<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TopupRequest;
use App\Http\Requests\TransferRequest;
use App\Http\Resources\TransactionResource;
use App\Http\Resources\WalletResource;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WalletController extends Controller
{
    use ApiResponse;

    public function balance(Request $request)
    {
        $wallet = $request->user()->wallet;
        return $this->success(new WalletResource($wallet), 'Wallet balance retrieved successfully');
    }

    public function topup(TopupRequest $request)
    {
        $wallet = $request->user()->wallet;

        DB::beginTransaction();
        try {
            $wallet->balance += $request->amount;
            $wallet->save();

            $transaction = Transaction::create([
                'wallet_id' => $wallet->id,
                'type' => 'topup',
                'amount' => $request->amount,
                'description' => 'Top up balance'
            ]);

            DB::commit();

            return $this->success(new TransactionResource($transaction), 'Top up successful');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('Failed to top up balance', 500);
        }
    }

    public function transfer(TransferRequest $request)
    {
        $sender = $request->user();
        $senderWallet = $sender->wallet;
        $amount = $request->amount;
        $to = $request->to;

        if ($senderWallet->balance < $amount) {
            return $this->error('Saldo tidak cukup', 400);
        }

        // Find receiver by email or phone_number
        $receiver = User::where('email', $to)->orWhere('phone_number', $to)->first();

        if (!$receiver) {
            return $this->error('Tujuan transfer tidak ditemukan', 400);
        }

        if ($receiver->id === $sender->id) {
            return $this->error('Tidak bisa transfer ke akun sendiri', 400);
        }

        $receiverWallet = $receiver->wallet;

        DB::beginTransaction();
        try {
            // Deduct sender
            $senderWallet->balance -= $amount;
            $senderWallet->save();

            // Add to receiver
            $receiverWallet->balance += $amount;
            $receiverWallet->save();

            $referenceId = uniqid('TRX-');

            // Record sender transaction
            $senderTransaction = Transaction::create([
                'wallet_id' => $senderWallet->id,
                'type' => 'transfer_out',
                'amount' => $amount,
                'reference_id' => $referenceId,
                'description' => 'Transfer to ' . $receiver->name
            ]);

            // Record receiver transaction
            Transaction::create([
                'wallet_id' => $receiverWallet->id,
                'type' => 'transfer_in',
                'amount' => $amount,
                'reference_id' => $referenceId,
                'description' => 'Transfer from ' . $sender->name
            ]);

            DB::commit();

            return $this->success(new TransactionResource($senderTransaction), 'Transfer successful');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('Transfer failed: ' . $e->getMessage(), 500);
        }
    }

    public function transactions(Request $request)
    {
        $wallet = $request->user()->wallet;
        $transactions = $wallet->transactions()->orderBy('created_at', 'desc')->get();

        return $this->success(TransactionResource::collection($transactions), 'Transactions retrieved successfully');
    }
}
