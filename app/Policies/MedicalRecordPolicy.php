<?php

namespace App\Policies;

use App\Models\MedicalRecord;
use App\Models\User;

class MedicalRecordPolicy extends BasePolicy
{
    public function viewAny(User $user): bool
    {
        return $this->isAdmin($user);
    }

    public function view(User $user, MedicalRecord $record): bool
    {
        return $this->isAdmin($user);
    }

    public function create(User $user): bool
    {
        return $this->isAdmin($user);
    }

    public function update(User $user, MedicalRecord $record): bool
    {
        return $this->isAdmin($user);
    }

    public function delete(User $user, MedicalRecord $record): bool
    {
        return false; // super-admin only
    }
}
