<?php

namespace App\Http\Controllers;

use App\Temperature;
use App\Http\Traits\SettingsTrait;
use App\Http\Traits\GuzzleTrait;

class CronTemperaturesController extends Controller
{
    use SettingsTrait, GuzzleTrait;

    public function run()
    {
        $baseURL = $this->getBaseUrl();
        $data = $this->getData($baseURL);

        if ($data['status'] == "success") {
            $temp = new Temperature();
            $temp->value = $data->temperature;
            $temp->save();
        } else {
            return $data->message;
        }
    }
}
