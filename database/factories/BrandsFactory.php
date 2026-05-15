<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Brands>
 */
class BrandsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->company();

        return [
            'user_id' => User::factory(),
            'name' => $name,
            'slug' => str()->slug($name),
            'category' => $this->faker->randomElements(['EO', 'WO'], random_int(1, 2)),
            'logo' => 'brands/placeholder-logo.png',
            'cover_image' => 'brands/placeholder-cover.png',
            'description' => $this->faker->paragraph(),
            'address' => $this->faker->address(),
            'whatsapp_number' => $this->faker->phoneNumber(),
            'instagram' => '@' . str()->slug($name),
            'website' => $this->faker->url(),
            'is_active' => $this->faker->boolean(80),
        ];
    }
}
