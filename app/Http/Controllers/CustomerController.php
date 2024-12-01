<?php

namespace App\Http\Controllers;

use App\Traits\HttpResponses;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Http\Resources\UsersResources;
use App\Http\Resources\ProductCustomerResource;
use App\Models\Product;

class CustomerController extends Controller
{
    use HttpResponses;
    public function index()
    {

    }

    public function updateInfo(Request $request)
    {
        if ($request->has('password')) {
            $request->validate([
                'current_password' => 'required',
                'password' => 'required|min:8',
            ]);
            $user = $request->user();

            if (!Hash::check($request->current_password, $user->password)) {
                return $this->errorResponse(
                    'Password invalid.',
                    400
                );
            }

            $user->password = Hash::make($request->password);
        }

        if ($request->has('name')) {
            $request->validate([
                'name' => 'required',
            ]);
            $user = $request->user();
            $user->name = $request->name;
        }

        if ($request->has('image')) {
            $request->validate([
                'image' => 'image|mimes:jpeg,png,jpg,gif,svg,webp|max:4048',
            ]);

            $imageName = Str::random(32) . '.' . $request->image->getClientOriginalExtension();
            Storage::disk('local')->put('public/images/' . $imageName, file_get_contents($request->image));

            $user = $request->user();
            $user->avatar = $imageName;
        }

        $user->save();

        return $this->successResponse(
            new UsersResources($user),
            'Updated successfully',
            200
        );
    }

    public function getProducts(Request $request)
    {

        $products = Product::paginate(10);
        $productData = ProductCustomerResource::collection($products);

        return $this->successResponse(
            $productData,
            '',
            200,
            $products->toArray()
        );
    }

    public function getProduct(string $id)
    {
        $product = Product::find($id);
        $productData = new ProductCustomerResource($product);

        return $this->successResponse(
            $productData,
            '',
            200
        );
    }
}
