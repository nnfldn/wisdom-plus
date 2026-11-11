<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserStoreRequest;
use App\Models\Sheep;
use App\Models\User;
use App\Traits\LogsActivity;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    use LogsActivity;

    public function index(Request $request): Response
    {
        $currentUser = $request->user();

        return Inertia::render('Admin/Users', [
            'users' => User::select('id', 'name', 'email', 'role', 'created_at')
                ->paginate(10)
                ->through(fn ($user) => [
                    ...$user->only(['id', 'name', 'email', 'role', 'created_at']),
                    'can' => [
                        'update' => optional($currentUser)->can('update', $user) ?? false,
                        'delete' => optional($currentUser)->can('delete', $user) ?? false,
                    ],
                ]),
            'stats' => ['sakitCount' => Sheep::where('status', 'Sakit')->count()],
            'fullScreen' => true,
        ]);
    }

    public function store(UserStoreRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        $this->logActivity('create', 'user', $user->id, "Membuat user baru: {$user->name} ({$user->role})");

        return redirect()->back()->with('success', "User {$user->email} dibuat.");
    }

    public function destroy(Request $request, $id): RedirectResponse
    {
        $user = User::findOrFail($id);
        $this->authorize('delete', $user);

        $email = $user->email;
        $user->delete();

        $this->logActivity('delete', 'user', $id, "Menghapus user: {$email}");

        return redirect()->back()->with('success', "User {$email} dihapus.");
    }
}
