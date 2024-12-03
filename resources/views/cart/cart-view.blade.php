<!-- resources/views/cart/index.blade.php -->

@extends('layouts.app')

@section('content')
<div class="container">
    <h2>Giỏ Hàng</h2>

    @if(count($cartItems) > 0)
        <form action="{{ route('cart.update') }}" method="POST">
            @csrf
            <table class="table">
                <thead>
                    <tr>
                        <th>Tên sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Giá</th>
                        <th>Tổng tiền</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($cartItems as $cartItem)
                    <tr>
                        <td>{{ $cartItem->product->name }}</td>
                        <td>
                            <form action="{{ route('cart.update', $cartItem->id) }}" method="POST">
                                @csrf
                                @method('POST')
                                <input type="number" name="quantity" value="{{ $cartItem->quantity }}" min="1" style="width: 60px;">
                                <button type="submit" class="btn btn-primary btn-sm">Cập nhật</button>
                            </form>
                        </td>
                        <td>{{ number_format($cartItem->price, 0, ',', '.') }} VND</td>
                        <td>{{ number_format($cartItem->price * $cartItem->quantity, 0, ',', '.') }} VND</td>
                        <td>
                            <form action="{{ route('cart.remove', $cartItem->id) }}" method="POST">
                                @csrf
                                @method('POST')
                                <button type="submit" class="btn btn-danger btn-sm">Xóa</button>
                            </form>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </form>

        <!-- Tổng giá trị giỏ hàng -->
        <div class="total">
            <h3>Tổng giá trị giỏ hàng: {{ number_format($cartItems->sum(function($item) { return $item->price * $item->quantity; }), 0, ',', '.') }} VND</h3>
            <a href="{{ route('checkout.index') }}" class="btn btn-success">Thanh toán</a>
        </div>
    @else
        <p>Giỏ hàng của bạn đang trống.</p>
    @endif
</div>
@endsection
