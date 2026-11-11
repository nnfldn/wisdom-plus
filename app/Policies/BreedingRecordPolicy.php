<?php

namespace App\Policies;

use App\Models\BreedingRecord;
use App\Models\User;

class BreedingRecordPolicy extends BasePolicy
{
    public function viewAny(User $user): bool
    {
        return $this->isAdmin($user);
    }

    public function view(User $user, BreedingRecord $record): bool
    {
        return $this->isAdmin($user);
    }

    public function create(User $user): bool
    {
        return $this->isAdmin($user);
    }

    public function update(User $user, BreedingRecord $record): bool
    {
        return $this->isAdmin($user);
    }

    public function delete(User $user, BreedingRecord $record): bool
    {
        return false; // super-admin lewat BasePolicy::before
    }
}
