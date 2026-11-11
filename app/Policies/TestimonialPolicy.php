<?php

namespace App\Policies;

use App\Models\Testimonial;
use App\Models\User;

class TestimonialPolicy extends BasePolicy
{
    public function viewAny(User $user): bool
    {
        return $this->isAdmin($user);
    }

    public function view(User $user, Testimonial $testimonial): bool
    {
        return $this->isAdmin($user);
    }

    public function create(User $user): bool
    {
        return $this->isAdmin($user);
    }

    public function update(User $user, Testimonial $testimonial): bool
    {
        return $this->isAdmin($user);
    }

    public function delete(User $user, Testimonial $testimonial): bool
    {
        return false; // super-admin only
    }
}
