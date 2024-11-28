<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Banner;

class HomeController extends Controller
{
    public function index(){
        $topBanner  = Banner::getBanner()->first();
        $galleries = Banner::getBanner('gallery')->get();
        return view('home.index', compact('topBanner', 'galleries'));
    }

    public function about(){
        return view('home.about'); 
    }
}
