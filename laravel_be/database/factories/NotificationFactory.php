<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Notification>
 */
class NotificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => fake()->randomElement(['success', 'error', 'warning', 'info']),
            'user_id' => \App\Models\User::factory(),
            'data' => fake()->text(),
            'read_at' => fake()->optional()->dateTime(),
        ];
    }
}