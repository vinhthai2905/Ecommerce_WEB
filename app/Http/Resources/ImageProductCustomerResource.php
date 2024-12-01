<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ImageProductCustomerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'image' => filter_var($this->image, FILTER_VALIDATE_URL)
                ? $this->image
                : url('/api/images/' . basename($this->image)),
        ];
    }
}
