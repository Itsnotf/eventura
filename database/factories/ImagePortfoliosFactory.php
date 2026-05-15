<?php

namespace Database\Factories;

use App\Models\BrandPortfolios;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ImagePortfolios>
 */
class ImagePortfoliosFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'brand_portfolio_id' => BrandPortfolios::factory(),
            'image' => $this->faker->imageUrl(640, 480, 'business', true, 'Portfolio'),
        ];
    }
}
