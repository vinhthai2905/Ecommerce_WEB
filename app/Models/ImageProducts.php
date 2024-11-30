<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * 
 *
 * @property int $id
 * @property int $product_id
 * @property string $image
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|ImageProducts newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ImageProducts newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ImageProducts query()
 * @method static \Illuminate\Database\Eloquent\Builder|ImageProducts whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ImageProducts whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ImageProducts whereImage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ImageProducts whereProductId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ImageProducts whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class ImageProducts extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'image',
    ];
}
