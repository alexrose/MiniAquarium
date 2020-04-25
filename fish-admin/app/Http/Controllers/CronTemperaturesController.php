<?php

namespace App\Http\Controllers;

use App\Temperature;
use App\Http\Traits\SettingsTrait;
use App\Http\Traits\GuzzleTrait;
use Carbon\Carbon;

class CronTemperaturesController extends Controller
{
    use SettingsTrait, GuzzleTrait;

    public function run()
    {
        $baseURL = $this->getBaseUrl();
        $data = $this->getData($baseURL);

        if ($data->status == "success") {
            $temp = new Temperature();
            $temp->value = $data->temperature;
            $temp->save();
        } else {
            return $data->message;
        }
    }

    public function data($date = null)
    {
        $data = [
            "status" => "success",
            "message" => ""
        ];

        try{
            $tz = env("APP_TIMEZONE");
            $date = (!$date) ? Carbon::now() : Carbon::createFromFormat("Y-m-d", $date, $tz);
            $temperatures = Temperature::whereDate("created_at", $date->toDateString())->get();

            foreach ($temperatures as $temperature) {
                $data["result"][$temperature->created_at->format("H:i")] = number_format($temperature->value, 2);
            }

            return json_encode($data);

        } catch (\Exception $exception) {
            $data["status"] = "error";
            $data["message"] = $exception->getMessage();
            return json_encode($data);
        }
    }
}
