<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * 
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Notifications newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Notifications newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Notifications query()
 * @property int $id
 * @property string $type
 * @property int $user_id
 * @property string $data
 * @property string|null $read_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|Notifications whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Notifications whereData($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Notifications whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Notifications whereReadAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Notifications whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Notifications whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Notifications whereUserId($value)
 * @mixin \Eloquent
 */
class Notifications extends Model
{
    use HasFactory;
}