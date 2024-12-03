<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = ['user_id'];

    // Quan hệ với CartItem
    public function items()
    {
        return $this->hasMany(CartItem::class);
    }

    // Xóa sản phẩm khỏi giỏ hàng
    public function deleteItem($id)
    {
        $item = $this->items()->find($id); // Tìm sản phẩm trong giỏ hàng
        if ($item) {
            $item->delete(); // Xóa sản phẩm khỏi bảng cart_items
        }
    }

    // Cập nhật số lượng sản phẩm
    public function updateItemQuantity($id, $quantity)
    {
        $item = $this->items()->find($id); // Tìm sản phẩm trong giỏ hàng
        if ($item) {
            $item->quantity = $quantity; // Cập nhật số lượng
            $item->save();
        }
    }
}
