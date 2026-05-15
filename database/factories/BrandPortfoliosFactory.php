<?php

namespace Database\Factories;

use App\Models\Brands;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BrandPortfolios>
 */
class BrandPortfoliosFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'brand_id' => Brands::factory(),
            'title' => $this->faker->sentence(3),
            'deskripsi' => $this->faker->paragraph(),
            'event_type' => $this->faker->randomElement(['Wedding', 'Corporate', 'Birthday', 'Conference', 'Concert', 'Festival']),
            'event_date' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
