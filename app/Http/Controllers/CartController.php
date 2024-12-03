<?php

// app/Http/Controllers/CartController.php

namespace App\Http\Controllers;

use App\Models\Cart;

class CartController extends Controller
{
    // Hiển thị giỏ hàng
    public function view(Cart $cart) {
      return view('cart-view', compact('cart'));
    }

    public function delete($id, Cart $cart) {
      $cart->delete($id);
      return redirect()->route('cart.view');
    }

    // Cập nhật sản phẩm trong giỏ hàng
    public function update(Request $request, Cart $cart)
    {
        $validatedData = $request->validate([
            'id' => 'required|exists:carts,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $cartItem = $cart->findOrFail($validatedData['id']);
        $cartItem->quantity = $validatedData['quantity'];
        $cartItem->save();

        return redirect()->route('cart.view')->with('success', 'Giỏ hàng đã được cập nhật.');
    }
}
