<?php

namespace App\Policies;

use App\Models\Stat;
use App\Models\User;

class StatPolicy extends BasePolicy
{
    public function viewAny(User $user): bool
    {
        return $this->isAdmin($user);
    }

    public function view(User $user, Stat $stat): bool
    {
        return $this->isAdmin($user);
    }

    public function create(User $user): bool
    {
        return false; // super-admin only
    }

    public function update(User $user, Stat $stat): bool
    {
        return false;
    }

    public function delete(User $user, Stat $stat): bool
    {
        return false;
    }
}
