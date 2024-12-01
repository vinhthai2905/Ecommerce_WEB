<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\ImageProducts;
use App\Models\Categories;

class ProductCustomerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $image = filter_var($this->image, FILTER_VALIDATE_URL) ? $this->image : url('/api/images/' . basename($this->image));
        $imageDetail = ImageProductCustomerResource::collection(ImageProducts::where('product_id', $this->id)->get());

        return [
            'id' => $this->id,
            'category' => Categories::find($this->category_id),
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'sale_price' => $this->sale_price,
            'image' => $image,
            'image_detail'=> $imageDetail,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
