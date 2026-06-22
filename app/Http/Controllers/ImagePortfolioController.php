<?php

namespace App\Http\Controllers;

use App\Models\ImagePortfolios;
use App\Models\BrandPortfolios;
use App\Http\Requests\BrandPortfoliosRequest\StoreImagePortfolioRequest;
use Illuminate\Support\Facades\Storage;

class ImagePortfolioController extends Controller
{
    /**
     * Store a newly created image in storage.
     */
    public function store(StoreImagePortfolioRequest $request, string $brandPortfolioId)
    {
        $brandPortfolio = BrandPortfolios::findOrFail($brandPortfolioId);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();

            $path = $file->storeAs(
                'brand-portfolios/' . $brandPortfolioId,
                $filename,
                'public'
            );

            ImagePortfolios::create([
                'brand_portfolio_id' => $brandPortfolioId,
                'image' => $path,
            ]);

            return redirect()->back();
        }

        return redirect()->back()->withErrors(['image' => 'No image provided']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $brandPortfolioId, string $imageId)
    {
        $image = ImagePortfolios::where('id', $imageId)
            ->where('brand_portfolio_id', $brandPortfolioId)
            ->firstOrFail();

        if ($image->image && Storage::disk('public')->exists($image->image)) {
            Storage::disk('public')->delete($image->image);
        }

        $image->delete();

        return redirect()->back();
    }
}
