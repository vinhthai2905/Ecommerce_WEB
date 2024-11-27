<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function Index(){
        return view('admin.index');
    }

    public function Login(){
        return view('admin.login');
    }

    public function Authenticate(Request $request){

        $validatedDatas = $request->validate([
            'email' => 'required|string|exists:users',
            'password' => 'required'
        ]);
        
    }

    public function Register(){
        return view('admin.register');
    }

    public function Check_Register(Request $request){

        $validatedDatas = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users',
            'password' => 'required',
            'confirm_password' => 'required|same:password'
        ]);

        $user = $request->only('name', 'email', 'password');
        $user['password'] = bcrypt(request('password'));
        User::create($user);
        
        return redirect()->route('admin.login');
    }
}
