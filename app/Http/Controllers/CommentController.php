<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
  public function index()
  {
    return view('detail.product-detail');
  }

  public function products()
  {
    $products = Product::all();
    return view('detail.test', compact('products'));
  }

  public function store(Request $request, $product_id)
  {
    $request->validate([
      'comment' => 'required|string|max:500'
    ]);
    $customer_id = Auth()->id();
    dd($request->comment);
    $comment = Comment::create(attributes: [
      'customer_id' => $customer_id,
      'product_id' => $product_id,
      'comment' => $request->comment,
    ]);

    return redirect()->back()->with('success');
  }
}
