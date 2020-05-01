<?php

namespace App\Models;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Temperature extends Model
{
    protected $fillable = [
        'value'
    ];

    public function getUpdatedAtAttribute($value)
    {
        $value = Carbon::parse($value);
        return $value->format('H:i');
    }

    public function getTemperatureAttribute($value)
    {
        return number_format($value, 2);
    }
}
