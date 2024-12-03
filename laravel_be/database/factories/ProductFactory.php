<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Categories;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'category_id' => Categories::factory(),
            'name' => fake()->word(),
            'slug' => Str::slug(fake()->unique()->word()),
            'description' => fake()->paragraph(),
            'image' => fake()->imageUrl(),
            'price' => fake()->randomFloat(2, 10, 100),
            'sale_price' => fake()->optional()->randomFloat(2, 5, 50),
        ];
    }
}