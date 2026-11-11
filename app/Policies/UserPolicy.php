<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy extends BasePolicy
{
    /**
     * Manajemen user dikunci untuk super-admin saja (di-handle oleh BasePolicy::before).
     * Method spesifik default false agar admin biasa tidak bisa mengakses.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    public function view(User $user, User $model): bool
    {
        return false;
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, User $model): bool
    {
        return false;
    }

    public function delete(User $user, User $model): bool
    {
        // Super-admin tidak boleh menghapus dirinya sendiri.
        return $user->id !== $model->id;
    }
}
