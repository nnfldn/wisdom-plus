<?php

namespace App\Policies;

use App\Models\User;

abstract class BasePolicy
{
    /**
     * Pre-authorization gate: super-admin selalu lolos.
     */
    public function before(User $user, string $ability): ?bool
    {
        if ($user->role === 'super-admin') {
            return true;
        }

        return null;
    }

    protected function isAdmin(User $user): bool
    {
        return in_array($user->role, ['admin', 'super-admin'], true);
    }
}
