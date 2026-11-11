<?php

namespace App\Policies;

use App\Models\Sheep;
use App\Models\User;

class SheepPolicy extends BasePolicy
{
    public function viewAny(User $user): bool
    {
        return $this->isAdmin($user);
    }

    public function view(User $user, Sheep $sheep): bool
    {
        return $this->isAdmin($user);
    }

    public function create(User $user): bool
    {
        return $this->isAdmin($user);
    }

    public function update(User $user, Sheep $sheep): bool
    {
        return $this->isAdmin($user);
    }

    /**
     * Penghapusan domba berdampak permanen → hanya super-admin (via BasePolicy::before).
     */
    public function delete(User $user, Sheep $sheep): bool
    {
        return false;
    }
}
