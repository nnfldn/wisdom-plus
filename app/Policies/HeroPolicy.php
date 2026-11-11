<?php

namespace App\Policies;

use App\Models\Hero;
use App\Models\User;

/**
 * Branding/landing page dikunci untuk super-admin saja
 * (admin biasa hanya bisa view).
 */
class HeroPolicy extends BasePolicy
{
    public function viewAny(User $user): bool
    {
        return $this->isAdmin($user);
    }

    public function view(User $user, Hero $hero): bool
    {
        return $this->isAdmin($user);
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, Hero $hero): bool
    {
        return false;
    }

    public function delete(User $user, Hero $hero): bool
    {
        return false;
    }
}
