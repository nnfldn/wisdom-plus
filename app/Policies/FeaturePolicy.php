<?php

namespace App\Policies;

use App\Models\Feature;
use App\Models\User;

class FeaturePolicy extends BasePolicy
{
    public function viewAny(User $user): bool
    {
        return $this->isAdmin($user);
    }

    public function view(User $user, Feature $feature): bool
    {
        return $this->isAdmin($user);
    }

    public function create(User $user): bool
    {
        return false; // super-admin only
    }

    public function update(User $user, Feature $feature): bool
    {
        return false;
    }

    public function delete(User $user, Feature $feature): bool
    {
        return false;
    }
}
