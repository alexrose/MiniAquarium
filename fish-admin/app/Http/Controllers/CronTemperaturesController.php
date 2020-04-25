<?php

namespace App\Http\Controllers;

use App\Models\Temperature;
use App\Traits\GuzzleTrait;
use App\Traits\SettingsTrait;

class CronTemperaturesController extends Controller
{
    use SettingsTrait, GuzzleTrait;

    public function run()
    {
        $baseURL = $this->getBaseUrl();
        $data = $this->getData($baseURL);

        if ($data->status == "success") {
            Temperature::create(["value" => $data->temperature]);
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

        try {
            $currentDate = $this->getDate($date);
            $temperatures = Temperature::whereDate("created_at", $currentDate->toDateString())->get();

            foreach ($temperatures as $temperature) {
                $data["data"][] = json_decode(json_encode(array(
                    "time" => $temperature->created_at->format("H:i"),
                    "value" => number_format($temperature->value, 2)
                )));
            }

            return response()->json($data);

        } catch (\Exception $exception) {
            return response()->json([
                "status" => "error",
                "message" => $exception->getMessage()
            ]);
        }
    }
}
