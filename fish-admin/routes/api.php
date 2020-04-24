<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('cron/settings', 'CronSettingsController@run');
Route::get('cron/temperatures', 'CronTemperaturesController@run');
