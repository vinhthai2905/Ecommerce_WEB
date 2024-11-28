<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Mail;
use App\Models\Customer;
use App\Mail\VerifyAccount;
use App\Http\Middleware\Authenticate;

class AccountController extends Controller
{
    public function login(){
        return view('account.login');
    }

    public function check_login(Request $request){
        $request->validate([
            'email' => 'required|email|exists:customers',
            'password' => 'required|min:4',

       ],[
            'email.email' => 'Check your email format.',
            'email.required' => 'Email cannot be empty.',
            'email.exists' => 'Email not existed.',
            'password.required' => 'Password cannot be empty.',
            'password.min' => 'Password need at least 4 characters long.',
            
       ]);

       $datas = $request->only('email', 'password');
       $check = auth('cus')->attempt($datas);

       if($check){
           if(auth('cus')->user()->email_verifided_at == ''){
                auth('cus')->logout();
                return redirect()->back()->with('failed', 'Error, your account is not verified.');
           } 

           $name = Customer::where('email', $datas['email'])->value('name');

           return redirect()->route('home.index')->with('name', $name);
       }
       
       return redirect()->back()->with('failed', 'Your account or password invalid');
    }

    public function register(){
        return view('account.register');
    }

    public function check_register(Request $request){
       $request->validate([
            'name' => 'required|min:6|max:100',
            'email' => 'required|email|min:6|max:100|unique:customers',
            'phone' => 'required|unique:customers',
            'address' => 'required',
            'password' => 'required|min:4',
            'confirm_password' => 'required|same:password',

       ],[
            'name.required' => 'Name cannot be empty.',
            'name.min' => 'Name need at least 4 characters long.',
            'email.email' => 'Check your email format.',
            'email.min' => 'Email need at least 4 characters long.',
            'email.unique' => 'Email has been taken.',
            'email.required' => 'Email cannot be empty.',
            'phone.required' => 'Phone cannot be empty.',
            'phone.unique' => 'Phone has been taken.',
            'address.required' => 'Address cannot be empty.',
            'password.required' => 'Password cannot be empty.',
            'password.min' => 'Password need at least 4 characters long.',
            'confirm_password.required' => 'Need to re-enter password.',
            'confirm_password.same' => 'Need to match password.',
            
       ]);

       $datas = $request->only('name', 'email', 'phone', 'address', 'gender');

       $datas['password'] = bcrypt($request->password);

       if($acc = Customer::create($datas)){
            Mail::to($acc->email)->send(new VerifyAccount($acc)); 
            
            return redirect()
            ->route('account.login')
            ->with('success', 'Registered successfully, check your mail box to verify.');
       }
       return redirect()->back()->with('failed', 'Something wrong, please try again');
    }

    public function verify($email){
        $acc = Customer::where('email', $email)
        ->whereNull('email_verified_at')
        ->firstOrFail();
        Customer::where('email', $email)
        ->whereNull('email_verified_at')
        ->update(['email_verified_at' => now()]);
        
        // return redirect()
        // ->route('account.login')
        // ->with('success', "Verified successfully, please login");
    }

    public function profile(){
        return view('account.profile');
    }

    public function check_profile(){

    }

    public function change_password(){
        return view('account.change_password');
    }

    public function check_change_password(){

    }

    public function forgot_password(){
        return view('account.forgot_password');
    }

    public function check_forgot_password(){

    }

    public function reset_password(){

    }

    public function check_reset_password(){
        
    }
}
