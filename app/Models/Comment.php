<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
  use HasFactory;

  protected $table = 'comments';

  protected $fillable = [
    'customer_id',
    'product_id',
    'comment',
  ];

  public function customer()
  {
    return $this->hasOne(Customer::class, 'id', 'customer_id');
  }

  public function product()
  {
    return $this->hasOne(Customer::class, 'id', 'product_id');
  }
}
