<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Bill>
 */
class BillFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'vn_pay_code' => fake()->uuid(),
            'product_id' => \App\Models\Product::factory(),
            'user_id' => \App\Models\User::factory(),
            'quantity' => fake()->randomFloat(2, 1, 10),
            'total_amount' => fake()->randomFloat(2, 100, 1000),
            'status' => fake()->randomElement(['thanh_toan_thanh_cong', 'dang_giao_hang', 'da_nhan']),
        ];
    }
}