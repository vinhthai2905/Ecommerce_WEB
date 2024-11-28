<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'status', 'link', 'image', 'description', 'prioty', 'position'];

    public function products(){
        return $this->hasMany(Product::class, 'category_id', 'id');
    }

    public function scopeGetBanner($q, $pos = 'top-banner'){
        $q = $q->where('position', $pos)->orderBy('prioty', 'ASC')->where('status', 1);
        
        return $q;
    }
}
