<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
/**
 *
 *
 * @property int $id
 * @property string $vn_pay_code
 * @property int $product_id
 * @property int $user_id
 * @property string $quantity
 * @property string $total_amount
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|Bills newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Bills newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Bills query()
 * @method static \Illuminate\Database\Eloquent\Builder|Bills whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Bills whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Bills whereProductId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Bills whereQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Bills whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Bills whereTotalAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Bills whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Bills whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Bills whereVnPayCode($value)
 * @mixin \Eloquent
 */

class Bills extends Model
{
    use HasFactory;
    protected $fillable = [
        'vn_pay_code',
        'user_id',
        'product_id',
        'quantity',
        'total_amount',
        'status',
    ];
}
