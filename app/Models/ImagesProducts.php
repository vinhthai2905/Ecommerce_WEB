<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * 
 *
 * @method static \Illuminate\Database\Eloquent\Builder|ImagesProducts newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ImagesProducts newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ImagesProducts query()
 * @mixin \Eloquent
 */
class ImagesProducts extends Model
{
    use HasFactory;
  
    protected $fillable = [
        'product_id',
        'image',
    ];

}
