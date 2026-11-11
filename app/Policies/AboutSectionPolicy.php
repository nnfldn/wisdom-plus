<?php

namespace App\Policies;

use App\Models\AboutSection;
use App\Models\User;

class AboutSectionPolicy extends BasePolicy
{
    public function viewAny(User $user): bool
    {
        return $this->isAdmin($user);
    }

    public function view(User $user, AboutSection $section): bool
    {
        return $this->isAdmin($user);
    }

    public function create(User $user): bool
    {
        return false; // super-admin only
    }

    public function update(User $user, AboutSection $section): bool
    {
        return false;
    }

    public function delete(User $user, AboutSection $section): bool
    {
        return false;
    }
}
