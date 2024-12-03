<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Categories;
use App\Models\Product;
use App\Models\ImageProducts;
use App\Models\Carts;
use App\Models\Bills;
use App\Models\Notifications;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create 5 users
        $users = User::factory(5)->create();

        // Create 5 categories
        $categories = Categories::factory(5)->create();

        // Create 5 products for each category
        $categories->each(function ($category) {
            $products = Product::factory(5)->create(['category_id' => $category->id]);

            // Create 5 images for each product
            $products->each(function ($product) {
                ImageProducts::factory(5)->create(['product_id' => $product->id]);
            });
        });

        // Create 5 carts for each user
        $users->each(function ($user) {
            $products = Product::inRandomOrder()->take(5)->get();
            $products->each(function ($product) use ($user) {
                Carts::factory()->create([
                    'user_id' => $user->id,
                    'product_id' => $product->id,
                ]);
            });
        });

        // Create 5 bills for each user
        $users->each(function ($user) {
            $products = Product::inRandomOrder()->take(5)->get();
            $products->each(function ($product) use ($user) {
                Bills::factory()->create([
                    'user_id' => $user->id,
                    'product_id' => $product->id,
                ]);
            });
        });

        // Create 5 notifications for each user
        $users->each(function ($user) {
            Notifications::factory(5)->create(['user_id' => $user->id]);
        });
    }
}
