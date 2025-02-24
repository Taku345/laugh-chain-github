<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Test User 1',
            'email' => 'test1@example.com',
            'public_key' => config('test_user_keys.test_user_1.public_key'),
            'address' => 'test_address_1',
            'tmp_private_key' => config('test_user_keys.test_user_1.private_key'),
        ]);
        User::create([
            'name' => 'Test User 2',
            'email' => 'test2@example.com',
            'public_key' => config('test_user_keys.test_user_2.public_key'),
            'address' => 'test_address_2',
            'tmp_private_key' => config('test_user_keys.test_user_2.private_key'),
        ]);
        User::create([
            'name' => 'Test User 3',
            'email' => 'test3@example.com',
            'public_key' => config('test_user_keys.test_user_3.public_key'),
            'address' => 'test_address_3',
            'tmp_private_key' => config('test_user_keys.test_user_3.private_key'),
        ]);
    }
}
