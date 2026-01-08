<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $fillable = [
        'category_id',
        'client_name',
        'client_phone',
        'image',
    ];
}
