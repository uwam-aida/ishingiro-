<?php

namespace App\Console\Commands;

use App\Models\Role;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class SeedSystemUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:seed-system-users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $users = config('system_users.users');

        foreach ($users as $userData) {
            $role = Role::where('name', $userData['role'])->first();

            if (!$role) {
                $this->error("Role {$userData['role']} not found");
                continue;
            }
            $this->info("Looking for: " . $userData['role']);
            $this->info("Matched role ID: " . $role->id);

            User::updateOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'password' => Hash::make($userData['password']),
                    'role_id' => $role->id,
                ]
            );

            $this->info("User {$userData['email']} created/updated");
        }

        return 0;
    }

}
