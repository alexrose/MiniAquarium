<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('cron/settings', 'CronSettingsController@run');
Route::get('settings', 'CronSettingsController@data');
Route::get('cron/temperatures', 'CronTemperaturesController@run');
Route::get('temperatures/{date?}', 'CronTemperaturesController@data');
